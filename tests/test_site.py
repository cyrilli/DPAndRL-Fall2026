"""Exercise the authoring workflow with real, isolated Quarto builds.

Run from the repository root: python3 -m unittest discover -s tests
"""
import html
import importlib.util
import os
from pathlib import Path
import re
import shutil
import tempfile
import unittest
from unittest.mock import patch


REPOSITORY = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('course_builder', REPOSITORY / 'site.py')
builder = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(builder)


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


if __name__ == '__main__':
    unittest.main()
