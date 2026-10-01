---
title: Reading and Study Resources
body-classes: course-resources
sidebar: false
toc: false
grid:
  content-mode: full
---

::: {.resource-intro}
Books, tutorials, and references for the course and for further study. Start with the core texts and use the other sections as needed.
:::

::: {.resource-nav role="navigation" aria-label="Resource sections"}
[Core reading](#core-reading)
[Preparation](#preparation)
[RL theory](#rl-theory)
[Deep RL](#deep-rl)
[LLM post-training](#rl-for-language-models)
[Research & writing](#research-and-writing)
[AI tools](#ai-coding-tools)
[Courses](#reference-courses)
:::

## Core reading

::: {.resource-table .resource-books}
| Book | What to read it for |
| :--- | :--- |
| **[Dynamic Programming and Optimal Control, Volume I](https://www.mit.edu/~dimitrib/dpbook.html)** [Dimitri P. Bertsekas]{.resource-author} | Formulating control problems and solving them by dynamic programming, with worked examples and exercises. |
| **[Reinforcement Learning: An Introduction, 2nd edition](https://mitpress.mit.edu/9780262352703/reinforcement-learning/)** [Richard S. Sutton and Andrew G. Barto]{.resource-author} | Start with Chapters 3–6 on MDPs, DP, Monte Carlo, and temporal-difference learning. Later chapters cover function approximation and policy gradients. |
| **[Reinforcement Learning: Theory and Algorithms](https://rltheorybook.github.io/)** [Alekh Agarwal, Kianté Brantley, Nan Jiang, Sham M. Kakade, and Wen Sun]{.resource-author} | Mathematical analysis of RL algorithms, including exploration, sample complexity, and regret. Free PDF from the authors. |
:::

## Background and preparation {#preparation}

::: {.resource-table}
| Background | Topics to review |
| :--- | :--- |
| **Probability** | Conditional expectation, independence, variance, and the law of total expectation, for working with Bellman equations and sampled returns. |
| **Linear algebra and calculus** | Matrix–vector products, norms, eigenvalues, gradients, and the chain rule, for value equations and function approximation. |
| **Python and NumPy** | Functions, array shapes, broadcasting, indexing, and plotting. Review the [Stanford Python and NumPy tutorial](https://cs231n.github.io/python-numpy-tutorial/) and consult the [Python tutorial](https://docs.python.org/3/tutorial/) as needed. |
:::

## Starting RL theory {#rl-theory}

Start with **[Improved Algorithms for Linear Stochastic Bandits](https://yasinov.github.io/linear-bandits-nips2011.pdf)** by Yasin Abbasi-Yadkori, Dávid Pál, and Csaba Szepesvári (NeurIPS 2011). Read the entire paper, including every appendix proof. Work through each definition, assumption, algorithm, and derivation until you can reproduce the arguments yourself.

Consult the references below when you encounter an unfamiliar bound or inequality. Check its conditions, then return to the proof and work out how it is used.

::: {.resource-table}
| Reference to keep nearby | When to consult it |
| :--- | :--- |
| **[Useful inequalities cheat sheet](https://www.lkozma.net/inequalities_cheat_sheet/)** [László Kozma]{.resource-author} | A compact reference for inequalities used in proofs. Some conditions are omitted; check a full statement before applying a bound. |
| **[Basic tail and concentration bounds](https://www.cambridge.org/core/books/abs/highdimensional-statistics/basic-tail-and-concentration-bounds/30AF7B572184787F4C99715838549721)** [Martin J. Wainwright]{.resource-author} | Chapter 2 of *High-Dimensional Statistics* explains tail bounds and concentration. Consult it when a probabilistic argument needs more background. Library or purchased access may be required. |
:::

## Deep RL in practice {#deep-rl}

Use these tutorials and implementations to connect RL algorithms to working agents.

::: {.resource-table}
| Resource | What it covers |
| :--- | :--- |
| **[PyTorch: Learn the Basics](https://docs.pytorch.org/tutorials/beginner/basics/intro.html)** | Tensors, automatic differentiation, neural networks, and the optimization loop used to train them, with a complete worked example. |
| **[Gymnasium: Basic Usage](https://gymnasium.farama.org/introduction/basic_usage/)** | The maintained successor to Gym. Introduces observation and action spaces, the environment interaction loop, and termination versus truncation. |
| **[PyTorch DQN tutorial](https://docs.pytorch.org/tutorials/intermediate/reinforcement_q_learning.html)** | A worked CartPole example connecting Q-learning to neural networks, experience replay, target networks, and epsilon-greedy exploration. |
| **[CleanRL](https://docs.cleanrl.dev/)** and **[Stable-Baselines3](https://stable-baselines3.readthedocs.io/en/master/guide/rl_tips.html)** | Read CleanRL’s single-file implementations to inspect algorithm details. Use Stable-Baselines3 for reusable baselines and guidance on evaluation and experiment design. |
:::

## RL for language models

These resources assume PyTorch, basic policy gradients, and familiarity with autoregressive language models. In RLHF, rewards are typically provided by a reward model trained on human preference data. Reinforcement learning with verifiable rewards (RLVR) uses task-specific verification procedures to compute rewards—for example, evaluating mathematical answers against ground truth or assessing generated code with unit tests. PPO and GRPO are policy-optimization methods that can use these rewards.

::: {.resource-table}
| Resource | What it covers |
| :--- | :--- |
| **[Hugging Face LLM Course: Fine-tuning](https://huggingface.co/learn/llm-course/chapter11/1)** | Chat templates, supervised fine-tuning (SFT), LoRA, and evaluation, with examples for adapting a pretrained language model. |
| **[Stanford CS224R: Preference Optimization](https://cs224r.stanford.edu/slides/09_cs224r_rlhf_2026.pdf)** and **[Reasoning](https://cs224r.stanford.edu/slides/10_cs224r_rl_for_llms_reasoning_2026.pdf)** | Lectures on learning from human preferences through RLHF and DPO, followed by GRPO, reasoning models, and inference-time computation. |
| **[Hugging Face LLM Course: RL](https://huggingface.co/learn/llm-course/chapter12/1)** and **[TRL](https://huggingface.co/docs/trl/index)** | A guided GRPO introduction, plus trainer documentation. Standard [DPO](https://huggingface.co/docs/trl/dpo_trainer) learns from fixed preference pairs; [GRPO](https://huggingface.co/docs/trl/grpo_trainer) samples responses during training and learns from their rewards. |
| **[verl](https://verl.readthedocs.io/en/latest/)/[slime](https://thudm.github.io/slime/)** | Distributed LLM RL frameworks with examples for rollout generation, custom rewards, policy updates, and allocating GPUs to training and inference. |
:::

## Research and writing

::: {.resource-table}
| Resource | How it helps |
| :--- | :--- |
| **General advice on computer science research** | Chris Johnson's [Basic Research Skills](https://www.dcs.gla.ac.uk/~johnson/teaching/research_skills/basics.html) discusses research questions and evidence. Simon Peyton Jones's [How to write a great research paper](https://www.microsoft.com/en-us/research/academic-program/write-great-research-paper/) offers advice on explaining your contribution clearly. |
| **Use LaTeX** | Start with [Learn LaTeX](https://www.learnlatex.org/en/) ([中文](https://www.learnlatex.org/zh-hans/)) or [Overleaf's introduction](https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes). Practice by writing up a course derivation, with equations, cross-references, and citations. |
:::

**RL theory research** studies what can be learned, how efficiently, and under what assumptions. Typical contributions include a new algorithm with a provable guarantee, sharper regret or sample-complexity bounds, weaker assumptions, or lower bounds that identify fundamental limits. A useful starting point is to reconstruct an existing proof, understand where each assumption enters, and investigate a question the analysis leaves open. Simple examples and counterexamples help test conjectures before attempting a proof.

**Empirical RL research** develops methods or investigates when and why existing ones succeed or fail. A project might improve exploration, explain training instability, or study generalization to new tasks. Build evidence through comparisons with strong baselines, ablations that isolate design choices, and evaluations across multiple random seeds and relevant environments. Report variability and failure cases, and make data, environment-interaction, and compute budgets clear so comparisons can be interpreted fairly.

## AI tools for proofs and code {#ai-coding-tools}

Try the proof or implementation yourself before turning to AI. Working through a derivation, writing code, and debugging mistakes are often how you learn the material. Use Codex or Claude Code when you need help with a specific difficulty; they can explain an idea, help develop or review a proof, or diagnose code. The goal is to understand the reasoning well enough to reproduce it yourself.

::: {.resource-table}
| Tool | Getting started |
| :--- | :--- |
| **OpenAI Codex** | The official [CLI guide](https://learn.chatgpt.com/docs/codex/cli) and [desktop quickstart](https://developers.openai.com/codex/quickstart/) explain setup. Open your project folder and include your attempted proof or code when asking for help. |
| **Claude Code** | The official [quickstart](https://code.claude.com/docs/en/quickstart) covers setup; the [best practices guide](https://code.claude.com/docs/en/best-practices) explains how to provide context and check results. Point it to the files relevant to your question. |
:::

- **Ask for focused help.** A hint, an explanation, or a check of one argument may be enough to let you continue yourself.
- **Work through the result.** Complete the proof or make the code change yourself. Check each proof step against the assumptions, and test code on an example whose answer you understand. AI-generated proofs and code can contain mistakes.

For assessed work, follow the assignment's rules on AI use and disclosure.

<details>
<summary>Two prompts to adapt for this course</summary>

::: {.resource-prompt}
**Get help with a proof**

> I want to prove that the Bellman optimality operator is a contraction in the sup norm for a finite discounted MDP. Here is my proof attempt: […]. I get stuck when comparing two maxima over actions. Check my reasoning so far and give me a hint so I can continue the proof myself.

**Debug your own implementation**

> My policy-evaluation function disagrees with my hand calculation for this two-state MDP. Help me find where the calculations first diverge, and suggest a diagnostic check. I will make the correction and rerun it.
:::

</details>

## Reference courses

Choose a companion course for the topic you want to study more closely.

::: {.resource-table .resource-courses}
| Course and instructor | Best used for |
| :--- | :--- |
| **[MIT 6.231 — Dynamic Programming and Stochastic Control](https://ocw.mit.edu/courses/6-231-dynamic-programming-and-stochastic-control-fall-2015/pages/lecture-notes/)** [Dimitri P. Bertsekas]{.resource-author} | Planning and stochastic control: finite- and infinite-horizon DP, Bellman equations, stochastic shortest paths, and approximation methods. |
| **[Polytechnique Montréal INF8250AE — Introduction to Reinforcement Learning](https://amfarahmand.github.io/IntroRL/fall2025.html)** [Amir-massoud Farahmand]{.resource-author} | Detailed notes and annotated slides for understanding why RL algorithms work, from MDPs and planning to value approximation and policy search. |
| **[Tsinghua 40241012 — Reinforcement Learning](https://coai.cs.tsinghua.edu.cn/Courses/RL2026/_site/lectures/)** [Hongning Wang]{.resource-author} | Lecture materials on bandits, MDPs, and core RL algorithms. The linked papers and tutorials provide starting points for further reading. |
| **[UC Berkeley CS185/285 — Deep Reinforcement Learning](https://rail.eecs.berkeley.edu/deeprlcourse/)** [Sergey Levine]{.resource-author} | Lectures and coding assignments for implementing deep RL: policy gradients, actor–critic methods, deep Q-learning, model-based RL, and offline RL. |
| **[Stanford CS364A — Algorithmic Game Theory](https://timroughgarden.org/f13/f13.html)** [Tim Roughgarden]{.resource-author} | Strategic interaction and learning in games. Lectures 13 and 17–18 cover equilibrium concepts, no-regret learning, swap regret, and minimax. |
:::
