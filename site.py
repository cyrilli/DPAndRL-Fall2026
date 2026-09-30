#!/usr/bin/env python3
"""Build a Markdown course site with Quarto. Python standard library only."""
import argparse
import hashlib
import os
from pathlib import Path
import shutil
import subprocess
import sys
from functools import partial
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Lock
from tempfile import TemporaryDirectory
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent


def source_files(root):
    """Underscore folders hold unpublished templates and planning documents."""
    for source in sorted((root / 'content').rglob('*')):
        relative = source.relative_to(root / 'content')
        if source.is_file() and not any(part.startswith(('.', '_')) for part in relative.parts):
            if source.name != 'README.md':
                yield source, relative


def source_hash(root):
    digest = hashlib.sha256()
    files = [root / 'content/_site.md', root / 'site.py']
    files += sorted(file for file in (root / 'theme').rglob('*') if file.is_file())
    files += [source for source, _ in source_files(root)]
    for source in files:
        digest.update(str(source.relative_to(root)).encode())
        digest.update(source.read_bytes())
    return digest.hexdigest()


def config_text(root):
    source = root / 'content/_site.md'
    text = source.read_text(encoding='utf-8').replace('\r\n', '\n')
    if not text.startswith('---\n') or '\n---\n' not in text[4:]:
        raise ValueError('content/_site.md must start with YAML settings between two --- lines.')
    return text[4:].split('\n---\n', 1)[0] + '\n'


def quarto_path(root):
    executable = os.environ.get('QUARTO_BIN') or shutil.which('quarto')
    portable = root / '.tools/bin/quarto'
    if not executable and portable.is_file():
        executable = str(portable)
    if not executable:
        raise ValueError('Install Quarto from https://quarto.org/docs/get-started/, then retry. '
                         'No Node.js, R, or Python packages are required.')
    return executable


class Document(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.ids, self.links = set(), []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        for key in ('href', 'src'):
            if attrs.get(key):
                self.links.append(attrs[key])


def validate(output):
    """Check rendered local pages, section anchors, PDFs and bundled assets."""
    documents = {file.resolve(): Document(file.read_text(encoding='utf-8'))
                 for file in output.rglob('*.html')}
    if not (output / 'index.html').is_file():
        raise ValueError('Missing homepage: create content/index.md.')
    failures, count = [], 0
    for file, document in documents.items():
        for link in document.links:
            target = urlsplit(link)
            if target.scheme or target.netloc:
                continue
            if target.path.startswith('/'):
                failures.append(f'{file.relative_to(output)}: root-relative link {link}; use a relative source path.')
                continue
            linked = (file.parent / unquote(target.path)).resolve() if target.path else file
            if linked.is_dir():
                linked = linked / 'index.html'
            if output.resolve() not in linked.parents or not linked.is_file():
                failures.append(f'{file.relative_to(output)}: missing local link {link}')
            elif target.fragment and linked in documents and unquote(target.fragment) not in documents[linked].ids:
                failures.append(f'{file.relative_to(output)}: missing section {link}')
            count += 1
    if failures:
        raise ValueError('Fix these links in the corresponding content/*.md files:\n' + '\n'.join(failures[:25]))
    return len(documents), count


def build(root=ROOT):
    root = root.resolve()
    executable = quarto_path(root)
    settings = config_text(root)
    fingerprint = source_hash(root)
    # Build outside the ignored repository folders: Quarto skips hidden roots.
    with TemporaryDirectory(prefix='course-site-') as temporary:
        staging = Path(temporary)
        for source, relative in source_files(root):
            destination = staging / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)
        (staging / '_quarto.yml').write_text(settings, encoding='utf-8')
        shutil.copytree(root / 'theme', staging / 'theme')
        result = subprocess.run([executable, 'render', str(staging), '--to', 'html'],
                                capture_output=True, text=True)
        if result.returncode:
            raise ValueError(result.stderr.strip() or result.stdout.strip() or 'Quarto render failed.')
        # Quarto reports unresolved scholarly references as warnings, not hard errors.
        messages = result.stdout + result.stderr
        if 'WARNING' in messages or 'Unable to resolve' in messages:
            raise ValueError('Resolve the Quarto warning before publishing:\n' + messages.strip())
        output = staging / '_site'
        pages, links = validate(output)
        (output / '.nojekyll').touch()
        (output / '.source-hash').write_text(fingerprint, encoding='utf-8')
        destination = root / 'dist'
        if destination.exists():
            shutil.rmtree(destination)
        shutil.move(str(output), destination)
    print(f'Built {pages} pages; checked {links} local links.', flush=True)
    return pages, links


def check(root=ROOT):
    root = root.resolve()
    output = root / 'dist'
    manifest = output / '.source-hash'
    if not manifest.exists() or manifest.read_text() != source_hash(root):
        raise ValueError('Sources changed or the site is missing. Run python3 site.py build first.')
    pages, links = validate(output)
    print(f'PASS: {pages} pages and {links} local links.', flush=True)
    return pages, links


def preview(root=ROOT, port=8765):
    root = root.resolve()
    lock = Lock()

    class PreviewHandler(SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Cache-Control', 'no-store')
            super().end_headers()

        def send_head(self):
            if 'If-Modified-Since' in self.headers:
                del self.headers['If-Modified-Since']
            with lock:
                if urlsplit(self.path).path.endswith(('/', '.html')):
                    manifest = root / 'dist/.source-hash'
                    try:
                        if not manifest.exists() or manifest.read_text() != source_hash(root):
                            build(root)
                    except (ValueError, OSError) as error:
                        self.send_error(500, 'Fix the source and refresh to retry', str(error))
                        return None
                return super().send_head()

    handler = partial(PreviewHandler, directory=str(root / 'dist'))
    with ThreadingHTTPServer(('127.0.0.1', port), handler) as server:
        print(f'Preview: http://127.0.0.1:{port}/ — save Markdown, then refresh.', flush=True)
        server.serve_forever()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['build', 'check', 'preview'])
    parser.add_argument('--port', type=int, default=8765)
    args = parser.parse_args()
    try:
        preview(port=args.port) if args.command == 'preview' else globals()[args.command]()
    except (ValueError, OSError) as error:
        print(f'{args.command.capitalize()} failed: {error}', file=sys.stderr)
        sys.exit(1)
    except KeyboardInterrupt:
        pass
