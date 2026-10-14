---
title: Value iteration and policy iteration
subtitle: Lecture 4
sidebar: notes
body-classes: course-notes
toc: true
number-sections: true
---

The [previous note](bellman-operators.md) established that Bellman updates converge: the policy operator has fixed point $V^\pi$, and the optimality operator has fixed point $V^*$. We now use these facts to compute values and make decisions. **Planning** means that the reward and transition model are known, so an update can calculate the required expectations directly. Policy evaluation computes the return of a specified policy; control seeks a policy with the largest return.

## Model and notation {#planning}

We retain the discounted MDP setting. The state set $\mathcal X$ is finite and nonempty, and each state has a finite, nonempty available-action set $\mathcal A(x)$. At decision $t$, the agent observes $X_t$, chooses $A_t$, and receives $R_t$ and $X_{t+1}$. The joint law of reward and next state, conditional on the history and action, depends only on $(X_t,A_t)$ and is unchanged over time. Its known mean reward is $r(x,a)$ and its known next-state probabilities are $\mathcal P(x'\mid x,a)$. Rewards satisfy $|R_t|\leq R_{\max}$, and $0\leq\gamma<1$.

Here $R_t$ is earned by the **current** action. The function $r$ gives its mean, which may differ from a particular observed reward. Reward and next state may be correlated. We use $t$ for environment time and $k$ for algorithm updates.

The policy value $V^\pi(x)$ is the expected discounted return from starting at $x$ and following $\pi$:

$$
V^\pi(x)=\mathbb E_x^\pi\left[\sum_{t=1}^{\infty}\gamma^{t-1}R_t\right].
$$

The optimal value $V^*(x)$ is the supremum of these returns over all admissible policies, which may randomize and use the observed history but cannot use future information. The previous chapter proved that a deterministic stationary Markov policy attains this value at every state.

Expanding every possible future trajectory repeats many copies of the same continuation problem. Bellman recursion avoids this repetition by storing one continuation value per state. A candidate table $V$ need not be the return of any policy; it supplies the numbers used to evaluate the next decision.

## Policy evaluation by a linear solve {#linear-evaluation}

Fix a stationary Markov policy $\pi$. It assigns action probabilities $\pi(a\mid x)$ at each state; a deterministic policy puts probability one on its chosen action. Average the model using these probabilities:

$$
r^\pi(x)=\sum_{a\in\mathcal A(x)}\pi(a\mid x)r(x,a),
\qquad
\mathcal P^\pi(x'\mid x)=\sum_{a\in\mathcal A(x)}\pi(a\mid x)\mathcal P(x'\mid x,a).
$$

Choose a state order $(x_1,\ldots,x_n)$. Values and rewards become column vectors. The matrix $\mathcal P^\pi$ has current states as rows and next states as columns:

$$
\mathcal P^\pi_{ij}=\mathcal P^\pi(x_j\mid x_i),
\qquad
(\mathcal P^\pi V)(x_i)=\sum_{j=1}^n\mathcal P^\pi_{ij}V(x_j).
$$

Thus matrix multiplication computes the expected continuation value. Each matrix row is nonnegative and sums to one. The [policy Bellman equation](value-functions.md) becomes

$$
V^\pi=r^\pi+\gamma\mathcal P^\pi V^\pi
\quad\Longleftrightarrow\quad
(I-\gamma\mathcal P^\pi)V^\pi=r^\pi.
$$

This is a linear system with $n$ unknowns. Why does it have a unique solution? For any real vector $u$, write $\|u\|_\infty=\max_j|u_j|$. At every row $i$,

$$
\begin{aligned}
|(\mathcal P^\pi u)_i|
&=\left|\sum_j\mathcal P^\pi_{ij}u_j\right|\\
&\leq\sum_j\mathcal P^\pi_{ij}|u_j|\\
&\leq\sum_j\mathcal P^\pi_{ij}\|u\|_\infty
=\|u\|_\infty.
\end{aligned}
$$

The bound holds at every row, so $\|\mathcal P^\pi u\|_\infty\leq\|u\|_\infty$. If $(I-\gamma\mathcal P^\pi)u=0$, then $u=\gamma\mathcal P^\pi u$, giving

$$
\|u\|_\infty
=\gamma\|\mathcal P^\pi u\|_\infty
\leq\gamma\|u\|_\infty.
$$

Since $1-\gamma>0$, this forces $\|u\|_\infty=0$, hence $u=0$. A square matrix with only the zero vector in its null space is invertible. Therefore the system has exactly one solution, the return-based value $V^\pi$. Although we may write $(I-\gamma\mathcal P^\pi)^{-1}r^\pi$, an implementation normally uses a linear solver instead of explicitly forming the inverse.

The eigenvalue argument in the slides uses the same averaging bound. Write $M=I-\gamma\mathcal P^\pi$ and take any eigenpair $Mu=\lambda u$ with $u\neq0$. Eigenvalues and eigenvectors may be complex; the bound $\|\mathcal P^\pi u\|_\infty\leq\|u\|_\infty$ still holds by the triangle inequality. Since $u=Mu+\gamma\mathcal P^\pi u$,

$$
\|u\|_\infty
\leq\|Mu\|_\infty+\gamma\|\mathcal P^\pi u\|_\infty
\leq(|\lambda|+\gamma)\|u\|_\infty.
$$

Dividing by $\|u\|_\infty>0$ gives $|\lambda|\geq1-\gamma>0$. Thus zero cannot be an eigenvalue, which also establishes invertibility. The conclusion concerns eigenvalue magnitudes; it does not assume the eigenvalues are real.

### A complete three-state example

The following continuing MDP uses state order $(x_0,x_1,x_2)$ and discount $\gamma=0.9$. The rewards in this example are deterministic and are earned on the indicated action.

| Current state | Available action | Reward | Next-state distribution |
|:--|:--|--:|:--|
| $x_0$ | $a_1$ | $0$ | $x_1$ with probability $0.8$; $x_2$ with probability $0.2$ |
| $x_0$ | $a_2$ | $2$ | $x_2$ with probability $1$ |
| $x_1$ | Sole action | $7$ | $x_2$ with probability $1$ |
| $x_2$ | Sole action | $2$ | $x_0$ with probability $1$ |

Let $\pi_1$ choose $a_1$ at $x_0$, and let $\pi_2$ choose $a_2$. Both use the sole action at the other states. For $\pi_2$,

$$
r^{\pi_2}=\begin{pmatrix}2\\7\\2\end{pmatrix},
\qquad
\mathcal P^{\pi_2}=\begin{pmatrix}0&0&1\\0&0&1\\1&0&0\end{pmatrix}.
$$

Writing its Bellman equation entry by entry gives

$$
\begin{aligned}
V^{\pi_2}(x_0)&=2+0.9V^{\pi_2}(x_2),\\
V^{\pi_2}(x_1)&=7+0.9V^{\pi_2}(x_2),\\
V^{\pi_2}(x_2)&=2+0.9V^{\pi_2}(x_0).
\end{aligned}
$$

Substitute the third equation into the first:

$$
V^{\pi_2}(x_0)=2+0.9[2+0.9V^{\pi_2}(x_0)]
=3.8+0.81V^{\pi_2}(x_0).
$$

Hence $0.19V^{\pi_2}(x_0)=3.8$, so $V^{\pi_2}(x_0)=20$. The other equations give $V^{\pi_2}(x_2)=20$ and $V^{\pi_2}(x_1)=25$:

$$
V^{\pi_2}=(20,25,20)^\top.
$$

### Iterative evaluation computes the same answer

Instead of solving the system, choose any initial table and repeat

$$
V_{k+1}=T^\pi V_k=r^\pi+\gamma\mathcal P^\pi V_k.
$$

The operator notation means applying an update to the whole table. For $\pi_2$, starting at zero gives

| $k$ | $V_k(x_0)$ | $V_k(x_1)$ | $V_k(x_2)$ |
|--:|--:|--:|--:|
| $0$ | $0$ | $0$ | $0$ |
| $1$ | $2$ | $7$ | $2$ |
| $2$ | $3.8$ | $8.8$ | $3.8$ |
| $3$ | $5.42$ | $10.42$ | $5.42$ |

Every new entry uses the same old table. Contraction guarantees convergence to $(20,25,20)^\top$, regardless of the initial table. A linear solve computes the fixed point by solving simultaneous equations; iterative evaluation approaches it through repeated backups. In either method, the policy remains fixed.

For a dense model, a policy-evaluation sweep uses about $n^2$ transition terms. A general dense linear solve typically costs on the order of $n^3$ arithmetic operations. Iteration can exploit sparse transitions and stop at a chosen tolerance; a linear solve avoids choosing an iteration count. These costs describe the numerical representation, rather than changing which value is being computed.

## Value iteration for control {#value-iteration}

For control, the action rule is unknown. The optimality operator selects the largest action score:

$$
(T^*V)(x)=\max_{a\in\mathcal A(x)}
\left[r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)V(x')\right].
$$

Each score is affine in $V$, but taking their maximum generally makes $T^*$ nonlinear. We generally do not know which policy matrix to use before solving the control problem; evaluating an arbitrary fixed policy need not produce the optimal value.

**Synchronous value iteration** starts with any real table $V_0$ and repeatedly computes $V_{k+1}=T^*V_k$. A sweep computes every action score from $V_k$, then stores each state's maximum in a new table $V_{k+1}$. Two arrays keep the old and new tables distinct. Reading entries already changed during the same sweep implements an in-place update with different semantics.

A policy greedy with respect to $V_k$ chooses

$$
\pi_g(x;V_k)\in\operatorname*{argmax}_{a\in\mathcal A(x)}
\left[r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)V_k(x')\right].
$$

Fix one maximizing action when there is a tie. The actions selected while computing $V_{k+1}$ constitute $\pi_g(V_k)$: their scores used the old table. To extract $\pi_g(V_{k+1})$, perform lookahead using the new table.

### The first two control updates

For the complete model above, the update is

$$
\begin{aligned}
V_{k+1}(x_0)&=\max\{0.9[0.8V_k(x_1)+0.2V_k(x_2)],\;2+0.9V_k(x_2)\},\\
V_{k+1}(x_1)&=7+0.9V_k(x_2),\\
V_{k+1}(x_2)&=2+0.9V_k(x_0).
\end{aligned}
$$

With $V_0=0$, the two scores at $x_0$ are $0$ and $2$, so

$$
V_1=(2,7,2)^\top,\qquad \pi_g(x_0;V_0)=a_2.
$$

For the second sweep, use only $V_1$ on the right:

$$
\begin{aligned}
\text{score}(x_0,a_1)&=0+0.9[0.8(7)+0.2(2)]=5.4,\\
\text{score}(x_0,a_2)&=2+0.9(2)=3.8,\\
V_2(x_0)&=\max\{5.4,3.8\}=5.4,\\
V_2(x_1)&=7+0.9(2)=8.8,\\
V_2(x_2)&=2+0.9(2)=3.8.
\end{aligned}
$$

Thus $V_2=(5.4,8.8,3.8)^\top$ and $\pi_g(x_0;V_1)=a_1$. The continuation table now represents the reward $7$ available at $x_1$, changing the preferred action.

### What a finite iterate means

When $V_0=0$, $V_k(x)$ is the largest expected discounted return over **exactly $k$ decisions**, with zero continuation value afterward:

$$
V_k(x)=\sup_\pi\mathbb E_x^\pi
\left[\sum_{t=1}^{k}\gamma^{t-1}R_t\right].
$$

The policies in this expression may depend on the observed history and on steps remaining. A decision with zero or negative reward still counts as one step.

To justify the interpretation, start with zero decisions, whose return is zero. Suppose that from any history ending at state $x'$, the best $k$-step continuation is $V_k(x')$ and an action rule attains it. With $k+1$ decisions left, choosing action $a$ at $x$ gives at most

$$
r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)V_k(x').
$$

A randomized first action averages these scores and cannot exceed their maximum. Conversely, choose a maximizing first action, then use an attaining $k$-step rule at each observed next state. Finite action sets ensure the maximum exists. This achieves $(T^*V_k)(x)$, proving the induction step. The Markov and time-homogeneous model makes earlier history irrelevant to the best remaining return once the current state and remaining steps are specified.

This interpretation concerns a truncated return. It does not make $V_k$ the infinite-horizon value of the stationary policy $\pi_g(V_k)$. For example, $V_1=(2,7,2)^\top$, whereas the stationary policy greedy with respect to $V_0$ has value $(20,25,20)^\top$. The policy greedy with respect to $V_1$ is $\pi_1$, whose infinite-horizon value must be computed by evaluating that policy. A finite-horizon optimal rule can change with the number of steps remaining. For a nonzero initial table, the updates also include that table as a terminal continuation value; the zero-terminal interpretation above assumes $V_0=0$.

With $k+1$ decisions remaining, $\pi_g(x;V_k)$ selects an optimal **first** action. For $k\geq1$, the next decision has $k$ steps remaining and uses $V_{k-1}$ to select its action. The continuation can therefore change its rule as the remaining horizon decreases.

### Action-value updates

The same method can store a candidate $Q_k(x,a)$ for every feasible state–action pair:

$$
Q_{k+1}(x,a)=r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)
\max_{a'\in\mathcal A(x')}Q_k(x',a').
$$

Here the current action $a$ is prescribed. The maximum is **inside** the next-state average because the next action is chosen after observing $x'$. A greedy policy selects an action maximizing $Q_k(x,a)$ directly. The $Q$ table requires more storage, while the state-value rule requires model-based lookahead when selecting an action.

These updates reuse the current estimate of future value to form the next estimate. This is called **bootstrapping**. A backup does not need to calculate an entire future return or fully evaluate an intermediate greedy policy.

## Convergence and the direction of updates {#vi-convergence}

The [Bellman contraction result](bellman-operators.md#contraction) and $T^*V^*=V^*$ give

$$
\begin{aligned}
\|V_{k+1}-V^*\|_\infty
&=\|T^*V_k-T^*V^*\|_\infty\\
&\leq\gamma\|V_k-V^*\|_\infty.
\end{aligned}
$$

Repeating yields $\|V_k-V^*\|_\infty\leq\gamma^k\|V_0-V^*\|_\infty$, so convergence holds from any initial table. The corresponding result holds for $Q$ updates, and for fixed-policy evaluation with $V^\pi$ or $Q^\pi$ as the target. When $\gamma=0$, one backup gives the fixed point.

With $V_0=0$, bounded rewards give $\|V^*\|_\infty\leq R_{\max}/(1-\gamma)$. Therefore

$$
\|V_k-V^*\|_\infty\leq\gamma^k\frac{R_{\max}}{1-\gamma}.
$$

This is a sufficient error bound based on the number of sweeps. Its worst-case estimate may be much larger than the actual error.

For $0<\gamma<1$ and a desired error $0<\varepsilon<R_{\max}/(1-\gamma)$, solving $\gamma^kR_{\max}/(1-\gamma)\leq\varepsilon$ gives the sufficient sweep count

$$
k\geq\left\lceil
\frac{\log\bigl(R_{\max}/((1-\gamma)\varepsilon)\bigr)}
{\log(1/\gamma)}
\right\rceil.
$$

Contraction controls distance, not the direction of individual entries. If $V_0\leq T^*V_0$, monotonicity gives an increasing sequence. Indeed, $V_k\leq V_{k+1}$ implies

$$
V_{k+1}=T^*V_k\leq T^*V_{k+1}=V_{k+2}.
$$

The comparison is at every state. Zero initialization satisfies the initial condition when all mean rewards are nonnegative, as in our example. Starting with a different table or allowing negative rewards need not produce increasing iterates, although convergence still holds. The same reasoning applies to action-value iteration.

## Stopping with a value and policy certificate {#stopping-certificates}

The contraction bound involves the unknown target. The **Bellman residual** $T^*V-V$ can be computed from the model and the candidate table alone. Its norm,

$$
\delta=\|T^*V-V\|_\infty,
$$

measures the largest absolute change a backup would make to the candidate. Using the triangle inequality, the optimality fixed-point equation, and contraction,

$$
\begin{aligned}
\|V-V^*\|_\infty
&=\|V-T^*V+T^*V-T^*V^*\|_\infty\\
&\leq\|V-T^*V\|_\infty+\|T^*V-T^*V^*\|_\infty\\
&\leq\delta+\gamma\|V-V^*\|_\infty.
\end{aligned}
$$

Subtract the last term from both sides and divide by $1-\gamma$:

$$
\boxed{\|V-V^*\|_\infty\leq\frac{\delta}{1-\gamma}.}
$$

This bounds the candidate's table error. To bound the return of its greedy policy, fix $\pi=\pi_g(V)$. At each state, its chosen action attains the optimality maximum, so

$$
\begin{aligned}
(T^\pi V)(x)
&=r(x,\pi(x))+\gamma\sum_{x'}\mathcal P(x'\mid x,\pi(x))V(x')\\
&=\max_a\left[r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)V(x')\right]\\
&=(T^*V)(x).
\end{aligned}
$$

Consequently $\|T^\pi V-V\|_\infty=\delta$. The fixed-policy operator also contracts and satisfies $T^\pi V^\pi=V^\pi$. Apply the same residual argument:

$$
\begin{aligned}
\|V-V^\pi\|_\infty
&\leq\|V-T^\pi V\|_\infty+\|T^\pi V-T^\pi V^\pi\|_\infty\\
&\leq\delta+\gamma\|V-V^\pi\|_\infty,
\end{aligned}
$$

so $\|V-V^\pi\|_\infty\leq\delta/(1-\gamma)$. Combining the two bounds proves the direct greedy-policy certificate:

$$
\boxed{\|V^*-V^{\pi_g(V)}\|_\infty
\leq\|V^*-V\|_\infty+\|V-V^{\pi_g(V)}\|_\infty
\leq\frac{2\delta}{1-\gamma}.}
$$

Since $V^*\geq V^{\pi_g(V)}$ at every state, this norm bounds the largest loss in expected return from using the returned policy. The candidate table and the policy's actual value are distinct objects, even though the same residual norm controls both distances.

In synchronous VI,

$$
\delta_k=\|V_{k+1}-V_k\|_\infty=\|T^*V_k-V_k\|_\infty.
$$

This residual norm certifies **$V_k$ and $\pi_g(V_k)$**. A consistent stopping procedure computes the new table and $\delta_k$, then returns the old table and the maximizing actions used for that sweep when the desired bound holds. For table error at most $\varepsilon_V$, require $\delta_k\leq(1-\gamma)\varepsilon_V$. For policy loss at most $\varepsilon_\pi$, require $\delta_k\leq(1-\gamma)\varepsilon_\pi/2$.

For example, $\gamma=0.9$ and $\delta_k\leq0.02$ guarantee table error at most $0.2$ and greedy-policy loss at most $0.4$, uniformly over initial states. These are upper bounds, not exact errors. If an implementation returns a different iterate or its greedy policy, the residual and its certificate must refer to that returned table.

These certificates assume exact model probabilities and exact backups. Errors from rounding or estimating the model need separate control.

## Policy iteration {#policy-iteration}

Value iteration repeatedly updates a candidate value table. **Policy iteration** instead maintains a policy, evaluates what that policy actually achieves, and uses the evaluated values to choose better actions. This gives an alternating cycle:

$$
\pi_k\quad\longrightarrow\quad V^{\pi_k}
\quad\longrightarrow\quad\pi_{k+1}.
$$

We continue with the known finite discounted MDP, bounded rewards, and $0\leq\gamma<1$. Exact policy iteration uses deterministic stationary policies: $\pi_k(x)$ specifies an available action at every state. The subscript $k$ counts policy updates, not decisions along a trajectory.

### Evaluate, then improve

During **evaluation**, hold $\pi_k$ fixed and compute its true value table:

$$
V^{\pi_k}=T^{\pi_k}V^{\pi_k}.
$$

We can solve $(I-\gamma\mathcal P^{\pi_k})V^{\pi_k}=r^{\pi_k}$ or iterate $U_{j+1}=T^{\pi_k}U_j$ to its limit. Here $j$ counts inner evaluation steps while $k$ counts outer policy changes. The two computations target the same fixed point; stopping the inner iteration early gives an approximate evaluation.

During **improvement**, score each available action using

$$
Q^{\pi_k}(x,a)
=r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)V^{\pi_k}(x').
$$

As in [the value-function note](value-functions.md), this means taking action $a$ now and following the **old policy** $\pi_k$ from the next decision onward. Choose

$$
\pi_{k+1}(x)\in\operatorname*{argmax}_{a\in\mathcal A(x)}Q^{\pi_k}(x,a)
\qquad\text{at every state }x.
$$

The old action is among those compared, so

$$
\begin{aligned}
Q^{\pi_k}(x,\pi_{k+1}(x))
&=\max_a Q^{\pi_k}(x,a)\\
&\geq Q^{\pi_k}(x,\pi_k(x))
=V^{\pi_k}(x).
\end{aligned}
$$

The last equality uses the Bellman equation for the action the old policy actually takes. In operator form, the same calculation is

$$
T^{\pi_{k+1}}V^{\pi_k}=T^*V^{\pi_k}\geq V^{\pi_k}.
$$

This is initially a comparison of one new action followed by the old continuation. The **policy improvement theorem** strengthens it to $V^{\pi_{k+1}}\geq V^{\pi_k}$: following the new policy forever is no worse at any initial state. The optional proof below explains the bridge from one step to the full return.

### A complete improvement in the running example

Use the running three-state model with $\gamma=0.9$ and state order $(x_0,x_1,x_2)$. The model labels $\pi_1$ and $\pi_2$ name two fixed policies; they are separate from the algorithmic index $k$. Policy $\pi_2$ chooses $a_2$ at $x_0$, while $\pi_1$ chooses $a_1$. Both use the sole action elsewhere. In state order $(x_0,x_1,x_2)$, evaluation gives

$$
V^{\pi_2}=(20,25,20)^\top.
$$

Use this entire table to compare the actions at $x_0$:

$$
\begin{aligned}
Q^{\pi_2}(x_0,a_1)
&=0+0.9[0.8(25)+0.2(20)]=21.6,\\
Q^{\pi_2}(x_0,a_2)
&=2+0.9(20)=20.
\end{aligned}
$$

The greedy update chooses $a_1$, giving policy $\pi_1$. Its zero immediate reward is compensated by the opportunity to obtain reward $7$ on the next action at $x_1$. The number $21.6$ still uses $\pi_2$ on subsequent visits to $x_0$. To find the return from using $a_1$ on **every** visit, evaluate the new policy:

$$
\begin{aligned}
V^{\pi_1}(x_0)&=0.9[0.8V^{\pi_1}(x_1)+0.2V^{\pi_1}(x_2)],\\
V^{\pi_1}(x_1)&=7+0.9V^{\pi_1}(x_2),\\
V^{\pi_1}(x_2)&=2+0.9V^{\pi_1}(x_0).
\end{aligned}
$$

Substituting the second and third equations into the first gives

$$
\begin{aligned}
V^{\pi_1}(x_0)
&=5.04+0.828V^{\pi_1}(x_2)\\
&=6.696+0.7452V^{\pi_1}(x_0).
\end{aligned}
$$

Thus $V^{\pi_1}(x_0)=6.696/(1-0.7452)$. Back-substitution yields

$$
V^{\pi_1}=\frac1{637}(16740,19165,16340)^\top
\approx(26.28,30.09,25.65)^\top.
$$

We must now improve using **these** evaluated values. At $x_0$,

$$
\begin{aligned}
Q^{\pi_1}(x_0,a_1)
&=0+0.9\left[0.8\frac{19165}{637}+0.2\frac{16340}{637}\right]
=\frac{16740}{637}\approx26.279,\\
Q^{\pi_1}(x_0,a_2)
&=2+0.9\frac{16340}{637}
=\frac{15980}{637}\approx25.086.
\end{aligned}
$$

The incumbent $a_1$ remains greedy. The other states have no alternative actions, so the complete policy remains unchanged.

### The exact algorithm and its stopping test

The algorithm uses an **incumbent-preserving tie rule**: keep the current action whenever it is a maximizer. If it is not, choose a maximizing action by a fixed rule.

1. Start with any deterministic stationary policy $\pi_0$.
2. Evaluate $V^{\pi_k}$ exactly and form the action scores $Q^{\pi_k}$.
3. Choose a greedy action at every state using the tie rule.
4. If $\pi_{k+1}(x)=\pi_k(x)$ at every state, return $\pi_k$ and $V^{\pi_k}$. Otherwise repeat with the new policy.

Why does an unchanged policy certify optimality? For each state, exact evaluation and greedy stability give

$$
\begin{aligned}
V^{\pi_k}(x)
&=r(x,\pi_k(x))+
\gamma\sum_{x'}\mathcal P(x'\mid x,\pi_k(x))V^{\pi_k}(x')\\
&=\max_a\left[r(x,a)+
\gamma\sum_{x'}\mathcal P(x'\mid x,a)V^{\pi_k}(x')\right]
=(T^*V^{\pi_k})(x).
\end{aligned}
$$

Therefore $V^{\pi_k}$ is a fixed point of $T^*$. [Lecture 3's optimality result](bellman-operators.md#thm-optimal-policy) identifies the unique such fixed point as $V^*$, so the returned policy is optimal simultaneously from all states. In particular, this proves optimality of $\pi_1$ in the example. We are checking a whole policy and value table, rather than only performance from one initialization.

Ties explain why the stopping rule needs care. Consider one state with two actions, both giving reward $0$ and returning to the same state, with $\gamma=1/2$. Either deterministic policy has value $0$, and both action scores are $0$. Arbitrary tie choices could alternate the policy labels forever, although the values are already optimal. Keeping the incumbent makes the algorithm stop. A finite policy set by itself does not prevent tie cycling.

Exact evaluation also matters. With an estimated value or action-value table, small errors can reverse the ranking of nearly tied actions. Stopping evaluation early, using sampled estimates, or approximating a table can be useful, but the exact improvement guarantee then needs an additional error analysis.

### Comparing value iteration and policy iteration

Both methods connect a value table with greedy action choices, but spend different amounts of work evaluating a policy before another improvement.

| | Value iteration | Exact policy iteration |
|:---|:---|:---|
| Main update | $V_{k+1}=T^*V_k$ | Evaluate $V^{\pi_k}$, then improve $\pi_k$ |
| Evaluation work | One backup per update | A full policy evaluation per outer step |
| Value guarantee | $V_k\to V^*$ from any initial table | Policy values never decrease |
| Stopping certificate | The residual norm bounds value error and greedy-policy loss | An unchanged greedy policy is optimal |
| Exact termination | The value table need not reach its fixed point in finitely many backups | Finite with the stated tie rule |

One VI update can be written $V_{k+1}=T^{\pi_g(V_k)}V_k$: select actions greedy in $V_k$, then make one backup with those actions. This does not fully evaluate that selected policy. PI completes evaluation before improving again. Which method is cheaper depends on the model and the evaluation computation.

VI guarantees convergence of the value table. Its greedy policy labels need not stabilize when optimal actions tie, even though the values converge to $V^*$.

## Optional: why exact policy iteration improves and terminates {#pi-proof}

This section supplies the proofs reserved for Lecture 4's optional convergence slides. The core algorithm and its stable-policy certificate above can be read independently.

### From one-step improvement to policy improvement

Let $\pi$ be the old deterministic stationary policy and $\pi'$ a policy greedy in $V^\pi$. Expanding the operators at every state shows precisely why the first comparison holds:

$$
\begin{aligned}
(T^{\pi'}V^\pi)(x)
&=r(x,\pi'(x))+\gamma\sum_{x'}\mathcal P(x'\mid x,\pi'(x))V^\pi(x')\\
&=\max_a\left[r(x,a)+\gamma\sum_{x'}\mathcal P(x'\mid x,a)V^\pi(x')\right]\\
&\geq r(x,\pi(x))+\gamma\sum_{x'}\mathcal P(x'\mid x,\pi(x))V^\pi(x')\\
&=(T^\pi V^\pi)(x)=V^\pi(x).
\end{aligned}
$$

The maximum includes the old action. Hence $T^{\pi'}V^\pi=T^*V^\pi\geq V^\pi$ as whole tables.

Now keep $\pi'$ fixed. Its operator is monotone: if $U\geq W$, then

$$
(T^{\pi'}U)(x)-(T^{\pi'}W)(x)
=\gamma\sum_{x'}\mathcal P(x'\mid x,\pi'(x))[U(x')-W(x')]\geq0,
$$

because every weight is nonnegative. Applying this same operator to both sides of $T^{\pi'}V^\pi\geq V^\pi$ gives the first propagation step:

$$
(T^{\pi'})^2V^\pi\geq T^{\pi'}V^\pi\geq V^\pi.
$$

Here $(T^{\pi'})^m$ means applying the operator $m$ times, with $\pi'$ fixed throughout; it is not a numerical power. Repeating the argument gives, for every $m\geq1$,

$$
(T^{\pi'})^mV^\pi\geq T^{\pi'}V^\pi=T^*V^\pi\geq V^\pi.
$$

These are evaluation iterates of one fixed new policy, initialized with the old policy's table. **Lecture 3's policy-evaluation contraction bound** gives

$$
\big\|(T^{\pi'})^mV^\pi-V^{\pi'}\big\|_\infty
\leq\gamma^m\|V^\pi-V^{\pi'}\|_\infty\longrightarrow0.
$$

Here $\|\cdot\|_\infty$ is the maximum absolute entry of a table. This uniform convergence implies convergence of every component. Taking the limit in the preceding pointwise inequalities proves

$$
\boxed{V^{\pi'}\geq T^*V^\pi\geq V^\pi.}
$$

The leftmost table now represents using $\pi'$ forever. If the old action is not a maximizer at a state $x$, the one-step inequality there is strict, and the stronger bound gives $V^{\pi'}(x)>V^\pi(x)$. Other states may have equal values.

### A whole-table plateau implies optimality

Suppose a greedy improvement gives $V^{\pi'}=V^\pi$ at every state. Call this shared table $W$. Equality of the whole tables lets us use the old value as the continuation in the new policy's Bellman equation. Together with the greedy construction, this gives

$$
W=T^{\pi'}W=T^{\pi'}V^\pi=T^*V^\pi=T^*W.
$$

The unique optimality fixed point is $V^*$, so $W=V^*$. Conversely, if $V^\pi=V^*$, then greediness gives $T^{\pi'}V^*=T^*V^*=V^*$. Uniqueness of the new policy's evaluation fixed point yields $V^{\pi'}=V^*$. Thus a plateau of the **entire table** is equivalent to already being optimal. Equality at one state alone is insufficient.

### Finite termination with preserved ties

There are only

$$
N=\prod_{x\in\mathcal X}|\mathcal A(x)|
$$

deterministic stationary policies. Under the tie rule, a changed action means that the incumbent was not a maximizer, so the policy value strictly increases at that state. Values never decrease elsewhere. Any later value table remains strictly above the old table at that state; consequently the algorithm cannot revisit that old policy, whose value table is fixed by the model.

Only finitely many such changes can occur. At an optimal policy, its incumbent action has score $V^*(x)=\max_a Q^\pi(x,a)$ at every state. All incumbents are therefore retained and the policy-equality test succeeds. At most $N$ distinct policies are evaluated, and the returned policy is optimal. This establishes finiteness; it does not claim that a full policy evaluation or the total computation is inexpensive.

## Check your understanding

1. In the three-state model, compute $V_3=T^*V_2$ from $V_2=(5.4,8.8,3.8)^\top$. Which continuation table determines the greedy actions used in this sweep?
2. With $\gamma=0.9$ and $\|V_{k+1}-V_k\|_\infty\leq0.01$, which table is certified, and what bounds follow for value error and the return loss of its greedy policy?
3. Why is $Q^{\pi_2}(x_0,a_1)=21.6$ different from $V^{\pi_1}(x_0)\approx26.28$?
4. Can exact PI change its policy without changing its value when arbitrary ties are allowed? What does preserving the incumbent action prevent?

This note develops the main material in the [Lecture 4 slides](../materials/slides/DPRL_lec04_value_iteration_and_policy_iteration.pdf). The policy-improvement and termination proofs above are optional reading, matching the optional proof section of the deck. The [reading list](../resources.md) provides complementary treatments.

[Previous: Bellman operators, fixed points, and optimal policies](bellman-operators.md) · [All course notes](index.md)
