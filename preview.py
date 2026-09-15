"""Rebuild authored content when refreshing a page in the local preview."""

import subprocess
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Lock
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent
BUILD_LOCK = Lock()


class PreviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_head(self):
        # Cloud-synced files can retain timestamps even when content changes.
        # Always send the current file instead of returning a cached 304 response.
        if "If-Modified-Since" in self.headers:
            del self.headers["If-Modified-Since"]
        requested = urlsplit(self.path).path
        # Open assets under the same lock so a rebuild cannot remove a file
        # between the handler's existence check and open call.
        with BUILD_LOCK:
            if requested.endswith(("/", ".html")):
                try:
                    result = subprocess.run(
                        ["node", "build.mjs"], cwd=ROOT,
                        capture_output=True, text=True, timeout=60,
                    )
                    if result.returncode:
                        detail = result.stderr.strip() or result.stdout.strip()
                        print(detail, flush=True)
                        self.send_error(500, "Could not rebuild the course website", detail)
                        return None
                    print(result.stdout.strip(), flush=True)
                except (OSError, subprocess.TimeoutExpired) as error:
                    self.send_error(500, "Could not run the course builder", str(error))
                    return None
            return super().send_head()


if __name__ == "__main__":
    directory = str(ROOT / "dist")
    handler = partial(PreviewHandler, directory=directory)
    with ThreadingHTTPServer(("127.0.0.1", 8765), handler) as server:
        print("Course preview: http://127.0.0.1:8765/ — save source files and refresh to rebuild", flush=True)
        server.serve_forever()
