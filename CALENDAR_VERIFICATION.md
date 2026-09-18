# Fall 2026 teaching calendar verification

Rechecked on September 18, 2026 against the instructor-supplied holiday adjustment notice.

## Evidence

1. Instructor-supplied departmental timetable, dated August 12, 2026: Tuesdays in the second morning teaching block, 09:50-12:15, Teaching Building 4, Room 4401. The timetable specifies Week 1 (September 14, 2026) through Week 16 (January 3, 2027).
2. [Official Tsinghua academic calendar](https://www.tsinghua.edu.cn/zjqh/syxx/qhxl.htm), [autumn 2026 image](https://www.tsinghua.edu.cn/xl/2026qiuji.jpg). The source copy is in `public/assets/tsinghua-2026-autumn-calendar.jpg`.
3. Instructor-supplied screenshot, `Resource/Weixin Image_20260918200001_1317_2.png` in the parent teaching workspace. Its title translates as “2026–2027 Autumn Semester Holiday Arrangements and Teaching Adjustment Diagram.” The screenshot identifies the Academic Affairs Office and displays July 1, 2026, 09:25. It was supplied for this verification on September 18, 2026. The original screenshot remains in the local teaching workspace.

The screenshot provides the teaching-day substitutions that were unavailable during the initial September 14 check. It supersedes the earlier unresolved makeup note; its displayed publication date is July 1, not the date of the notice listing previously consulted.

## Holiday adjustments relevant to this course

| Date | Instruction in the supplied notice | Effect on this Tuesday course |
| --- | --- | --- |
| September 20, 2026 (Sunday) | Teach the courses originally scheduled for September 25 (Friday); suspend the original Sunday courses. | No additional Tuesday meeting. |
| September 25, 2026 (Friday) | Mid-Autumn Festival holiday; original Friday courses move to September 20. | No change. |
| October 1–7, 2026 | Suspend originally scheduled courses during the National Day holiday. | Cancel Tuesday, October 6. The notice assigns no makeup for it. |
| October 10, 2026 (Saturday) | Originally scheduled courses proceed normally. | Follow the Saturday timetable; this is not a substitute Tuesday. |
| January 1, 2027 (Friday) | New Year holiday; originally scheduled courses are suspended. | No change. |

The notice also says staff work on September 20 and October 10. That staff working-day statement does not replace the explicit course arrangements in the diagram.

## Regular timetable dates

| Week | Tuesday | Status |
| --- | --- | --- |
| 1 | September 15, 2026 | Regular meeting |
| 2 | September 22, 2026 | Regular meeting |
| 3 | September 29, 2026 | Regular meeting |
| 4 | October 6, 2026 | National Day holiday; no class and no makeup scheduled |
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

There are exactly **15 scheduled meetings** under this notice and the supplied 16-week course timetable: 16 Tuesdays minus October 6. Each meeting consists of 09:50-10:35, 10:40-11:25 and 11:30-12:15, China Standard Time (UTC+8). This is 45 teaching periods of 45 minutes each.

The public calendar marks Mid-Autumn Festival on September 25, National Day on October 1-7, and New Year on January 1. January 5 and 12 are outside the course's supplied 16-week timetable and are not added as regular meetings. A final-exam date has not been inferred.

## Website correction

All 15 previously dated course meetings were correct and remain unchanged. The final undated 16th session incorrectly implied that a holiday makeup was expected. It has been removed from the active schedule and lecture navigation. Its synthesis outline is preserved in `planning/synthesis-outline.json` for optional future use, not as an additional course meeting.

The schedule, October 6 announcement, lecture pages and exported calendar now agree on 15 meetings. Subsequent department-specific changes, if any, should be entered in `content/schedule.json` and followed by `npm run build && npm run check`. Routine date changes do not require editing `build.mjs` or adding a `makeupDate` field.
