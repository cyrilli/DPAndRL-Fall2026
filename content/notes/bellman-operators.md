---
title: Bellman operators, fixed points, and optimal policies
subtitle: Lecture 3
sidebar: notes
body-classes: course-notes
toc: true
number-sections: true
---

The [previous note](value-functions.md) derived equations for the return of a fixed policy and introduced the Bellman optimality equations. An equation alone leaves several questions open: does a solution exist, is it unique, and why should solving the optimality equation produce an optimal policy? Bellman operators let us answer these questions together.

We use a finite, nonempty state set $\mathcal X$ and a finite, nonempty set of available actions $\mathcal A(x)$ at every state $x$. The state is fully observed. The joint law of the current reward $R_t$ and next state $X_{t+1}$, given the history and current action, depends only on $(X_t,A_t)$ and does not change with time. Its mean reward is $r(x,a)$ and its next-state probabilities are $\mathcal P(x'\mid x,a)$. Rewards satisfy $|R_t|\leq R_{\max}$ with probability one, and $0\leq\gamma<1$. Reward and next state may be correlated.

These assumptions are the setting for every MDP result below. We first study stationary Markov policies, then prove optimality even against policies that use time, randomization, and the entire observed history.

## From Bellman equations to operators {#operators}

An **operator** takes a whole function as input and produces another function. On a finite state space, a function is simply a table. A candidate table $V$ assigns a real number to each state; it need not equal the value of any policy.

Write $\mathcal B(\mathcal X)$ for the space of bounded real functions on the states. On a finite domain, every real-valued table is bounded. An operator $T:\mathcal B(\mathcal X)\to\mathcal B(\mathcal X)$ takes $V$ to $T(V)$, abbreviated $TV$. Thus $TV$ is a function, whereas $(TV)(x)$ is its numerical entry at $x$. The notation means application of a rule, not multiplication.

### Policy and optimality updates

For a fixed stationary Markov policy $\pi$, define the state-value operator by

$$
(T^\pi V)(x)=\sum_{a\in\mathcal A(x)}\pi(a\mid x)
\left[r(x,a)+\gamma\sum_{x'\in\mathcal X}\mathcal P(x'\mid x,a)V(x')\right].
$$ {#eq-policy-operator}

The input supplies the continuation values. The output averages immediate reward plus discounted continuation, using the specified policy for the current action. The actual value satisfies $V^\pi=T^\pi V^\pi$ because decomposing its return gives precisely this equation.

For an action-value candidate $Q$, defined on feasible state–action pairs, use

$$
(T^\pi Q)(x,a)=r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)
\sum_{a'\in\mathcal A(x')}\pi(a'\mid x')Q(x',a').
$$ {#eq-policy-q-operator}

Here the current action $a$ is prescribed. The policy averages the **next** action after the next state is observed. The return-based action values satisfy $Q^\pi=T^\pi Q^\pi$.

The optimality operators replace the relevant action average with a maximum:

$$
(T^*V)(x)=\max_{a\in\mathcal A(x)}
\left[r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)V(x')\right],
$$ {#eq-optimality-operator}

$$
(T^*Q)(x,a)=r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)
\max_{a'\in\mathcal A(x')}Q(x',a').
$$ {#eq-optimality-q-operator}

The same symbols $T^\pi$ and $T^*$ denote mappings on either state tables or state–action tables; the input tells us which one is intended. For a deterministic policy, the policy average selects just its chosen action.

The position of each maximum matters. In $T^*V$, we choose the current action **before** seeing the next state, so the maximum is outside the next-state average. In $T^*Q$, the current action is fixed and the next action can respond to the observed next state, so the maximum is inside that average. Moving a maximum across an expectation can change the decision problem.

### Greedy policies and fixed points

A policy greedy with respect to $V$ selects

$$
\pi_g(x;V)\in\operatorname*{argmax}_{a\in\mathcal A(x)}
\left[r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)V(x')\right].
$$

For $Q$, it selects $\pi_g(x;Q)\in\operatorname*{argmax}_a Q(x,a)$. A maximum is a number; an argmax is the set of actions attaining it. Choose one maximizing action at each state and fix those choices. This defines a deterministic stationary policy, written $\pi_g(V)$ or $\pi_g(Q)$.

By construction,

$$
T^{\pi_g(V)}V=T^*V.
$$

This is equality of **one update**. For an arbitrary candidate $V$, it does not say that the greedy policy's actual value equals $V$.

A **fixed point** of an operator is a table unchanged by its update: $TF=F$. The policy equations ask for fixed points of $T^\pi$. The optimality equations ask for fixed points of $T^*$. To understand their solutions, we need two properties: preservation of order and contraction of distance.

## Order and distance between value tables {#order-and-distance}

### Monotonicity preserves comparisons

The notation $V\leq W$ means $V(x)\leq W(x)$ at **every** state. It is a pointwise comparison, not a comparison of averages. The same convention applies to $Q$ tables.

All four Bellman operators are **monotone**:

$$
F\leq G\quad\Longrightarrow\quad TF\leq TG.
$$

To see why, start with state values. Nonnegative transition weights preserve $V(x')\leq W(x')$ when averaged. Multiplying by $\gamma\geq0$ and adding the same reward preserves the inequality for each action. Averaging these action scores under a policy, or taking their maximum, also preserves it. For action values, the next-action average or maximum preserves the inequality first, and the transition average then does the same.

Monotonicity compares two inputs. It does **not** assert $TV\geq V$, nor that updates from any starting table must increase. For example, the one-state update $TV=1+V/2$ reduces the candidate $V=10$ to $6$.

### A norm measures size; a metric measures distance

A **norm** $\|z\|$ measures the size of a vector. It is nonnegative, is zero only for the zero vector, satisfies $\|cz\|=|c|\|z\|$, and obeys the triangle inequality $\|z+w\|\leq\|z\|+\|w\|$.

For $z=(z_1,\ldots,z_m)$, familiar examples are

$$
\|z\|_1=\sum_i|z_i|,\qquad
\|z\|_2=\sqrt{\sum_i z_i^2},\qquad
\|z\|_\infty=\max_i|z_i|.
$$

For $(3,4)$ these are $7$, $5$, and $4$. We use the **supremum norm** on value functions:

$$
\|V\|_\infty=\max_{x\in\mathcal X}|V(x)|,\qquad
\|Q\|_\infty=\max_{x\in\mathcal X,\,a\in\mathcal A(x)}|Q(x,a)|.
$$

On a general domain the definition uses a supremum—the least upper bound—instead of a maximum. Our domains are finite, so the maxima exist. The absolute values matter: $\|(-10,2)^\top\|_\infty=10$.

A **metric** $d(z,w)$ measures distance between two objects. It is nonnegative, is zero exactly when the objects agree, is symmetric, and satisfies $d(z,w)\leq d(z,u)+d(u,w)$. A norm induces the metric $d(z,w)=\|z-w\|$. In particular,

$$
d(V,W)=\|V-W\|_\infty
$$

measures the largest absolute difference between corresponding entries. A distance at most $\varepsilon$ means one error bound holds at every state. This is why the supremum norm is useful for guarantees about an entire value function.

### Contraction and completeness

An operator $L$ on a metric space is a **contraction** if one constant $0\leq\alpha<1$ satisfies

$$
d(Lz,Lw)\leq\alpha\,d(z,w)
\qquad\text{for every pair }z,w.
$$

It brings any two inputs closer by a uniform factor. For example, $Lz=1+z/2$ is a contraction on the real numbers, with fixed point $2$. Starting at zero gives $0,1,3/2,7/4,\ldots$. The mapping $Lz=-z/2$ is also a contraction, although it reverses order. Contraction concerns distance; monotonicity concerns order.

We also need to know that a limiting table remains in the space. A sequence $(z_k)$ is **Cauchy** if, for every $\varepsilon>0$, all sufficiently late pairs satisfy $d(z_m,z_n)<\varepsilon$. A space is **complete** if every Cauchy sequence converges to an element of that space.

Finite value-table spaces with the supremum norm are complete. A Cauchy sequence of tables is Cauchy in each real coordinate. Each coordinate has a real limit, and there are only finitely many coordinates, so the whole table converges in the maximum norm. This uses the completeness of the real numbers; no additional assumptions about the MDP are involved.

## Why Bellman operators contract {#contraction}

Two elementary inequalities explain the result. First, if $p_i\geq0$ and $\sum_i p_i=1$, then

$$
\left|\sum_i p_i f_i\right|
\leq\sum_i p_i|f_i|
\leq\max_i|f_i|.
$$

A probability average cannot exceed the largest absolute input. Second, maximization cannot enlarge a uniform difference between action scores.

::: {#lem-max-bound}
## Difference of maxima

For two lists of real numbers on the same finite nonempty set,

$$
\left|\max_a u_a-\max_a w_a\right|
\leq\max_a|u_a-w_a|.
$$ {#eq-max-bound}
:::

::: {.proof}
Set $D=\max_a|u_a-w_a|$. For each action, $u_a\leq w_a+D\leq\max_b w_b+D$. Maximizing the left side gives $\max_a u_a-\max_a w_a\leq D$. Exchange the two lists for the reverse inequality. The maximizing actions need not be the same.
:::

::: {#thm-bellman-contraction}
## Bellman contraction

Each policy and optimality operator, on either state values or action values, is a $\gamma$-contraction in its supremum norm:

$$
\|TF-TG\|_\infty\leq\gamma\|F-G\|_\infty.
$$ {#eq-contraction}
:::

::: {.proof}
For the policy state-value operator, the rewards cancel when we subtract two updates. For every state $x$,

$$
\begin{aligned}
|(T^\pi V)(x)-(T^\pi W)(x)|
&=\gamma\left|\sum_{a,x'}\pi(a\mid x)\mathcal P(x'\mid x,a)
\bigl(V(x')-W(x')\bigr)\right|\\
&\leq\gamma\sum_{a,x'}\pi(a\mid x)\mathcal P(x'\mid x,a)
|V(x')-W(x')|\\
&\leq\gamma\|V-W\|_\infty
\sum_{a,x'}\pi(a\mid x)\mathcal P(x'\mid x,a)\\
&=\gamma\|V-W\|_\infty.
\end{aligned}
$$

The weights are nonnegative and sum to one. The final bound is the same for every $x$, so taking the maximum over $x$ proves the norm inequality.

For the policy action-value operator, the analogous difference is

$$
\gamma\sum_{x',a'}\mathcal P(x'\mid x,a)\pi(a'\mid x')
\bigl(Q_1(x',a')-Q_2(x',a')\bigr).
$$

Its weights also sum to one. Taking the absolute value and using the same averaging bound gives at most $\gamma\|Q_1-Q_2\|_\infty$ for every $(x,a)$, hence the action-value contraction.

For the optimality state-value operator, @lem-max-bound gives

$$
\begin{aligned}
|(T^*V)(x)-(T^*W)(x)|
&\leq\gamma\max_a
\left|\sum_{x'}\mathcal P(x'\mid x,a)(V(x')-W(x'))\right|\\
&\leq\gamma\|V-W\|_\infty.
\end{aligned}
$$

For optimality action values, first apply the maximum inequality at every next state:

$$
\left|\max_{a'}Q_1(x',a')-\max_{a'}Q_2(x',a')\right|
\leq\|Q_1-Q_2\|_\infty.
$$

The transition average then gives

$$
|(T^*Q_1)(x,a)-(T^*Q_2)(x,a)|
\leq\gamma\sum_{x'}\mathcal P(x'\mid x,a)\|Q_1-Q_2\|_\infty
=\gamma\|Q_1-Q_2\|_\infty.
$$

Again, the bound holds uniformly over input entries, so it bounds the supremum norm.
:::

The mechanism is the same in all four cases: averaging and maximization do not amplify the largest error, and discounting shrinks it by $\gamma$. With $\gamma=1$, these inequalities give only a factor of one; the contraction conclusions below would no longer follow.

## Unique fixed points and convergent updates {#fixed-points}

::: {#thm-banach}
## Banach fixed-point theorem

Let $(\mathcal Z,d)$ be a nonempty complete metric space, and let $L:\mathcal Z\to\mathcal Z$ be a contraction with factor $0\leq\alpha<1$. Then $L$ has exactly one fixed point $z^*$. From any $z_0$, the sequence $z_{k+1}=Lz_k$ converges to it, with

$$
d(z_k,z^*)\leq\alpha^k d(z_0,z^*),\qquad k\geq1.
$$
:::

::: {.proof}
If $\alpha=0$, the contraction inequality makes $L$ a constant mapping. Its output is its unique fixed point, and every iteration reaches it after one update. For $0<\alpha<1$, repeated contraction bounds adjacent differences:

$$
d(z_{k+1},z_k)\leq\alpha^k d(z_1,z_0).
$$

For $m>n$, the triangle inequality and a geometric sum give

$$
d(z_m,z_n)
\leq\sum_{k=n}^{m-1}d(z_{k+1},z_k)
\leq\frac{\alpha^n}{1-\alpha}\,d(z_1,z_0).
$$

This tends to zero as $n\to\infty$, so the iterates are Cauchy. Completeness gives a limit $z^*\in\mathcal Z$. It is a fixed point because

$$
d(Lz^*,z^*)
\leq d(Lz^*,Lz_k)+d(z_{k+1},z^*)
\leq\alpha d(z^*,z_k)+d(z_{k+1},z^*)\longrightarrow0.
$$

If $w^*$ were another fixed point, contraction would give $d(z^*,w^*)\leq\alpha d(z^*,w^*)$. Since $1-\alpha>0$, this forces their distance to be zero. Finally, applying contraction repeatedly to $z_0$ and the now-established fixed point proves the rate.
:::

The geometric tail sum is essential: adjacent differences tending to zero would not, by itself, prove convergence. The theorem uses completeness to establish existence, rather than assuming the fixed point in advance.

Each Bellman operator maps its finite value-table space into itself: bounded rewards and finite probability averages produce finite entries. The space is nonempty and complete, and the operator contracts. All hypotheses of @thm-banach are therefore satisfied.

For a fixed policy, the return-based functions already satisfy the Bellman equations. Uniqueness identifies the fixed points as $V^\pi$ and $Q^\pi$. In particular,

$$
V_{k+1}=T^\pi V_k\quad\Longrightarrow\quad
\|V_k-V^\pi\|_\infty\leq\gamma^k\|V_0-V^\pi\|_\infty.
$$

For the optimality state operator, call the unique fixed point $U$:

$$
U=T^*U,\qquad
V_{k+1}=T^*V_k\quad\Longrightarrow\quad
\|V_k-U\|_\infty\leq\gamma^k\|V_0-U\|_\infty.
$$ {#eq-value-error}

Here $k$ counts mathematical updates, while $t$ counts interactions with the environment. These updates establish convergence to the solution of an equation. To call that solution the **optimal value**, we still need to connect it to achievable returns.

## Why the fixed point is the optimal value {#optimality}

The proof has two parts: construct a policy that reaches $U$, then show that no admissible policy can exceed it.

### A greedy policy attains the fixed point

Choose $\pi_g=\pi_g(U)$. At each state $x$, its action $\pi_g(x)$ maximizes immediate reward plus expected discounted continuation under $U$. Expanding the operators gives

$$
\begin{aligned}
(T^{\pi_g}U)(x)
&=r(x,\pi_g(x))
+\gamma\sum_{x'}\mathcal P(x'\mid x,\pi_g(x))U(x')\\
&=\max_{a\in\mathcal A(x)}
\left[r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)U(x')\right]\\
&=(T^*U)(x)=U(x).
\end{aligned}
$$

The second equality holds because $\pi_g(x)$ is a maximizing action. The last equality uses the fixed-point equation $T^*U=U$.

The calculation holds at every state, so $T^{\pi_g}U=U$. The actual return-based value also satisfies $T^{\pi_g}V^{\pi_g}=V^{\pi_g}$. Both $U$ and $V^{\pi_g}$ therefore solve the same policy Bellman equation. Since $T^{\pi_g}$ has a unique fixed point,

$$
V^{\pi_g}=U.
$$

The constructed policy is deterministic, stationary, and Markov. This one action rule attains $U(x)$ for every initial state $x$.

### No stationary policy does better

Fix any stationary Markov policy $\pi$ and state $x$. The policy probabilities $\pi(a\mid x)$ are nonnegative and sum to one. Thus the policy's weighted average of the action scores cannot exceed their maximum:

$$
\begin{aligned}
(T^\pi U)(x)
&=\sum_{a\in\mathcal A(x)}\pi(a\mid x)
\left[r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)U(x')\right]\\
&\leq\max_{a\in\mathcal A(x)}
\left[r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)U(x')\right]\\
&=(T^*U)(x)=U(x).
\end{aligned}
$$

This inequality holds at every state, which is what $T^\pi U\leq T^*U=U$ means. Monotonicity then lets us apply $T^\pi$ while preserving the inequality:

$$
(T^\pi)^2U\leq T^\pi U\leq U.
$$

Repeating gives $(T^\pi)^kU\leq U$ for every $k$. The superscript $k$ here means repeated operator application. Contraction makes these iterates converge to $V^\pi$, and taking a limit at each state gives $V^\pi\leq U$.

Together with greedy attainment, this proves optimality among stationary Markov policies, including randomized ones. It has not yet ruled out improvement by remembering the past or changing the policy over time.

### No history-dependent policy does better

Before acting at time $t$, the observed history is

$$
H_t=(X_1,A_1,R_1,\ldots,X_{t-1},A_{t-1},R_{t-1},X_t),
\qquad H_1=X_1.
$$

An admissible policy chooses an action distribution $\pi_t(\cdot\mid H_t)$. It may depend on time and all past observations and rewards, but it cannot use future information. Let $\Pi_{\mathrm{all}}$ denote these policies. Starting at $X_1=x$, define

$$
V^\pi(x)=\mathbb E_x^\pi\left[\sum_{t=1}^{\infty}\gamma^{t-1}R_t\right].
$$

The stationary Bellman equation need not hold for such a policy. Instead, start from the actionwise inequality supplied by $U=T^*U$:

$$
r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)U(x')\leq U(x)
\qquad\text{for every feasible }(x,a).
$$

The joint Markov model gives the corresponding conditional expectation. After any observed history, average over the policy's action:

$$
\begin{aligned}
\mathbb E^\pi[R_t+\gamma U(X_{t+1})\mid H_t]
&=\sum_a\pi_t(a\mid H_t)
\left[r(X_t,a)+\gamma\sum_{x'}\mathcal P(x'\mid X_t,a)U(x')\right]\\
&\leq U(X_t).
\end{aligned}
$$

These conditional statements hold almost surely, meaning with probability one. They require no independence between reward and next state: linearity of expectation suffices.

The **tower property**, $\mathbb E[\mathbb E[Y\mid H_t]]=\mathbb E[Y]$, allows us to average a conditional expectation. Applying the one-step inequality twice, starting at $x$, yields

$$
\begin{aligned}
U(x)
&\geq\mathbb E_x^\pi[R_1+\gamma U(X_2)]\\
&\geq\mathbb E_x^\pi[R_1+\gamma R_2+\gamma^2U(X_3)].
\end{aligned}
$$

The second step substitutes the bound conditional on $H_2$, where $R_1$ is already known, and then uses the tower property. Induction gives, for every positive integer $n$,

$$
U(x)\geq\mathbb E_x^\pi\left[
\sum_{t=1}^{n}\gamma^{t-1}R_t+\gamma^n U(X_{n+1})\right].
$$ {#eq-prefix-bound}

This finite sum is a prefix of our infinite-horizon problem, not a change to a finite-horizon objective. We must remove two tails to pass to the full return:

$$
\left|\mathbb E_x^\pi[\gamma^n U(X_{n+1})]\right|
\leq\gamma^n\|U\|_\infty\longrightarrow0,
$$

$$
\left|V^\pi(x)-\mathbb E_x^\pi\left[\sum_{t=1}^{n}\gamma^{t-1}R_t\right]\right|
\leq\frac{R_{\max}\gamma^n}{1-\gamma}\longrightarrow0.
$$

Consequently, @eq-prefix-bound gives $V^\pi(x)\leq U(x)$ for every $\pi\in\Pi_{\mathrm{all}}$. Rewards may be positive or negative; the absolute tail bounds handle both.

::: {#thm-optimal-policy}
## Optimality of the Bellman fixed point

The optimal discounted value

$$
V^*(x)=\sup_{\pi\in\Pi_{\mathrm{all}}}V^\pi(x)
$$

equals the unique fixed point $U$ of $T^*$. A policy greedy with respect to $U$ is optimal simultaneously at every initial state:

$$
V^{\pi_g(U)}=U=V^*.
$$
:::

Existence of a deterministic stationary Markov optimal policy does not mean every optimal policy must have this form. For example, if a one-state MDP has two identical actions, each giving reward $1$, and $\gamma=1/2$, every policy has return $2$. Randomizing or switching between the actions is also optimal.

## Optimal action values {#optimal-action-values}

To define $Q^*(x,a)$, force the initial action $a$ at state $x$, then optimize all later decisions. The forced-action experiment is meaningful even if some policy would never choose $a$.

After that action, a continuation policy may remember the full history $H_2=(x,a,R_1,X_2)$. We therefore cannot simply replace every arbitrary continuation by a stationary value without justification.

Conditional on $H_2$, the next state $X_2$ is known, while later actions may still use everything recorded in $H_2$. The one-step bound holds regardless of those action choices. Later histories contain $H_2$, so repeated conditional averaging propagates the bound from time $2$. For every positive integer $n$,

$$
\mathbb E_{x,a}^{\pi}\left[
\sum_{t=2}^{n+1}\gamma^{t-2}R_t+\gamma^n V^*(X_{n+2})\,\middle|\,H_2\right]
\leq V^*(X_2).
$$

The remaining value term has magnitude at most $\gamma^n\|V^*\|_\infty$, and the remaining reward tail at most $R_{\max}\gamma^n/(1-\gamma)$. These deterministic bounds remain valid after conditioning on $H_2$. Letting $n\to\infty$ therefore gives

$$
\mathbb E_{x,a}^{\pi}\left[
\sum_{t=2}^{\infty}\gamma^{t-2}R_t\,\middle|\,H_2\right]
\leq V^*(X_2)
\quad\text{almost surely}.
$$

Taking expectations and adding the first reward shows that every continuation satisfies

$$
Q^\pi(x,a)
\leq\mathbb E_{x,a}^{\pi}[R_1+\gamma V^*(X_2)]
=r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)V^*(x').
$$

Under the constructed optimal stationary Markov policy, the future law conditional on $H_2$ depends only on $X_2$. Its conditional continuation value is $V^*(X_2)$, so following it from time $2$ attains the upper bound. Hence

$$
Q^*(x,a)=r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)V^*(x').
$$

Taking the maximum over available actions and using the already-proved equation $V^*=T^*V^*$ gives $V^*(x)=\max_a Q^*(x,a)$.

Substituting the second identity into the first gives $Q^*=T^*Q^*$. Contraction makes this the unique optimality action-value fixed point. The same optimal stationary policy supplies the continuation for all feasible state–action pairs.

We have now justified both optimality equations and their interpretation as optimal expected returns, rather than just solutions of algebraic equations.

## Approximate solutions and Bellman residuals {#residuals}

The convergence bound involves an unknown fixed point. To assess a candidate using the model and candidate alone, measure how far it is from satisfying its equation. The **Bellman residual** is the table $TF-F$; its norm $\|TF-F\|_\infty$ is a nonnegative number.

For any of the four Bellman operators, let $Z$ be its fixed point. Adding and subtracting $TF$, then using contraction, gives

$$
\begin{aligned}
\|F-Z\|_\infty
&=\|F-TF+TF-TZ\|_\infty\\
&\leq\|F-TF\|_\infty+\|TF-TZ\|_\infty\\
&\leq\|TF-F\|_\infty+\gamma\|F-Z\|_\infty.
\end{aligned}
$$

Rearranging, since $1-\gamma>0$, proves

$$
\boxed{\|F-Z\|_\infty\leq
\frac{\|TF-F\|_\infty}{1-\gamma}.}
$$ {#eq-residual-bound}

For $T^\pi$, this controls distance to $V^\pi$ or $Q^\pi$; for $T^*$, it controls distance to $V^*$ or $Q^*$. For instance, with $\gamma=0.9$, a state-value optimality residual of at most $0.02$ guarantees value error at most $0.2$. This is an upper bound, not a claim that the actual error equals $0.2$.

If $V_{k+1}=TV_k$, then $V_{k+1}-V_k$ is the residual of **$V_k$**. Thus

$$
\|V_{k+1}-V_k\|_\infty\leq(1-\gamma)\varepsilon
\quad\Longrightarrow\quad
\|V_k-Z\|_\infty\leq\varepsilon.
$$

This certifies accuracy of a value table. It is not itself the same numerical guarantee about the return of a policy extracted from that table.

## Connecting the results

The logical chain is now complete. Returns define the quantities we care about. Their recursive decomposition gives Bellman equations. Operators turn those equations into update rules. Contraction and completeness establish unique fixed points and convergence. Greedy attainment and the comparison with all admissible policies identify the optimality fixed points with optimal returns. Residuals then quantify how close an approximate table is to those values.

The distinction between evaluating a specified policy and optimizing decisions remains visible throughout: a policy operator averages actions using $\pi$, while an optimality operator takes their maximum.

### Check your understanding

1. Why does $T^{\pi_g(V)}V=T^*V$ not imply $V^{\pi_g(V)}=V$ for an arbitrary candidate?
2. Which step in contraction uses nonnegative weights, and which uses $\gamma<1$?
3. Why does a unique fixed point not, by itself, prove optimality?
4. In the history-policy proof, why must both the continuation-value tail and reward tail vanish?
5. If $\gamma=0.95$ and $\|T^*V-V\|_\infty\leq0.01$, what value-error bound follows?

This note develops [Lecture 3's slides](../materials/slides/DPRL_lec03_bellman_operators_and_optimal_policies_post.pdf). The [reading list](../resources.md) gives complementary references.

[Previous: Returns, value functions, and Bellman equations](value-functions.md) · [All course notes](index.md)
