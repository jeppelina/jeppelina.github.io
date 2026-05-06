# Structure or behaviour?

A toy decomposition tied to Paper 3 of the dissertation. Two snapshots — earlier (T1) and later (T2). At each, set the population's minority share (structure) and the in-group preference (behaviour). The 2×2 grid shows endogamy under all four combinations: two observed, two counterfactual. The decomposition reads off how much of the observed change is composition vs. preference.

## The conceptual point

Observed inter-ethnic unions can rise *while* preference for own-group simultaneously tightens. The observed pattern is structurally driven; the behavioural component points the other way. From observed unions alone you cannot tell. The 2×2 with counterfactuals lets you see both.

Defaults reproduce the kappa's headline finding:

| | T1 structure (m=10%) | T2 structure (m=30%) |
|---|---|---|
| **T1 behaviour (+40%)** | **89.9%** *observed at T1* | 73.0% *counterfactual* |
| **T2 behaviour (+80%)** | 93.7% *counterfactual* | **81.7%** *observed at T2* |

- **Observed:** −8.2 pp (89.9% → 81.7%) — looks like decline
- **Structure-only:** −16.9 pp (89.9% → 73.0%) — what diversification alone would do
- **Behaviour-only:** +3.7 pp (89.9% → 93.7%) — preference *intensified*
- **Interaction:** +5.0 pp (joint effect; structure × behaviour)

So the observed −8 pp is not "society became more open." It's "society diversified faster than openness eroded."

## Math

For two groups (majority share `1−m`, minority share `m`) with in-group preference bonus `pref`, define `α = 1 + pref` (`α²` is the multiplicative same-group dyad weight). With two-sided independent acceptance and equal acceptance baselines:

- Same-group dyad weight: `α² · (m² + (1−m)²)`
- Cross-group dyad weight: `2 · m · (1−m)`
- Endogamy = same / (same + cross)

Each cell of the 2×2 is `endogamy(m_struct, p_behav)`. Decomposition is anchored at T1·T1:

- `Δ_obs    = T2·T2 − T1·T1`
- `Δ_struct = T1·T2 − T1·T1` (hold behaviour at T1, change structure)
- `Δ_behav  = T2·T1 − T1·T1` (hold structure at T1, change behaviour)
- `Δ_inter  = Δ_obs − Δ_struct − Δ_behav`

Sum identity: `Δ_obs = Δ_struct + Δ_behav + Δ_inter`. The interaction can be material when both shifts are large, which is the realistic regime.

## Implementation notes

- **Closed-form, no stochastic matching.** This sim is about the decomposition, not about watching a market converge. Adding noise would only obscure the comparison. The other sims (Paper 1, hierarchy/homophily) use agent-based matching where the stochasticity is part of the point.
- **Live updates** as sliders move; no Run button. Cheap to recompute.
- **No spatial component.** Distance/segregation is what Paper 1's sim covers. Paper 3's mechanism is about composition and preference; spatial enters via Paper 4 territory.
- T1-anchored decomposition (vs. T2-anchored) is a choice — the kappa text generally anchors at the earlier period. Could be made a toggle if useful.

## Future v2 — visual two-grid version

Per discussion: build a version with **two parallel grids of agents**, one per snapshot, where the user sets:

- Relative group size (slider)
- Segregation (slider — clustering of groups in space)
- Distance sensitivity is **fixed**

So the matching is two-sided spatial, like Paper 1's sim, but run twice — once at T1, once at T2 — and the two grids visualise *what changed in the partner market* between snapshots. The 2×2 decomposition on top still works; this just makes the structural side viscerally legible. v2 would still inherit the closed-form math for the decomposition cells but layer agents underneath for the two observed scenarios.

## Files

- `index.html` — single-file simulation (HTML + CSS + JS)

## Linked from

- Standalone at `/simulation/structure-vs-behavior/`
- Tab in the simulations hub at `/simulation/`
