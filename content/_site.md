---
project:
  type: website
  output-dir: _site
  resources:
  - materials/**
  - assets/**
  - theme/vendor/katex/**
website:
  title: DP & RL
  site-url: https://www.chuanhao-li.com/DPAndRL-Fall2026/
  navbar:
    left:
    - text: Home
      href: index.md
    - text: Schedule
      href: schedule.md
    - text: Assignments
      href: assignments.md
    - text: Project
      href: project.md
    - text: Notes
      href: notes/index.md
    - text: Resources
      href: resources.md
  sidebar:
  - id: notes
    title: Course notes
    style: docked
    collapse-level: 1
    contents:
    - notes/index.md
    - section: Worked notes
      contents:
      - notes/bellman-operators.md
    - section: Lecture outlines
      contents:
      - lectures/01.md
      - lectures/02.md
      - lectures/03.md
      - lectures/04.md
      - lectures/05.md
      - lectures/06.md
      - lectures/07.md
      - lectures/08.md
      - lectures/09.md
      - lectures/10.md
      - lectures/11.md
      - lectures/12.md
      - lectures/13.md
      - lectures/14.md
      - lectures/15.md
  page-footer:
    left: Dynamic Programming and Reinforcement Learning · Fall 2026
    right: Tsinghua University
format:
  html:
    theme:
    - cosmo
    - theme/course.scss
    html-math-method:
      method: katex
      url: /theme/vendor/katex/
    toc: true
    toc-depth: 3
---

# Website settings

Edit the YAML block above to change the course name, navigation tabs, notes sidebar,
footer, and website address. This file configures the site and is not rendered as a page.
