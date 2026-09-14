# Dynamic Programming and Reinforcement Learning - Fall 2026

An English course website for Chuanhao Li and Chengli Zhu at Tsinghua University. Home contains a brief course description, class details, updates and instructor links. Schedule is the single index for dates, topics and materials; individual lecture outlines remain linked from it. The old lectures.html address redirects to Schedule.

## Contents

- `dist/`: the complete, ready-to-host static website.
- `content/course.json`: course facts, instructors and calendar sources.
- `content/lectures.json`: the proposed 16-session outline.
- `build.mjs`: generates all pages and calendar downloads, without dependencies.
- `check.mjs`: checks internal links, English page text, dates and repository-relative URLs.
- `.github/workflows/pages.yml`: deployment workflow for a dedicated course repository.
- `CALENDAR_VERIFICATION.md`: source evidence and the unresolved makeup date.

All teaching pages and newly prepared study materials are in English. The official university calendar is linked and saved in its original Chinese form as a source document.

## Preview and update

Requires Node.js 18 or newer to regenerate. The generated website itself requires no Node.js, Jekyll, database, account system or server application.

```sh
npm run build
npm run check
python3 -m http.server 8765 --directory dist
```

Open `http://localhost:8765/`. Edit the two JSON files for structured content, `build.mjs` for page content/layout, and `dist/assets/style.css` for styling. Regenerate after source edits. Assets remain in place during regeneration.

## GitHub Pages: dedicated course repository

1. Put this project's files at the repository root, including `dist/` and `.github/`.
2. In repository Settings > Pages, choose **GitHub Actions** as the source.
3. Push to `main`, or run the workflow manually. Change the branch in the workflow if needed.

The workflow uses GitHub's official Pages actions. All internal links are relative, so the same site works at a repository URL such as `https://USERNAME.github.io/REPOSITORY/` without changing its base URL.

## GitHub Pages: inside an existing personal website

Copy the **contents of `dist/`** into a chosen course subdirectory, preserving the internal directory structure. Keep the personal website's existing build and deployment workflow. Do not replace its root homepage, configuration, CNAME or publishing workflow with the dedicated-course workflow supplied here.

The files also work at a deeper path such as `/teaching/dp-rl-2026/`. The selected repository is https://github.com/cyrilli/DPAndRL-Fall2026. The dedicated-repository workflow above is configured for its main branch.

## What is confirmed and what remains a draft

- The supplied timetable specifies Tuesdays, 09:50-12:15, Teaching Building 4, Room 4401, Weeks 1-16.
- The public university calendar places October 6 within the National Day holiday.
- The downloadable calendar includes 15 regular Tuesday meetings; it does not invent a makeup date or final-exam date.
- The separate holiday adjustment notice requires Tsinghua sign-in. See `CALENDAR_VERIFICATION.md`.
- The 16-session teaching outline is a **proposal**, not an approved syllabus. The 16th session is unscheduled pending the makeup arrangement. Topic placement must be reviewed when that arrangement is known.
- Grading, office hours, assignments and project requirements have not been invented. Their pages explicitly state that they are not yet released.
- Only Lecture 1 currently includes a full study guide and worked example. Other lecture pages provide proposed objectives and readings; slide decks have not been created.

## Sources and attribution

- Structure inspired by [Tsinghua RL 2025](https://coai.cs.tsinghua.edu.cn/Courses/RL2025/_site/index.html).
- Visual restraint inspired by [Berkeley CS285](https://rail.eecs.berkeley.edu/deeprlcourse/).
- Implementation is a small, independently authored static site. No Jekyll runtime or copied template is required.
- Instructor information: [Chuanhao Li](https://www.chuanhao-li.com/), [official faculty profile](https://www.ie.tsinghua.edu.cn/info/1051/4043.htm), [Chengli Zhu](https://www.ie.tsinghua.edu.cn/info/1057/1094.htm).
- Instructor portrait: the image used on [Chuanhao Li's homepage](https://cyrilli.github.io/images/portrait_photo.png).
- Purple follows [Tsinghua's official color specification](https://vi.tsinghua.edu.cn/gk/xxbz/scgf.htm): `#660874`.
- Reference-course slides are linked to their original publishers; the local teaching archive is not uploaded or redistributed by this site.

The `.openai/` folder is local preview-registration metadata and is excluded from the GitHub package. This website is prepared for GitHub Pages; no Sites deployment is required.
