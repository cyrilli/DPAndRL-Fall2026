# Website content

Start with [the editing guide](../EDITING.md), which maps each visible part of the website to its source and includes common edit examples.

| File or folder | Edit here for |
| --- | --- |
| [`pages/home.md`](pages/home.md) | Home headings and page layout |
| [`pages/schedule.md`](pages/schedule.md) | Schedule heading and introductory text |
| [`pages/assignments.md`](pages/assignments.md) | Assignment releases, instructions and policies |
| [`pages/project.md`](pages/project.md) | Labs and project descriptions and requirements |
| [`pages/resources.md`](pages/resources.md) | Resource-page headings and explanatory text |
| [`course.json`](course.json) | Course facts, teaching team, contacts and prerequisites |
| [`site.json`](site.json) | Navigation, footer and shared labels |
| [`announcements.json`](announcements.json) | Home updates |
| [`schedule.json`](schedule.json) | Explicit class dates, holidays and undated sessions |
| [`lectures.json`](lectures.json) | Lecture titles, objectives, readings and material links |
| [`lectures/`](lectures/) | Extended lecture notes; each lecture's `body` selects a file |
| [`resources.json`](resources.json) | Textbooks, reference courses and LLM readings |

Markdown files contain editable prose and simple HTML wrappers for layout. A token such as `{{course.description}}` draws its value from JSON; edit that source value to update every use. Keep the tokens for generated lists and tables, such as `{{schedule}}`, and edit their JSON entries.

Upload slides and handouts to [`../public/downloads/`](../public/downloads/). Edit styles and images in [`../public/assets/`](../public/assets/). Write source links as `downloads/file.pdf` or `assets/image.png`, without a leading `/` or `../`; the builder handles nested lecture pages.

After editing, run `npm run build && npm run check` from the repository root. With `npm run preview` running, saving source and refreshing a page also rebuilds the preview. **Do not edit `dist/`; every build regenerates it.**
