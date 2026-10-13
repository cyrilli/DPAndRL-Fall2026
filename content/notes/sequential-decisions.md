---
title: Sequential decisions and Markov decision processes
subtitle: Lecture 1
sidebar: notes
body-classes: course-notes
toc: true
number-sections: true
---

Sequential decision making asks how to act when a decision changes both the immediate outcome and the choices available later. Dynamic programming and reinforcement learning address this same problem. To understand their methods, we first need a model of what the decision maker observes, what it can do, and what makes one course of action better than another.

## Why the future matters

Consider an inventory manager deciding how much stock to order. A large order may reduce future shortages, but it also increases purchasing and holding costs. A small order saves money now but may leave insufficient stock when demand arrives. The order changes the situation in which the next decision will be made.

This dependence distinguishes a sequential problem from a collection of separate decisions. We cannot judge an action only by its immediate outcome: we must also consider the situations it makes likely and the decisions we can take in those situations. Uncertainty adds another difficulty. Tomorrow's demand is unknown, so a useful decision rule must respond to what actually happens.

The same structure appears in assigning deliveries, choosing medical treatments, controlling a robot, and playing a game. The details differ, but in each case an action affects what happens next.

## A resource-allocation example

The first lecture considered three products competing for four units of a resource. Their resource requirements and profits are:

| Product | Resource per item | Profit per item |
| :--- | ---: | ---: |
| 1 | 2 | 31 |
| 2 | 3 | 47 |
| 3 | 1 | 14 |

Profits are measured in thousands of RMB. If $a_t$ is the quantity of product $t$, the problem is to maximize $31a_1+47a_2+14a_3$ subject to $2a_1+3a_2+a_3\leq4$ and nonnegative integer quantities.

We can also view the problem as three decisions, one for each product. At decision $t$, let $x$ be the resource still available. The feasible quantities are

$$
\mathcal A_t(x)=\{0,1,\ldots,\lfloor x/h_t\rfloor\},
$$

where $(h_1,h_2,h_3)=(2,3,1)$. Producing $a$ items earns $p_ta$, where $(p_1,p_2,p_3)=(31,47,14)$, and leaves $x-h_ta$ units for later products.

For the last product, all remaining resource can be used at a profit of 14 per unit. With four units available before product 2, producing no product 2 leaves a profit of $4\times14=56$; producing one gives $47+14=61$. Before product 1, the three feasible choices therefore give

$$
\begin{array}{c|c}
\text{Quantity of product 1}&\text{Profit including the best later choices}\\\hline
0&61\\
1&31+28=59\\
2&62+0=62
\end{array}
$$

In the middle row, producing one item of product 1 leaves two resource units. These cannot produce an item of product 2, but they can produce two items of product 3, earning another $28$.

The optimal quantities are $(2,0,0)$, with total profit 62. The important idea is the reasoning: compare the profit from an action **together with the best use of what remains**. Working backward makes that later contribution available when an earlier decision is evaluated. Here the model is deterministic and known, so we can calculate every consequence in advance.

## The agent–environment interaction

We call the decision maker the **agent** and the system it interacts with the **environment**. At each time $t=1,2,\ldots$, the interaction follows this order:

$$
\underbrace{X_t}_{\text{observe state}}
\longrightarrow
\underbrace{A_t}_{\text{choose action}}
\longrightarrow
\underbrace{(R_t,X_{t+1})}_{\text{receive reward and next state}}.
$$

$X_t$, $A_t$, and $R_t$ are random variables. Lowercase $x$ and $a$ denote particular state and action values. We use $\mathcal X$ for the state space and $\mathcal A(x)$ for the actions available at state $x$. If every state has the same actions, we simply write $\mathcal A$.

The reward $R_t$ belongs to the decision made at $(X_t,A_t)$. This course uses that timing convention throughout: the reward after choosing $A_t$ is $R_t$, even though some books label it $R_{t+1}$. The initial state may be fixed or sampled from a distribution $\rho$, written $X_1\sim\rho$.

Repeating the interaction produces a **trajectory**, also called a rollout:

$$
(X_1,A_1,R_1,X_2,A_2,R_2,\ldots).
$$

A trajectory records what happened in one run. A model describes what could happen and with what probabilities.

## What should a state contain?

A state should summarize the past information needed to predict the next outcome after an action is chosen. This requirement is the **Markov property**: given the current state and action, earlier history provides no further information about the joint distribution of the next state and reward.

A **Markov decision process (MDP)** is a model with this property, specifying states, available actions, transitions, and rewards. Together with a criterion for combining rewards, it defines the decision problem.

For an inventory system with immediate replenishment and an appropriate demand model, current stock may suffice. If orders arrive after a delay, stock alone generally does not suffice: two systems with the same stock can have different deliveries due tomorrow. Outstanding orders must then be included in the state. The choice of state is therefore a modeling decision, not merely a label assigned to an observation.

An **observation** is what the agent can measure; a **state** describes the information required by the model. In a fully observed MDP, the agent has access to the state. When important state information is hidden, the agent may need past observations to infer it. That is a partially observed problem, beyond the fully observed models studied here.

Markov and stationary mean different things. Markov concerns dependence on the past; **stationary dynamics** means that the transition and reward rules do not change with absolute time. If a deadline or product stage changes the rules, time or stage may need to appear explicitly in the model or state.

## Transitions and rewards

For each valid state–action pair $(x,a)$, a stochastic model specifies a joint distribution for the next state and reward. Write $\mathcal P(\cdot\mid x,a)$ for its next-state distribution and $\mathcal R(\cdot\mid x,a)$ for its reward distribution. These are its **marginal distributions**: each describes one component of the pair without specifying the other. They do not imply independence. For example, a successful delivery may produce both a particular next state and a positive reward.

In a finite state space,

$$
\mathcal P(x'\mid x,a)\geq0,
\qquad
\sum_{x'\in\mathcal X}\mathcal P(x'\mid x,a)=1.
$$

For fixed $(x,a)$, these probabilities form one distribution. The full **transition kernel** supplies such a distribution for every input pair. A matrix representation places current states in rows and next states in columns, with one matrix for each action when actions are available everywhere.

A deterministic transition is a special case: a function $f(x,a)$ gives the next state, and the transition kernel assigns probability one to it. Resource allocation has this form, with $f_t(x,a)=x-h_ta$.

The realized reward $R_t$ need not equal its mean. For a reward drawn from $\mathcal R(\cdot\mid x,a)$, define

$$
r(x,a)=\mathbb E[R],\qquad R\sim\mathcal R(\cdot\mid x,a).
$$

Thus $r(x,a)$ is the expected immediate reward, a model quantity defined even at an input the agent has not yet visited. For expected additive reward objectives, the Bellman equations use this mean reward and the transition kernel. Their derivation does not require reward and next state to be independent.

## Policies describe how decisions respond to states

A **policy** is an action-selection rule. A deterministic stationary Markov policy chooses an action

$$
A_t=\pi(X_t),\qquad \pi(x)\in\mathcal A(x).
$$

A stochastic stationary Markov policy instead specifies action probabilities:

$$
A_t\sim\pi(\cdot\mid X_t),\qquad
\sum_{a\in\mathcal A(x)}\pi(a\mid x)=1.
$$

“Markov” means the rule uses the current state rather than the full history; “stationary” means the same rule applies at every time. A deterministic rule is a special case of a stochastic policy, assigning probability one to its chosen action.

More generally, a policy can depend on time and on the observed history, including past rewards. A Markov environment does not force the agent to use a Markov policy. We will later establish when a stationary Markov policy is sufficient for optimality.

A policy also differs from a fixed action sequence. A sequence chosen in advance cannot adapt to an unexpected outcome. A policy specifies what to do in each possible state, including states that do not occur in a particular run. In deterministic resource allocation, the optimal sequence suffices for the given starting budget; with uncertain resource consumption, a rule responding to remaining resource becomes useful.

## The objective connects decisions over time

A reward expresses the immediate desirability of an outcome. Choosing it is part of modeling the goal: profit can be a positive reward, and a cost can be represented by its negative. The task objective says how rewards over time are combined. For $T$ decisions, one possible objective is the expected total reward. With discount factor $0\leq\gamma\leq1$, the corresponding random **return** is

$$
G=\sum_{t=1}^{T}\gamma^{t-1}R_t.
$$

For a finite horizon, $\gamma=1$ weights all rewards equally. In an episode, $T$ may instead be the random time at which the interaction terminates. A continuing task has no prescribed final decision; its discounted return uses the same sum extended to infinity, with $0\leq\gamma<1$ and suitable boundedness assumptions.

The discount factor determines how future rewards count in the objective. It is not an algorithm's learning rate. A realized return varies across trajectories; the goal here is to maximize its expectation. The [next note](value-functions.md) develops these objectives carefully and defines value functions that measure a policy's expected return.

## Planning and reinforcement learning

If the transition and reward model is known, we can reason about actions without first discovering their consequences. This is **planning**. Dynamic programming uses the relationship between a current decision and its continuation to organize that reasoning.

Reinforcement learning learns how to act from sampled experience. Often, relevant parts of the transition or reward model are unknown. A model-based method uses a supplied or learned model to plan. A model-free method learns values or a policy from experience without using a transition model for planning. Either way, actions influence both the rewards earned and the experience available for learning. Choosing a currently promising action is exploitation; trying an uncertain action to learn about it is exploration.

Planning and learning can also be combined. Even with a known simulator, learning from sampled interactions may be useful when exact planning is too expensive.

A bandit problem isolates this information tradeoff by removing controlled state transitions. In a contextual bandit, the agent observes a context, chooses an action, and receives its reward, while its action does not control the future context process. In an MDP, an action can change the next state and therefore future opportunities as well. In both settings, the agent typically observes the reward of its chosen action without seeing what other actions would have earned. This feedback limitation is distinct from an action's effect on future states.

Language-model training provides another application discussed in Lecture 1: generated text can be treated as a sequence of actions, with rewards evaluating a response. The details of the state and reward model depend on the task. The common question remains how a sequence of decisions should be guided by its eventual outcomes.

The model gives us states, actions, outcomes, and an objective. To compare policies, we now need a way to assign a numerical value to the future they generate.

*Based on the [Lecture 1 slides](../materials/slides/DPRL_lec01_course_overview_and_rl_intro_post.pdf), with explanations written for these notes. The [course resources](../resources.md) provide complementary textbook treatments.*

[Next: Returns, value functions, and Bellman equations](value-functions.md) · [All course notes](index.md)
