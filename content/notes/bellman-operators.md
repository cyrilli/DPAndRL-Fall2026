---
title: Bellman operators and contraction
subtitle: Why value iteration converges
sidebar: notes
body-classes: course-notes
toc: true
number-sections: true
---

This note develops a fixed-point view of discounted dynamic programming. It accompanies the outlines on [infinite-horizon problems](../lectures/04.md) and [value iteration](../lectures/05.md).

## Setting

Consider a finite Markov decision process with state set $\mathcal S$, finite nonempty action sets $\mathcal A(s)$, expected one-step reward $r(s,a)$, transition probabilities $P(s'\mid s,a)$, and discount factor $0\leq\gamma<1$. For each state-action pair, $P(s'\mid s,a)\geq0$ and $\sum_{s'}P(s'\mid s,a)=1$.

We maximize expected discounted reward. A value vector $V\in\mathbb R^{|\mathcal S|}$ assigns one real number to each state. Write

$$
\lVert V\rVert_\infty=\max_{s\in\mathcal S}|V(s)|.
$$

## Bellman operators

::: {#def-bellman-operators}
## Policy and optimality operators

For a stationary policy $\pi(a\mid s)$, its Bellman operator is

$$
(T^\pi V)(s)=\sum_{a\in\mathcal A(s)}\pi(a\mid s)
\left[r(s,a)+\gamma\sum_{s'\in\mathcal S}P(s'\mid s,a)V(s')\right].
$$ {#eq-policy-operator}

The Bellman optimality operator is

$$
(TV)(s)=\max_{a\in\mathcal A(s)}
\left[r(s,a)+\gamma\sum_{s'\in\mathcal S}P(s'\mid s,a)V(s')\right].
$$ {#eq-optimality-operator}
:::

@eq-policy-operator evaluates the available actions under a fixed policy. @eq-optimality-operator chooses the action with the largest immediate reward plus discounted continuation value.

The following elementary bound lets us compare the maxima in two Bellman updates.

::: {#lem-max-bound}
## Difference of maxima

For two real-valued functions $f$ and $g$ on the same finite nonempty set $A$,

$$
\left|\max_{a\in A}f(a)-\max_{a\in A}g(a)\right|
\leq\max_{a\in A}|f(a)-g(a)|.
$$ {#eq-max-bound}
:::

::: {.proof}
Let $d=\max_{a\in A}|f(a)-g(a)|$. For every $a\in A$,
$f(a)\leq g(a)+d\leq\max_b g(b)+d$. Taking the maximum over $a$ gives one direction. Interchanging $f$ and $g$ gives the other direction.
:::

## Contraction

::: {#thm-bellman-contraction}
## Bellman contraction

For any value vectors $V$ and $W$,

$$
\lVert TV-TW\rVert_\infty
\leq\gamma\lVert V-W\rVert_\infty.
$$ {#eq-contraction}

The same bound holds with $T^\pi$ in place of $T$ for every stationary policy $\pi$.
:::

::: {.proof}
Fix a state $s$. Applying @lem-max-bound to the action values in @eq-optimality-operator gives

$$
\begin{aligned}
|(TV)(s)-(TW)(s)|
&\leq \gamma\max_{a\in\mathcal A(s)}
\left|\sum_{s'}P(s'\mid s,a)\bigl(V(s')-W(s')\bigr)\right|\\
&\leq \gamma\max_{a\in\mathcal A(s)}
\sum_{s'}P(s'\mid s,a)|V(s')-W(s')|\\
&\leq \gamma\lVert V-W\rVert_\infty.
\end{aligned}
$$

The transition probabilities sum to one, which gives the last step. Taking the maximum over $s$ proves @eq-contraction. For $T^\pi$, average the same actionwise bound with the probabilities $\pi(a\mid s)$ instead of applying the maximum bound.
:::

## Value iteration

Start from any finite value vector $V_0$ and repeatedly apply the optimality operator:

$$
V_{k+1}=TV_k.
$$ {#eq-value-iteration}

::: {#cor-value-convergence}
## Convergence to the optimal value

The Bellman optimality operator has a unique fixed point $V^*$, equal to the optimal discounted value function. The iterates in @eq-value-iteration satisfy

$$
\lVert V_k-V^*\rVert_\infty
\leq\gamma^k\lVert V_0-V^*\rVert_\infty,
\qquad k\geq1.
$$ {#eq-value-error}
:::

::: {.proof}
The space $\mathbb R^{|\mathcal S|}$ is complete in the maximum norm. By @thm-bellman-contraction and the contraction mapping theorem, $T$ has a unique fixed point. The discounted finite-MDP Bellman optimality equation identifies this fixed point with $V^*$. Applying @eq-contraction repeatedly to $V_k$ and $V^*$ proves @eq-value-error.
:::

### A one-state example

Suppose there is one state, one action, reward $1$ at every step, and $\gamma=1/2$. Then $TV=1+V/2$. Starting from $V_0=0$ gives $V_1=1$, $V_2=3/2$, and $V_3=7/4$. More generally,

$$
V_k=2(1-2^{-k}),\qquad V^*=2.
$$

The error halves at every update, attaining the contraction bound exactly.

### Questions

1. Where does the condition $\gamma<1$ enter the convergence argument?
2. Which part of the proof uses nonnegative transition probabilities?
3. For the one-state example, how many updates make the value error at most $0.01$?

## Further reading

See Chapter 4 of Sutton and Barto, *Reinforcement Learning: An Introduction*, and the [course reading list](../resources.md) for the broader dynamic programming context.
