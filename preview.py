"""Serve the generated course website locally without caching edited pages."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


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
        return super().send_head()


if __name__ == "__main__":
    directory = str(Path(__file__).resolve().parent / "dist")
    handler = partial(PreviewHandler, directory=directory)
    with ThreadingHTTPServer(("127.0.0.1", 8765), handler) as server:
        print("Course preview: http://127.0.0.1:8765/ (caching disabled)", flush=True)
        server.serve_forever()
