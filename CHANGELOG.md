# Changelog

All notable changes to this project will be documented in this file.

## [2.5.0] - 2026-05-06

### Changed
- **Structure-vs-behaviour sim — full rewrite from closed-form to two-canvas spatial.** Replaces the v1 slider-driven analytical version with two side-by-side spatial windows (T1 and T2) showing actual populations and matchings.
  - 140 agents per snapshot; **two minority clusters (enclaves)** per snapshot with minimum-separation; majority spreads out avoiding the enclave zones
  - **Smooth group-flip transitions** when minority share slider moves: only the minimum number of agents flip between groups, each over a ~750 ms tween — colour crossfades between majority and minority palette, position glides from old anchor to a newly assigned cluster anchor (composes with segregation interpolation)
  - **Fixed segregation (no slider)** — held at `FIXED_SEG = 0.65` across both snapshots so the structure × behaviour decomposition stays clean (composition vs. preference, with segregation as a held-constant background)
  - **Symmetric (Shapley) decomposition** — averages T1-anchored and T2-anchored estimates of each main effect, splitting the bilinear interaction term equally. `Δ_obs ≡ Δ_struct + Δ_behav` exactly, no separate interaction row. Matches the paper's framing.
  - Per-snapshot stat shows realised same-group share after each run; counterfactual cells (T1·T2, T2·T1) come from silent runs over the existing populations with the other snapshot's preference, averaged across 3 trials for stability
  - Visible matches are restored after the silent counterfactual runs so canvas and numbers stay in sync
  - **Continuous auto-run** — removed the "Run matching" button. Slider edits trigger a debounced re-match (~350 ms after the user pauses); initial load runs once on its own; reset triggers a fresh run as well
  - **Per-group decomposition** — endogamy is computed and decomposed separately for majority and minority (`2·n_AA / (2·n_AA + n_AB)` from each group's perspective), so the Blau structural-opportunity asymmetry is visible: minority endogamy is much more sensitive to group size than majority's
  - **Layout inverted** — endogamy values + per-group decomposition panel sits at the top; sliders are now above each canvas, canvases at the bottom; 2×2 cell matrix dropped (T1 and T2 endogamy values per group plus the decomposition is enough)
  - **Distance removed from the DGP** — match probability is now purely `BASE_ACCEPT × (1 + pref)²` for same-group, `BASE_ACCEPT` for cross-group; spatial layout is visual only. Removes a major source of run-to-run variance and makes the decomposition reflect composition × preference cleanly. `BASE_ACCEPT = 0.10` calibrated to keep pairing rate high in 8 rounds × 14 candidates
  - **Decomposition uses closed-form analytical values, not stochastic matching.** Once distance was removed, the DGP is purely compositional and has an exact solution: majority endogamy = `(1−m)·α² / ((1−m)·α² + m)`, minority endogamy = `m·α² / (m·α² + (1−m))`, where `α = 1 + pref`. Even with averaging, single-pair shifts in a small minority (e.g. 14 agents at m=0.10) move endogamy by ~7 pp per realisation, leaking noise into the Shapley decomposition and producing spurious Δ_struct when T1 and T2 had identical minority shares. The closed-form solution eliminates this entirely — Δ_struct is now exactly 0 at identical structure, Δ_behav exactly 0 at identical preference. The canvases still animate a single stochastic match each as visual illustration; pair counts on the canvas are one realisation while displayed numbers are the analytical expectation
  - Updated README documents the spatial model (now labelled visual-only), the matching DGP, the symmetric (Shapley) decomposition per group, and the auto-run behaviour

## [2.4.0] - 2026-05-06

### Added
- **New toy simulation: "Structure or behaviour?"** at `/simulation/structure-vs-behavior/` — Paper 3 decomposition
  - Two snapshots (T1 and T2) with two sliders each: minority share (structure) and in-group preference bonus (behaviour)
  - 2×2 matrix shows endogamy under all four combinations of structure × behaviour: two observed corners, two counterfactual
  - Decomposition rows below: Observed, Structure-only, Behaviour-only, Interaction (T1·T1-anchored; sums identically to observed)
  - Closed-form math (no stochastic matching) — same-group dyad weight `α² · (m² + (1−m)²)`, cross-group `2m(1−m)`, where `α = 1 + pref`
  - Live updates as sliders move; Reset to defaults button
  - Default settings reproduce the kappa's headline finding: observed −8.2 pp, structure −16.9 pp, behaviour +3.7 pp, interaction +5.0 pp — i.e. observed decline is purely structural while behaviour intensifies
  - Adaptive insight box describes the regime (opposing forces / both opening / both tightening / structure-dominated / behaviour-dominated)
  - Sibling `README.md` documenting math, decomposition identity, and a v2 plan with two visual grids of agents (group size + segregation per snapshot, fixed distance sensitivity)

### Changed
- **Hub** (`/simulation/index.html`) — added third tab for the new sim; removed "Paper 1 — " prefix from the space-vs-preference caption
- **Status-vs-homophily layout** — preference matrix and realized-matches matrix now sit **side by side** in the left column (previously stacked). Cell editor moved below the matrix pair, agent strip stays at the bottom. Net: ~200 px less vertical height; the input/output juxtaposition is now the visual hero

## [2.3.0] - 2026-05-06

### Added
- **Simulations hub at `/simulation/`** — tab-based navigation between toy simulations
  - Tabs styled as italic Playfair labels with monospace sub-captions; underlined active state in accent color
  - Hash routing: `/simulation/#space-vs-preference` and `/simulation/#status-vs-homophily` for direct linking
  - Iframe-based — each sim remains a self-contained standalone page; hub embeds it via iframe
  - Iframes auto-size to content via `ResizeObserver` on the inner body (same-origin); refits on load + delayed retries to catch font swap, canvas init, and slider layout settling
  - Per-tab caption above the iframe explaining what the sim shows and how it relates to the dissertation
  - Inherited fonts and palette from the rest of the site; mobile breakpoint at 720px

### Changed
- **Relocated Paper 1 sim** from `/simulation/index.html` to `/simulation/space-vs-preference/index.html`
  - URL `/simulation/` still serves valid content (the hub, with this sim selected by default), so existing inbound links and the sitemap entry remain intact
  - Updated back link in the relocated file from `../` to `../../` so standalone access still returns to site root
- `sitemap.xml` — added entries for the two sub-paths; bumped `<lastmod>` on `/simulation/`

## [2.2.0] - 2026-05-06

### Added
- **New toy simulation: "Hierarchy or homophily?"** at `/simulation/status-vs-homophily/`
  - Editable 3×3 directed preference matrix; row = ego group, column = alter group; click a cell, slider adjusts
  - Two-sided stochastic matching (independent Bernoulli acceptance per side; dyad probability = P[i,j] × P[j,i])
  - Three presets: **Homophily** (symmetric, diagonal-heavy → ~63% endogamy uniform across groups), **Hierarchy** (G1 and G2 nearly close G3 out at P=0.05; G3 prefers upward with no diagonal weight → G3 becomes the *most* endogamous group at ~81%, ahead of G1 at ~77%), **Indifferent** (flat → 33% random baseline)
  - Side-by-side display of preference matrix (asymmetric, the truth) and realized matches matrix (symmetric, what an analyst sees)
  - Per-group endogamy bars and aggregate same-group share
  - Insight box describes the active regime and contrasts homophily vs. hierarchy
  - 240 agents (3 groups × 80), 12 matching rounds, ~18 candidates per ego per round
- Sibling `README.md` documenting concept, mechanics, presets, and possible extensions
- Three-group palette: G1 #D9471C (orange, top), G2 #3B6994 (blue, mid), G3 #6B7553 (sage, bottom)

### Conceptual rationale
- The Paper 1 sim (already on the site) shows spatial vs. preference mechanisms behind ethnic endogamy. The new sim addresses a different identification problem from the kappa: same observed endogamy can come from in-group preference *or* from out-group exclusion under a hierarchy. Realized unions can't distinguish the two — only directed preferences can.

## [2.1.0] - 2026-03-11

### Added
- **VR grant** — Research section now includes a funding note for the Swedish Research Council project grant (2025-04468, 5,045,000 SEK, 3 years) on social boundaries through partner choice and residential segregation
- **Postdoc timeline entry** — Background section updated with upcoming postdoctoral researcher position at IAS, Linköping University (2026–)
- CSS for `.research-funding` element with accent border and responsive grid handling

### Changed
- PhD timeline entry date updated from "2021 — present" to "2021 — 2025" to reflect upcoming defense

## [2.0.0] - 2026-03-11

### Changed
- **Replaced Showcase section with Teaching section** — eight lecture slides from the SDS-II course now hosted directly on the site with linked reveal.js presentations
- **Repositioned profile** — hero and meta descriptions now reflect both research and teaching roles; subtitle mentions "lecturer" and the MSc in Computational Social Science
- **History section renamed to "Background"** — PhD entry expanded to include teaching responsibilities; section header simplified
- **Hero copy** broadened — signals quantitative methods, teaching, and business background without being explicit about consulting
- **Nav** updated: "Showcase" → "Teaching"

### Added
- `teaching/sds-ii/` directory with 8 lectures and 2 labs as self-contained reveal.js HTML presentations
- `teaching/sds-ii/data/` with simulated datasets and R data-generation scripts from the course
- Teaching cards grid with week-by-week curriculum (OLS → Multiple regression → Interactions → DAGs → Logistic → Discrete choice → Causal inference)

### Removed
- Showcase section and all associated CSS/JS (`.showcase-*` classes)

### Fixed
- Paper abstract toggle JS now uses `.closest('.paper-item')` instead of `previousElementSibling` (was broken when paper-links div was present between abstract and button)

## [1.1.0] - 2026-03-11

### Changed
- **Papers section** expanded from 2 to 5 papers with accurate titles, co-authors, and abstracts from dissertation project
  - Added published paper: "Cohabitation and Mortality Across the Life Course" (European Journal of Population, 2025)
  - Added preprint: "However Far Away?" with SocArXiv link
  - Added working papers: "2,500 Ethnic Boundaries", "Three Decades of Ethnic Assortative Mating", "Working Together, Living Together?"
  - Paper cards now show authors and direct links to publications
- **Research cards** rewritten to reflect actual dissertation framework (opportunity vs. preference, spatial contingencies, methods)
- **Copy refinement** throughout — less forced, more direct and professional
  - Replaced "The winding road so far" with "Before all this"
  - Toned down hero tagline; removed overly casual phrasing
  - Simplified contact section copy
- **Showcase section** — removed all "Coming soon" tags; cards now describe content areas without placeholder labels
- Increased image heights for full-width images (300px → 420px) and timeline images (260px → 380px)
- Removed decorative captions ("Norrköping, Sweden", "The human side of the data")

### Added
- Link to castle parties video (fb.watch)
- Link to cookbook digital copy (Google Drive)
- Correct Google Scholar profile link
- DOI links for published paper and preprint
- Paper author names and styled link buttons
- CSS for `.paper-authors` and `.paper-links` elements

### Fixed
- Google Scholar link now points to actual profile (user=12yuS3sAAAAJ)

## [1.0.0] - 2026-03-11

### Added
- Initial site launch
- **Hero section** with portrait, intro text, and animated background blobs
- **Research section** with three card layout
- **Publications section** (dark theme) with expandable abstracts
- **Professional History** timeline: PhD at IAS/LiU, The Castle Coworking, Cookbook Adventure, GreenCup
- **Showcase section** with cards for ABMs, visualizations, GitHub projects, and paper results
- **Contact section** with email, LinkedIn, and Google Scholar links
- Responsive design for mobile and tablet
- Scroll-triggered fade-in animations with staggered timing
- Sticky navigation with scroll state and mobile hamburger menu
- Active nav link highlighting on scroll
- Open Graph meta tags for social sharing
- SVG favicon
- README.md, CHANGELOG.md, CNAME, .nojekyll
- GitHub Pages deployment ready

### Design notes
- Inspired by the original Readymag site but rebuilt from scratch
- Color palette: warm off-white (#FAFAF8) with orange accent (#E85D3A) and blue accent (#2D5BFF)
- Typography: Playfair Display (headings), Inter (body), JetBrains Mono (labels/code)
