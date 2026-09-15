# Editing the course website

Edit the files below, rebuild, and refresh the preview. **Do not edit `dist/`: it is generated and your changes there will be overwritten.** Ordinary content changes do not require editing `build.mjs`.

## Find the content you see

All paths in this guide are relative to the repository root.

| Visible area | File to edit |
| --- | --- |
| Home headings, arrangement and introductory text | [`content/pages/home.md`](content/pages/home.md) |
| Course title, description, term, affiliation, time and room | [`content/course.json`](content/course.json) |
| Home updates | [`content/announcements.json`](content/announcements.json) |
| Teaching team, emails, offices and responsibilities | [`content/course.json`](content/course.json): `instructors`, `teachingAssistants` |
| Schedule heading and introductory line | [`content/pages/schedule.md`](content/pages/schedule.md) |
| Schedule dates, holidays and unscheduled sessions | [`content/schedule.json`](content/schedule.json) |
| Lecture titles, format, objectives, readings and material links | [`content/lectures.json`](content/lectures.json) |
| Lecture 1 worked example and extended notes | [`content/lectures/01.md`](content/lectures/01.md) |
| Assignments, release notices and grading information | [`content/pages/assignments.md`](content/pages/assignments.md) |
| Labs and project descriptions, requirements and links | [`content/pages/project.md`](content/pages/project.md) |
| Resources page headings and explanatory text | [`content/pages/resources.md`](content/pages/resources.md) |
| Textbooks, reference courses and LLM readings | [`content/resources.json`](content/resources.json) |
| Prerequisites on Home and Resources | [`content/course.json`](content/course.json): `prerequisites` |
| Navigation, footer, table headings and shared interface wording | [`content/site.json`](content/site.json) |
| Typography, colors, spacing and borders | [`public/assets/style.css`](public/assets/style.css) |
| Images, diagrams and downloadable files | `public/assets/` and `public/downloads/` |

The schedule remains a compact table. Calendar research notes stay in `CALENDAR_VERIFICATION.md`; they are not part of the rendered pages.

## Build and preview

Use Node.js 22 or newer and Python 3. From this repository's folder:

```sh
npm ci
npm run build && npm run check
npm run preview
```

Run `npm ci` once after downloading the repository, and again when its dependencies change. Open [the local preview](http://127.0.0.1:8765/). The preview rebuilds when a page is requested: save your source file, then refresh the browser. If a build reports an error, correct the source before continuing. Stop the server with Ctrl+C.

Before publishing, run `npm run build && npm run check` again. Commit and push the edited source files and rebuilt output to `main`. The GitHub workflow also runs `npm ci`, builds, checks and deploys the result; GitHub Pages must be enabled for the repository.

## Edit text and reusable values

Page files use Markdown: `#` for the page title, `##` for a section heading, `**bold**`, and `[link text](schedule.html)` for links. Edit the sentences directly.

The `<section>`, `<div>` and other HTML wrappers provide the existing layout. Keep opening and closing tags paired, and preserve blank lines between wrappers and Markdown. You can remove a whole section by deleting its wrapper and everything inside it.

`{{...}}` inserts content from another source. For example, `{{course.description}}` means that the description is edited in `course.json`, not in this page. Keep the token to share one value across pages, or replace it with ordinary text if this page needs different wording. Unknown or misspelled tokens are errors.

| Token | What it inserts |
| --- | --- |
| `{{course.title}}`, `{{course.room}}`, other `{{course.*}}` values | Corresponding course field |
| `{{course.meetingLabel}}` | Weekday label and start/end times from `course.meeting` |
| `{{course.prerequisitesSummary}}` | Summary of the prerequisite backgrounds |
| `{{contacts.assignmentHelp}}`, `{{contacts.labs}}` | Selected person's name and email link |
| `{{contacts.labsName}}` | Selected lab instructor's name |
| `{{announcements}}`, `{{team}}`, `{{schedule}}` | Rendered updates, teaching team and schedule |
| `{{textbooks}}`, `{{prerequisites}}`, `{{referenceCourses}}`, `{{llmReadings}}` | Rendered resource lists and tables |

JSON uses double quotes, commas between items, and no trailing comma after the final item. Use the literal `null` for an unknown value, not `"null"`. Within a quoted string, write `\"` for a literal double quote and `\n` for a line break.

## Common updates

### Post an announcement

Add an object to `content/announcements.json`, placing it where you want it displayed. The `text` field supports Markdown links and emphasis. For example, after uploading the named file:

```json
{
  "date": "2026-09-22",
  "text": "[Lecture 2 slides](downloads/lecture-02.pdf) are available."
}
```

Delete an object to remove its announcement. Dates use `YYYY-MM-DD`.

### Change course details or the teaching team

Edit `content/course.json`. For example, change a person's `email`, `office` or `responsibility`. Add or remove complete objects in `instructors` or `teachingAssistants` to change the team. Each person needs a unique, stable `id`. The compact team list displays `role`, `name`, `email`, and optional `office` and `responsibility`; the optional academic `title` is retained as metadata. Set a contact ID to `null` if that responsibility is unassigned.

`contacts.assignmentHelp` and `contacts.labs` contain those IDs. If the person responsible for assignments or labs changes, update the corresponding ID there; contact links on Assignments and Project then follow automatically.

The usual meeting time is in `meeting.start` and `meeting.end`, using 24-hour `HH:MM`. Keep `weekdayLabel`, `timezone`, `utcOffset` and `timezoneLabel` consistent with the intended timetable. **Changing the weekday label does not move dates**: edit the explicit dates in `schedule.json` as well. Timings written inside lecture notes are ordinary text and should also be reviewed when class times change.

### Change a date, holiday or makeup session

Each object in `content/schedule.json` is one displayed row, in array order. A class refers to a lecture by its ID:

```json
{
  "week": 2,
  "date": "2026-09-22",
  "lectureId": 2
}
```

Edit `date` to move that session. This also updates the lecture's displayed date and calendar exports. For a single meeting with a different time or room, add optional `start`, `end` or `room` fields to that row.

A holiday row has a `kind`, title and note instead of a `lectureId`:

```json
{
  "week": 4,
  "date": "2026-10-06",
  "kind": "holiday",
  "title": "National Day holiday",
  "note": "No class."
}
```

An unscheduled session uses `"date": null` and may use `"week": null`. Once its date is confirmed, replace `null` with the actual date in quotes, add any time/room overrides, and move the row to the appropriate place. Do not add a second row for the same lecture. Holidays and undated sessions do not create calendar events.

### Add, reorder or remove a lecture

In `content/lectures.json`, copy an existing object and give it an unused numeric `id`. Edit its `title`, `module`, `kind`, `summary`, `objectives`, `reading` and `materials`. IDs need not be consecutive; keep existing IDs stable so bookmarks continue to work. Array order controls previous/next lecture navigation.

Add a corresponding row to `content/schedule.json`, using the new ID and either its confirmed date or `null`. Moving a lecture in the lecture array does not change its scheduled date; update schedule rows separately.

For extended notes, create a Markdown file such as `content/lectures/17.md` and add `"body": "lectures/17.md"` to that lecture. The body path is relative to `content/`. The generated detail page for ID 17 is `lectures/17.html` (IDs below 10 are padded, such as `lectures/01.html`).

To remove a lecture, remove its object and schedule row, then update any hand-written links to it in page files or announcements. Rebuild and run the link check. A clean build removes obsolete generated pages.

### Upload slides or other materials

1. Put the file in `public/downloads/`, for example `public/downloads/lecture-02.pdf`.
2. In that lecture's `materials` array, add:

```json
{
  "label": "Slides",
  "url": "downloads/lecture-02.pdf"
}
```

The link appears on both Schedule and the lecture page. Add more objects for notes, code or external readings. An external resource uses its full `https://...` URL. Add `"download": true` when you want the browser to download a local file instead of opening it.

For a generated Markdown study guide, use a lecture `body` file and set that lecture's `download` to a filename such as `lecture-02-study-guide.md`. Add `downloads/lecture-02-study-guide.md` to `materials` to display its link. This lecture-level `download` field creates the guide; the material-level `download: true` only controls link behavior. Do not put a separate file with the same generated filename in `public/downloads/`.

**Local links are relative to the site's root in every source file**, even nested lecture notes: use `downloads/lecture-02.pdf`, `assets/diagram.svg` or `schedule.html`, with no leading `/` and no `../`. The builder adjusts them for nested output pages. Files in `public/` are copied to the site root, so the URL never includes `public/` or `dist/`. Keep filename case consistent. Create the folder if it does not exist. For links to a section of your own page, add an explicit HTML ID such as `<h2 id="grading">Grading</h2>` and link to `assignments.html#grading`.

### Release an assignment

Upload the handout to `public/downloads/assignment-01.pdf`. In `content/pages/assignments.md`, replace the unreleased-assignment sentence with the actual announcement and link:

```markdown
## Assignment 1: Dynamic programming

[Download the handout](downloads/assignment-01.pdf)

Submission instructions and the confirmed deadline go here.
```

Use your actual instructions and deadline, and remove any nearby placeholder text that is no longer accurate. Optionally add a Home announcement. Project and lab updates work the same way in `content/pages/project.md`.

### Change navigation, footer or appearance

Edit `content/site.json` to rename or reorder navigation items. Each item's `source` is a path relative to `content/`, and its `url` is the output filename. The same file holds footer text and reusable labels such as table headings and pending-material wording.

Edit `public/assets/style.css` for colors, font sizes, spacing and borders. Put new images in `public/assets/` and reference them as `assets/filename.png`. Rebuild or refresh the running preview to see the result.
