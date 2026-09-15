import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

export function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}
export function readJson(root, name) {
  const file = `content/${name}.json`;
  try { return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')); }
  catch (error) { throw new Error(`${file}: ${error.message}`); }
}
export function inside(root, relative, label = relative) {
  requireValue(typeof relative === 'string' && relative.length > 0, `${label}: enter a relative file path.`);
  const resolved = path.resolve(root, relative);
  requireValue(resolved.startsWith(path.resolve(root) + path.sep), `${label}: path must stay inside its source folder.`);
  return resolved;
}
export function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
}
export function validTime(value) { return typeof value === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value); }
export const lecturePath = id => `lectures/${String(id).padStart(2, '0')}.html`;
export function dateLabel(date) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'});
}
export function meetingFor(course, row) {
  return {start: row.start ?? course.meeting.start, end: row.end ?? course.meeting.end, room: row.room ?? course.room};
}
export function eventStamp(date, time, offset) {
  return new Date(`${date}T${time}:00${offset}`).toISOString().replace(/[-:]/g, '').replace('.000', '');
}
export function listFiles(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, {withFileTypes: true}).flatMap(entry => {
    if (entry.name === '.DS_Store') return [];
    const file = path.join(root, entry.name);
    return entry.isDirectory() ? listFiles(file) : [file];
  });
}
export function sourceHash(root) {
  const hash = createHash('sha256');
  for (const folder of ['content', 'public', 'templates']) {
    for (const file of listFiles(path.join(root, folder)).sort()) {
      hash.update(path.relative(root, file)).update(fs.readFileSync(file));
    }
  }
  return hash.digest('hex');
}
function text(value, label) { requireValue(typeof value === 'string' && value.trim(), `${label}: enter text.`); }
function array(value, label) { requireValue(Array.isArray(value), `${label}: expected a JSON array.`); }
function unique(values, label) { requireValue(new Set(values).size === values.length, `${label}: duplicate values are not allowed.`); }
function url(value, label) {
  text(value, label);
  requireValue(!/^(?:\/|javascript:|data:|file:)/i.test(value), `${label}: use an https:// URL or a site-relative path such as downloads/slides.pdf.`);
  requireValue(!/\\/.test(value), `${label}: use forward slashes in URLs.`);
}
export function loadContent(root) {
  const data = Object.fromEntries(['course', 'site', 'lectures', 'schedule', 'announcements', 'resources'].map(name => [name, readJson(root, name)]));
  const {course, site, lectures, schedule, announcements, resources} = data;
  for (const key of ['title', 'shortTitle', 'term', 'institution', 'department', 'room', 'description']) text(course[key], `content/course.json → ${key}`);
  requireValue(course.meeting && typeof course.meeting === 'object', 'content/course.json → meeting: expected an object.');
  for (const key of ['start', 'end']) requireValue(validTime(course.meeting[key]), `content/course.json → meeting.${key}: use HH:MM (24-hour time).`);
  requireValue(course.meeting.end > course.meeting.start, 'content/course.json → meeting.end must be after start.');
  for (const key of ['weekdayLabel', 'timezone', 'timezoneLabel']) text(course.meeting[key], `content/course.json → meeting.${key}`);
  requireValue(/^[+-](?:0\d|1[0-4]):[0-5]\d$/.test(course.meeting.utcOffset), 'content/course.json → meeting.utcOffset: use a UTC offset such as +08:00.');
  try { new Intl.DateTimeFormat('en-US', {timeZone: course.meeting.timezone}).format(); }
  catch { throw new Error('content/course.json → meeting.timezone: use a valid IANA timezone such as Asia/Shanghai.'); }
  for (const key of ['instructors', 'teachingAssistants', 'prerequisites']) array(course[key], `content/course.json → ${key}`);
  const team = [...course.instructors, ...course.teachingAssistants];
  unique(team.map(person => person.id), 'content/course.json → team IDs');
  for (const person of team) {
    for (const key of ['id', 'name', 'role', 'email']) text(person[key], `content/course.json → ${person.id ?? 'team member'}.${key}`);
    if (person.url) url(person.url, `content/course.json → ${person.id}.url`);
  }
  for (const [key, id] of Object.entries(course.contacts ?? {})) {
    requireValue(id === null || team.some(person => person.id === id), `content/course.json → contacts.${key}: no team member has ID "${id}". Use a listed ID or null.`);
  }
  for (const [i, item] of course.prerequisites.entries()) {
    text(item.background, `content/course.json → prerequisites[${i}].background`);
    text(item.use, `content/course.json → prerequisites[${i}].use`);
  }
  array(site.navigation, 'content/site.json → navigation');
  unique(site.navigation.map(page => page.id), 'content/site.json → navigation IDs');
  unique(site.navigation.map(page => page.url), 'content/site.json → navigation URLs');
  for (const [i, page] of site.navigation.entries()) {
    for (const key of ['id', 'label', 'url', 'source']) text(page[key], `content/site.json → navigation[${i}].${key}`);
    requireValue(page.url.endsWith('.html') && !page.url.startsWith('/') && !page.url.includes('..'), `content/site.json → navigation[${i}].url: use a relative .html filename.`);
    requireValue(fs.existsSync(inside(path.join(root, 'content'), page.source)), `content/site.json → navigation[${i}].source: missing content/${page.source}.`);
  }
  requireValue(site.navigation.some(page => page.id === 'schedule'), 'content/site.json → navigation: retain one page with id "schedule" for lecture navigation.');
  requireValue(site.labels && site.footer, 'content/site.json: labels and footer are required.');
  array(lectures, 'content/lectures.json');
  unique(lectures.map(lecture => lecture.id), 'content/lectures.json → lecture IDs');
  unique(lectures.filter(lecture => lecture.download).map(lecture => lecture.download), 'content/lectures.json → download filenames');
  for (const [i, lecture] of lectures.entries()) {
    const field = `content/lectures.json → entry ${i + 1} (id ${lecture.id})`;
    requireValue(Number.isInteger(lecture.id) && lecture.id > 0, `${field}.id: use a unique positive integer.`);
    for (const key of ['title', 'module', 'kind', 'summary', 'reading']) text(lecture[key], `${field}.${key}`);
    array(lecture.objectives, `${field}.objectives`);
    array(lecture.materials, `${field}.materials`);
    for (const [j, material] of lecture.materials.entries()) {
      text(material.label, `${field}.materials[${j}].label`);
      url(material.url, `${field}.materials[${j}].url`);
    }
    if (lecture.body) requireValue(fs.existsSync(inside(path.join(root, 'content'), lecture.body)), `${field}.body: missing content/${lecture.body}.`);
    if (lecture.download) {
      requireValue(lecture.body, `${field}.download: add a body Markdown file first.`);
      requireValue(/^[\w.-]+\.md$/.test(lecture.download), `${field}.download: use a Markdown filename such as lecture-01-study-guide.md.`);
    }
  }
  array(schedule, 'content/schedule.json');
  const assigned = schedule.filter(row => row.lectureId !== undefined);
  unique(assigned.map(row => row.lectureId), 'content/schedule.json → lectureId (one row per session)');
  for (const [i, row] of schedule.entries()) {
    const field = `content/schedule.json → row ${i + 1}`;
    requireValue(row.date === null || validDate(row.date), `${field}.date: use a real YYYY-MM-DD date or null.`);
    requireValue(row.week === null || (Number.isInteger(row.week) && row.week > 0), `${field}.week: use a positive integer or null.`);
    if (row.kind === 'holiday') {
      text(row.title, `${field}.title`);
      requireValue(row.lectureId === undefined, `${field}: a holiday must not have a lectureId.`);
    } else {
      requireValue(lectures.some(lecture => lecture.id === row.lectureId), `${field}.lectureId: no lecture has ID ${row.lectureId}. Add it to content/lectures.json or remove this row.`);
    }
    const meeting = meetingFor(course, row);
    requireValue(validTime(meeting.start) && validTime(meeting.end) && meeting.end > meeting.start, `${field}: start/end must be valid HH:MM times with end after start.`);
  }
  array(announcements, 'content/announcements.json');
  for (const [i, item] of announcements.entries()) {
    requireValue(validDate(item.date), `content/announcements.json → entry ${i + 1}.date: use YYYY-MM-DD.`);
    text(item.text, `content/announcements.json → entry ${i + 1}.text`);
  }
  for (const key of ['textbooks', 'courses', 'llmReadings']) {
    array(resources[key], `content/resources.json → ${key}`);
    for (const [i, item] of resources[key].entries()) url(item.url, `content/resources.json → ${key}[${i}].url`);
  }
  return data;
}

export function validateOutput(root, data, files) {
  let links = 0;
  const htmlFiles = [...files.keys()].filter(file => file.endsWith('.html'));
  for (const file of htmlFiles) {
    const html = files.get(file).toString();
    requireValue(html.includes('<html lang="en">'), `${file}: missing English document language.`);
    requireValue(!/[\u3400-\u9fff]/u.test(html), `${file}: authored website text must remain in English.`);
    requireValue(!/\{\{[^}]+\}\}/.test(html), `${file}: an unresolved content placeholder remains.`);
    requireValue(!html.includes('127.0.0.1'), `${file}: a local preview URL must not be published.`);
    for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
      const href = match[1].replaceAll('&amp;', '&');
      if (/^(https?:|mailto:|tel:)/i.test(href)) continue;
      requireValue(!href.startsWith('/') && !/^[a-z]+:/i.test(href), `${file}: invalid site-relative link ${href}.`);
      const [pathname, hash] = href.split('#');
      const clean = pathname.split('?')[0];
      const target = clean ? path.posix.normalize(path.posix.join(path.posix.dirname(file), decodeURIComponent(clean))) : file;
      requireValue(!target.startsWith('../') && files.has(target), `${file}: missing local link "${href}". Add the file under public/, or fix the source page/material URL.`);
      if (hash && target.endsWith('.html')) {
        requireValue(new RegExp(`id=["']${hash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(files.get(target).toString()), `${file}: missing anchor ${href}.`);
      }
      links++;
    }
  }
  const events = data.schedule.filter(row => row.kind !== 'holiday' && row.date !== null);
  const ics = files.get('downloads/course-calendar.ics')?.toString().replace(/\r?\n /g, '');
  requireValue(ics, 'Missing generated calendar.');
  const eventBlocks = [...ics.matchAll(/BEGIN:VEVENT\r?\n([\s\S]*?)END:VEVENT/g)].map(match => match[1]);
  requireValue(eventBlocks.length === events.length, 'Calendar event count does not match content/schedule.json. Run npm run build.');
  for (const row of events) {
    const meeting = meetingFor(data.course, row);
    const start = eventStamp(row.date, meeting.start, data.course.meeting.utcOffset);
    const end = eventStamp(row.date, meeting.end, data.course.meeting.utcOffset);
    requireValue(eventBlocks.some(block => block.includes(`DTSTART:${start}`) && block.includes(`DTEND:${end}`)), `Calendar is missing the meeting at ${row.date} ${meeting.start}. Run npm run build.`);
  }
  for (const lecture of data.lectures) requireValue(files.has(lecturePath(lecture.id)), `Missing page for lecture ID ${lecture.id}. Run npm run build.`);
  requireValue(files.has('.nojekyll'), 'Missing .nojekyll file in public/.');
  return {pages: htmlFiles.length, links, events: events.length};
}
