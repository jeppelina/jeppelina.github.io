/* Paper 4 interactive: the opportunity decomposition of educational homogamy.
   Numbers are the KHB nested-model odds ratios (Model 4 scale) from the Swedish
   register analysis, women and men as ego, first unions 1991-2019.
   Each array is [M0, M1, M2, M3, M4]: baseline, then channels added in the
   order people meet them (universities, workplaces, organisations, neighbourhoods).
   Self-contained, no dependencies. */
(function () {
    "use strict";

    var DATA = {
        women: {
            "No gymnasium":   [1.837, 1.778, 1.781, 1.788, 1.832],
            "Gymnasium":      [2.903, 2.838, 2.730, 2.730, 2.713],
            "Post-sec short": [1.745, 1.656, 1.557, 1.548, 1.488],
            "Post-sec long":  [1.858, 1.517, 1.317, 1.297, 1.337]
        },
        men: {
            "No gymnasium":   [1.157, 1.112, 1.098, 1.102, 1.134],
            "Gymnasium":      [1.513, 1.475, 1.405, 1.398, 1.409],
            "Post-sec short": [2.729, 2.364, 2.184, 2.086, 1.917],
            "Post-sec long":  [9.369, 6.553, 5.541, 5.075, 4.739]
        }
    };

    // Top of the education distribution first, so the eye sees the top bars
    // collapse while the bottom ones barely move.
    var ORDER = ["Post-sec long", "Post-sec short", "Gymnasium", "No gymnasium"];
    var CHANNELS = ["Baseline", "Universities", "Workplaces", "Organisations", "Neighbourhoods"];
    var CUMULATIVE = [
        "nothing yet",
        "universities",
        "universities and workplaces",
        "universities, workplaces, and organisations",
        "universities, workplaces, organisations, and neighbourhoods"
    ];

    // Linear axis anchored at 1x (different education), matching the poster
    // dumbbell. Separate caps per sex because the men's odds-ratio range is
    // roughly five times wider.
    var MAXX = { women: 3.0, men: 10.0 };

    var root = document.getElementById("p4-explorer");
    if (!root) { return; }
    var chart = document.getElementById("p4-chart");
    var range = document.getElementById("p4-range");
    var ticks = document.getElementById("p4-ticks");
    var readout = document.getElementById("p4-readout");
    var segButtons = root.querySelectorAll(".p4-seg button");

    var sex = "women";
    var step = 0;

    // Position of an odds ratio on the 1x-anchored axis, as a percent of track.
    function xpos(v, s) {
        var p = (v - 1) / (MAXX[s] - 1) * 100;
        if (p < 0) { p = 0; }
        if (p > 100) { p = 100; }
        return p;
    }

    // Share of baseline log-odds removed by the channels switched on so far.
    // At the final step this equals the published KHB percentage explained.
    function explainedPct(s, lvl, st) {
        var base = Math.log(DATA[s][lvl][0]);
        if (base <= 0) { return 0; }
        return (base - Math.log(DATA[s][lvl][st])) / base * 100;
    }

    function buildChart() {
        var html = "";
        for (var i = 0; i < ORDER.length; i++) {
            html += '<div class="p4-row" data-level="' + ORDER[i] + '">' +
                '<div class="p4-row-label">' + ORDER[i] + '</div>' +
                '<div class="p4-track">' +
                    '<div class="p4-axis"></div>' +
                    '<div class="p4-ref"></div>' +
                    '<div class="p4-link"></div>' +
                    '<div class="p4-dot p4-dot-base"></div>' +
                    '<div class="p4-dot p4-dot-cur"></div>' +
                '</div>' +
                '<div class="p4-val"></div>' +
            '</div>';
        }
        chart.innerHTML = html;

        var tickHtml = "";
        for (var j = 0; j < CHANNELS.length; j++) {
            tickHtml += '<button type="button" class="p4-tick" data-step="' + j + '">' + CHANNELS[j] + '</button>';
        }
        ticks.innerHTML = tickHtml;
    }

    function render() {
        chart.classList.toggle("is-women", sex === "women");
        chart.classList.toggle("is-men", sex === "men");
        for (var i = 0; i < ORDER.length; i++) {
            var lvl = ORDER[i];
            var vals = DATA[sex][lvl];
            var base = vals[0];
            var cur = vals[step];
            var xBase = xpos(base, sex);
            var xCur = xpos(cur, sex);
            var row = chart.children[i];
            var link = row.querySelector(".p4-link");
            var dotBase = row.querySelector(".p4-dot-base");
            var dotCur = row.querySelector(".p4-dot-cur");
            var val = row.querySelector(".p4-val");

            dotBase.style.left = xBase.toFixed(2) + "%";
            dotCur.style.left = xCur.toFixed(2) + "%";
            var lo = Math.min(xCur, xBase);
            var hi = Math.max(xCur, xBase);
            link.style.left = lo.toFixed(2) + "%";
            link.style.width = (hi - lo).toFixed(2) + "%";
            // A channel can push the estimate up rather than down (residential
            // suppression): flag it so the connector reads as a different colour.
            if (xCur > xBase + 0.05) { link.classList.add("is-up"); }
            else { link.classList.remove("is-up"); }
            val.innerHTML = '<span class="p4-v-base">' + base.toFixed(2) + '</span>' +
                '<span class="p4-v-arrow">&rarr;</span>' +
                '<span class="p4-v-cur">' + cur.toFixed(2) + '</span>';
        }

        var tickEls = ticks.querySelectorAll(".p4-tick");
        for (var k = 0; k < tickEls.length; k++) {
            tickEls[k].classList.toggle("is-on", k === step);
        }
        range.value = step;
        renderReadout();
    }

    function renderReadout() {
        if (step === 0) {
            readout.innerHTML = "Baseline educational homogamy: this already nets out who each person could realistically have met, plus age, cohort, and region. It is not a raw count. " +
                "Each bar is how much more often people partner within their education level than across it. " +
                "<strong>Drag the slider to add the settings where they actually overlapped.</strong>";
            return;
        }
        var topPct = Math.round(explainedPct(sex, "Post-sec long", step));
        var lowRaw = explainedPct(sex, "No gymnasium", step);
        var lowTxt = lowRaw < 1 ? "under 1" : String(Math.round(lowRaw));
        if (sex === "men") {
            // Men's baselines are far apart: the most-educated sort strongly, the
            // least-educated barely at all. Naming the two bases keeps the larger
            // bottom share from reading as a contradiction of the smaller top one.
            readout.innerHTML = "With " + CUMULATIVE[step] + " accounted for, shared settings explain " +
                "<strong>" + topPct + "%</strong> of the strong educational homogamy among the most-educated men, " +
                "who partner within their education almost ten times as often as across it, and " +
                "<strong>" + lowTxt + "%</strong> of the slim homogamy among the least-educated.";
            return;
        }
        readout.innerHTML = "With " + CUMULATIVE[step] + " accounted for, sharing those settings explains " +
            "<strong>" + topPct + "%</strong> of educational homogamy among the most-educated " + sex +
            ", but only <strong>" + lowTxt + "%</strong> among the least-educated.";
    }

    // ---- wiring ----
    buildChart();
    render();

    range.addEventListener("input", function () {
        step = parseInt(range.value, 10) || 0;
        render();
    });

    ticks.addEventListener("click", function (e) {
        var btn = e.target.closest(".p4-tick");
        if (!btn) { return; }
        step = parseInt(btn.getAttribute("data-step"), 10) || 0;
        render();
    });

    for (var b = 0; b < segButtons.length; b++) {
        segButtons[b].addEventListener("click", function () {
            sex = this.getAttribute("data-sex");
            for (var n = 0; n < segButtons.length; n++) {
                var on = segButtons[n] === this;
                segButtons[n].classList.toggle("is-on", on);
                segButtons[n].setAttribute("aria-pressed", on ? "true" : "false");
            }
            render();
        });
    }
})();
