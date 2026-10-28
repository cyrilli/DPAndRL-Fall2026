---
title: Course notes
sidebar: notes
body-classes: course-notes
toc: false
---

These notes explain the concepts and mathematical reasoning behind dynamic programming and reinforcement learning. They connect the ideas introduced in lectures through definitions, worked examples, and self-contained derivations.

1. **[Sequential decisions and Markov decision processes](sequential-decisions.md)** · Lecture 1

   How actions affect future choices; states, transitions, rewards, and policies; the distinction between planning and learning.

2. **[Returns, value functions, and Bellman equations](value-functions.md)** · Lecture 2

   How to evaluate long-term consequences, derive the policy Bellman equations, and interpret state and action values through a worked example.

3. **[Bellman operators, fixed points, and optimal policies](bellman-operators.md)** · Lecture 3

   How monotonicity and contraction give unique solutions, why a greedy policy attains the optimal return, and how residuals bound value error.

4. **[Value iteration and policy iteration](value-and-policy-iteration.md)** · Lecture 4

   How to compute values and policies with a known model, certify the accuracy of a result, and understand the guarantees of exact policy iteration.

5. **[Finite-horizon DP and online planning](finite-horizon-dp-and-online-planning.md)** · Lecture 5

   How a deadline leads to backward induction, how online search focuses computation on the current decision, and how simulated returns support Monte Carlo tree search.

6. **[Function approximation and least-squares value iteration](function-approximation-and-lsvi.md)** · Lecture 6

   How features replace value tables, how least squares fits Bellman targets, and how representation, data coverage, and Bellman completeness affect the resulting values and policies.

The [schedule](../schedule.md) provides the lecture slides, and the [resources page](../resources.md) lists complementary readings.
