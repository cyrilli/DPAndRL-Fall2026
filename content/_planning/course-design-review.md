---
title: Independent review of the course design
subtitle: Dynamic Programming and Reinforcement Learning · Fall 2026
date: 2026-10-01
format:
  html:
    theme: cosmo
    toc: true
    toc-depth: 2
    embed-resources: true
    html-math-method: katex
    fontsize: 17px
    linestretch: 1.55
    include-in-header:
      text: |
        <style>
        .table { font-size: .93rem; line-height: 1.5; }
        .table td { vertical-align: top; }
        #the-settings-students-should-distinguish col:first-child { width: 24% !important; }
        #the-settings-students-should-distinguish col:nth-child(2) { width: 44% !important; }
        #the-settings-students-should-distinguish col:nth-child(3) { width: 32% !important; }
        #lecture-by-lecture-setting-map col:first-child { width: 12% !important; }
        #lecture-by-lecture-setting-map col:nth-child(2) { width: 40% !important; }
        #lecture-by-lecture-setting-map col:nth-child(3) { width: 48% !important; }
        </style>
---

## Judgment

**Keep the broad sequence. Make changes of mathematical setting explicit, provide the missing preparation, and simplify the linear-MDP portion of Lecture 9.** Starting with infinite-horizon discounted theory and later teaching finite-horizon DP is a defensible design with precedents. Omitting full stochastic-shortest-path and average-reward theory is also a reasonable scope choice.

The main risk is that students carry theorems or interpretations into a new setting without noticing which assumptions changed. A second risk is that the theory and deep-RL blocks assume skills beyond the advertised prerequisites. These are more consequential than whether finite-horizon DP comes before discounted DP.

There is also a concrete boundary-specification problem in the original resource-allocation slides, verified against the rendered PDF. It should be corrected when that example is reused.

This report reviews the [current semester proposal](semester-plan.html). It records recommendations; it does not revise the proposal or the published schedule.

## How the blind review was conducted

Three sub-agents reviewed the course in separate fresh contexts:

- **Formulations reviewer:** mathematical assumptions, objectives, theorem scope, and missing bridges.
- **Student-understanding reviewer:** likely misconceptions, prerequisites, examples, and cognitive load.
- **Comparative reviewer:** actual official schedules and teaching materials from four relevant courses.

They received the proposed agendas and source references, plus text extracted from the first three posted slide decks. The earlier conversation, our rationale, the previous pacing audit, and earlier review conclusions were withheld. They did not consult one another. The advertised prerequisites—probability, linear algebra, calculus, and Python—were supplied as course evidence.

The synthesis below distinguishes observed specification defects from teaching risks and legitimate scope choices. I checked the reviewers' claims against the plan and original slides, including visual inspection of Lecture 1 slides 18 and 26–28. These are independent agent assessments, not measurements of actual student comprehension. Agreement among reviewers is useful evidence of salience, not proof of a defect.

## The settings students should distinguish

Horizon, termination, and discounting are separate choices. A finite-horizon task can be discounted; an episodic task can have a random, unbounded stopping time; a continuing task can use either discounted return or an average-reward objective.

| Setting | What defines the objective and solution | Role in this course |
|:--|:--|:--|
| Infinite-horizon discounted | Bounded rewards and $\gamma<1$ give bounded values. In the finite stationary model, contraction supports fixed-point uniqueness, VI/PI, and stationary optimal policies. | Main theory in Lectures 2–4; the principal tabular learning guarantee in Lecture 6. |
| Fixed finite horizon | A terminal condition and stage-indexed Bellman recursion determine the solution by backward induction. $\gamma=1$ is allowed. Policies may depend on remaining time. | Lecture 5; the episodic linear-MDP theory in Lecture 9; a suitable formulation for Lectures 11–13 and the final lab. |
| Random termination / stochastic shortest path | Total reward or cost is accumulated until termination. At $\gamma=1$, termination, integrability, and assumptions about improper policies matter; the discounted proof does not automatically apply. | Recognize the setting and explain the boundary. Full SSP convergence theory can remain optional. |
| Continuing average reward | Optimize a long-run reward rate. This is a different criterion from undiscounted cumulative reward and has different Bellman theory. | Briefly identify the objective and give an application; full gain/bias and structural theory can remain optional. |

For example, a continuing one-state process earning one per step has divergent undiscounted total reward but average reward one. Simply substituting $\gamma=1$ into a discounted value formula does not produce an average-reward method.

Adding time to the state makes a finite-horizon policy stationary on the **augmented** state space. It does not make the undiscounted operator a strict contraction in the ordinary sup norm or validate the old $1/(1-\gamma)$ error certificates.

## Lecture-by-lecture setting map

The distinction between the setting taught in a lesson and every setting in which an algorithm can operate should stay explicit.

| Lecture | Current or intended formulation | Bridge students need |
|:--|:--|:--|
| 1 | Deterministic finite-stage allocation, random resource consumption, then general RL/MDP motivation. | Distinguish decision stage from remaining resource; specify feasible actions and boundary outcomes. |
| 2 | Finite and randomly terminating returns are introduced; slide 17 switches to stationary continuing discounted tasks. | “Finite MDP” means finite state/action sets, not necessarily a finite horizon. |
| 3 | Finite, fully observed stationary MDP; bounded rewards; $\gamma<1$. | Keep these assumptions attached to contraction, residual bounds, and stationary-policy optimality. |
| 4 | Same known-model discounted setting; VI and PI. | An algorithm iteration is not a physical decision stage. Reuse the established theorems. |
| 5 | Known finite-horizon model and resource/time augmentation; exact-base-policy rollout. | Backward induction and stage dependence replace the fixed-point argument. A decreasing resource must give a finite, well-founded recursion. |
| 6 | MC/TD policy evaluation, followed by Q-learning control; discounted tabular convergence is the theorem being stated. | Declare termination and discounting for the example. Announce the change from estimating $V^\pi$ to learning $Q^\star$. |
| 7 | Known constrained route model; exact DP and checks. | This is finite-horizon or resource-decreasing planning, not an arbitrary cyclic SSP solver. |
| 8 | Linear rewards, unknown parameter, adaptive actions, regret over bandit rounds. | Regret is cumulative learning performance. The number of bandit rounds is not an MDP episode horizon. |
| 9 | Bandit lower bound, then fixed-horizon linear MDPs with known rewards and unknown transitions. | Explain what remains unknown when rewards are known, and why the regression label now contains an estimated continuation value. |
| 10 | Fitted Q/DQN, discounted targets and nonlinear approximation. | Choose the example's horizon explicitly. Bellman targets survive; tabular convergence and linear-MDP confidence guarantees do not follow. |
| 11 | Finite-horizon policy-gradient derivation and one actor–critic variant. | Fix the objective and discount convention. A stage-dependent critic needs time in its input or an explicit stage index. |
| 12 | PPO using old-policy trajectories and repeated updates. | The action ratio does not exactly correct changed state visitation. Keep old probabilities and sampled advantages fixed. |
| 13 | Token-prefix policy, terminal response feedback, reference KL, GRPO/DPO. | Specify EOS, maximum length, and how capped generations are scored. Empirical group weights are not automatically unbiased advantages. |
| 14 | LLM evaluation, then restricted zero-sum policy games and approximate best-response learning. | A restricted equilibrium is not a full-game equilibrium; a hidden fixed opponent policy may require history in the responder's state. |
| 15 | Finite-horizon learner compared with a known-model DP solution. | Match horizon, discount, reward, terminal conditions, and initial-state distribution. The plan already states this well. |

## Priority findings and minimal fixes

### 1. Make the model changes visible

**Type: missing teaching bridge; all three reviewers raised it.**

The posted slides are more careful than a superficial reading of the schedule suggests. Lecture 2 already introduces $V_t^\pi$, random termination, and absorbing zero-reward states on slides 14 and 16; slide 17 explicitly switches to continuing discounted tasks. Lecture 3 scopes its main theorem to finite stationary discounted models. Finite-horizon DP has therefore not been absent from the course.

The risk is losing those qualifications when the class moves through finite-horizon planning, sampled learning, regret, and policy optimization.

**Fix:** introduce the four-setting table above during Lecture 5's existing model introduction. At later transitions, fill in a small recurring box: **objective; horizon/termination; discount; state including time if needed; known quantities; quantity to learn**. This replaces repeated definitions rather than adding a new unit.

**Diagnostic:** “Why can a five-step problem use $\gamma=1$, even though the contraction proof and residual certificate from Lecture 3 cannot be used unchanged?”

### 2. Specify a valid complete-return example for MC

**Type: unresolved example specification; confirmed in synthesis.**

The plan proposes reusing the three-state example from Lecture 2 for exact and sampled updates. That example is explicitly continuing with $\gamma=0.9$ (slides 29–31); its transitions do not terminate. An ordinary complete-return MC sample cannot be obtained by running it until the episode ends.

**Fix:** use a clearly labeled terminating variant for the MC/TD comparison, such as a fixed deadline with time in the state, while retaining the original continuing model for TD/Q-learning. Alternatively, use truncated MC and explicitly state that its target approximates the continuing return. Do not silently call a finite trajectory the complete return of the original task.

Alongside each update, show **quantity sought, behavior generating data, and target's conditional mean**. MC and TD in this lesson evaluate a fixed policy; Q-learning targets optimal control. They are not three unbiased estimators of the same quantity.

**Diagnostic:** “If an exploratory behavior policy chooses a poor next action, does Q-learning evaluate that behavior policy?”

Use the existing trajectory/comparison time. Introduce true termination versus an external data-collection cutoff during Lecture 6's termination segment, then revisit it with DQN. [Gymnasium's time-limit guidance](https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/) supports this distinction.

### 3. Treat statistical and ML preparation as actual teaching dependencies

**Type: prerequisite mismatch; all three reviewers raised it.**

The advertised prerequisites do not include prior machine learning. Lecture 8 adds ridge geometry, PSD matrices, self-normalized concentration, and determinant arguments. Lecture 9 introduces adaptive testing. Lecture 10 assumes familiarity with losses and gradient descent, and Lecture 11 starts by recalling softmax policies.

Naming prerequisites or linking a large resource does not establish that students can use them.

**Fix:** prepare two short worked sheets with answers: a two-dimensional ridge/uncertainty calculation before Lecture 8, and a linear squared-loss update plus two-action softmax before Lecture 10. Check understanding in the existing example time. If necessary, supply the bandit confidence ellipsoid and preserve the regret argument. Use an explicit linear approximator for the first DQN batch calculation; a neural network can then be presented as a differentiable parameterized function.

**Diagnostic:** “Which parameters receive a gradient, and which quantities are held fixed when forming this Bellman target?”

This preparation has a student-workload cost; it should replace some optional reading, not be added to a full reading load.

### 4. Give Lecture 9 a concrete sequential-exploration example

**Type: pacing and transfer risk; student and comparative reviewers raised it.**

The conceptual connection from bandits to linear MDPs is sound. Its present 90-minute treatment still asks students to absorb the model, Bellman closure, backward regression, adaptive continuation values, a regret decomposition, and an MDP lower-bound construction.

An important transition is easy to miss: the bandit has unknown rewards, whereas the chosen MDP model has known rewards and unknown transitions. “Run a bandit at each stage” is not enough to explain that difference.

**Fix:** retain the bandit lower proof and the MDP upper/lower statements. Reduce the 20-minute MDP hard-chain/scaling discussion to a five-minute bound comparison, leaving the construction in optional notes. Spend the recovered 15 minutes completing a two-stage example: observed transition, terminal-stage target, changed continuation estimate, recomputed earlier-stage label, and optimism bonus. Start with finite-state matrices before introducing signed measures.

**Diagnostic:** “If rewards are known, why might an action still need exploration? Can the same recorded transition receive a new regression target after the value estimate changes?”

This preserves the two-meeting exploration allocation and the requested lighter proof treatment for MDPs.

### 5. Correct the resource-allocation boundary specification

**Type: confirmed local specification defect; formulations reviewer, then visual verification.**

In [Lecture 1](../materials/slides/DPRL_lec01_course_overview_and_rl_intro_post.pdf), slide 18 gives the action range using the original budget $4$. The feasible set should depend on remaining resource:

$$
A_t(S_t)=\{0,\ldots,\lfloor S_t/h_t\rfloor\}.
$$

The worked tables already exclude infeasible quantities; this is a mismatch between the formal definition and the calculation.

Slides 26–28 require a separate boundary decision. Product $X$ consumes either one or two units, but the diagram permits it at one remaining unit. The displayed transition formula then permits $S_{t+1}=-1$, outside the declared state space $\{0,\ldots,4\}$. The illustration appears to terminate there, but the transition/reward convention is not specified consistently.

**Fix:** explicitly choose whether production is infeasible below the worst-case resource requirement, can fail with a specified payoff, or may exhaust/overrun the budget and terminate. Align feasible actions, transitions, rewards, and the diagram. Do not silently clamp the next state while preserving an unspecified production payoff.

Use this as a short modeling check when the example is revisited in Lecture 5. No original slides were edited as part of this review.

### 6. Fix the objective before deriving policy gradients

**Type: specification requirement for forthcoming slides, not an established wrong formula.**

Lecture 11 promises a finite-horizon derivation but does not settle the discount convention in its agenda. A clean choice for the worked Lectures 11–13 example is a bounded undiscounted episode, explicit stage/prefix state, and stated terminal behavior.

If instead

$$
J(\theta)=\mathbb E_\theta\!\left[\sum_{h=1}^{H}\gamma^{h-1}R_h\right],
$$

then a policy-gradient formula using reward-to-go discounted relative to stage $h$ needs the corresponding outer $\gamma^{h-1}$ weighting, unless a specified sampling/occupancy convention absorbs it. The finite-horizon critic must also represent remaining time.

**Fix:** write the objective before the derivation and keep the same convention through the actor–critic and PPO example. For LLMs, distinguish EOS termination from an imposed generation cap and specify the capped response's reward. This fits within the existing objective and token-generation introductions.

### 7. Explain the limit of the baseline analogy in GRPO

**Type: possible misleading inference; formulations reviewer.**

Lecture 11 proves a state-only baseline identity. Lecture 13 introduces group-relative weights whose group mean and standard deviation include the sampled response's own reward. Students should not infer that the earlier theorem automatically establishes an unbiased raw-reward gradient for this update.

**Fix:** call these empirical relative update weights and explicitly state the limit of the analogy. Use two minutes of the existing group-advantage segment. The definitions appear in [DeepSeekMath §4.1.2](https://arxiv.org/pdf/2402.03300).

For instructor preparation only: for independent on-policy responses at a fixed prompt, with parameter-independent rewards, the ordinary sequence-score estimator $G^{-1}\sum_i\nabla\log p_\theta(y_i)(R_i-\bar R)$ has expectation $(1-1/G)\nabla\mathbb E[R]$. This statement excludes clipping, reward standardization, and response-length normalization; it is not a formula for the complete GRPO update. It is a mathematical observation about that simplified estimator, not a claim that the paper promises unbiasedness.

## What the comparison courses actually do

These are observed curricular choices. The explanations of why they are pedagogically useful are our interpretations, not claims about unpublished instructor intentions.

| Course | Verified structure | Implication for this design |
|:--|:--|:--|
| [Farahmand, Fall 2025](https://amfarahmand.github.io/IntroRL/fall2025.html) | Introduces several return conventions, then mainly develops discounted MDP structure and planning; follows with sampled learning, approximation, policy search, and model-based RL. No separate SSP or average-reward unit is listed. | The initial discounted-theory sequence has a direct precedent. Our added exploration and modern applications require less depth elsewhere. |
| [MIT 6.231, Fall 2015](https://ocw.mit.edu/courses/6-231-dynamic-programming-and-stochastic-control-fall-2015/pages/lecture-notes/) | Finite-horizon DP and modeling first; lookahead/rollout in Lectures 8–9; SSP in 10–11, average cost in 12, and further discounted/undiscounted theory later. | A stochastic-control course can reasonably emphasize a broader range of criteria. Its ordering is not a requirement for a course that uses discounted operators as its initial common language. |
| [UCSB CS292F, Spring 2021](https://cseweb.ucsd.edu/~yuxiangw/classes/RLCourse-2021Spring/) | Discounted MDP foundations, sampled methods and approximation, bandits, then finite-horizon tabular exploration and linear MDPs. | Discounted foundations followed by episodic exploration is established practice. Its separate tabular-exploration lesson highlights the bridge our shorter course must supply with an example. |
| [Stanford CS224R, Spring 2026](https://cs224r.stanford.edu/) | Early finite-trajectory policy gradients and actor–critic, then deep-RL methods, reward learning, LLMs, and other applications. The prerequisites include machine learning and relevant implementation background. | Separate PG and PPO meetings and later LLM applications are reasonable. Its pace cannot be transferred directly to students whose prerequisites stop at mathematics and Python. |

The source materials supporting the setting choices include Farahmand's [introductory slides](https://amfarahmand.github.io/IntroRL/lectures2025/lec01.pdf), UCSB's [initial MDP slides](https://cseweb.ucsd.edu/~yuxiangw/classes/RLCourse-2021Spring/Lectures/Intro_slides.pdf) and [tabular episodic exploration](https://cseweb.ucsd.edu/~yuxiangw/classes/RLCourse-2021Spring/Lectures/Exploration_TabularMDP.pdf), and Stanford's [policy-gradient](https://cs224r.stanford.edu/slides/03_cs224r_policy_gradients_2026.pdf) and [actor–critic](https://cs224r.stanford.edu/slides/04_cs224r_actor_critic_2026.pdf) slides.

**Timing caveat:** this course has 2,025 teaching minutes, including 270 lab minutes. Other courses publish scheduled slots, which may include breaks or additional tutorials. Those schedules support comparisons of sequencing and emphasis; they do not validate a slides-per-minute conversion.

## How much undiscounted theory to add

**Add a boundary explanation, not another full lecture.** Students should leave knowing that “infinite horizon, undiscounted” does not specify one universally well-behaved problem.

A short SSP example is enough to show what discounting was doing. From one nonterminal state:

- **Exit:** receive reward 1 and terminate.
- **Wait:** receive reward 0 and return to the same state.

With $\gamma=1$, the Bellman equation is $V=\max\{1,V\}$. Every $V\geq1$ solves it, although the optimal return is 1. At $V^\star=1$, always waiting is a greedy policy but earns 0. A terminal state alone therefore does not preserve the earlier uniqueness or arbitrary-greedy-policy conclusions. This is the reward version of the pathology in [Bertsekas, Lecture 17, p. 9](https://ocw.mit.edu/courses/6-231-dynamic-programming-and-stochastic-control-fall-2015/d70106b7f8fd529d2976a360eb395425_MIT6_231F15_Lec17.pdf).

Then identify average reward as the rate criterion for continuing operation; point interested students to [MIT Lecture 12](https://ocw.mit.edu/courses/6-231-dynamic-programming-and-stochastic-control-fall-2015/cfb0cf1e05c36bb68fe28433d1b3eea5_MIT6_231F15_Lec12.pdf). Neither full SSP convergence nor average-reward gain/bias equations are prerequisites for the selected exploration, PPO, or LLM content.

Use approximately 8–10 minutes within Lecture 5's existing introduction and modeling discussion for the setting map and boundary illustration, shortening repeated arithmetic as needed. This is a proposed allocation, not measured teaching time.

## Changes to make first

| Priority | Concrete action | Time or scope tradeoff |
|:--|:--|:--|
| Before preparing Lecture 5 | Add the setting map, a deadline-dependent action example, and a short undiscounted boundary example. | Replace repeated definitions and some backward-update arithmetic. Keep finite-horizon DP itself to about one period. |
| Before reusing Lecture 1 examples | Resolve the feasible-action and stochastic boundary conventions. | A short correction and modeling question; no new topic. |
| Before Lecture 6 | Specify the terminating MC example; label evaluation versus control; introduce termination versus truncation. | Use existing trajectory and termination time. |
| Before Lectures 8 and 10 | Provide and check the two preparation sheets. | Replace optional reading; retain the supplied-confidence fallback. |
| Before Lecture 9 | Make the two-stage exploration calculation the central MDP example. | Move the MDP lower construction to reading; keep a short upper/lower comparison. |
| Before Lectures 11–13 | Fix the objective, time inputs, termination conventions, and meaning of empirical group weights. | Use existing introductions and worked examples. |

There is no review-based reason to move all finite-horizon material before the discounted theory, add complete SSP/average-reward units, merge PG and PPO, or replace the scaffolded labs with large neural-network training runs. The current theorem caveats for DQN/PPO and the restricted-game caveat for MARL are strengths. Keep them visible in teaching, rather than only in instructor notes.
