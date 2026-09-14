# Lecture 1: Sequential decisions and dynamic programming

Dynamic Programming and Reinforcement Learning
Tsinghua University, Fall 2026

Date: September 15, 2026. Time: 09:50-12:15, China Standard Time.
Location: Teaching Building 4, Room 4401.

This is a proposed first-lecture study guide.

## Learning objectives

- Identify the state, action, transition, immediate cost and horizon.
- Explain a policy as a rule for choosing actions in different states.
- Compute optimal remaining costs by backward induction.
- Explain how planning and learning from experience are connected.

## Class sections

1. 09:50-10:35: Motivation, course introduction and route-planning challenge.
2. 10:40-11:25: States, actions, policies, values and a modeling exercise.
3. 11:30-12:15: Backward induction, Bellman's idea and a bridge to RL and LLMs.

## Route-planning problem

Find a minimum-cost route from A to G. Edges: A-B: 2; A-C: 5; B-D: 4; B-E: 7; C-D: 2; C-E: 1; D-G: 4; E-G: 2.

J(G)=0. J(D)=4. J(E)=2.
J(B)=min(4+4,7+2)=8.
J(C)=min(2+4,1+2)=3.
J(A)=min(2+8,5+3)=8.

The optimal route is A-C-E-G, cost 8. A greedy immediate-cost rule gives A-B-D-G, cost 10. The policy must specify an action from B as well as C.

For a deterministic finite-horizon problem:
J_t(s)=min_a {c_t(s,a)+J_(t+1)(f_t(s,a))}, with terminal condition J_T(s)=g_T(s).
Choose the smallest immediate cost plus optimal remaining cost.

## LLM connection

State: prompt and generated prefix. Action: next token. Policy: the language model's distribution over tokens. Reward: feedback on the completed answer. The token-appending transition can be known even when optimization requires sampled experience and approximation.

## Review questions

1. How does a policy differ from a route?
2. Why can greedy action selection fail?
3. What changes if E-G costs 6 instead of 2?
4. What changes if travel costs are initially unknown?

## Preparation

Bertsekas, Dynamic Programming and Optimal Control, Volume I, Chapter 1.
Sutton and Barto, Reinforcement Learning: An Introduction, Chapter 1.

Official references:
- https://ocw.mit.edu/courses/6-231-dynamic-programming-and-stochastic-control-fall-2015/pages/lecture-notes/
- https://mitpress.mit.edu/9780262352703/reinforcement-learning/
