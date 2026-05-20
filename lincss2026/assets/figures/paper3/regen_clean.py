"""
Regenerate the three Paper 3 presentation figures for the LinCSS deck.

Instead of standalone HTML files embedded via <iframe> (which do not load
reliably when the deck is opened from a file:// path), this writes each
figure as an inline div+script partial. The deck loads plotly.min.js once
and includes the three partials directly, so the figures become part of
slides.html and render the same way the deck is opened.

Reduced chrome: no big title, no footer note, a clean Women/Men toggle.
Paper 3 source files are untouched; this only imports their build_figure().
"""

import sys
from pathlib import Path

SRC = Path("/Users/jeppelina/Documents/R/Research/Paper 3/notes/"
           "rewrite_v2_meso/figures/presentation")
sys.path.insert(0, str(SRC))
OUT = Path(__file__).parent

import pres_fig1_endogamy as f1            # noqa: E402
import pres_fig2_alter_generation as f2    # noqa: E402
import pres_fig3_meso_buckets as f3        # noqa: E402
from plotly.offline import get_plotlyjs    # noqa: E402


def clean(fig, height=600):
    fig.update_layout(title=dict(text=""), height=height,
                      margin=dict(l=24, r=32, t=50, b=96))
    fig.layout.annotations = ()
    for um in (fig.layout.updatemenus or []):
        for btn in um.buttons:
            btn.args = [btn.args[0]]
        um.x = 0.5
        um.xanchor = "center"
        um.y = 1.0
        um.yanchor = "bottom"
        um.direction = "right"
        um.pad = dict(t=4, b=4, l=14, r=14)
        um.font = dict(size=15)
    if fig.layout.showlegend:
        fig.update_layout(legend=dict(
            orientation="h", x=0.5, xanchor="center",
            y=-0.22, yanchor="top", font=dict(size=13)))
    return fig


# plotly.js, written once; the deck loads it a single time
(OUT / "plotly.min.js").write_text(get_plotlyjs(), encoding="utf-8")
print("wrote plotly.min.js")

CONFIG = {"displayModeBar": False, "responsive": True}

for mod, n in [(f1, 1), (f2, 2), (f3, 3)]:
    fig = mod.build_figure()
    if n == 1:
        # fig1 ships without a legend (its three components sit on
        # labelled y-rows). Add the same 3-colour key as figs 2 and 3
        # so the component colours are explained the same way everywhere.
        fig.update_layout(showlegend=True)
        for tr in fig.data:
            tr.showlegend = True
    fig = clean(fig)
    inner = fig.to_html(
        include_plotlyjs=False, full_html=False,
        div_id=f"plotlyfig{n}", config=CONFIG,
        default_width="100%", default_height="600px",
    )
    # The deck standardises on "structure" for the opportunity component;
    # the source figures still label it "Composition". Relabel here only
    # (trace names, legend, hover text), leaving Paper 3 sources untouched.
    inner = inner.replace("Composition", "Structure")
    partial = "```{=html}\n" + inner + "\n```\n"
    (OUT / f"_fig{n}.qmd").write_text(partial, encoding="utf-8")
    print(f"wrote _fig{n}.qmd")
