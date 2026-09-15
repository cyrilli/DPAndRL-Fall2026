import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {marked} from 'marked';
import {loadContent, inside, listFiles, sourceHash, lecturePath, dateLabel, meetingFor, eventStamp, validateOutput, requireValue} from './lib/content.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const inline = value => marked.parseInline(String(value ?? ''));
const interpolate = (source, context, file) => source.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
  const value = key.split('.').reduce((current, part) => current?.[part], context);
  requireValue(value !== undefined && value !== null, `${file}: unknown placeholder {{${key}}. See EDITING.md for supported placeholders.`);
  requireValue(['string', 'number'].includes(typeof value), `${file}: {{${key}}} must refer to text, not an entire list or object.`);
  return String(value);
});
const localUrl = (url, depth) => /^(?:[a-z][a-z\d+.-]*:|#|\?)/i.test(url) ? url : '../'.repeat(depth) + url;
const rebase = (html, depth) => html.replace(/\b(href|src)=(["'])([^"']+)\2/g, (_, attribute, quote, url) => `${attribute}=${quote}${localUrl(url, depth)}${quote}`);
const materialLinks = materials => materials.map(item => `<a href="${escape(item.url)}"${item.download ? ' download' : ''}>${escape(item.label)}</a>`).join(' &middot; ');
const table = (columns, rows, attributes = '') => `<table${attributes}><thead><tr>${columns.map(label => `<th scope="col">${escape(label)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>`;
const personLink = person => person.url ? `<a href="${escape(person.url)}">${escape(person.name)}</a>` : `<strong>${escape(person.name)}</strong>`;

function calendarFiles(data) {
  const {course, site, lectures, schedule} = data;
  const byId = new Map(lectures.map(lecture => [lecture.id, lecture]));
  const icsEscape = value => String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  const context = {course};
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//DP RL Course Website//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    `X-WR-CALNAME:${icsEscape(interpolate(site.labels.calendarName, context, 'content/site.json → labels.calendarName'))}`, `X-WR-TIMEZONE:${course.meeting.timezone}`];
  for (const row of schedule.filter(row => row.kind !== 'holiday' && row.date !== null)) {
    const meeting = meetingFor(course, row);
    const lecture = byId.get(row.lectureId);
    lines.push('BEGIN:VEVENT', `UID:course-session-${lecture.id}-${course.term.replace(/[^\w-]/g, '-')}@course.local`,
      `DTSTAMP:${row.date.replaceAll('-', '')}T000000Z`,
      `DTSTART:${eventStamp(row.date, meeting.start, course.meeting.utcOffset)}`,
      `DTEND:${eventStamp(row.date, meeting.end, course.meeting.utcOffset)}`,
      `SUMMARY:${icsEscape(course.title)}`, `LOCATION:${icsEscape(meeting.room)}`,
      `DESCRIPTION:${icsEscape(lecture.title + (row.note ? '\n' + row.note : ''))}`, 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  const folded = lines.map(line => {
    const parts = [];
    let current = '';
    for (const char of line) {
      if (Buffer.byteLength(current + char) > 73) { parts.push(current); current = ' '; }
      current += char;
    }
    parts.push(current);
    return parts.join('\r\n');
  });
  const quote = value => '"' + String(value ?? '').replaceAll('"', '""') + '"';
  const csvRows = schedule.map(row => {
    const holiday = row.kind === 'holiday';
    const meeting = meetingFor(course, row);
    const day = row.date ? new Date(`${row.date}T12:00:00Z`).toLocaleDateString('en-US', {weekday: 'long', timeZone: 'UTC'}) : '';
    return [row.week, row.date, day, holiday || !row.date ? '' : meeting.start, holiday || !row.date ? '' : meeting.end,
      course.meeting.timezone, holiday ? '' : meeting.room, holiday ? site.labels.holiday : row.date ? site.labels.regularMeeting : site.labels.pending,
      holiday ? row.title : byId.get(row.lectureId).title];
  });
  return new Map([
    ['downloads/course-calendar.ics', folded.join('\r\n') + '\r\n'],
    ['downloads/course-schedule.csv', [site.labels.calendarColumns, ...csvRows].map(row => row.map(quote).join(',')).join('\r\n') + '\r\n']
  ]);
}

export function buildSite(root = ROOT) {
  const data = loadContent(root);
  const {course, site, lectures, schedule, announcements, resources} = data;
  const labels = site.labels;
  const team = [...course.instructors, ...course.teachingAssistants];
  const byId = new Map(lectures.map(lecture => [lecture.id, lecture]));
  const schedulePage = site.navigation.find(page => page.id === 'schedule');
  const resourcesPage = site.navigation.find(page => page.id === 'resources');
  const homePage = site.navigation.find(page => page.id === 'home') ?? site.navigation[0];
  const fullCourse = {...course, meetingLabel: `${course.meeting.weekdayLabel}, ${course.meeting.start}-${course.meeting.end}`,
    prerequisitesSummary: course.prerequisites.map(item => item.background).join(', ') + '.'};
  const contacts = {};
  for (const key of ['assignmentHelp', 'labs', ...Object.keys(course.contacts ?? {})]) {
    const person = team.find(item => item.id === course.contacts?.[key]);
    contacts[key] = person ? `${personLink(person)} &middot; <a href="mailto:${escape(person.email)}">${escape(person.email)}</a>` : escape(labels.datePending);
    contacts[key + 'Name'] = person ? escape(person.name) : escape(labels.datePending);
  }
  const context = {course: fullCourse, site, contacts};
  context.team = `<ul>${team.map(person => `<li><span class="staff-role">${escape(person.role)}</span> ${personLink(person)} <span class="staff-contact">&middot; <a href="mailto:${escape(person.email)}">${escape(person.email)}</a></span>${person.office ? `<span class="staff-note">${escape(labels.office)}: ${escape(person.office)}.</span>` : ''}${person.responsibility ? `<span class="staff-note">${escape(person.responsibility)}</span>` : ''}</li>`).join('\n')}</ul>`;
  context.announcements = `<ul>${announcements.map(item => `<li><time datetime="${item.date}">${dateLabel(item.date)}</time> &mdash; ${inline(item.text)}</li>`).join('\n')}</ul>`;
  context.textbooks = `<div class="three-col">${resources.textbooks.map(book => `<article class="module"><p class="module-number">${escape(book.category.toUpperCase())}</p><h3>${escape(book.title)}</h3><p>${escape(book.authors)}</p><p>${inline(book.description)}</p><a href="${escape(book.url)}">${escape(book.linkLabel)} &rarr;</a></article>`).join('\n')}</div>`;
  context.prerequisites = table(labels.prerequisiteColumns, course.prerequisites.map(item => `<tr><th scope="row">${escape(item.background)}</th><td>${inline(item.use)}</td></tr>`).join('\n'));
  context.referenceCourses = table(labels.referenceColumns, resources.courses.map(item => `<tr><td><strong>${escape(item.name)}</strong><small>${escape(item.title)}</small></td><td>${inline(item.description)}</td><td><a href="${escape(item.url)}">${escape(item.linkLabel)}</a></td></tr>`).join('\n'));
  context.llmReadings = `<ul>${resources.llmReadings.map(item => `<li><a href="${escape(item.url)}">${escape(item.label)}</a> &mdash; ${inline(item.description)}</li>`).join('\n')}</ul>`;
  context.schedule = table(labels.scheduleColumns, schedule.map(row => {
    const holiday = row.kind === 'holiday';
    const lecture = byId.get(row.lectureId);
    const meeting = meetingFor(course, row);
    const override = !holiday && (row.start || row.end || row.room) ? `<small>${escape(meeting.start)}-${escape(meeting.end)} &middot; ${escape(meeting.room)}</small>` : '';
    const topic = holiday ? `<strong>${escape(row.title)}</strong>` : `<a class="topic" href="${lecturePath(lecture.id)}">${escape(lecture.title)}</a><small>${escape(lecture.module)}</small>`;
    return `<tr${holiday ? ' class="holiday"' : ` id="lecture-${lecture.id}"`}><td>${row.week === null ? '&mdash;' : String(row.week).padStart(2, '0')}</td><td class="nowrap">${row.date ? dateLabel(row.date) : escape(labels.datePending)}${override}</td><td>${topic}${row.note ? `<small>${inline(row.note)}</small>` : ''}</td><td><span class="status">${escape(holiday ? labels.holiday : row.date === null ? labels.pending : lecture.kind)}</span></td><td>${holiday ? '&mdash;' : lecture.materials.length ? materialLinks(lecture.materials) : `<span class="label">${escape(labels.materialsPending)}</span>`}</td></tr>`;
  }).join('\n'), ' class="schedule"').replace('<thead>', `<caption class="sr-only">${escape(labels.scheduleCaption)}</caption><thead>`);

  const files = new Map();
  for (const file of listFiles(path.join(root, 'public'))) files.set(path.relative(path.join(root, 'public'), file).split(path.sep).join('/'), fs.readFileSync(file));
  requireValue(files.has('assets/style.css'), 'Missing public/assets/style.css. Source assets belong in public/, not dist/.');
  const cssVersion = createHash('sha256').update(files.get('assets/style.css')).digest('hex').slice(0, 10);
  const layout = fs.readFileSync(path.join(root, 'templates/layout.html'), 'utf8');
  const renderMarkdown = (source, file, extra = {}) => {
    const expanded = interpolate(source, {...context, ...extra}, file);
    return marked.parse(expanded).replace(/(<table\b[\s\S]*?<\/table>)/g, '<div class="table-wrap">$1</div>');
  };
  const wrap = (body, title, active, output, sourceNote) => {
    const depth = output.split('/').length - 1;
    const footer = key => inline(interpolate(site.footer[key], context, `content/site.json → footer.${key}`)).replace(/\n/g, '<br>');
    return interpolate(layout, {
      metaDescription: escape(`${title}. ${course.title}, ${course.institution}, ${course.term}.`),
      documentTitle: escape(`${title} | ${course.shortTitle} | ${course.institution} ${course.term}`),
      cssUrl: localUrl(`assets/style.css?v=${cssVersion}`, depth),
      sourceNote: escape(sourceNote), skipToContent: escape(labels.skipToContent),
      homeUrl: localUrl(homePage.url, depth), brand: escape(course.shortTitle), term: escape(course.term),
      mainNavigation: escape(labels.mainNavigation),
      navigation: site.navigation.map(page => `<a href="${localUrl(page.url, depth)}"${page.id === active ? ' aria-current="page"' : ''}>${escape(page.label)}</a>`).join('\n'),
      body: rebase(body, depth), footerLeft: rebase(footer('left'), depth), footerRight: rebase(footer('right'), depth)
    }, 'templates/layout.html');
  };
  for (const page of site.navigation) {
    const source = fs.readFileSync(inside(path.join(root, 'content'), page.source), 'utf8');
    const body = renderMarkdown(source, `content/${page.source}`);
    const titleMatch = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    requireValue(titleMatch, `content/${page.source}: add a # page title.`);
    const title = titleMatch[1].replace(/<[^>]+>/g, '').replaceAll('&amp;', '&');
    files.set(page.url, wrap(body, title, page.id, page.url, `content/${page.source}`));
  }
  for (const [index, lecture] of lectures.entries()) {
    const row = schedule.find(row => row.lectureId === lecture.id);
    const meeting = meetingFor(course, row ?? {});
    const date = row?.date ? dateLabel(row.date) : labels.datePending;
    const lectureContext = {lecture: {...lecture, date, start: meeting.start, end: meeting.end, room: meeting.room}};
    const source = lecture.body ? fs.readFileSync(inside(path.join(root, 'content'), lecture.body), 'utf8') : '';
    const body = `<div class="breadcrumb"><a href="${schedulePage.url}">${escape(labels.schedule)}</a> / ${String(lecture.id).padStart(2, '0')}</div>
<section class="page-title"><p class="eyebrow">${escape(labels.session)} ${String(lecture.id).padStart(2, '0')} / ${escape(lecture.module)}</p><h1>${escape(lecture.title)}</h1><p>${inline(lecture.summary)}</p></section>
<div class="meta"><span><strong>${escape(labels.plannedDate)}</strong> ${escape(date)}${row?.start || row?.end || row?.room ? ` &middot; ${escape(meeting.start)}-${escape(meeting.end)} &middot; ${escape(meeting.room)}` : ''}</span></div>
<section class="section prose"><h2>${escape(labels.learningObjectives)}</h2><ul>${lecture.objectives.map(item => `<li>${inline(item)}</li>`).join('')}</ul><h2>${escape(labels.beforeClass)}</h2><p>${inline(lecture.reading)}</p>
${resourcesPage ? `<div class="link-row"><a href="${resourcesPage.url}">${escape(labels.findResources)}</a></div>` : ''}
${lecture.materials.length ? `<h2>${escape(labels.materials)}</h2><div class="link-row">${materialLinks(lecture.materials)}</div>` : `<p class="note">${escape(labels.slidesPending)}</p>`}</section>
<section class="prose">${renderMarkdown(source, `content/${lecture.body ?? 'lectures.json'}`, lectureContext)}</section>
<section class="section rule"><div class="section-head">${index > 0 ? `<a href="${lecturePath(lectures[index - 1].id)}">&larr; ${escape(labels.previousOutline)}</a>` : `<a href="${schedulePage.url}">${escape(labels.fullSchedule)}</a>`}${index + 1 < lectures.length ? `<a href="${lecturePath(lectures[index + 1].id)}">${escape(labels.nextOutline)} &rarr;</a>` : `<a href="${schedulePage.url}">${escape(labels.fullSchedule)}</a>`}</div></section>`;
    files.set(lecturePath(lecture.id), wrap(body, lecture.title, 'schedule', lecturePath(lecture.id), `content/lectures.json${lecture.body ? ` and content/${lecture.body}` : ''}`));
    if (lecture.download) {
      const guide = `# ${lecture.title}\n\n${course.title}\n${course.institution}, ${course.term}\n\n${labels.guideDate}: ${date}. ${labels.guideTime}: ${meeting.start}-${meeting.end}, ${course.meeting.timezoneLabel}.\n${labels.guideLocation}: ${meeting.room}.\n\n## ${labels.learningObjectives}\n\n${lecture.objectives.map(item => '- ' + item).join('\n')}\n\n${interpolate(source, {...context, ...lectureContext}, `content/${lecture.body}`)}\n\n## ${labels.beforeClass}\n\n${lecture.reading}\n`;
      files.set(`downloads/${lecture.download}`, rebase(guide, 1).replace(/(!?\[[^\]]*\]\()([^\s)]+)(\))/g, (_, before, url, after) => before + localUrl(url, 1) + after));
    }
  }
  // Keep existing bookmarks without maintaining a duplicate lecture catalogue.
  const redirect = `<script>location.replace(${JSON.stringify(schedulePage.url)}+location.hash);</script><noscript><meta http-equiv="refresh" content="0;url=${escape(schedulePage.url)}"></noscript>`;
  files.set('lectures.html', `<!doctype html><html lang="en"><head><meta charset="utf-8">${redirect}<title>${escape(labels.redirectTitle)}</title></head><body><p>${escape(labels.redirectMessage)} <a href="${escape(schedulePage.url)}">${escape(labels.redirectLink)}</a>.</p></body></html>`);
  for (const [name, value] of calendarFiles(data)) files.set(name, value);
  const result = validateOutput(root, data, files);
  files.set('.source-manifest.json', JSON.stringify({sourceHash: sourceHash(root)}, null, 2) + '\n');
  // Validate every output before replacing the generated folder.
  const staging = path.join(root, '.course-build');
  fs.rmSync(staging, {recursive: true, force: true});
  for (const [name, value] of files) {
    const target = inside(staging, name);
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, value);
  }
  fs.rmSync(path.join(root, 'dist'), {recursive: true, force: true});
  fs.renameSync(staging, path.join(root, 'dist'));
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { const result = buildSite(); console.log(`Built ${result.pages} English pages and ${result.events} calendar events from content/ and public/.`); }
  catch (error) { console.error(`Build failed: ${error.message}`); process.exitCode = 1; }
}
