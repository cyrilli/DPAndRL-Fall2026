---
title: Note title
sidebar: notes
body-classes: course-notes
toc: true
number-sections: true
draft: true
---

<!-- Copy this file to notes/your-topic.md, remove draft: true, and replace the example text. Add its path to the notes sidebar in _site.md. -->

Introduce the question and its connection to the course.

## Setting

State the assumptions and define the notation. Inline mathematics uses $x^2$.

## Main result

::: {#lem-example}
## A short lemma title

For every real number $x$,

$$
x^2\geq0.
$$ {#eq-example}
:::

::: {.proof}
If $x\geq0$, the product $x\cdot x$ is nonnegative. If $x<0$, the product of the two negative factors is positive.
:::

Refer to @lem-example or @eq-example. Use `#thm-...` for a theorem, `#def-...` for a definition, and `#cor-...` for a corollary; give each label a unique name within the page.

## Links

[Schedule](../schedule.md) · [Assignments](../assignments.md)

After putting a PDF in `materials/`, link it from this note with:

```markdown
[Slides](../materials/your-slides.pdf)
```

Link another note using a path relative to this file, for example:

```markdown
[Bellman operators](bellman-operators.md)
```
