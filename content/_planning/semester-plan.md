---
title: Semester teaching plan
subtitle: Dynamic Programming and Reinforcement Learning · Fall 2026
date: 2026-10-01
format:
  html:
    theme: cosmo
    toc: true
    toc-depth: 3
    embed-resources: true
    html-math-method: katex
    fontsize: 17px
    linestretch: 1.55
    include-in-header:
      text: |
        <style>
        #assessment-of-each-remaining-meeting col:nth-child(1) { width: 18% !important; }
        #assessment-of-each-remaining-meeting col:nth-child(2) { width: 18% !important; }
        #assessment-of-each-remaining-meeting col:nth-child(3) { width: 18% !important; }
        #assessment-of-each-remaining-meeting col:nth-child(4) { width: 46% !important; }
        #semester-at-a-glance col:nth-child(1) { width: 10% !important; }
        #semester-at-a-glance col:nth-child(2) { width: 12% !important; }
        #semester-at-a-glance col:nth-child(3) { width: 34% !important; }
        #semester-at-a-glance col:nth-child(4) { width: 44% !important; }
        section[id^="session-"] > table:first-of-type col:first-child { width: 18% !important; }
        section[id^="session-"] > table:first-of-type col:last-child { width: 82% !important; }
        .table td { vertical-align: top; }
        .table { font-size: .94rem; line-height: 1.5; }
        </style>
---

## Recommendation

Keep the first three lectures as taught, finish the main planning algorithms in two more lectures, and introduce learning from samples before the first lab. Devote **two meetings to exploration: 180 minutes on linear bandits and 90 minutes connecting them to linear MDPs**. Work carefully through the bandit regret proof; use its structure to explain LSVI-UCB and the MDP bounds. Follow with separate meetings on deep Q-learning, policy gradients and actor–critic, and PPO. This gives PPO a full worked training example and leaves the next meeting for RL with language models. Finish with an LLM evaluation case and a brief multi-agent introduction through equilibrium computation and single-agent best-response learning. The final lab connects implementation and evaluation to the semester's ideas.

This is an instructor proposal. The posted schedule, lecture outlines, slides, lab dates, and assessment rules have not been changed. The existing calendar provides **15 meetings**, including **two labs**; there is no class on October 6 and no assumed makeup. Each meeting contains **135 teaching minutes**, in three 45-minute periods, with two five-minute breaks. The agendas below count teaching minutes only. The ten remaining lecture meetings are Sessions 4–6 and 8–14.

The organizing question is: **How do Bellman reasoning, statistical uncertainty, and policy improvement change as the model, representation, feedback, and other decision-makers change?** Reuse four examples: the existing three-state MDP for exact and sampled updates; a resource-constrained route for finite-horizon modeling and the first lab; a two-dimensional bandit for confidence geometry; and a short response-generation task for policy gradients and LLM rewards.

### What changes from the current tentative schedule

- Replace the separate “infinite-horizon problems” meeting with VI and PI. The posted Lecture 3 already establishes the discounted fixed-point and optimality theory.
- Use the next meeting for finite-horizon DP, state augmentation, and rollout. These support both the planning lab and the later episodic linear-MDP analysis.
- Combine introductory MC, TD, and Q-learning around their common sample-update structure. Derive their updates and explain the convergence assumptions; reserve the full stochastic-approximation proof for further reading.
- Use two connected exploration meetings. The linear-bandit upper proof is the main mathematical thread; follow it with a concrete lower-bound argument, then explain the corresponding linear-MDP algorithm and bounds through the bandit connection.
- Move MARL after policy optimization and keep it introductory. Use double oracle and PSRO to make the requested connection to equilibrium algorithms concrete.
- Preserve both lab meetings. Treat advanced topics such as average-cost control, POMDP solvers, full TRPO/SAC derivations, and general-sum MARL theory as extensions, rather than adding nominal coverage without time to explain them.

### Semester at a glance

| Session | Date | Focus | Main result or student task |
|:--|:--|:--|:--|
| 1, taught | Sep 15 | Sequential decisions, DP and RL | Formulate a decision problem; distinguish known-model planning from learning |
| 2, taught | Sep 22 | Values and Bellman equations | Derive expectation and optimality equations; evaluate a small MDP |
| 3, taught | Sep 29 | Operators, fixed points, optimal policies | Explain contraction, residual bounds, and greedy attainment |
| — | Oct 6 | National Day holiday | No meeting |
| 4 | Oct 13 | Value iteration and policy iteration | Implement VI/PI; prove policy improvement; certify an approximate solution |
| 5 | Oct 20 | Finite-horizon DP and online planning | Derive backward induction; augment the state; perform rollout |
| 6 | Oct 27 | Learning values and policies from samples | Compute and explain MC, TD, and Q-learning targets and their assumptions |
| 7, lab | Nov 3 | Resource-constrained path planning | Solve and validate a DP model; compare exact planning and rollout |
| 8 | Nov 10 | Linear bandits: optimism and regret | Develop ridge confidence and prove the OFUL upper bound given a concentration lemma |
| 9 | Nov 17 | Bandit limits and the connection to linear MDPs | Prove a bandit lower bound; explain how optimistic regression extends to sequential decisions |
| 10 | Nov 24 | Value approximation and deep Q-learning | Relate fitted Bellman updates to DQN and diagnose instability |
| 11 | Dec 1 | Policy gradients and actor–critic | Derive REINFORCE and the baseline identity; compute an actor/critic update |
| 12 | Dec 8 | PPO: objective and training loop | Interpret clipping, trace a complete update, and explain the limits of sample reuse |
| 13 | Dec 15 | Reinforcement learning for language models | Explain RLHF and GRPO; distinguish online RL from preference optimization |
| 14 | Dec 22 | LLM evaluation, introductory MARL, synthesis | Audit an LLM result; combine equilibrium computation with best-response RL |
| 15, lab | Dec 29 | Learning and evaluation for sequential decisions | Compare learned policies with exact baselines and analyze variation across runs |

## Pacing audit {#pacing-audit}

**Verdict:** two exploration meetings are reasonable with different depth commitments: derive the central linear-bandit arguments, then use them to explain the MDP extension. This is 180 minutes on bandits and 90 on MDPs, including questions. The remaining lectures each develop one main thread with a worked example. The tightest meetings are introductory sample-based learning, the bandit upper proof, and policy gradients/actor–critic. Their agendas rely on the prerequisites and proof boundaries stated below.

### Calibration from the first three lectures

- **Lecture 1 (85 PDF pages):** administration, motivation, definitions, and illustrations account for much of the deck. Pages 20–25 expand three stages of one resource-allocation calculation; pp. 79–84 build one trajectory illustration. Its page count is not a useful target for a proof lecture.
- **Lecture 2 (42 pages):** pp. 4–10 review notation and expectations, pp. 23–28 develop the Bellman derivation, and pp. 29–34 give a worked example and quiz. This is the relevant benchmark for introducing unfamiliar algorithms: budget time to interpret the symbols and compute an example.
- **Lecture 3 (64 pages):** pp. 19–32 build the norm/contraction background; pp. 34–47 develop closely related contraction and fixed-point arguments; pp. 49–62 establish optimality. This is a demanding benchmark for a connected proof lecture, not evidence that several independent mathematical toolkits fit into one meeting.

The posted decks establish intended coverage, not measured classroom timings or student mastery. The feasibility assessments below are planning judgments based on their teaching style and the source schedules. They are not recording durations or a slides-per-minute formula.

### Comparison with other courses

| Course | Published allocation | Implication for this course |
|:--|:--|:--|
| [Farahmand, Fall 2025][FCOURSE] | Monday slots are 180 minutes. Planning occupies two meetings; stream learning occupies a special 195-minute Friday slot plus a Monday. Break lengths are unspecified. | Our 135-minute meetings can reuse selected passages, not full modules. Much of the planning foundation is already taught here; stream learning still needs a substantial depth reduction. |
| [MIT 6.231][MITTIME] | 90-minute lectures plus a separate weekly 60-minute recitation. DP/augmentation, paths, lookahead, and rollout appear in separate [lectures 2, 3, 8, and 9][MIT]. | Session 5 must reuse one small example and select a few ideas, rather than compress four whole lectures. |
| [UCSB CS292F, Spring 2021][UCSBCOURSE] | 100-minute meetings. MAB/linear setup, linear-bandit analysis, tabular exploration, and linear MDPs have separate meetings; the next meeting wraps up exploration. | Our shorter block prioritizes the linear-bandit proof. Omit a separate finite-arm UCB proof and explain the MDP extension through the shared argument, with its concentration and regret lemmas supplied. |
| [Stanford CS224R, Spring 2026][STANCOURSE] | Separate 90-minute meetings for policy gradients and actor–critic; later meetings cover reward learning, LLM preferences, and LLM reasoning. | Keep PG/actor–critic separate from PPO. A full LLM meeting plus an evaluation segment permits a focused introduction; it still does not reproduce three specialized lectures. |
| [Berkeley CS185/285, Spring 2026][BERKELEYCOURSE] | Scheduled weekly pairs total 180 minutes: PG/actor–critic, value-based/practical Q-learning, and advanced PG each receive a pair. | One DQN meeting is plausible after our tabular preparation. Separate PG/actor–critic and PPO meetings give time to connect objectives to actual updates. |

Scheduled hours are comparisons, not conversion factors. The other courses teach broader or different material, and their prerequisites and separate tutorials also matter. In particular, Stanford and Berkeley assume prior machine learning; their pace is not a safe default if gradient descent or log-likelihood is new to this class.

### Assessment of each remaining meeting

Each agenda below totals 135 teaching minutes. These assessments concern the stated classroom depth, not the time needed to read every cited reference.

| Session | Teaching allocation | Assessment | Scope that makes 3 × 45 minutes credible |
|:--|:--|:--|:--|
| 4 · VI/PI | Algorithms, one proof, worked comparison | Feasible | Reuse residual theory; prove policy improvement; supply the additional policy-loss certificate. |
| 5 · Finite horizon/rollout | One augmented route model | Tight but coherent | Backward induction, state augmentation, and one-step rollout; omit separate approximation-error analysis. |
| 6 · MC/TD/Q-learning | Three related sample updates | Tight | Derive targets and examples; state convergence; SARSA optional; no general stochastic-approximation proof. |
| 7 · Planning lab | Scaffolded solver and checks | Conditional | Supply infrastructure and an enumeration checker; rollout is a stretch activity. |
| 8 · Linear-bandit upper bound | Model → confidence → optimism → regret | Demanding but connected | Supply concentration and matrix prerequisites; derive the confidence ellipsoid, width bound, potential bound, and regret sum. Finite-arm UCB is motivation only. |
| 9 · Bandit limits/linear MDPs | 45 min lower proof; 90 min MDP connection | Tight; needs a guided lower proof | Supply the adaptive testing lemma and a proof scaffold. Explain the MDP proof structure and bound comparison; detailed concentration, recursion, and lower-bound proofs are reading. |
| 10 · Approximation/DQN | One fitted update and one DQN batch | Feasible | No formal error propagation or algorithm survey; gradient descent is a prerequisite. |
| 11 · PG/actor–critic | Two derivations and one actor/critic update | Tight | Derive the score-function and baseline identities; use one simple actor–critic variant; PPO follows next meeting. |
| 12 · PPO | Surrogate, clipping, complete training trace | Feasible | Spend the additional time on the data and updates; omit a TRPO theorem and GAE derivation. |
| 13 · RL for LLMs | RLHF, GRPO, preference comparison | Feasible with preparation | Use one response-generation example; interpret reward-model and DPO losses; compute one group-relative update. |
| 14 · Evaluation/MARL | 45 min evaluation; two periods on MARL and synthesis | Feasible if introductory | One evaluation case and one zero-sum/double-oracle/PSRO example; no general MARL theory survey. |
| 15 · Learning lab | Short controlled runs and interpretation | Conditional | Supply most code, an exact baseline, and fallback results; reserve 30 minutes for debugging/recovery. |

Check ridge-matrix notation before Session 8, squared loss and gradient descent before Session 10, and softmax/log-likelihood notation before Session 11. If students need more preparation, use the stated fallback scope rather than accelerating through the central argument. Keep 15–20 minutes per lecture for questions and recovery.

## What the first three lectures establish

The published PDFs, rather than older preparation decks or tentative outlines, are the starting point. They contain 85, 42, and 64 PDF pages respectively. The following is a retrospective content map, not a new timing plan for meetings that have already happened.

### Session 1 · Introduction and formulation · September 15

**Covered:** sequential decision examples; resource allocation and backward induction; states, actions, rewards, transitions, policies, and returns; the distinction between dynamic programming with a model and reinforcement learning without one. The resource-allocation example provides an intuitive finite-horizon calculation, but does not replace a general stochastic backward-induction argument.

**Use later:** revisit the resource allocation example in Session 5 and the distinction between planning and data collection in Sessions 6 and 8.

**References:** [posted Lecture 1 slides](../materials/slides/DPRL_lec01_course_overview_and_rl_intro_post.pdf), especially the resource-allocation worked example; [Farahmand, Introduction][F1]; Sutton and Barto, Chapter 1; [Bertsekas MIT 6.231 Lecture 2][M2], for the later formal DP recursion.

### Session 2 · Values and Bellman equations · September 22

**Covered:** finite-horizon and discounted returns; state and action values; Bellman expectation and optimality equations; matrix policy evaluation and a worked small MDP; greedy action selection. The posted deck ends at page 42, before the operator and contraction development in the longer preparation version.

**Use later:** the same MDP becomes the VI/PI calculation in Session 4 and the MC/TD/Q-learning example in Session 6. Keep the distinction between a greedy action for $Q^\pi$ and a globally optimal policy explicit.

**References:** [posted Lecture 2 slides](../materials/slides/DPRL_lec02_value_functions_and_bellman_equations_post.pdf); [Farahmand, Structural Properties of MDPs][F2]; [Foundations of Reinforcement Learning, Chapter 2][FRL].

### Session 3 · Operators and optimality · September 29

**Covered:** greedy policies for candidate values; Bellman operators; monotonicity and contraction; fixed-point uniqueness, convergence, and residual value-error certificates; identification of the optimal fixed point and an optimal stationary policy, including comparison with history-dependent policies. Page 64 explicitly leaves algorithm details, PI's improvement argument, stopping rules, and computational comparisons to the next lecture.

**Use later:** treat the contraction theorem as an established tool. Session 4 should spend its time on algorithms and policy guarantees, rather than proving Banach's theorem again.

**References:** [posted Lecture 3 slides](../materials/slides/DPRL_lec03_bellman_operators_and_optimal_policies_post.pdf), especially pp. 42–64; [Farahmand, Structural Properties of MDPs][F2]; [FRL Chapter 2][FRL].

## Detailed plan for the remaining meetings

The three rows of each lecture agenda are the actual 45-minute teaching periods. Breaks sit between the rows and do not reduce the 135 teaching minutes. Reserve 15–20 minutes across the meeting for questions, checks, and recovery; those minutes are not spare capacity for another algorithm. Exercises already named in the rows are also part of the teaching budget. Selected references support the lesson and instructor preparation, not a promise to reproduce every cited proof.

### Session 4 · Value iteration and policy iteration · October 13

**Purpose.** Turn the previous lecture's existence and convergence results into algorithms students can implement and compare. Use the same finite, discounted MDP throughout.

| Teaching minutes | Content |
|:--|:--|
| 0–45 | 5 min recall; 20 min VI and one worked sweep, reusing policy evaluation; 10 min student calculation; 5 min apply the existing residual bound; 5 min questions/overrun. |
| 45–90 | 10 min PI algorithm; 20 min policy-improvement proof; 10 min finite termination and tie handling; 5 min questions/overrun. |
| 90–135 | 20 min complete the PI example; 10 min VI/PI cost and stopping comparison; 10 min diagnostic exercise, including interpretation of a supplied policy-loss certificate; 5 min questions/overrun. |

**Proof target.** Prove policy improvement and finite termination with a rule that retains an incumbent action when it remains greedy. Interpret and apply a supplied greedy-policy loss certificate; its additional derivation is optional reading. The VI convergence theorem and residual value-error bound are reused, not reproved. Keep LP and modified-PI variants outside the core agenda.

**Student work.** Implement VI and PI on the existing three-state model and a small grid. Confirm agreement with exact policy evaluation and compare Bellman updates, linear solves, and residuals. The goal is to explain the stopping rule, not just obtain matching numbers.

**Selected references.** Primary: [Farahmand module 3][F3], pp. 10–19 and 21–40; [FRL Chapter 3][FRL]. Supplement: Sutton and Barto §§4.1–4.6. Farahmand pp. 43–49 on LP are instructor background or optional reading, not a second full proof topic.

### Session 5 · Finite-horizon DP and online planning · October 20

**Purpose.** Give students the episodic formulation needed for the planning lab and the exploration theory. Then show how to plan when exhaustive backward induction is too expensive.

| Teaching minutes | Content |
|:--|:--|
| 0–45 | 10 min stage-indexed model; 15 min stochastic backward induction and its induction step; 15 min one small stochastic calculation; 5 min questions/overrun. |
| 45–90 | 15 min budget/time augmentation on the same route; 15 min feasible-action and terminal-condition exercise; 10 min backward updates; 5 min questions/overrun. |
| 90–135 | 10 min one-step lookahead; 15 min rollout example; 10 min exact-base-policy improvement argument; 5 min lab handoff; 5 min questions/overrun. |

**Proof target.** Prove the finite-horizon Bellman recursion by backward induction. Give the short exact-rollout improvement argument as an application of policy improvement. Use the same route throughout. Do not add stochastic-shortest-path convergence, MCTS, or a terminal-value approximation-error derivation here.

**Student work.** Construct a route where ignoring the remaining resource produces an infeasible or suboptimal answer. Compare one-step rollout with the base policy. Use a finite horizon or a resource that decreases strictly, so the recursion is well-defined; do not quietly assume an arbitrary cyclic shortest-path instance is acyclic.

**Selected references.** [MIT 6.231 Lecture 2][M2], pp. 2–7 and 9 (DP and augmentation); [Lecture 3][M3], pp. 2–4 (finite-state paths); [Lecture 8][M8], pp. 2–3 and 7–9 (lookahead); [Lecture 9][M9], pp. 2–4 and 9 (rollout). This is the main supplement to Farahmand, whose core planning module is discounted and stationary. MCTS is an optional example of sampling a search tree, not another required algorithm in this meeting.

### Session 6 · Learning from sampled experience · October 27

**Purpose.** Replace exact Bellman expectations with sample targets. This connects the DP block to statistical learning before addressing how the data should be collected.

| Teaching minutes | Content |
|:--|:--|
| 0–45 | 8 min unknown model and data; 10 min incremental averaging and MC targets; 14 min a trajectory calculation; 8 min MC limitations; 5 min questions/overrun. |
| 45–90 | 15 min TD target and its conditional mean; 15 min comparison on the same trajectory; 10 min step sizes and termination; 5 min questions/overrun. |
| 90–135 | 15 min Q-learning target and behavior policy; 13 min numerical updates; 7 min convergence conditions, stated only; 5 min exploration hook or optional SARSA comparison; 5 min questions/overrun. |

**Proof target.** Derive the conditional expectation of the TD and Q-learning sample targets. Identify the estimand: a complete on-policy MC return estimates $V^\pi$, while a TD target has conditional mean $T^\pi V$ for the current value table and history. State the finite discounted tabular convergence result with bounded rewards, appropriate visit-wise step sizes, and sufficient visitation. Do not introduce or prove a general stochastic-approximation theorem in this meeting. For undiscounted episodic variants, give the additional termination/properness caveat rather than inheriting the discounted theorem automatically. SARSA is an optional short target comparison if the three core updates are clear.

**Student work.** Compare MC, TD, and Q-learning targets by hand, with an optional SARSA comparison. Diagnose a failure caused by never visiting an action, separately from a bug caused by bootstrapping after termination. A small Q-learning implementation can be completed after class and revisited in Lab 2.

**Selected references.** [Farahmand module 4][F4], the stochastic-approximation, MC, TD, SARSA, and Q-learning sections; [FRL Chapter 4][FRL]. Sutton and Barto §§5.1, 6.1–6.5 provide a shorter student reading. Full stochastic-approximation and Q-learning convergence proofs in Farahmand are optional preparation for theory-oriented students. Eligibility traces, importance-sampling MC control, and a full Dyna treatment are deferred.

### Session 7 · Lab 1 on resource-constrained planning · November 3

**Purpose.** Test whether students can turn a verbal decision problem into a correct state model and a working DP solver. Preserve the existing lab date and instructor allocation.

**Suggested three-period structure:** (1) 10 minutes to verify the starter runs, 15 for the model specification, 15 for the recurrence and first test, 5 for recovery; (2) 25 minutes to solve/debug, 15 for enumeration and feasibility checks, 5 for recovery; (3) 15 minutes for budget/runtime comparison, 15 for a supplied rollout comparison or continued debugging, 10 for explanations, 5 for recovery. Provide graph loading, visualization, and an enumeration checker. Required outcomes are the correct model, exact solver, and independent checks; rollout is a stretch activity if debugging uses its time.

**Concrete output.** A small reproducible instance, an exact solution, two checks that catch modeling errors, and a short explanation of how runtime grows with the resource budget. An optional stochastic extension uses the same state definition and changes the transition model.

**References.** Sessions 4–5; [MIT Lecture 2][M2], pp. 6–9; [MIT Lecture 3][M3], pp. 2–4; [MIT Lecture 9][M9], pp. 2–4. The final lab handout and assessment remain for the lab instructor to specify; this plan does not create new grading rules.

### Session 8 · Linear bandits: optimism and regret · November 10

**Purpose.** Answer the exploration question left open by Q-learning, then develop one complete regret argument. Introduce the model and algorithm as the proof needs them, using the same two-dimensional example throughout.

| Teaching minutes | Content |
|:--|:--|
| 0–45 | 10 min exploration, regret, and finite-arm UCB intuition; 15 min linear reward model and a two-dimensional example; 15 min ridge estimator, design matrix, and directional uncertainty; 5 min questions. |
| 45–90 | 15 min derive the confidence ellipsoid from a supplied self-normalized inequality; 10 min optimistic action rule; 15 min prove the instantaneous regret–confidence-width inequality; 5 min questions. |
| 90–135 | 20 min prove elliptical potential using the determinant lemma; 15 min complete the regret summation and identify the dimension factors; 5 min interpret the theorem and check assumptions; 5 min questions. |

**Model and notation.** Use $d$ for feature dimension and $n$ for bandit rounds. Let

$$
Y_t=x_t^\top\theta_\star+\eta_t,\qquad
\|x_t\|_2\leq1,\quad \|\theta_\star\|_2\leq1,
$$

with conditionally mean-zero, 1-sub-Gaussian noise. The action is chosen from a revealed set using past observations. Begin with a fixed finite set so students can enumerate its optimistic scores. Define pseudo-regret using mean-reward gaps; its realized sum depends on the chosen actions, whereas expected pseudo-regret averages over the interaction randomness.

**Proof target.** Derive the ridge confidence ellipsoid conditional on a stated self-normalized inequality. Explain why fixed-design concentration cannot simply be applied after conditioning on the entire adaptively selected design. With $V_t=I+\sum_{s\leq t}x_sx_s^\top$, confidence radius $b_t$, and instantaneous mean-reward gap $r_t$, prove

$$
r_t\leq 2b_{t-1}\|x_t\|_{V_{t-1}^{-1}},\qquad
\sum_{t=1}^{n}\|x_t\|_{V_{t-1}^{-1}}^2
\leq 2\log\det V_n\leq 2d\log(1+n/d).
$$

Complete the Cauchy–Schwarz summation to obtain $\widetilde O(d\sqrt n)$ high-probability pseudo-regret. This argument is the main proof of the exploration block. Finite-arm UCB provides intuition only; omit its counting proof and gap-free conversion. The martingale/mixture proof of the concentration theorem is further reading.

**Student preparation and work.** Check ridge normal equations, PSD matrices, matrix-norm Cauchy–Schwarz, sub-Gaussian tails, and the matrix determinant lemma before class. Use the two-dimensional example to compare uncertainty after repeated observations along one axis. If ridge geometry is unfamiliar, provide the confidence ellipsoid and spend its derivation time interpreting it; preserve the optimism, potential, and regret-summation argument. The worksheet asks students to reconstruct these steps and identify where adaptivity matters.

**Selected references.** [Abbasi-Yadkori, Pál, and Szepesvári (2011)][OFUL], Theorems 1–3 and Appendix C, with Appendices A–B for the concentration proof; [Bandit Algorithms][BA], Chapters 19–20, especially Theorem 19.2 and Lemma 19.4. Students taking the research-reading route should work through every proof in the 2011 paper, using the resources page's inequalities and concentration references when needed. That is a guided reading activity beyond the live proof.

### Session 9 · Bandit limits and the connection to linear MDPs · November 17

**Purpose.** Finish the bandit story by showing why its dimension dependence is unavoidable in the worst case. Then use the same reasoning to explain exploration in linear MDPs. The MDP portion should make the algorithm and proof strategy convincing, without developing a second full concentration and regret analysis.

| Teaching minutes | Content |
|:--|:--|
| 0–45 | 5 min recall the upper bound and minimax question; 10 min state and interpret the adaptive-KL/testing lemma; 20 min normalized hypercube, neighboring-instance KL, sign errors, and regret; 5 min check normalization and expected-regret interpretation; 5 min questions. |
| 45–90 | 5 min episodic notation and regret; 10 min linear-MDP model and Bellman closure; 15 min connect bandit regression to LSVI-UCB using a supplied example; 10 min backward optimism and the adaptive-continuation-value issue; 5 min questions. |
| 90–135 | 15 min explain a supplied regret inequality and reuse stagewise elliptical potential; 10 min illustrate the lower-bound hard chain; 10 min explain its scaling and compare upper/lower rates; 5 min consolidate what transfers from bandits and what changes; 5 min questions. |

**Bandit lower-bound proof.** Take $x\in\{\pm1/\sqrt d\}^d$, independent $N(0,1)$ noise, and $\theta_v=\frac18\sqrt{d/n}\,v$ for $v\in\{\pm1\}^d$, with $n\geq d^2$. Supply a precise lemma combining adaptive trajectory-KL decomposition with a testing inequality. Students calculate that neighboring sign vectors have trajectory KL at most $1/32$, so a constant fraction of coordinate decisions must be wrong on average over the instances. Translate those errors into $\Omega(d\sqrt n)$ expected pseudo-regret for some instance. This is a concrete proof conditional on the testing lemma, not a derivation of general information-theoretic machinery. It is a worst-case result for a rich action set, not a claim about every feature set.

Give students a proof scaffold with the three steps—neighboring-instance KL, unavoidable coordinate errors, and regret—and work through the calculations together. The 45-minute period assumes the testing lemma is supplied and interpreted, rather than proved.

**The connection to linear MDPs.** Organize the remaining two periods around the correspondence below. Reuse the confidence-width and potential arguments from Session 8; explain how the Bellman recursion changes their role.

| Linear bandit | Linear MDP |
|:--|:--|
| Regress observed reward on action features | Regress reward plus estimated continuation value on state–action features |
| One design matrix | One design matrix per stage |
| Optimistic action score | Optimistic Bellman backup, clipped to the remaining return range |
| Confidence bounds the instantaneous reward gap | Backward optimism and a regret recursion relate episode loss to confidence bonuses |
| One elliptical-potential sum | Stagewise potential sums, with additional horizon dependence |
| Adaptive actions but directly observed rewards | Fitted continuation values depend on the same data; a fixed-value confidence statement is insufficient |

**Model.** Let $K$ be episodes, $H$ decisions per episode, and **$T=KH$ total environment steps**. Use unknown stage-dependent transitions and known deterministic rewards in $[0,1]$. Define policy-value regret as $R_K=\sum_{k=1}^K[V_1^\star(s_1^k)-V_1^{\pi_k}(s_1^k)]$, not the gap between an optimal value and a realized noisy return. A known feature map $\phi(s,a)\in\mathbb R^d$ satisfies

$$
r_h(s,a)=\phi(s,a)^\top\theta_h^r,\qquad
P_h(\mathrm ds'\mid s,a)=\phi(s,a)^\top\mu_h(\mathrm ds').
$$

State $\|\phi\|_2\leq1$, $\|\theta_h^r\|_2\leq\sqrt d$, and the bounded linear-operator condition $\|\int f\,\mathrm d\mu_h\|_2\leq\sqrt d\|f\|_\infty$. The resulting kernels must be valid probability laws. These assumptions make $r_h+P_hV$ linear for every bounded continuation value $V$. They are stronger than merely assuming that $Q_h^\star$ is linear. They are also different from a linear-mixture model with known next-state-dependent features and an unknown finite parameter vector.

**MDP explanation target.** Show the short Bellman-closure identity and explain backward optimism using a supplied uniform prediction-confidence statement. Display the telescoped regret inequality, identify its bonus and martingale terms, and connect the bonus sum to the bandit potential bound. Explain the lower bound through a chain of hard local decisions and the effect of later rewards. Students should be able to reconstruct this proof outline and say where the bandit tools enter. Full concentration, regret-recursion, visitation, and lower-bound testing proofs are further reading. The dependence of fitted continuation values on the data is a real additional difficulty; the bandit concentration theorem cannot simply be reused unchanged.

**Live versus reference material.** Use a precomputed backward regression example. Compare the first two rows of the rate table in class; keep the precise normalization and lower-bound regime in the notes. The LSVI-UCB++ row is optional reading, with no live proof or algorithm discussion. The MDP portion is 90 minutes of algorithm, analogy, and proof outline, rather than an abbreviated promise of a full proof.

**Rate comparison.** These expressions use per-step rewards in $[0,1]$ and allow stage-dependent unknown dynamics. Logarithmic factors are suppressed by $\widetilde O$.

| Result | In episodes $K$ | In steps $T=KH$ | Interpretation |
|:--|:--|:--|:--|
| Classical LSVI-UCB | $\widetilde O(d^{3/2}H^2\sqrt K)$ | $\widetilde O(\sqrt{d^3H^3T})$ | High-probability upper bound; its proof outline is explained in class |
| Linear-MDP lower bound | $\Omega(dH^{3/2}\sqrt K)$ | $\Omega(dH\sqrt T)$ | Worst-case expected regret; appropriate large-sample regime |
| LSVI-UCB++ | $\widetilde O(d\sqrt{H^3K}+d^7H^8)$ | $\widetilde O(dH\sqrt T+d^7H^8)$ | Matching leading term only once the additive term is dominated |

The classical upper and lower bounds differ by $\sqrt{dH}$. Do not call classical LSVI-UCB minimax optimal. A safe sufficient regime for the displayed lower bound is $H\geq3$, $d\geq5$, and $K\geq C d^2H$ for a sufficiently large constant $C$; it cannot be extended into regimes where it exceeds the total possible regret $KH$. Upper and lower statements have different probability quantifiers; choose total failure probability at most $1/T$ when converting a high-probability bound to an expectation comparison, so the failure-event contribution is at most one.

**Student work.** Reconstruct the bandit sign-error argument and explain why two arms embedded in a high-dimensional space need not incur the rich-action-set lower bound. For the MDP extension, compute one backward regression-and-bonus update and identify which bandit steps transfer and which confidence statement changes. As follow-up exercises, convert the rates between $K$ and $T$ and explain why linear $Q^\star$ does not imply a linear MDP; a zero-reward MDP provides a useful starting point.

**Selected references.** For the bandit lower proof, [Bandit Algorithms][BA], §24.1/Theorem 24.1; the classroom construction rescales its hypercube example. [Dani, Hayes, and Kakade][DHK], Theorem 3, is an original reference. For the MDP connection, [Jin, Yang, Wang, and Jordan][LSVI], Assumption A, Algorithm 1, Theorem 3.1, and Lemmas B.3–B.6; Lemmas D.4 and D.6 contain the uniform concentration and covering arguments for further reading. [Zhou, Gu, and Szepesvári][MDPLOW], Theorem 8 and Appendix E, especially Remark 23, supply the linear-MDP lower construction after a feature-dimension adjustment; do not import a linear-mixture upper bound into this model. [He et al.][LSVIPLUS], Theorem 5.1, is the optional advanced comparison. The [UCSB linear-MDP slides][UCSBLIN], particularly pp. 7–9, support instructor preparation for the model and operator bound.

### Session 10 · Value approximation and deep Q-learning · November 24

**Purpose.** Move from a known linear representation with a theorem to learned nonlinear value approximators. Explain what remains a Bellman update and which guarantees no longer follow.

| Teaching minutes | Content |
|:--|:--|
| 0–45 | 10 min recall Q-learning and motivate features; 15 min fitted Q iteration and semi-gradient updates; 10 min trace a target and fitted function on a small example; 10 min questions/overrun. |
| 45–90 | 10 min why approximation, off-policy data, and bootstrapping can be unstable; 30 min DQN loss, replay, target network, and collect/update loop; 5 min questions. |
| 90–135 | 25 min trace one supplied minibatch and its gradient; 10 min terminal masks and external time limits; 5 min training versus evaluation returns; 5 min check/questions. |

**Derivation target.** Starting from a sampled Bellman target, derive

$$
y=r+\gamma(1-z)\max_{a'}Q_{\bar\theta}(s',a'),\qquad
L(\theta)=\frac{1}{B}\sum_{i=1}^B\bigl(Q_\theta(s_i,a_i)-y_i\bigr)^2.
$$

Here $z$ indicates a true terminal transition and $\bar\theta$ is held fixed. Explain why an external time limit may require different handling from task termination; a genuine finite-horizon task should include the remaining time in the state. Replay and target networks improve practical stability but do not supply a general convergence theorem.

**Student work.** Check a tiny batch by hand, then inspect a DQN implementation. Remove replay or target-network updates in a controlled demonstration and ask which claim the experiment can support. Do not require training Atari during a lecture or lab.

**Selected references.** [Farahmand module 5][F5], pp. 5–15, 25–28, 94–100, and 124–135; [FRL][FRL] §§5.1–5.2.2, 5.3.2, and 5.4. These support representation, fitted iteration, and semi-gradients; they do not provide a full DQN implementation lesson. Add [Mnih et al.][DQN], the loss and Methods/Algorithm 1 (PDF p. 7), and the [PyTorch DQN tutorial][TORCHDQN]. LSTD, LSPI, projected-equation proofs, formal approximation-error propagation, and DQN variants remain outside the live agenda. Assume familiarity with a parameterized function, squared loss, and gradient descent; a neural-network/backpropagation introduction is not included in these 135 minutes.

### Session 11 · Policy gradients and actor–critic · December 1

**Purpose.** Optimize the policy directly, with a value estimate serving as a variance-reduction and credit-assignment tool. This is the mathematical preparation for RL with language models.

| Teaching minutes | Content |
|:--|:--|
| 0–45 | 5 min recall a parameterized softmax policy and objective; 10 min trajectory probabilities; 25 min derive the score-function estimator and REINFORCE; 5 min questions. |
| 45–90 | 10 min reward-to-go; 15 min derive the state-baseline identity; 10 min a two-action gradient calculation; 10 min questions/overrun. |
| 90–135 | 20 min a simple actor–critic update and TD advantage; 15 min one actor/critic calculation with detached targets; 5 min critic bias and motivation for controlling policy changes; 5 min questions. PPO is taught next meeting. |

**Proof target.** Complete the finite-horizon score-function derivation and the baseline identity. Show the critic's update and the actor's corresponding update on one transition. Hold sampled advantage estimates fixed when differentiating the actor objective. Use one simple on-policy actor–critic variant; continuing-task policy-gradient proofs, GAE, natural gradients, and PPO belong outside this meeting.

**Student work.** Derive REINFORCE for a two-action policy and compute one actor/critic update. A diagnostic should ask why a state-only baseline is valid and an arbitrary action-dependent baseline is not automatically valid. The clipping exercise follows with PPO in Session 12.

**Selected references.** [Farahmand module 6][F6], pp. 51–63, 69–71, and 91–95; [FRL][FRL] §6.1 and §§6.3.2–6.3.3. The continuing-task policy-gradient theorem on slides 76–85 is a useful parallel reading; keep its discounted-occupancy normalization distinct from the episodic derivation. [Schulman et al., PPO][PPO], §3 and §5/Algorithm 1, is preparation for Session 12. GAE, TRPO, and SAC are further reading; do not add them to the actor–critic block.

### Session 12 · PPO: objective and training loop · December 8

**Purpose.** Turn the policy-gradient estimator into an update procedure students can inspect and explain. Develop the old-policy surrogate, interpret clipping, and trace what happens when a rollout batch is reused for several updates.

| Teaching minutes | Content |
|:--|:--|
| 0–45 | 10 min recall the actor update and motivate sample reuse; 15 min derive the old-policy action-ratio surrogate; 15 min distinguish reweighting actions from correcting a changed state distribution; 5 min questions. |
| 45–90 | 15 min PPO clipped objective; 15 min positive- and negative-advantage examples; 10 min explain why clipping is not a hard KL constraint or a monotonic-improvement guarantee; 5 min questions. |
| 90–135 | 10 min rollout data and fixed advantage/value targets; 20 min trace collection, minibatches, repeated updates, and refresh on a supplied example; 10 min interpret KL, clipping fraction, and held-out return; 5 min questions. |

**Derivation target.** For data from $\pi_{\mathrm{old}}$, define $\rho_\theta(s,a)=\pi_\theta(a\mid s)/\pi_{\mathrm{old}}(a\mid s)$ and interpret

$$
L^{\mathrm{clip}}(\theta)=\widehat{\mathbb E}\!\left[\min\left\{\rho_\theta\widehat A,\ \operatorname{clip}(\rho_\theta,1-\epsilon,1+\epsilon)\widehat A\right\}\right].
$$

Derive the action-ratio identity under the old state distribution and explain why it is a local surrogate for policy improvement, not an exact expression for the new policy's return. Hold the old log-probabilities and sampled advantage estimates fixed during the updates. Work both advantage signs and identify where the objective becomes flat in the favorable direction. Clipping does not enforce a hard bound on all probability ratios or on KL divergence.

**Worked training example.** Reuse the small policy from Session 11. Supply one rollout batch, return targets, and simple return-minus-baseline advantages; follow the actor loss, critic loss, two parameter updates, and a new collection step. Explain why PPO's repeated updates on recent on-policy data do not turn it into arbitrary replay-based off-policy learning. GAE, entropy bonuses, and implementation variants can be mentioned in the reading notes, but their derivations are outside the core example.

**Student work.** Compute the surrogate before and after clipping on a batch with mixed advantage signs. Diagnose a trace in which the denominator is recomputed from the changing policy, or stale rollouts continue to be reused while KL rises. State what the diagnostics reveal and what they cannot guarantee about return.

**Selected references.** [Schulman et al., PPO][PPO], §§2–3 and §5/Algorithm 1. [Farahmand module 6][F6] and [FRL][FRL] supply the preceding policy-gradient and baseline background. TRPO's performance bound, natural-gradient optimization, and a full GAE derivation are optional reading. Keep the live meeting centered on one objective and one training loop.

### Session 13 · Reinforcement learning for language models · December 15

**Purpose.** Show how the same policy-update machinery operates when actions are tokens and feedback evaluates a response. Make reward sources, optimization methods, and evaluation protocols distinct concepts.

| Teaching minutes | Content |
|:--|:--|
| 0–45 | 10 min token generation as a policy; 15 min SFT, preferences, and a supplied reward-model loss; 15 min reference-policy KL and the RLHF pipeline; 5 min questions. |
| 45–90 | 15 min connect PPO to GRPO and group-relative advantages; 15 min one response-group/verifier exercise; 10 min trace the training loop and identify frozen components; 5 min questions. |
| 90–135 | 20 min interpret DPO's supplied loss and contrast its data and updates with online RL; 15 min compare the methods on the same response-generation example; 5 min distinguish optimization objectives from independent evaluation; 5 min questions. |

**Derivation target.** Reuse the PPO ratio and clipping from Session 12. Display and interpret the preference-model loss and KL-regularized objective; do not derive both from first principles. Derive the group-relative advantage and calculate it for one response group, including the all-equal-reward case. GRPO removes the learned value critic in this construction, not the need for reward design or rollout generation. Distinguish the old-policy ratio, which supports the update, from the reference-policy KL term, which changes the training objective. Interpret DPO's supplied loss and identify its preference data and reference model; leave the reward–policy reparameterization and consistency proof to further reading.

**Preparation and limits.** Students need categorical probabilities, log-likelihood, and the idea of next-token prediction. Use a supplied token-probability example to check those ideas. This is a focused introduction to LLM post-training, without transformer architecture, distributed training, or a survey of preference-optimization variants.

**Student work.** Annotate a training diagram with the trainable policy, reference policy, optional reward model, rollout data, and optimizer. Identify which components are frozen. Explain why a verifier passing an answer does not necessarily validate every reasoning step, and why weak unit tests can reward incorrect code.

**Selected references.** [InstructGPT][RLHF], §§3.1 and 3.5, for the preference/SFT/reward-model/PPO pipeline; [DeepSeekMath][GRPO], §§4.1.1–4.1.2, for PPO-to-GRPO and outcome-based advantages; [DeepSeek-R1, original v1][R1], §§2.2.1–2.2.2, for rule-based rewards, and §2.3 for the later multi-stage pipeline. SFT is common but not a universal prerequisite for RL; R1-Zero illustrates that distinction. [Rafailov et al., DPO][DPO], §§3–4 and Eqs. (4)–(7), support the preference-method comparison. [Stanford CS224R preference optimization][STANPREF] and [reasoning][STANREASON] are useful explanatory slides. The [TRL GRPO documentation][TRLGRPO] is optional implementation reading; verl/slime belong in follow-on projects rather than a framework installation lecture.

### Session 14 · LLM evaluation and introductory multi-agent RL · December 22

**Purpose.** Evaluate the evidence for an LLM training result, then show what changes when other agents also choose strategies. The multi-agent segment is an introduction built around one algorithmic decomposition, not a survey of MARL.

| Teaching minutes | Content |
|:--|:--|
| 0–45 | 10 min define the LLM evaluation question and held-out task set; 15 min inspect training reward versus independent task success; 10 min compare sampling budgets and missing controls; 10 min questions/overrun. |
| 45–90 | 15 min a two-player zero-sum matrix game, mixtures, best responses, and equilibrium; 25 min work through double-oracle expansion on the same game; 5 min questions. |
| 90–135 | 20 min lift the example to policy populations and PSRO, with single-agent RL as an approximate best-response oracle; 5 min what the restricted game and approximate oracle can certify; 5 min students explain the loop; 10 min synthesis and Lab 2 preparation; 5 min questions. |

**LLM evaluation exercise.** Give students a result with rising training reward and declining independent evaluation and ask what evidence is missing. Compare methods at a stated sampling or compute budget, distinguish training prompts from held-out tasks, and check whether the reward or verifier measures the intended task. Use the Session 13 method comparison as background rather than introducing another objective. In Gao et al.'s experiment, the “gold reward” is another model, not a direct measurement of ground-truth human utility.

**MARL algorithmic target.** Students should be able to draw and explain this loop:

1. Maintain finite policy populations and estimate their payoff matrix.
2. Compute a mixture over the current populations, using a restricted-game equilibrium solver in the two-player zero-sum example.
3. Hold the opponent mixture fixed and train a new response with single-agent RL.
4. Evaluate the new policy, add it to the population, and repeat.

Explain two qualifications while drawing the loop. A restricted equilibrium need not be an equilibrium of the full game. Exact finite double oracle requires exact payoffs, equilibrium solutions, and full-space best responses; approximate PSRO does not inherit a general neural-RL convergence guarantee. **Instructor note, outside the core explanation:** if an opponent's hidden policy is sampled once per episode, the physical state alone need not be Markov for the responder; history or an appropriate augmented state may be required. Do not label an equilibrium over complete policies from an initial distribution automatically “Markov perfect.” Retain these qualifications in the notes without adding a separate lecture on equilibrium refinements.

**Selected references.** [Gao et al.][OVEROPT], Figure 1 and §2.1, for the evaluation case. For MARL, use only two primary papers: [McMahan, Gordon, and Blum][DO], §4.2 and Theorem 1 (PDF pp. 6–7), and [Lanctot et al., PSRO][PSRO], §§2–3 and Algorithm 1 (PDF pp. 2–4). The first paper's oracle is principally planning in its model; the second supplies the explicit connection to RL-trained policy responses. [Roughgarden Lectures 13 and 17–18][AGT] provide optional equilibrium/no-regret background. V-learning, general-sum learning guarantees, and MARL sample-complexity proofs are outside this introductory segment.

### Session 15 · Lab 2 on learning and evaluation · December 29

**Purpose.** Close the loop from a known-model DP solution to learning from interactions and interpreting experimental evidence. Preserve the existing second lab date and instructor allocation.

**Suggested environment.** A small stochastic, finite-horizon route or grid problem with a resource budget. The instructor can compute an exact DP reference from the simulator's model, while the learner receives only sampled transitions. Use stage-augmented states and the same horizon, discount factor, reward definition, terminal condition, and initial-state distribution for both methods. This gives students a meaningful optimality gap without requiring a large neural-network run.

**Suggested three-period structure:** (1) 10 minutes for the task/checks, 25 to complete or inspect one update, 10 for debugging; (2) 15 minutes to diagnose a supplied bug, 20 for short controlled runs and comparisons, 10 for debugging; (3) 20 minutes to analyze results, 15 for a concise report, 10 for recovery. Provide the exact DP reference, evaluation/plotting harness, and most of the learner code. Test runtime beforehand and supply saved results for students whose run fails. Building and debugging the whole learner from scratch does not fit this lab.

**Concrete output.** A reproducible small experiment, a comparison with the exact reference, and an explanation separating modeling, optimization, exploration, and evaluation failures. Optionally supply a small DQN implementation or precomputed training runs for analysis. A tiny LLM reward-auditing exercise may be an alternative extension, but required work should run without access to GPUs or a paid API.

**References.** Session 6 and Sessions 10–14; [Farahmand module 4][F4], pp. 62–68; the [PyTorch DQN tutorial][TORCHDQN] if the neural extension is used; [Agarwal et al., Deep RL at the Edge of the Statistical Precipice][EVAL], especially its motivation and interval-estimation examples. The number of seeds and statistical claims must reflect the available budget; a handful of runs is a classroom demonstration, not a definitive benchmark result.

## How to use Farahmand's remaining materials

Use the [dated Fall 2025 archive][FCOURSE], rather than its changing current-course homepage. The seven numbered slide modules are topic units, not seven single meetings. The notes chapter/page pointers below refer to the archived **November 18, 2025** copy already in the workspace; printed notes pages differ from PDF page numbers. Slide page numbers refer to clean PDFs. The online notes may change.

| Farahmand module | Selection for this course | What needs another source or original teaching material |
|:--|:--|:--|
| 3, Planning with a Known Model | Session 4: pp. 8–19, 21–42; notes §§3.2–3.4.1, selected printed pp. 73–86 | Worked comparisons and practical stopping decisions; finite-horizon DP is a separate supplement |
| 4, Learning from a Stream of Data | Session 6: pp. 16–18, 23, 35–40, 43–55, 62–68; convergence conditions on pp. 74–76 and 83–84; notes §§4.3–4.4, 4.6–4.8 | A common trajectory exercise; first-visit MC clarification; complete stochastic-approximation proof remains further reading |
| 5, Value Function Approximation | Session 10: representation, approximate/fitted Bellman updates, semi-gradients; notes §§5.1–5.2.2, 5.3.2, 5.4 | DQN replay, targets, terminal masks, and training loop. Correct the next-state typo on slide 134 if adapting it |
| 6, Policy Search | Session 11: score-function derivation, baselines, REINFORCE, and actor–critic; notes §6.1 and §§6.3.2–6.3.3 | A worked actor/critic update; PPO has a separate worked session in Session 12. Skip zero-order search and finite-difference optimization |
| 7, Model-Based RL | Optional synthesis: pp. 8–11 for Dyna and pp. 13–21 for model error and planner/distribution choices | Not a substitute for online planning, exploration guarantees, or LLM/MARL material. The archived notes do not contain Chapter 7 |

The strongest reuse is mathematical structure and selected derivations. Add the missing examples and implementation details. Keep notation consistent with the existing slides: discounted stationary $(V^\pi,Q^\pi,\gamma)$ first; explicitly introduce episodic $(V_h^\pi,Q_h^\pi,H,K)$ in Session 5 and reuse it in Sessions 9 and 11–14.

## Pacing and student workload

### Depth commitments

| Complete in class | Complete conditional on a stated lemma | Explain the construction or objective; assign the full proof as further reading |
|:--|:--|:--|
| PI improvement and termination; finite-horizon induction; expected sampled targets; elliptical potential; score-function and baseline identities | OFUL upper bound given self-normalized confidence; linear-bandit lower bound given an adaptive-KL/testing lemma | LSVI-UCB via the bandit connection, including the additional uniform-confidence requirement; linear-MDP lower construction and rates; stochastic-approximation convergence; modern optimal-rate proof; DPO reparameterization; double-oracle theorem |

“Conditional” is explicit: students should know the lemma's statement, assumptions, and where it enters. This keeps the theory substantive while making the time budget credible. Full paper mastery is a follow-on research activity, not an implied promise to cover every appendix in class.

### Suggested practice sequence

These are proposed learning activities, not new graded releases or deadlines.

1. **After Session 5:** VI/PI and finite-horizon modeling; prepare the state model for Lab 1.
2. **After Session 6:** one hand-computed trajectory and a minimal tabular learning implementation.
3. **Across Sessions 8–9:** one connected exploration worksheet, from the confidence ellipse to potential bounds, testing, and an optimistic MDP backup. Require a careful bandit argument and an explanation of the MDP correspondence; separate optional full-paper proofs.
4. **Across Sessions 10–12:** inspect a DQN update, derive a policy-gradient/actor–critic update, then work the PPO clipping and training-loop example. A small CPU example or supplied trace is sufficient.
5. **After Sessions 13–14:** classify an LLM training loop and audit its evaluation, then explain the PSRO loop. Prepare the evaluation table for Lab 2.

For most weeks, select a short core reading from the ranges above, with the remaining material labeled instructor preparation or optional depth. Do not assign entire long Farahmand decks or every cited research paper as routine weekly reading.

### If the class needs more time

Use the reserved time for its intended purpose. Do not fill it in advance with LP, modified PI, general stochastic approximation, GAE, DQN variants, or DPO algebra: these have already been removed from the core. In Session 4, supply the additional policy-loss certificate rather than deriving it. In Session 6, omit the optional SARSA comparison. In Session 9, keep the modern MDP rate in optional reading and preserve the bandit-to-MDP correspondence. If the bandit proof needs another 15 minutes, use a shorter MDP hard-instance illustration and move detailed rate bookkeeping to the worksheet.

Check the bandit matrix prerequisites and the deep-RL gradient prerequisites before their respective blocks. If ridge geometry is unfamiliar, supply the confidence ellipsoid and teach its meaning in Session 8; keep the OFUL upper-bound argument intact in Session 8. If adaptive testing is new, state its lemmas and spend time on the concrete hard instances. A handout is a reference, not evidence that the class has learned its contents.

The deliberate depth choice is to teach the bandit proof carefully and use it to motivate the linear-MDP argument. Full proofs of the MDP concentration lemma, regret recursion, and lower bound are not live-course commitments. Students interested in theory can continue with the cited papers; the lecture should leave them knowing both why the bandit ideas transfer and where additional work is needed.

## Reference links

All primary references below are tied to a specific use above. Local archived copies of the Farahmand and MIT course PDFs are in `Resource/ReferenceCourse/` in the teaching workspace. Paper section/theorem identifiers are preferable to page numbers if a live PDF is revised.

- **Farahmand:** [2025 course][FCOURSE]; [Foundations of Reinforcement Learning][FRL]; [Introduction][F1]; [MDP structure][F2]; [Planning][F3]; [Learning from data][F4]; [Value approximation][F5]; [Policy search][F6]; [Model-based RL][F7].
- **Dynamic programming:** [MIT 6.231 lecture collection][MIT]; selected [Lecture 2][M2], [Lecture 3][M3], [Lecture 8][M8], and [Lecture 9][M9]. [Sutton and Barto, second edition][SB] supplies the shorter complementary textbook selections.
- **Bandits:** [Lattimore and Szepesvári, Bandit Algorithms][BA]; [Improved Algorithms for Linear Stochastic Bandits][OFUL]; [Stochastic Linear Optimization under Bandit Feedback][DHK].
- **Linear MDPs:** [Provably Efficient Reinforcement Learning with Linear Function Approximation][LSVI]; [Nearly Minimax Optimal Reinforcement Learning for Linear Mixture Markov Decision Processes][MDPLOW] (Appendix E/Remark 23 for the linear-MDP lower bound); [Nearly Minimax Optimal Reinforcement Learning for Linear Markov Decision Processes][LSVIPLUS]; [UCSB lecture][UCSBLIN].
- **Deep RL:** [Human-level Control through Deep Reinforcement Learning][DQN]; [Proximal Policy Optimization Algorithms][PPO]; [PyTorch DQN tutorial][TORCHDQN]; [Deep RL at the Edge of the Statistical Precipice][EVAL].
- **Language models:** [Training Language Models to Follow Instructions with Human Feedback][RLHF]; [Direct Preference Optimization][DPO]; [DeepSeekMath][GRPO]; [DeepSeek-R1 v1][R1]; [Scaling Laws for Reward Model Overoptimization][OVEROPT]; Stanford [preference][STANPREF] and [reasoning][STANREASON] slides; optional [TRL GRPO documentation][TRLGRPO].
- **Multi-agent introduction:** [Planning in the Presence of Cost Functions Controlled by an Adversary][DO]; [A Unified Game-Theoretic Approach to Multiagent Reinforcement Learning][PSRO]; [Roughgarden's Algorithmic Game Theory][AGT].

[FCOURSE]: https://amfarahmand.github.io/IntroRL/fall2025.html
[FRL]: https://amfarahmand.github.io/IntroRL/lectures2025/FRL.pdf
[F1]: https://amfarahmand.github.io/IntroRL/lectures2025/lec01.pdf
[F2]: https://amfarahmand.github.io/IntroRL/lectures2025/lec02.pdf
[F3]: https://amfarahmand.github.io/IntroRL/lectures2025/lec03.pdf
[F4]: https://amfarahmand.github.io/IntroRL/lectures2025/lec04.pdf
[F5]: https://amfarahmand.github.io/IntroRL/lectures2025/lec05.pdf
[F6]: https://amfarahmand.github.io/IntroRL/lectures2025/lec06.pdf
[F7]: https://amfarahmand.github.io/IntroRL/lectures2025/lec07.pdf
[MIT]: https://ocw.mit.edu/courses/6-231-dynamic-programming-and-stochastic-control-fall-2015/pages/lecture-notes/
[M2]: https://ocw.mit.edu/courses/6-231-dynamic-programming-and-stochastic-control-fall-2015/2beec55b0de261096962e514febe3b5c_MIT6_231F15_Lec2.pdf
[M3]: https://ocw.mit.edu/courses/6-231-dynamic-programming-and-stochastic-control-fall-2015/87189f338e62a05e4a7fd12198797381_MIT6_231F15_Lec3.pdf
[M8]: https://ocw.mit.edu/courses/6-231-dynamic-programming-and-stochastic-control-fall-2015/33112a488f35e58822c146198cc41528_MIT6_231F15_Lec8.pdf
[M9]: https://ocw.mit.edu/courses/6-231-dynamic-programming-and-stochastic-control-fall-2015/5839a0924a3a8aac2413fff653a1a8d4_MIT6_231F15_Lec9.pdf
[SB]: http://incompleteideas.net/book/the-book-2nd.html
[BA]: https://tor-lattimore.com/downloads/book/book.pdf
[OFUL]: https://yasinov.github.io/linear-bandits-nips2011.pdf
[DHK]: https://homes.cs.washington.edu/~sham/papers/ml/bandit_linear_long.pdf
[LSVI]: https://arxiv.org/pdf/1907.05388
[MDPLOW]: https://proceedings.mlr.press/v134/zhou21a/zhou21a.pdf
[LSVIPLUS]: https://proceedings.mlr.press/v202/he23d/he23d.pdf
[UCSBLIN]: https://cseweb.ucsd.edu/~yuxiangw/classes/RLCourse-2021Spring/Lectures/Exploration_LinearMDP.pdf
[DQN]: https://storage.googleapis.com/deepmind-media/dqn/DQNNaturePaper.pdf
[PPO]: https://arxiv.org/pdf/1707.06347
[TORCHDQN]: https://docs.pytorch.org/tutorials/intermediate/reinforcement_q_learning.html
[EVAL]: https://arxiv.org/abs/2108.13264
[RLHF]: https://arxiv.org/pdf/2203.02155
[DPO]: https://arxiv.org/pdf/2305.18290
[GRPO]: https://arxiv.org/pdf/2402.03300
[R1]: https://arxiv.org/pdf/2501.12948v1
[OVEROPT]: https://arxiv.org/pdf/2210.10760
[STANPREF]: https://cs224r.stanford.edu/slides/09_cs224r_rlhf_2026.pdf
[STANREASON]: https://cs224r.stanford.edu/slides/10_cs224r_rl_for_llms_reasoning_2026.pdf
[TRLGRPO]: https://huggingface.co/docs/trl/grpo_trainer
[DO]: https://www.cs.cmu.edu/~ggordon/mcmahan-ggordon-blum.icml2003.pdf
[PSRO]: https://mlanctot.info/files/papers/nips17-psro.pdf
[AGT]: https://timroughgarden.org/f13/f13.html

[MITTIME]: https://ocw.mit.edu/courses/6-231-dynamic-programming-and-stochastic-control-fall-2015/pages/syllabus/
[UCSBCOURSE]: https://cseweb.ucsd.edu/~yuxiangw/classes/RLCourse-2021Spring/
[STANCOURSE]: https://cs224r.stanford.edu/
[BERKELEYCOURSE]: https://rail.eecs.berkeley.edu/deeprlcourse/
