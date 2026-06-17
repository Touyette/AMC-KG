---
type: concept
aliases: [frame problem]
first_introduced: "[[Ep 28 - Convergence To Relevance Realization]]"
---

# Frame Problem

> McCarthy & Hayes (AI): the problem of how a cognitive system determines what needs to be updated and what can be held constant when the world changes — generalized by Vervaeke to the core problem that makes relevance realization necessary for any mind.

## Vervaeke's framing
The frame problem was discovered in classical AI research (McCarthy & Hayes, 1969): when a robot performs an action, it needs to know what stays the same and what changes. If you move a block from one table to another, you don't need to update the color of the block, the position of the ceiling, or the state of objects in other rooms. But how does the system know what NOT to update? For any real-world action, there are infinitely many properties that didn't change — the system cannot enumerate them all (Ep 28).

**The deeper generalization**: Vervaeke extends this far beyond AI. The frame problem is not a technical glitch in early robotics but a fundamental feature of any intelligent system operating in an open-ended world. Any cognitive system that explicitly checks all possible consequences of every action before acting will never act — the combinatorial explosion is immediate. The frame problem IS the problem of relevance: the system needs to know what's relevant (what to update, what to attend to, what matters) *before* it can process the situation. But relevance cannot itself be derived from an exhaustive propositional search — that would require solving the frame problem before solving the frame problem (Ep 28).

**Dreyfus's formulation**: Hubert Dreyfus (via Heidegger) puts it most sharply: "facts and rules are meaningless without relevance." Any representational system (classical AI, propositional inference) must already have relevance specified to function — which means propositional systems presuppose a relevance-determining capacity they cannot themselves provide. This is why the frame problem cannot be solved *within* the propositional paradigm; it can only be addressed by a non-propositional relevance realization mechanism (Ep 28).

**Working memory and the frame problem**: The frame problem connects directly to the limits of working memory: because working memory is severely capacity-limited, the question of what gets loaded into working memory IS the frame problem. Whatever mechanism selects what goes into working memory is performing relevance realization, not propositional inference (Ep 28).

## Relationships
developed_by:: [[Hubert Dreyfus]]
builds_on:: [[Combinatorial Explosion]], [[Working Memory]]
contrasts_with:: [[Propositional Knowledge]]
responds_to:: [[Relevance Realization]]
related:: [[Heuristics]], [[Bounded Rationality]], [[Salience Landscape]]
