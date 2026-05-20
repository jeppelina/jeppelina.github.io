# Structure or behaviour?

A two-window spatial sim tied to Paper 3 of the dissertation. Two snapshots of a partner market — earlier (T1) and later (T2). Each snapshot has its own canvas with agents, its own minority share, and its own in-group preference. Residential segregation is held constant so it doesn't confound the comparison. Run matching to see the four counterfactual cells (two observed, two not) and the decomposition: how much of the change is composition versus preference.

## The conceptual point

Observed inter-ethnic unions can rise *while* preference for own-group simultaneously tightens. The observed pattern is structurally driven; the behavioural component points the other way. From observed unions alone you cannot tell. The 2×2 with counterfactuals lets you see both.

Defaults reproduce the kappa's headline finding:

| | T1 structure (m=10%) | T2 structure (m=30%) |
|---|---|---|
| **T1 behaviour (+40%)** | **observed at T1** | counterfactual |
| **T2 behaviour (+80%)** | counterfactual | **observed at T2** |

Typical (symmetric) decomposition with these settings:

- **Observed:** small negative (~ −8 pp) — looks like decline
- **Structure:** large negative (~ −14 pp) — what diversification contributes
- **Behaviour:** small positive (~ +6 pp) — preference *intensified*

Sums exactly to observed by construction. The story: observed change is not "society became more open." It's "society diversified faster than openness eroded."

(Numbers fluctuate within ~1–2 pp run-to-run because matching is stochastic; counterfactual cells are averaged over 3 trials for stability.)

## Spatial model (visual only)

- 140 agents per snapshot
- **Two minority clusters** (enclaves) per snapshot, picked at init with a minimum-separation constraint
- Majority spreads out, avoiding both cluster zones
- Segregation interpolates each agent's displayed position between a per-agent random anchor and a per-agent segregated anchor; held at **`FIXED_SEG = 0.65`** across both snapshots

The spatial layout is **purely visual**. Positions do not enter the match probability — the data-generating process is purely compositional, so the decomposition reflects composition × preference without spatial noise. (Earlier versions had a distance kernel; it added run-to-run variance that masked the underlying decomposition, so it was removed.)

## Matching DGP & how the numbers are computed

The dyad acceptance probability for a candidate pair is:

- Same-group: `BASE_ACCEPT × (1 + pref)²`
- Cross-group: `BASE_ACCEPT`

with `BASE_ACCEPT = 0.10` calibrated so most agents pair within 8 rounds × 14 candidates per round.

**Crucially, the displayed endogamy values and the decomposition do *not* come from this stochastic process.** Once distance was removed from the DGP, the matching is purely compositional and has a closed-form solution:

- Majority endogamy = `(1 − m)·α² / ((1 − m)·α² + m)` (where `α = 1 + pref`)
- Minority endogamy = `m·α² / (m·α² + (1 − m))`

These are the limits the stochastic matching converges toward as `N → ∞`. The sim uses them directly for the four cells of the decomposition, so:

- `Δ_struct` is exactly `0` when T1 and T2 minority shares are identical
- `Δ_behav` is exactly `0` when T1 and T2 preferences are identical
- The decomposition is rock-solid stable — no run-to-run variance

The canvases still run a single stochastic match each, animated, as visual illustration. Pair counts on the canvas are one realisation and may differ from the displayed expectation by a few percentage points (more for minority at small shares — single-pair shifts move minority endogamy by `1/n_min`). That's a feature, not a bug: the canvas shows *what could happen*; the numbers show *what would happen on average*.

## Smooth flip transitions on minority share

Moving the minority share slider does **not** regenerate the population. Instead, the minimum number of agents are *flipped* between groups, and each flipping agent runs an ~750 ms transition:

- Colour crossfades between majority palette (`#D9471C`) and minority palette (`#1E5EA3`)
- Position glides from the agent's old segregated anchor to a newly assigned cluster anchor

Both animations compose with the existing segregation interpolation, so what you see is a fluid morph of the two enclaves shrinking or growing, with the right number of agents drifting in or out, rather than the population resetting.

## Decomposition (symmetric, Shapley)

The sim uses the symmetric Oaxaca / Shapley decomposition that the paper does, not the asymmetric T1-anchored version. Each main effect averages the T1-anchored and T2-anchored estimates of the same change, so the interaction term is split equally between structure and behaviour and there is no leftover.

- `Δ_obs    = T2·T2 − T1·T1`
- `Δ_struct = ½ · [ (T1·T2 − T1·T1) + (T2·T2 − T2·T1) ]`
- `Δ_behav  = ½ · [ (T2·T1 − T1·T1) + (T2·T2 − T1·T2) ]`

Identity: `Δ_obs ≡ Δ_struct + Δ_behav` exactly.

Why "interaction" exists in the asymmetric version: endogamy is non-linear in (m, p), so changing both at once has a bilinear extra effect that "hold one fixed and change the other" anchored at a single corner cannot capture. Averaging anchorings absorbs that term.

## Implementation notes

- **Two visible canvases run their actual matches** (animated). The two counterfactual cells (T1·T2, T2·T1) come from silent runs over the existing populations with the *other* snapshot's preference, averaged across 3 trials. Counterfactuals don't disturb the visible match — paired-state is saved and restored, then the visible match is re-run after the silent runs.
- **Continuous auto-run.** No "Run matching" button. Slider edits trigger a debounced re-match (~350 ms after the user pauses) so the panel stays in sync with the sliders without recomputing on every drag tick. Initial load also runs once, so the sim shows results immediately. Reset triggers a fresh run too.
- **Why fix segregation rather than expose it?** Adding a segregation slider per snapshot would put the spatial mechanism back into the decomposition, blurring "structure" (composition + segregation) with "behaviour" (preference). Fixing segregation isolates the composition × preference comparison cleanly.

## Files

- `index.html` — single-file simulation (HTML + CSS + JS)

## Linked from

- Standalone at `/simulation/structure-vs-behavior/`
- Tab in the simulations hub at `/simulation/`
