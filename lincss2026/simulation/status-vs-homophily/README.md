# Hierarchy or homophily?

A toy simulation showing that the same observed endogamy can emerge from two very different mechanisms — **homophily** (each group prefers its own) and **status hierarchy** (everyone prefers up; the top group is selective). The realized match matrix is symmetric and similar across regimes; the underlying directed preferences are not.

## The conceptual point

In assortative mating research we typically observe realized unions, not preferences. The match matrix is symmetric by construction (a G1↔G2 couple is the same as a G2↔G1 couple). But preferences are *directed*: who would accept whom. Two regimes —

- **Homophily:** symmetric, diagonal-heavy preference matrix
- **Status hierarchy:** asymmetric — top group is selective, lower groups prefer upward and are rejected back to their own

— produce nearly the same aggregate endogamy and nearly the same realized match matrix. To distinguish them empirically you need data on directed acceptance (e.g. dating app responses, stated preferences, or vignettes), which observed marriages and cohabitations do not provide.

## How it works

Each agent belongs to one of three groups (G1 top, G3 bottom; equal sizes, 80 each). For each ordered pair `(ego, alter)` the user-editable matrix specifies `P[ego_group][alter_group]` — the probability the ego accepts that alter. **Two-sided matching:** a couple forms with probability `P[i, j] × P[j, i]`. Matching runs for 12 stochastic rounds, ~18 candidate alters sampled per ego per round.

The left column shows:

1. **Group preferences** — the directed input matrix (editable, can be asymmetric).
2. **Realized matches** — row-normalised: of group `i`'s actual partners, what share are from group `j`. The diagonal is per-group endogamy.
3. **Agent strip** — three tiers of dots, one per group; pair lines arc between tiers.

## Presets

| Preset | What the matrix looks like | Expected outcome |
|---|---|---|
| Homophily | Symmetric, diag 0.65 / off-diag 0.35 | All groups ≈ 63% endogamy. Aggregate ≈ 63%. |
| Hierarchy | G1 and G2 close G3 out (P=0.05); G3 prefers upward, no diagonal weight | G1 ≈ 77%, G2 ≈ 65%, **G3 ≈ 81%**. Aggregate ≈ 74%. |
| Indifferent | All cells 0.45 | All groups ≈ 33% — random baseline for three equal groups. |

The educational comparison is between **Homophily** and **Hierarchy**. Both produce high overall endogamy. But the per-group story differs dramatically:

- Under **Homophily**, every group prefers its own and ends up similarly endogamous.
- Under **Hierarchy**, the *most rejected* group (G3) becomes the *most* endogamous — even though its row of preferences has no diagonal weight at all. Endogamy here is forced from above, not chosen from within.

This inverted gradient — G3 more endogamous than G1 — is the kind of counterintuitive pattern that pure preference-based explanations cannot generate. From observed unions alone you cannot tell which mechanism is at work.

## Implementation notes

- **3 fixed groups, 240 agents.** Equal sizes for now; group-size effects (Blau) are a separate sim.
- **No spatial component.** This sim isolates preference mechanics. The Paper 1 sim (`/simulation/`) covers the spatial/propinquity case.
- **Two-sided matching** uses independent Bernoulli acceptance per side (product rule). Not Gale–Shapley; this is closer to actual dating-market dynamics with stochastic interest.
- **Row-normalisation** for the realized matrix mirrors how empirical assortative-mating tables are typically read ("of group i's unions, X% are with group j").

## Possible extensions

- Toggle 3 ↔ 4 groups (status gradient is more visible with 4)
- Adjustable group sizes — Blau's "no Eskimo around" effect
- Layer homophily on top of hierarchy — the empirically realistic case
- One-sided vs two-sided matching toggle (shows how mutual acceptance changes the shape)
- Identification mode: hide the preference matrix, show only realized matches, and ask the user to guess which regime is running

## Files

- `index.html` — single-file simulation (HTML + CSS + JS)

## Linked from

Standalone sim, accessed at `/simulation/status-vs-homophily/`. Sibling to the Paper 1 spatial sim at `/simulation/`.
