---
project:
  type: website
  output-dir: _site
  resources:
  - materials/**
  - assets/**
  - theme/vendor/katex/**
website:
  title: DP & RL Course
  site-url: https://www.chuanhao-li.com/DPAndRL-Fall2026/
  navbar:
    left:
    - text: Home
      href: index.md
    - text: Schedule & Materials
      href: schedule.md
    - text: Assignments
      href: assignments.md
    # - text: Project
    #   href: project.md
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
    - section: Chapters
      contents:
      - notes/sequential-decisions.md
      - notes/value-functions.md
      - notes/bellman-operators.md
      - notes/value-and-policy-iteration.md
      - notes/finite-horizon-dp-and-online-planning.md
      - notes/function-approximation-and-lsvi.md
  page-footer:
    left: Dynamic Programming and Reinforcement Learning · Fall 2026
    right: Tsinghua University
format:
  html:
    theme:
    - cosmo
    - theme/course.scss
    include-after-body: theme/navigation.html
    html-math-method:
      method: katex
      url: /theme/vendor/katex/
    toc: true
    toc-depth: 3
---

# Website settings

Edit the YAML block above to change the course name, navigation tabs, notes sidebar,
footer, and website address. This file configures the site and is not rendered as a page.
