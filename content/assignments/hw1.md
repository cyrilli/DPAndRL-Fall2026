---
title: "Assignment 1: Dynamic programming"
subtitle: Planning when to operate and repair a machine
sidebar: false
toc: true
---

[Back to assignments](../assignments.md)

This assignment uses one machine-maintenance model to connect finite-horizon planning, discounted infinite-horizon planning, and function approximation. In each part, prove why a method works, then apply it to a small example by hand.

## Download {#materials}

- **[Download the student materials (ZIP)](../materials/assignments/assignment-01/student-materials.zip)** — the English assignment PDF, optional Lean starter project, and README.
- **[Read the assignment PDF](../materials/assignments/assignment-01/assignment_en.pdf)** — all required questions, hints, course-note links, and the optional Lean appendix.

## Deadline and submission {#submission}

| Item | Requirement |
|:--|:--|
| Released | November 17, 2026 |
| Deadline | **Tuesday, December 1, 2026, 09:50, before class (China Standard Time, UTC+8)** |
| Submission | Upload **one PDF** to the university course system |
| Required work | Problems 1–4; 18 subquestions; 100 points |
| Format | Typed answers or clear handwritten scans, with problem and subpart labels |
| Estimated work | About 7–10 hours, including review and writing; more if substantial review is needed |
| Optional Lean activity | Ungraded; no submission required; setup and practice take additional time |

Show equations, intermediate calculations, and the reasons for your proof steps. A final number or program output alone is not enough. Try each problem yourself before consulting notes or tools, acknowledge substantial assistance, and write explanations you can reproduce independently. The PDF gives the full instructions.

## Topics {#learning-goals}

| Problem | Points | What you will work on |
|:--|--:|:--|
| 1. Decisions before a deadline | 30 | Finite-horizon policy evaluation, backward-DP optimality, and a two-period calculation |
| 2. Continuing operation | 30 | Bellman operators, contraction, value iteration, optimality, and residual bounds |
| 3. Policy improvement | 15 | Why improvement cannot reduce the return, when to stop, and a small policy-iteration calculation |
| 4. Shared features | 25 | Representation limits, least-squares value iteration, error propagation, and fitted values versus policy returns |

Suggested schedule: complete Problems 1 and 2 in the first week, then Problems 3 and 4 in the second. The questions review the DP material and the reasoning needed for the closed-book written final examination. Lean is not part of the final examination.

For assignment questions, contact [Zhengyu Ye](mailto:zy-ye20@mails.tsinghua.edu.cn).
