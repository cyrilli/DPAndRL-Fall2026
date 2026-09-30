# Markdown course website

All course text, dates, links, and navigation settings live in [`content/`](content/). Edit Markdown, save, and refresh the preview. No JSON files, HTML templates, or programming changes are needed for routine course updates.

The site uses [Quarto](https://quarto.org/) for Markdown, mathematics, theorem numbering, navigation, and search. `site.py` provides the build, link checks, and local preview; `theme/` contains the shared presentation styles.

## Start locally

Install **Python 3** and **Quarto 1.10.18** using the [official Quarto installation instructions](https://quarto.org/docs/get-started/). No npm installation or Python packages are required.

From this repository's folder, run:

```sh
python3 site.py preview
```

Open [http://127.0.0.1:8765/](http://127.0.0.1:8765/). Save a source file and refresh the browser: the next page request rebuilds changed sources. Stop the preview with Ctrl+C. To use another port, run `python3 site.py preview --port 8766`.

The preview keeps working when a link is wrong. Missing files, absolute filesystem paths, and broken section links appear in a small preview-only warning with the Markdown filename to fix. Other edits still render. If Quarto cannot render the source (for example, invalid configuration), the preview serves the last successful build with an error notice. Fix the source and refresh to rebuild; the same failed edit is not rebuilt on every page request. If no successful build exists yet, the preview shows the error until the source is fixed.

## Where to edit

```text
content/
├── _site.md                 # Course name, tabs, notes sidebar, footer, site URL
├── index.md                 # Homepage, teaching team, announcements
├── schedule.md              # Actual schedule table and material links
├── assignments.md           # Assignment index
├── project.md               # Labs/project page
├── resources.md             # Books and reference links
├── lectures/                # One editable outline per lecture
├── notes/                   # Extended mathematical notes and notes index
├── materials/
│   ├── slides/              # PDFs
│   └── assignments/         # Handouts, code, data
├── assets/                  # Images used in the pages
├── _templates/              # Unpublished starting points for notes/assignments
└── _planning/               # Unpublished planning notes
site.py                      # Reusable build/preview commands
theme/                      # Shared styling and bundled math renderer
.github/workflows/pages.yml  # GitHub Pages deployment
```

`dist/` is generated and ignored by Git. Do not edit it. Files and folders beginning with `_` or `.` are excluded from page rendering; `_site.md` is the settings file. Planning files and templates stay in the repository but do not appear on the website.

Each ordinary page starts with a small YAML block and then its actual Markdown content:

```markdown
---
title: Assignments
sidebar: false
toc: true
---

## Assignment releases

Write the page content here.
```

`title` sets the page heading, `toc` controls its table of contents, and `sidebar: false` hides the notes sidebar. Notes use `sidebar: notes`. **The table in `content/schedule.md` is the displayed schedule**: edit its rows directly.

## Change tabs and navigation

Edit the YAML block at the top of [`content/_site.md`](content/_site.md). Under `website.navbar.left`, each entry names a tab and its source page:

```yaml
- text: Project
  href: project.md
```

Delete these two lines to remove the Project tab, or move them to change the tab order. This hides the tab while keeping the page available through other links. To remove the page too, delete `content/project.md` or move it into `_planning/`, then remove links pointing to it.

Add a tab by creating its Markdown page and adding a matching entry. Update `website.sidebar` to choose which notes appear in the notes sidebar; sidebar paths are relative to `content/`. Page titles are read from their source files.

## Add slides or a child page

Put a PDF at `content/materials/slides/lecture-02.pdf`. In the appropriate row of `content/schedule.md`, write:

```markdown
[Slides](materials/slides/lecture-02.pdf) · [Outline](lectures/02.md)
```

For an assignment description, copy `_templates/assignment.md` to `content/assignments/hw1.md`, remove `draft: true`, and replace the example content. Add a link in `content/assignments.md`:

```markdown
[Assignment 1](assignments/hw1.md)
```

A child page needs no new tab. Quarto renders it automatically. Links are **relative to the Markdown file containing them**; from `assignments/hw1.md`, use:

```markdown
[Back to assignments](../assignments.md)
[Handout](../materials/assignments/hw1.pdf)
[Related note](../notes/bellman-operators.md)
```

Create the referenced files before building. Link to source `.md` files; Quarto converts those links to `.html`. For a stable section link, write a heading such as `## Preparation {#preparation}` and link to `resources.md#preparation`. Avoid paths starting with `/`, so links work under any course repository URL.

## Write mathematical notes

Copy [`content/_templates/note.md`](content/_templates/note.md) into `content/notes/`, remove `draft: true`, and add the note to the sidebar in `_site.md` and to `notes/index.md`. The [Bellman operators note](content/notes/bellman-operators.md) is a complete working example.

Use `$V(s)$` for inline mathematics. Numbered equations, theorems, and proofs use native Quarto syntax:

```markdown
::: {#thm-square}
## Nonnegative squares

For every real number $x$,

$$
x^2 \geq 0.
$$ {#eq-square}
:::

::: {.proof}
A product of two equal real factors is nonnegative.
:::

See @thm-square and @eq-square.
```

Use `#lem-name` for a lemma, `#def-name` for a definition, and `#cor-name` for a corollary. Give each label a unique name on the page. Quarto supplies numbering and clickable references; `number-sections: true` numbers section headings. See [Quarto's cross-reference documentation](https://quarto.org/docs/authoring/cross-references.html) for additional options.

## Build and publish

```sh
python3 site.py build
python3 site.py check
```

Build renders the Markdown and checks local page, image, PDF, and section links before replacing `dist/`. Build and check remain strict for publishing: fix any warnings shown in the local preview first. A rejected build preserves the previously published website. Preview notices are added only by the local server and are never included in the published pages. Check verifies the existing output and detects source changes that need a rebuild. For changes to the reusable tooling, run `python3 -m unittest discover -s tests`.

Commit and push **source files** to `main`. The supplied GitHub Actions workflow builds, checks, tests, and deploys the site; do not commit `dist/`. Set **Settings → Pages → Source** to **GitHub Actions** for a new repository. A local preview does not update the live website.

The current course is published at [www.chuanhao-li.com/DPAndRL-Fall2026](https://www.chuanhao-li.com/DPAndRL-Fall2026/).

## Reuse for another course

1. Copy the repository into the new course repository; generated output and local tools are unnecessary.
2. Edit the course name, footer, `website.site-url`, tabs, and sidebar in `content/_site.md`.
3. Replace the homepage, schedule, readings, lecture outlines, and notes with the new course's Markdown. Keep or remove tabs as needed; remove links to deleted pages.
4. Replace files under `content/materials/` and `content/assets/`, then preview and build.
5. Enable GitHub Actions for Pages and push to `main`.

Keep `project.output-dir: _site` in the settings: the wrapper collects that temporary Quarto output into `dist/`. The renderer and theme contain no course-specific facts and can be reused unchanged. Optional visual changes belong in `theme/course.scss`.

All main pages and note articles share `--course-content-width` in `theme/course.scss` (1120px). On wide screens, note navigation occupies the space beside that centered column. Below 1700px, the sidebar uses its navigation button and the table of contents becomes an “On this page” disclosure; `theme/navigation.html` supplies that disclosure without changing the Markdown.

The mathematical-note presentation is inspired by [Zhuoran Yang's S&DS 685 notes](https://github.com/ZhuoranYang/sds685-notes); this site uses independently authored content and styles with Quarto's built-in scholarly features.
