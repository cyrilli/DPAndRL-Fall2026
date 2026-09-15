# Dynamic Programming and Reinforcement Learning — Fall 2026

An English course website for Chuanhao Li and Chengli Zhu at Tsinghua University.

**Start with [EDITING.md](EDITING.md)** for a page-by-page map and examples of changing dates, uploading slides, posting assignments and updating contacts. Routine content edits do not require changing the generator.

## Edit and preview

Use Node.js 22 or newer and Python 3. From this repository's folder:

```sh
npm ci
npm run preview
```

Open [the local preview](http://127.0.0.1:8765/). Save an editable source file and refresh the browser; the preview rebuilds the site and disables caching. An invalid edit produces a source-specific error while preserving the last successful build. Stop the server with Ctrl+C. If the preview is already running, just refresh it.

| Content you want to change | Editable source |
| --- | --- |
| Page text and sections | [`content/pages/`](content/pages/) — one Markdown file per page |
| Course facts and teaching team | [`content/course.json`](content/course.json) |
| Home updates | [`content/announcements.json`](content/announcements.json) |
| Dates and holidays | [`content/schedule.json`](content/schedule.json) |
| Lecture titles, objectives, readings and slide links | [`content/lectures.json`](content/lectures.json) |
| Extended lecture notes | [`content/lectures/`](content/lectures/) |
| Textbooks and reference links | [`content/resources.json`](content/resources.json) |
| Navigation, footer and shared labels | [`content/site.json`](content/site.json) |
| Styling and images | [`public/assets/`](public/assets/) |
| Slides and handouts | [`public/downloads/`](public/downloads/) |

**Do not edit `dist/`.** The entire folder is generated, including assets. Put source assets in `public/`; they are copied to the site root. Page sources use site-relative links such as `downloads/lecture-02.pdf`, including inside nested lecture notes.

## Build and validate

```sh
npm run build
npm run check
npm test
```

The builder checks required fields, dates, lecture references, and local links before replacing the generated output. The checker also detects source edits that have not been rebuilt. Integration tests exercise common edits in temporary copies of the content.

`build.mjs` handles rendering; `lib/content.mjs` handles validation; `templates/layout.html` is the shared HTML shell. Change these only when extending the site's behavior or layout. Markdown is rendered with the version of Marked recorded in `package-lock.json`.

## Publish on GitHub Pages

The selected repository is [cyrilli/DPAndRL-Fall2026](https://github.com/cyrilli/DPAndRL-Fall2026). Commit and push the edited sources and rebuilt `dist/` to `main`. The supplied workflow installs dependencies, builds, checks, tests, and deploys `dist/` using GitHub's Pages actions.

The course website is published at [www.chuanhao-li.com/DPAndRL-Fall2026](https://www.chuanhao-li.com/DPAndRL-Fall2026/). GitHub Pages uses **GitHub Actions** under **Settings → Pages**. The repository is public, and successful pushes to `main` publish updates automatically. The standard `cyrilli.github.io/DPAndRL-Fall2026/` address redirects to the custom domain inherited from the personal website.

All internal links are relative, so the generated site can live under a repository path or a subfolder of a personal website. To use an existing personal website, copy the contents of `dist/` into the chosen course subfolder and keep that website's existing deployment workflow.

## Course planning notes

Schedule is the single index of dates, topics and materials. The old `lectures.html` address redirects there. Calendar evidence and the pending makeup arrangement are documented separately in [CALENDAR_VERIFICATION.md](CALENDAR_VERIFICATION.md). The public pages omit the administrative notes and calendar download controls.

The current timetable has 15 regular meetings and one undated session. The lecture outline is tentative. Assignment, project and grading details remain unreleased, and only Lecture 1 currently has extended notes. Update these through the content files as plans and materials are finalized.

## Sources and attribution

- Structure inspired by [Tsinghua RL 2025](https://coai.cs.tsinghua.edu.cn/Courses/RL2025/_site/index.html).
- Visual restraint inspired by [Berkeley CS285](https://rail.eecs.berkeley.edu/deeprlcourse/), with lighter typography, warm paper tones and muted purple accents.
- Implementation is a small, independently authored static site. No Jekyll runtime or copied template is required.
- Instructor information: [Chuanhao Li](https://www.chuanhao-li.com/), [official faculty profile](https://www.ie.tsinghua.edu.cn/info/1051/4043.htm), [Chengli Zhu](https://www.ie.tsinghua.edu.cn/info/1057/1094.htm).
- Instructor portrait: the image used on [Chuanhao Li's homepage](https://cyrilli.github.io/images/portrait_photo.png).
- Muted purple accents reflect the course's Tsinghua affiliation within a warm, understated palette.
- Reference-course slides are linked to their original publishers; the local teaching archive is not uploaded or redistributed by this site.

The `.openai/` folder is local preview-registration metadata and is excluded from the GitHub package. This website is prepared for GitHub Pages; no Sites deployment is required.
