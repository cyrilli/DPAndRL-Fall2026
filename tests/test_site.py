"""Exercise the authoring workflow with real, isolated Quarto builds.

Run from the repository root: python3 -m unittest discover -s tests
"""
import html
import importlib.util
import json
import os
from contextlib import contextmanager
from pathlib import Path
import re
import shutil
import tempfile
from threading import Thread
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import urlopen


REPOSITORY = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('course_builder', REPOSITORY / 'site.py')
builder = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(builder)


@contextmanager
def running_preview(root):
    """Use the same request handler as the manual preview, on an unused port."""
    server = builder.preview_server(root, port=0)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f'http://127.0.0.1:{server.server_port}'
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)


def request_preview(url):
    try:
        response = urlopen(url, timeout=60)
    except HTTPError as error:
        response = error
    with response:
        return response.status, response.read().decode('utf-8')


class MarkdownAuthoringTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.quarto = str(Path(builder.quarto_path(REPOSITORY)).resolve())

    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix='course-authoring-test-')
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        shutil.copy2(REPOSITORY / 'site.py', self.root / 'site.py')
        shutil.copytree(REPOSITORY / 'theme', self.root / 'theme')
        self.environment = patch.dict(os.environ, {'QUARTO_BIN': self.quarto})
        self.environment.start()
        self.addCleanup(self.environment.stop)

    def write(self, name, text):
        destination = self.root / 'content' / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(text, encoding='utf-8')

    def settings(self, tabs):
        navigation = '\n'.join(f'    - text: {label}\n      href: {path}'
                               for label, path in tabs)
        self.write('_site.md', f'''---
project:
  type: website
  output-dir: _site
  resources:
  - materials/**
website:
  title: Linear Algebra Workshop
  navbar:
    left:
{navigation}
format:
  html:
    theme:
    - cosmo
    - theme/course.scss
    html-math-method: katex
---

These settings belong to an unrelated course and are not a public page.
''')

    def rendered(self, name='index.html'):
        return (self.root / 'dist' / name).read_text(encoding='utf-8')

    def test_markdown_edits_tabs_nested_pages_and_cleanup(self):
        self.settings([('Home', 'index.md'), ('Schedule', 'schedule.md'),
                       ('Project', 'project.md')])
        self.write('index.md', '# Linear Algebra Workshop\n\nWelcome to the workshop.\n')
        self.write('schedule.md', '''# Schedule

| Day | Topic |
| --- | --- |
| Monday | Vector spaces |
''')
        self.write('project.md', '# Project\n\nAn optional workshop project.\n')
        self.write('_templates/note.md', '# Unpublished template\n')
        self.write('_planning/ideas.md', '# Private planning\n')
        builder.build(self.root)
        self.assertIn('Vector spaces', self.rendered('schedule.html'))
        self.assertRegex(self.rendered(), r'href="[^"]*project\.html"')
        self.assertFalse((self.root / 'dist/_templates').exists())
        self.assertFalse((self.root / 'dist/_planning').exists())
        self.assertFalse((self.root / 'dist/_site.html').exists())

        # A plain table edit and navigation change must be sufficient: no JSON,
        # HTML templates, or Python changes are involved in this course update.
        schedule = (self.root / 'content/schedule.md').read_text()
        self.write('schedule.md', schedule.replace('Vector spaces', 'Eigenvalues') +
                   '\n[Problem sheet](assignments/week-01.md#submission)\n')
        self.settings([('Home', 'index.md'), ('Schedule', 'schedule.md'),
                       ('Reading', 'reading.md')])
        self.write('reading.md', '# Reading\n\n[Schedule](schedule.md)\n')
        self.write('assignments/week-01.md', '''# Problem sheet

## Submission {#submission}

[Download the worksheet](../materials/slides/week-01.pdf).

[Return to the schedule](../schedule.md).
''')
        pdf = self.root / 'content/materials/slides/week-01.pdf'
        pdf.parent.mkdir(parents=True)
        pdf.write_bytes(b'%PDF-1.4\n% local link fixture\n%%EOF\n')
        with self.assertRaisesRegex(ValueError, 'Sources changed'):
            builder.check(self.root)
        builder.build(self.root)
        builder.check(self.root)
        self.assertIn('Eigenvalues', self.rendered('schedule.html'))
        self.assertNotIn('Vector spaces', self.rendered('schedule.html'))
        self.assertNotRegex(self.rendered(), r'href="[^"]*project\.html"')
        self.assertRegex(self.rendered(), r'href="[^"]*reading\.html"')
        self.assertRegex(self.rendered('schedule.html'),
                         r'href="[^"]*assignments/week-01\.html#submission"')
        self.assertIn('href="../schedule.html"', self.rendered('assignments/week-01.html'))
        self.assertIn('href="../materials/slides/week-01.pdf"',
                      self.rendered('assignments/week-01.html'))
        self.assertEqual(pdf.read_bytes(),
                         (self.root / 'dist/materials/slides/week-01.pdf').read_bytes())
        self.assertTrue((self.root / 'dist/project.html').exists(),
                        'Removing a tab should not delete its still-authored page.')

        # Reusing the template does not require Schedule, Project, this semester,
        # any particular course name, or any original lecture files.
        self.settings([('Home', 'index.md')])
        for path in ('schedule.md', 'project.md', 'reading.md', 'assignments/week-01.md'):
            (self.root / 'content' / path).unlink()
        builder.build(self.root)
        self.assertEqual([path.name for path in (self.root / 'dist').glob('*.html')],
                         ['index.html'])
        self.assertFalse((self.root / 'dist/assignments/week-01.html').exists())
        self.assertIn('Linear Algebra Workshop', self.rendered())
        self.assertNotIn('Dynamic Programming', self.rendered())

    def test_numbered_notes_and_failed_builds_keep_last_good_site(self):
        self.settings([('Home', 'index.md'), ('Notes', 'notes/operators.md')])
        self.write('index.md', '# Workshop\n\n[Operator note](notes/operators.md#sec-bounds).\n')
        note = r'''---
title: Operator bounds
body-classes: course-notes
---

## Bounds {#sec-bounds}

::: {#lem-bound}
## A norm bound

For a scalar $a$ and vector $x$,

$$
\lVert ax\rVert = |a|\lVert x\rVert.
$$ {#eq-bound}
:::

::: {#thm-continuity}
## Continuity

Scalar multiplication is continuous by @lem-bound and @eq-bound.
:::

::: {.proof}
Apply @eq-bound to the difference of two vectors. This proves @thm-continuity.
:::

```markdown
@lem-this-is-a-code-example
```
'''
        self.write('notes/operators.md', note)
        builder.build(self.root)
        document = self.rendered('notes/operators.html')
        plain = html.unescape(re.sub(r'<[^>]*>', '', document)).replace('\xa0', ' ')
        self.assertIn('Lemma 1 (A norm bound)', plain)
        self.assertIn('Theorem 1 (Continuity)', plain)
        self.assertIn('Equation 1', plain)
        self.assertIn('id="eq-bound"', document)
        self.assertIn('class="theorem lemma"', document)
        self.assertIn('class="proof"', document)
        self.assertIn('class="math display"', document)
        self.assertIn('@lem-this-is-a-code-example', plain)
        self.assertNotIn('@lem-bound', plain)
        self.assertNotIn('@eq-bound', plain)
        last_good = (self.root / 'dist/.source-hash').read_bytes()
        good_home = (self.root / 'dist/index.html').read_bytes()

        for problem, suffix in (
            ('broken PDF', '\n[Missing slides](../materials/missing.pdf).\n'),
            ('unknown theorem', '\nSee @thm-does-not-exist.\n'),
        ):
            with self.subTest(problem=problem):
                self.write('notes/operators.md', note + suffix)
                with self.assertRaises(ValueError):
                    builder.build(self.root)
                self.assertEqual(last_good, (self.root / 'dist/.source-hash').read_bytes())
                self.assertEqual(good_home, (self.root / 'dist/index.html').read_bytes())
                self.assertEqual(document, self.rendered('notes/operators.html'))

    def test_preview_renders_course_despite_bad_slide_links(self):
        self.settings([('Home', 'index.md'), ('Schedule', 'schedule.md')])
        self.write('index.md', '# Workshop\n\n[Schedule](schedule.md).\n')
        self.write('schedule.md', '''# Schedule

| Day | Material |
| --- | --- |
| Monday | [Slides](materials/slides/missing.pdf) |
| Tuesday | [Slides](/Users/instructor/Desktop/slides.pdf) |
''')
        with running_preview(self.root) as url:
            status, home = request_preview(url + '/')
            self.assertEqual(status, 200)
            self.assertIn('Workshop', home)
            self.assertIn('missing.pdf', home)
            status, schedule = request_preview(url + '/schedule.html')
            self.assertEqual(status, 200)
            self.assertIn('Monday', schedule)
            self.assertIn('Tuesday', schedule)
            self.assertIn('/Users/instructor/Desktop/slides.pdf', schedule)

        warnings = json.loads((self.root / 'dist/.build-warnings').read_text())
        self.assertTrue(any('missing.pdf' in warning for warning in warnings))
        self.assertTrue(any('/Users/instructor/Desktop/slides.pdf' in warning
                            for warning in warnings))
        with self.assertRaisesRegex(ValueError, 'before publishing'):
            builder.check(self.root)


class LinkValidationTests(unittest.TestCase):
    def test_symlinked_output_root_and_nonfatal_link_diagnostics(self):
        with tempfile.TemporaryDirectory(prefix='course-link-test-') as temporary:
            root = Path(temporary)
            output = root / 'rendered'
            output.mkdir()
            (output / 'index.html').write_text(
                '<a href="page.html#section">Page</a>'
                '<a href="slides.pdf">Slides</a>', encoding='utf-8')
            (output / 'page.html').write_text('<h1 id="section">Page</h1>', encoding='utf-8')
            (output / 'slides.pdf').write_bytes(b'%PDF-1.4\n%%EOF\n')
            alias = root / 'output-alias'
            alias.symlink_to(output, target_is_directory=True)
            self.assertEqual(builder.validate(alias), (2, 2, []))

            (output / 'index.html').write_text(
                '<a href="missing.pdf">Missing slides</a>'
                '<a href="/Users/instructor/slides.pdf">Absolute path</a>'
                '<a href="file:///Users/instructor/slides.pdf">Filesystem URL</a>'
                '<a href="../outside.pdf">Outside path</a>'
                '<a href="http://[broken">Malformed URL</a>'
                '<a href="page.html#unknown">Missing section</a>', encoding='utf-8')
            pages, links, warnings = builder.validate(alias, strict=False)
            self.assertEqual(pages, 2)
            self.assertGreater(links, 0)
            self.assertEqual(len(warnings), 6)
            self.assertTrue(all(warning.startswith('content/index.md:') for warning in warnings))
            self.assertTrue(any('root-relative' in warning for warning in warnings))
            self.assertTrue(any('local filesystem link' in warning for warning in warnings))
            self.assertTrue(any('invalid URL' in warning for warning in warnings))
            self.assertTrue(any('missing section' in warning for warning in warnings))
            with self.assertRaisesRegex(ValueError, 'Fix these links'):
                builder.validate(alias)


class PreviewRecoveryTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix='course-preview-test-')
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.source = {'fingerprint': 'first', 'failure': None, 'warnings': []}
        self.builds = []
        self.hash_patch = patch.object(builder, 'source_hash',
                                       side_effect=lambda root: self.source['fingerprint'])
        self.hash_patch.start()
        self.addCleanup(self.hash_patch.stop)
        self.build_patch = patch.object(builder, 'build', side_effect=self.fake_build)
        self.mock_build = self.build_patch.start()
        self.addCleanup(self.build_patch.stop)

    def fake_build(self, root, strict=True):
        self.assertFalse(strict, 'Manual preview should permit link warnings.')
        self.builds.append(self.source['fingerprint'])
        if self.source['failure']:
            raise ValueError(self.source['failure'])
        output = root / 'dist'
        output.mkdir(exist_ok=True)
        page = '<!doctype html><html><body>Content ' + self.source['fingerprint'] + '</body></html>'
        (output / 'index.html').write_text(page, encoding='utf-8')
        (output / '.source-hash').write_text(self.source['fingerprint'], encoding='utf-8')
        (output / '.build-warnings').write_text(json.dumps(self.source['warnings']), encoding='utf-8')
        return 1, 0

    def test_warning_rebuild_fatal_fallback_failed_hash_cache_and_recovery(self):
        with running_preview(self.root) as url:
            status, page = request_preview(url + '/')
            self.assertEqual(status, 200)
            self.assertIn('Content first', page)

            self.source.update(fingerprint='bad-link', warnings=['schedule.html: missing local link slides.pdf'])
            status, page = request_preview(url + '/')
            self.assertEqual(status, 200)
            self.assertIn('Content bad-link', page)
            self.assertIn('missing local link slides.pdf', page)
            self.assertNotIn('missing local link slides.pdf',
                             (self.root / 'dist/index.html').read_text(),
                             'The warning notice belongs to preview, not published HTML.')

            self.source.update(fingerprint='broken', failure='Malformed course configuration')
            for _ in range(2):
                status, page = request_preview(url + '/')
                self.assertEqual(status, 200)
                self.assertIn('Content bad-link', page)
                self.assertIn('last successful build', page.lower())
                self.assertIn('Malformed course configuration', page)
            self.assertEqual(self.builds, ['first', 'bad-link', 'broken'],
                             'A failed source revision must not rebuild on every request.')

            self.source.update(fingerprint='repaired', failure=None, warnings=[])
            status, page = request_preview(url + '/')
            self.assertEqual(status, 200)
            self.assertIn('Content repaired', page)
            self.assertNotIn('Malformed course configuration', page)
            self.assertNotIn('last successful build', page.lower())
            self.assertEqual(self.builds, ['first', 'bad-link', 'broken', 'repaired'])

    def test_initial_failure_is_actionable_and_recovers_after_edit(self):
        self.source.update(fingerprint='broken', failure='Missing content/index.md')
        with running_preview(self.root) as url:
            for _ in range(2):
                status, page = request_preview(url + '/')
                self.assertEqual(status, 503)
                self.assertIn('Missing content/index.md', page)
            self.assertEqual(self.builds, ['broken'])

            self.source.update(fingerprint='repaired', failure=None)
            status, page = request_preview(url + '/')
            self.assertEqual(status, 200)
            self.assertIn('Content repaired', page)
            self.assertEqual(self.builds, ['broken', 'repaired'])


if __name__ == '__main__':
    unittest.main()
