# Fall 2026 teaching calendar verification

Checked on September 14, 2026.

## Evidence

1. Instructor-supplied departmental timetable, dated August 12, 2026: Tuesdays in the second morning teaching block, 09:50-12:15, Teaching Building 4, Room 4401. The timetable specifies Week 1 (September 14, 2026) through Week 16 (January 3, 2027).
2. [Official Tsinghua academic calendar](https://www.tsinghua.edu.cn/zjqh/syxx/qhxl.htm), [autumn 2026 image](https://www.tsinghua.edu.cn/xl/2026qiuji.jpg). A saved copy is in `dist/assets/tsinghua-2026-autumn-calendar.jpg`.
3. [Official notice listing](https://learning.tsinghua.edu.cn/xwgg/tzgg.htm) lists a September 14, 2026 notice on holiday teaching adjustments for academic year 2026-2027. [The full notice](https://xxbg.cic.tsinghua.edu.cn/oath/detail.jsp?boardid=2709&seq=177015) redirects to Tsinghua authentication. Its body has not been verified.

## Regular timetable dates

| Week | Tuesday | Status |
| --- | --- | --- |
| 1 | September 15, 2026 | Regular meeting |
| 2 | September 22, 2026 | Regular meeting |
| 3 | September 29, 2026 | Regular meeting |
| 4 | October 6, 2026 | National Day holiday; makeup unverified |
| 5 | October 13, 2026 | Regular meeting |
| 6 | October 20, 2026 | Regular meeting |
| 7 | October 27, 2026 | Regular meeting |
| 8 | November 3, 2026 | Regular meeting |
| 9 | November 10, 2026 | Regular meeting |
| 10 | November 17, 2026 | Regular meeting |
| 11 | November 24, 2026 | Regular meeting |
| 12 | December 1, 2026 | Regular meeting |
| 13 | December 8, 2026 | Regular meeting |
| 14 | December 15, 2026 | Regular meeting |
| 15 | December 22, 2026 | Regular meeting |
| 16 | December 29, 2026 | Regular meeting |

There are 15 regular meetings plus any officially required makeup meeting. Each meeting consists of 09:50-10:35, 10:40-11:25 and 11:30-12:15, China Standard Time (UTC+8).

The public calendar marks Mid-Autumn Festival on September 25, National Day on October 1-7, and New Year on January 1. January 5 and 12 are outside the course's supplied 16-week timetable and are not added as regular meetings. A final-exam date has not been inferred.

## Unresolved point

The exact makeup arrangement for October 6 requires the full teaching adjustment notice or confirmation from the department. National working-day adjustments must not be treated as university teaching adjustments. The website and calendar explicitly preserve this uncertainty.

When the notice is available, update the schedule generation in `build.mjs`, set `makeupDate` in `content/course.json`, revise the proposed topic order, and regenerate both the `.ics` and `.csv` downloads. Include a makeup event only after its date, time and teaching-day substitution are known.
