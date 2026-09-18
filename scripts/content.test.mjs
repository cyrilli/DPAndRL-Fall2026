import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {buildSite} from '../build.mjs';
import {checkSite} from '../check.mjs';

const sourceRoot = fileURLToPath(new URL('../', import.meta.url));

// Every test starts from editable sources alone. The real site is never rebuilt.
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dp-rl-content-test-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  for (const directory of ['content', 'public', 'templates']) {
    fs.cpSync(path.join(sourceRoot, directory), path.join(root, directory), {recursive: true});
  }
  assert.equal(fs.existsSync(path.join(root, 'dist')), false);
  return {
    root,
    read: relative => fs.readFileSync(path.join(root, relative), 'utf8'),
    json: relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8')),
    write(relative, text) {
      const target = path.join(root, relative);
      fs.mkdirSync(path.dirname(target), {recursive: true});
      fs.writeFileSync(target, text);
    },
    update(relative, edit) {
      const value = JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
      edit(value);
      fs.writeFileSync(path.join(root, relative), JSON.stringify(value, null, 2) + '\n');
    },
  };
}

async function buildAndCheck(f) {
  await buildSite(f.root);
  await checkSite(f.root);
}

function calendar(f) {
  // RFC 5545 permits long property values to continue on the next line.
  return f.read('dist/downloads/course-calendar.ics').replace(/\r?\n[ \t]/g, '');
}

function calendarValues(ics, property) {
  return [...ics.matchAll(new RegExp(`^${property}(?:;[^:\\r\\n]+)?:([^\\r\\n]+)`, 'gm'))]
    .map(match => match[1]);
}

function links(html) {
  return [...html.matchAll(/\bhref=["']([^"']+)["']/g)].map(match => match[1]);
}

function localTargets(html, fromPage) {
  return links(html).filter(url => !/^(?:[a-z][a-z\d+.-]*:|#)/i.test(url))
    .map(url => path.posix.normalize(path.posix.join(path.posix.dirname(fromPage), url.split(/[?#]/)[0])));
}

function outputSnapshot(root) {
  const dist = path.join(root, 'dist');
  const files = {};
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else files[path.relative(dist, file)] = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    }
  }
  walk(dist);
  return files;
}

test('course information and meeting-time edits reach pages and calendar downloads', async t => {
  const f = fixture(t);
  f.update('content/course.json', course => {
    course.title = 'Sequential Decision Methods';
    course.shortTitle = 'Decision Methods';
    course.term = 'Spring 2027';
    course.room = 'Example Teaching Room 501';
    course.instructors[0].email = 'instructor@example.edu';
    course.teachingAssistants[0].email = 'assignments@example.edu';
    course.meeting.start = '11:05';
    course.meeting.end = '13:40';
  });

  await buildAndCheck(f);
  for (const page of ['index.html', 'schedule.html', 'lectures/01.html']) {
    const html = f.read(`dist/${page}`);
    assert.ok(html.includes('Sequential Decision Methods'), `${page} uses the course title`);
    assert.ok(html.includes('Spring 2027'), `${page} uses the term`);
  }
  for (const page of ['index.html', 'schedule.html']) {
    const html = f.read(`dist/${page}`);
    assert.ok(html.includes('Example Teaching Room 501'), `${page} uses the room`);
    assert.ok(html.includes('11:05') && html.includes('13:40'), `${page} uses both meeting times`);
  }
  assert.ok(links(f.read('dist/index.html')).includes('mailto:instructor@example.edu'));
  assert.ok(links(f.read('dist/assignments.html')).includes('mailto:assignments@example.edu'));
  const ics = calendar(f);
  assert.ok(calendarValues(ics, 'SUMMARY').every(value => value.includes('Sequential Decision Methods')));
  assert.ok(calendarValues(ics, 'LOCATION').every(value => value === 'Example Teaching Room 501'));
  const datedClasses = f.json('content/schedule.json').filter(row => row.date && row.kind !== 'holiday');
  const starts = calendarValues(ics, 'DTSTART');
  const ends = calendarValues(ics, 'DTEND');
  assert.equal(starts.length, datedClasses.length);
  assert.equal(ends.length, datedClasses.length);
  assert.ok(starts.every(value => value.endsWith('T030500Z')), '11:05 at UTC+8 exports as 03:05 UTC');
  assert.ok(ends.every(value => value.endsWith('T054000Z')), '13:40 at UTC+8 exports as 05:40 UTC');
  const guide = f.read('dist/downloads/lecture-01-study-guide.md');
  assert.ok(guide.includes('Sequential Decision Methods') && guide.includes('Spring 2027'));
  assert.ok(guide.includes('Example Teaching Room 501') && guide.includes('11:05') && guide.includes('13:40'));
});

test('explicit holiday and Saturday makeup dates control the schedule and exported events', async t => {
  const f = fixture(t);
  const lastClass = f.json('content/schedule.json').filter(row => row.date && row.kind !== 'holiday').at(-1);
  const makeupPage = `lectures/${String(lastClass.lectureId).padStart(2, '0')}.html`;
  f.update('content/schedule.json', schedule => {
    const holiday = schedule.find(row => row.kind === 'holiday');
    holiday.date = '2026-10-07';
    holiday.title = 'Revised university holiday';
    holiday.note = 'Teaching is suspended on this date.';
    const makeup = schedule.find(row => row.lectureId === lastClass.lectureId);
    makeup.date = '2027-01-09';
    makeup.kind = 'makeup';
    makeup.week = null;
  });

  await buildAndCheck(f);
  const schedule = f.read('dist/schedule.html');
  assert.ok(schedule.includes('Revised university holiday'));
  assert.ok(schedule.includes('Teaching is suspended on this date.'));
  assert.match(schedule, /Oct(?:ober)?\s+7/);
  assert.match(schedule, /Jan(?:uary)?\s+9/);
  assert.match(f.read(`dist/${makeupPage}`), /Jan(?:uary)?\s+9/);
  const dates = calendarValues(calendar(f), 'DTSTART').map(value => value.slice(0, 8));
  assert.ok(dates.includes('20270109'), 'a confirmed Saturday makeup is included without a Tuesday assumption');
  assert.ok(!dates.includes('20261007'), 'the explicit holiday is excluded');
  assert.equal(dates.length, f.json('content/schedule.json').filter(row => row.date && row.kind !== 'holiday').length);
});

test('nonconsecutive lecture IDs and multiple materials work, and removed lectures leave no stale page', async t => {
  const f = fixture(t);
  const previousLastId = f.json('content/lectures.json').at(-1).id;
  const previousLastPage = `lectures/${String(previousLastId).padStart(2, '0')}.html`;
  const localMaterial = 'downloads/extra-practice.txt';
  const externalMaterial = 'https://example.edu/course/extra-slides.pdf';
  f.write(`public/${localMaterial}`, 'An extra classroom practice problem.\n');
  f.update('content/lectures.json', lectures => {
    lectures.push({
      id: 42,
      title: 'An additional policy workshop',
      module: 'Practice',
      kind: 'Workshop',
      summary: 'Compare policies in a small decision problem.',
      objectives: ['Explain the observed policy difference.'],
      reading: 'Review the course notes.',
      materials: [
        {label: 'Practice handout', url: localMaterial, download: true},
        {label: 'External slides', url: externalMaterial},
      ],
    });
  });
  f.update('content/schedule.json', schedule => {
    schedule.push({week: 17, date: '2027-01-05', lectureId: 42});
  });

  await buildAndCheck(f);
  const schedule = f.read('dist/schedule.html');
  const detail = f.read('dist/lectures/42.html');
  assert.ok(schedule.includes('An additional policy workshop'));
  assert.ok(links(schedule).includes('lectures/42.html'));
  assert.ok(links(schedule).includes(localMaterial));
  assert.ok(links(detail).includes(`../${localMaterial}`));
  assert.ok(links(schedule).includes(externalMaterial) && links(detail).includes(externalMaterial));
  assert.ok(localTargets(f.read(`dist/${previousLastPage}`), previousLastPage).includes('lectures/42.html'), 'next follows lecture order, not ID arithmetic');
  assert.ok(localTargets(detail, 'lectures/42.html').includes(previousLastPage), 'previous follows lecture order, not ID arithmetic');
  assert.equal(f.read(`dist/${localMaterial}`), 'An extra classroom practice problem.\n');

  f.update('content/lectures.json', lectures => lectures.splice(lectures.findIndex(lecture => lecture.id === 42), 1));
  f.update('content/schedule.json', schedule => schedule.splice(schedule.findIndex(row => row.lectureId === 42), 1));
  await buildAndCheck(f);
  assert.equal(fs.existsSync(path.join(f.root, 'dist/lectures/42.html')), false);
  assert.ok(!f.read('dist/schedule.html').includes('An additional policy workshop'));
  assert.ok(!localTargets(f.read(`dist/${previousLastPage}`), previousLastPage).includes('lectures/42.html'));
});

test('invalid lecture references, dates and missing materials fail before replacing the working site', async t => {
  const f = fixture(t);
  await buildAndCheck(f);
  const previousSite = outputSnapshot(f.root);
  const cases = [
    {
      file: 'content/schedule.json',
      edit: schedule => { schedule[0].lectureId = 999; },
      expected: /lecture.*999|999.*lecture/i,
    },
    {
      file: 'content/schedule.json',
      edit: schedule => { delete schedule[0].lectureId; },
      expected: /lectureId|lecture reference/i,
    },
    {
      file: 'content/schedule.json',
      edit: schedule => { schedule[0].date = '2026-02-30'; },
      expected: /date|2026-02-30/i,
    },
    {
      file: 'content/lectures.json',
      edit: lectures => lectures[1].materials.push({label: 'Missing handout', url: 'downloads/not-uploaded.pdf'}),
      expected: /not-uploaded\.pdf/,
    },
  ];
  for (const invalid of cases) {
    const original = f.read(invalid.file);
    f.update(invalid.file, invalid.edit);
    await assert.rejects(async () => await buildSite(f.root), invalid.expected);
    assert.deepEqual(outputSnapshot(f.root), previousSite, `${invalid.file}: an invalid edit must preserve the last good build`);
    f.write(invalid.file, original);
  }
});

test('removing the teaching assistant and assignment contact leaves a usable site', async t => {
  const f = fixture(t);
  const formerTaEmail = f.json('content/course.json').teachingAssistants[0].email;
  f.update('content/course.json', course => {
    course.teachingAssistants = [];
    course.contacts.assignmentHelp = null;
  });
  await buildAndCheck(f);
  for (const page of ['index.html', 'assignments.html']) {
    const html = f.read(`dist/${page}`);
    assert.ok(!html.includes(formerTaEmail), `${page} must not retain the removed contact`);
    assert.doesNotMatch(html, /\bundefined\b|mailto:null|\{\{contacts\./);
  }
  for (const instructor of f.json('content/course.json').instructors) {
    assert.ok(f.read('dist/index.html').includes(instructor.name));
  }
});

test('editing a lecture Markdown body updates both its page and downloadable study guide', async t => {
  const f = fixture(t);
  const firstLecture = f.json('content/lectures.json').find(lecture => lecture.id === 1);
  const bodyPath = `content/${firstLecture.body}`;
  f.write(bodyPath, f.read(bodyPath) + '\n\n## An additional classroom exercise\n\nCompare **two inventory policies** using a three-day demand sequence.\n');
  await buildAndCheck(f);
  const html = f.read('dist/lectures/01.html');
  const guide = f.read(`dist/downloads/${firstLecture.download}`);
  for (const text of [html, guide]) {
    assert.ok(text.includes('An additional classroom exercise'));
    assert.ok(text.includes('two inventory policies'));
    assert.ok(text.includes('three-day demand sequence'));
  }
  assert.ok(html.includes('../assets/lecture-01-route.svg'), 'lecture-body image links work from the detail directory');
  assert.ok(guide.includes('../assets/lecture-01-route.svg'), 'the downloaded Markdown uses working image paths too');
});

test('page prose, announcements, readings and shared labels are editable without renderer changes', async t => {
  const f = fixture(t);
  f.write('content/pages/home.md', f.read('content/pages/home.md').replace('## Teaching team', '## Course contacts'));
  f.update('content/announcements.json', announcements => {
    announcements.push({date: '2026-09-18', text: 'A new [classroom handout](downloads/announcement-handout.txt) is available.'});
  });
  f.write('public/downloads/announcement-handout.txt', 'Read this short handout before class.\n');
  f.update('content/resources.json', resources => {
    resources.textbooks[0].title = 'A replacement course reference';
    resources.textbooks[0].url = 'https://example.edu/reference-book';
  });
  f.update('content/site.json', site => {
    site.navigation.find(item => item.id === 'resources').label = 'Readings';
    site.footer.right = 'Contact the course team for updates.';
  });
  await buildAndCheck(f);
  const home = f.read('dist/index.html');
  assert.ok(home.includes('Course contacts'));
  assert.ok(home.includes('classroom handout'));
  assert.ok(links(home).includes('downloads/announcement-handout.txt'));
  const resources = f.read('dist/resources.html');
  assert.ok(resources.includes('A replacement course reference'));
  assert.ok(links(resources).includes('https://example.edu/reference-book'));
  for (const page of ['index.html', 'schedule.html', 'lectures/01.html']) {
    const html = f.read(`dist/${page}`);
    assert.ok(html.includes('Readings'), `${page} reflects the edited navigation label`);
    assert.ok(html.includes('Contact the course team for updates.'), `${page} reflects the edited footer`);
  }
});
