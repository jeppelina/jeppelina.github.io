/* Statistics and Data Science II - straight-line tools.
   Lifted out of the Week 1 lecture so they can be played with on their own.
   No dependencies, no build step. */
(function () {
    "use strict";

    var INK = "#17181a",
        MUTED = "#858b91",
        RULE = "#c9ccd0",
        ARG = "#9a5b3d",
        TECH = "rgba(44,95,124,0.55)",
        FONT = '"Source Sans 3", -apple-system, BlinkMacSystemFont, sans-serif';

    var EXAM = [26.2,116,33,106,51.5,123,42.6,123,35.4,117,53.8,116,62.9,112,57.7,124,62.2,112,41,123,76.3,121,54.3,134,45,113,25.4,103,62.7,127,64.7,127,40.6,116,55.9,119,39.9,117,39.2,111,57.2,112,50.9,125,51.3,135,35.5,122,46.7,125,42.4,130,60.1,125,29.8,107,43.1,123,27.4,106,41,122,40.8,104,47.4,113,17.5,124,14.5,100,30.5,99,41.5,138,56.5,121,46.9,122,43.8,120,35.2,107,49,114,60.9,126,59.1,91,59.4,117,57.8,122,35.1,108,36,123,40,96,32.9,116,17.2,96,16.6,90,54.8,117,61.8,133,39.6,118,48.2,107,44,109,52.9,124,44.9,132,52.7,118,37.3,134,41.9,129,48.1,116,37.6,97,54.3,120,53.3,120,53,115,20.5,98,20.7,110,41.8,99,44.3,102,52,89,27.9,119,38.8,93,44.8,134,30.4,134,50.9,108,62.1,114,24.8,118,45.5,114,49.6,103,45.8,104,56.4,128,53.2,118,55.9,137,32.6,104,59.5,120,57.7,116,58.4,109,52.6,114,55.5,125,35.7,126,49.2,121,30.8,113,31.9,108,40.2,129,41,125,54.1,105,32.9,117,50.8,98,21.2,129,38.1,109,37.4,107,40.7,124,42.8,87,56.3,127,59.4,125,31.4,116,42.4,130,40.8,112,36.9,104,29.7,99,38.8,116,63.4,126,47.2,124,52.4,130,32,111,39.5,115,51,135,56.8,123,58.3,125,73.2,137,13,102,52.3,121,48.5,110,56.4,120,30.4,97,38.4,130,41.1,130,21.7,111,61.4,122,36,95,45.8,110,41.2,115,59.5,123,17.3,77,72.5,124,49.2,121,63.7,116,42.2,121,41.3,117,53.7,122,52.6,124,36.8,92,50.5,116,29.3,130,63.9,127,37,117,46.7,106,36.8,86,37,126,51.1,138,51.4,138,44.3,105,46.9,120,23.2,111,36.1,105,36.1,104,39.9,101,20.7,112,73.6,117,58.6,125,29.4,105,38.6,118,43.9,123,19.6,107,25.6,107,40.4,113,44,102,73.9,127,53.2,118,46.4,103,36.9,103,64.3,129,36.9,137,70.1,112,35.6,107,39.4,104,56.9,125,52.3,106,50.9,133,44.1,102,41.1,105,65.4,123,38.3,120,59.1,118,60,118,57.2,131,9.3,121,23.3,94,54.4,126,43.3,131,46,124,55.5,135,54.3,125,42.6,124,39.8,120,57.5,126,67.8,118,45.8,116,52.3,106,36.7,102,45.7,96,48.1,112,22.8,124,49.1,103,28.8,121,47.8,124,52.2,115,32.2,96,43.1,128,51.5,109,43.6,129,39.4,126,39.8,122,42.9,127,61.4,118,52.8,110,55.5,123,42,124,41,94,51.9,120,52.9,123,54.4,137,31.3,117,35.6,113,47.1,120,29.7,112,35.8,108,47.1,116,44.7,121,50.9,124,29.2,113,48.3,103,61,114,51,103,57.3,113,57.7,136,31.3,103,35.8,110,43,123,38.2,131,54.3,121,27.8,97,50.8,129,49.1,131,40.9,120,45.7,131,52,103,45,122,49.5,106,46.2,127,53,114,30.8,104,44.5,122,52,122,41.6,115,56.3,100,43.4,125,38.6,107,38.5,108,45.9,106,68.8,109,50.9,116,27.4,108,37.7,112,61.9,126,54,111,38.8,105,40.9,124,37.1,120,48.4,115,51.4,114,51.4,122,67,124,53.9,127,45.4,117,28.7,109,42,116,53.7,120,30.2,104,34.8,95,60.2,128,42.7,113,50.2,114,30.9,124,76.1,128,47.8,131,44.6,116,44.3,123,30.8,112,47.4,109,38.3,114,30.9,115,52.7,116,21.8,103,60.1,119,26.3,111,46.1,128,66.1,111,24.7,121,62.7,130,63.2,122,42.6,111,24.7,104,31.5,107,38.4,139,37.9,110,47.7,112,28,105,44.4,102,46.8,138,24.3,99,53.2,134,32.5,98,39.8,122,59.9,134,41.4,98,40.1,90,46.3,127,36.3,106,39.6,123,36.5,115,46.7,121,31.3,125,53.3,133,27,103,48.5,122,55,135,47,119,59.9,121,57.8,132,42.7,125,73.1,115,49.2,113,34.3,108,27.8,113,40.9,114,54.4,119,53.1,125,44.6,125,64.5,109,37.9,89,46.8,111,44.7,104,24.1,107,45.1,116,24.7,111,50.8,130,42.3,129,42.5,102,21.4,108,43.6,115,44.4,124,74,121,51.5,128,55.8,135,44.1,107,49.9,126,50.7,129,41.9,124,23.4,91,57,136,48.1,118,54.1,127,31,110,12.1,98,25.2,114,37.1,117,63.6,113,53.7,113,69.4,145,38.4,134,55.6,99,41.9,115,55.4,118,18.9,105,57.5,109,52.6,128,31.4,122,46.7,124,56.2,107,41.6,113,39.7,107,24.7,102,35.7,134,59.8,124,57.1,123,50.7,121,58.4,126,55.8,112,37,106,49.3,132,37.4,112,48,111,37.7,127,27.9,115,44,95,20.9,113,48.1,111,48.8,110,41.5,120,53.2,109,48.5,117,29.4,117,37.2,107,39,105,67.5,115,21.9,95,39.8,117,60.6,122,46.3,114,31.3,115,29.3,119,27.3,122,60.2,116,54.8,103,36.3,92,43.4,99,39.1,119,37.9,120,28.3,113,43.1,118,28,120,35.1,129,41.2,117,48.3,112,55.3,113,51.1,113,43.5,119,42.8,112,38.8,116,40.9,145,48.4,133,19.3,106,51.7,128,46.4,117,42.5,113,48.7,138,41.2,128,24.5,115,39.7,114,37.7,105,28.1,101,33.4,108,39.7,111,49,110,58.3,116,31.6,85,49.4,109,38.1,127,57.2,109,47.2,123,51.8,117,35.6,97,52.1,113,44.8,110,54.2,122,41.7,112,54.5,112,69.3,109,59.7,122,38.5,110,32.5,106,30.3,102,51.7,114,52.3,111,26.5,101,31.2,107,21.2,88,38.5,112,49.7,107,42.4,109,62.8,119,48,124,55.1,97,26.8,102,46.7,110,55.2,118,34.4,118,32.3,111,51.2,131,42.1,114,38.4,102,38.1,112,45.8,95,57,130,55.3,114,55.2,128,32.5,121,50.2,114,22.5,116,46.2,124,47.3,122,25,113];
    var FIT_A = 100.1562, FIT_B = 0.3508;

    var FIT_SSR = 0;
    for (var q = 0; q < EXAM.length; q += 2) {
        var fe = EXAM[q + 1] - (FIT_A + FIT_B * EXAM[q]);
        FIT_SSR += fe * fe;
    }

    function seq(lo, hi, step) {
        var out = [], v = lo;
        while (v <= hi + 1e-9) { out.push(Math.round(v * 1e6) / 1e6); v += step; }
        return out;
    }

    function group(n) {
        return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    /* --- a plot that draws axes, an optional cloud of points, and one line --- */

    function Plot(canvas, spec) {
        this.cv = canvas;
        this.spec = spec;
        this.state = { a: 0, b: 0, fit: false };
        this.hover = null;

        var self = this;
        function at(e) {
            var r = self.cv.getBoundingClientRect();
            var clientX = e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
            return (clientX - r.left) * (self.W / r.width);
        }
        function track(e) { self.setHover(at(e)); }
        function clear() { self.hover = null; self.render(); }

        canvas.addEventListener("mousemove", track);
        canvas.addEventListener("mouseleave", clear);
        canvas.addEventListener("touchstart", track, { passive: true });
        canvas.addEventListener("touchmove", track, { passive: true });
        canvas.addEventListener("touchend", clear);

        var pending;
        window.addEventListener("resize", function () {
            clearTimeout(pending);
            pending = setTimeout(function () { self.resize(); }, 80);
        });

        this.resize();
    }

    Plot.prototype.setHover = function (mx) {
        var xt = this.spec.xt;
        if (mx < this.L || mx > this.W - this.R) this.hover = null;
        else this.hover = xt[0] + (mx - this.L) / (this.W - this.L - this.R) * (xt[xt.length - 1] - xt[0]);
        this.render();
    };

    Plot.prototype.resize = function () {
        var host = this.cv.parentNode;
        var w = Math.max(280, host.clientWidth || 880);
        var dpr = window.devicePixelRatio || 1;

        this.W = w;
        this.H = w < 520 ? 230 : this.spec.height;
        this.L = w < 520 ? 44 : 62;
        this.R = 14;
        this.T = 12;
        this.B = 42;

        this.cv.width = Math.round(this.W * dpr);
        this.cv.height = Math.round(this.H * dpr);
        this.cv.style.width = "100%";
        this.cv.style.height = this.H + "px";
        this.cx = this.cv.getContext("2d");
        this.cx.setTransform(dpr, 0, 0, dpr, 0, 0);

        this.render();
    };

    Plot.prototype.px = function (v) {
        var xt = this.spec.xt, x0 = xt[0], x1 = xt[xt.length - 1];
        return this.L + (v - x0) / (x1 - x0) * (this.W - this.L - this.R);
    };

    Plot.prototype.py = function (v) {
        var yt = this.spec.yt, y0 = yt[0], y1 = yt[yt.length - 1];
        return this.H - this.B - (v - y0) / (y1 - y0) * (this.H - this.T - this.B);
    };

    Plot.prototype.set = function (state) {
        for (var k in state) if (Object.prototype.hasOwnProperty.call(state, k)) this.state[k] = state[k];
        this.render();
    };

    Plot.prototype.render = function () {
        var cx = this.cx;
        if (!cx) return;

        var s = this.spec,
            xt = s.xt, yt = s.yt,
            x0 = xt[0], x1 = xt[xt.length - 1],
            y0 = yt[0], y1 = yt[yt.length - 1],
            a = this.state.a, b = this.state.b,
            W = this.W, H = this.H, L = this.L, R = this.R, T = this.T, B = this.B,
            small = W < 520,
            i;

        cx.clearRect(0, 0, W, H);
        cx.font = (small ? "11px " : "13px ") + FONT;
        cx.lineWidth = 1;
        cx.strokeStyle = RULE;
        cx.fillStyle = MUTED;

        cx.beginPath();
        cx.moveTo(L, T);
        cx.lineTo(L, H - B);
        cx.lineTo(W - R, H - B);
        cx.stroke();

        cx.textAlign = "center";
        cx.textBaseline = "top";
        for (i = 0; i < xt.length; i++) {
            if (small && i % 2) continue;
            var X = this.px(xt[i]);
            cx.beginPath();
            cx.moveTo(X, H - B);
            cx.lineTo(X, H - B + 5);
            cx.stroke();
            cx.fillText(xt[i], X, H - B + 9);
        }

        cx.textAlign = "right";
        cx.textBaseline = "middle";
        for (i = 0; i < yt.length; i++) {
            if (small && i % 2) continue;
            var Y = this.py(yt[i]);
            cx.beginPath();
            cx.moveTo(L - 5, Y);
            cx.lineTo(L, Y);
            cx.stroke();
            cx.fillText(yt[i], L - 9, Y);
        }

        cx.fillStyle = "#33383d";
        cx.textAlign = "center";
        cx.textBaseline = "bottom";
        cx.fillText(s.xlab, L + (W - L - R) / 2, H - 4);
        cx.save();
        cx.translate(small ? 11 : 14, T + (H - T - B) / 2);
        cx.rotate(-Math.PI / 2);
        cx.textBaseline = "top";
        cx.fillText(s.ylab, 0, 0);
        cx.restore();

        cx.save();
        cx.beginPath();
        cx.rect(L, T, W - L - R, H - T - B);
        cx.clip();

        /* residual whiskers, then the points themselves */
        if (s.data) {
            cx.strokeStyle = "rgba(133,139,145,0.40)";
            cx.lineWidth = 0.6;
            cx.beginPath();
            for (i = 0; i < s.data.length; i += 2) {
                var rx = this.px(s.data[i]);
                cx.moveTo(rx, this.py(s.data[i + 1]));
                cx.lineTo(rx, this.py(a + b * s.data[i]));
            }
            cx.stroke();

            cx.fillStyle = TECH;
            for (i = 0; i < s.data.length; i += 2) {
                cx.beginPath();
                cx.arc(this.px(s.data[i]), this.py(s.data[i + 1]), 2.1, 0, 6.2832);
                cx.fill();
            }
        }

        if (this.state.fit) {
            cx.strokeStyle = MUTED;
            cx.lineWidth = 1.6;
            cx.setLineDash([6, 5]);
            cx.beginPath();
            cx.moveTo(this.px(x0), this.py(FIT_A + FIT_B * x0));
            cx.lineTo(this.px(x1), this.py(FIT_A + FIT_B * x1));
            cx.stroke();
            cx.setLineDash([]);
        }

        cx.strokeStyle = ARG;
        cx.lineWidth = 3;
        cx.beginPath();
        cx.moveTo(this.px(x0), this.py(a + b * x0));
        cx.lineTo(this.px(x1), this.py(a + b * x1));
        cx.stroke();
        cx.restore();

        if (this.hover === null) return;
        var hy = a + b * this.hover;
        if (hy < y0 || hy > y1) return;

        var PX = this.px(this.hover), PY = this.py(hy);
        cx.save();
        cx.setLineDash([4, 4]);
        cx.strokeStyle = MUTED;
        cx.lineWidth = 1;
        cx.beginPath();
        cx.moveTo(PX, PY);
        cx.lineTo(PX, H - B);
        cx.stroke();
        cx.beginPath();
        cx.moveTo(PX, PY);
        cx.lineTo(L, PY);
        cx.stroke();
        cx.restore();

        cx.fillStyle = ARG;
        cx.beginPath();
        cx.arc(PX, PY, 5, 0, 6.2832);
        cx.fill();

        cx.font = "600 " + (small ? "13px " : "15px ") + FONT;
        cx.fillStyle = INK;
        var flip = PX > W - (small ? 150 : 230);
        cx.textAlign = flip ? "right" : "left";
        cx.textBaseline = "bottom";
        cx.fillText(s.readout(this.hover, hy), PX + (flip ? -12 : 12), PY - 10);
    };

    /* --- wiring --- */

    function byId(id) { return document.getElementById(id); }

    function showEquation(el, a, b, decimals) {
        el.innerHTML = a.toFixed(decimals) + " " +
            (b < 0 ? "−" : "+") + " " +
            Math.abs(b).toFixed(2) + " × ";
    }

    /* Tool 1: a line on an empty grid. */
    function lineTool() {
        var cv = byId("toolLineCv");
        if (!cv) return;

        var plot = new Plot(cv, {
            height: 300,
            xt: seq(0, 50, 10),
            yt: seq(0, 150, 25),
            xlab: "x",
            ylab: "y",
            readout: function (x, y) {
                return "x = " + x.toFixed(1) + " y = " + y.toFixed(1);
            }
        });

        var ra = byId("toolLineA"), rb = byId("toolLineB"), eq = byId("toolLineEq");

        function update() {
            var a = +ra.value, b = +rb.value;
            showEquation(eq, a, b, 0);
            plot.set({ a: a, b: b });
        }

        ra.addEventListener("input", update);
        rb.addEventListener("input", update);
        byId("toolLineReset").addEventListener("click", function () {
            ra.value = 21; rb.value = 2; update();
        });

        ra.value = 21; rb.value = 2;
        update();
    }

    /* Tool 2: the same line, now over 495 students. */
    function fitTool() {
        var cv = byId("toolFitCv");
        if (!cv) return;

        var plot = new Plot(cv, {
            height: 300,
            xt: seq(0, 80, 10),
            yt: seq(70, 150, 10),
            xlab: "Hours studied",
            ylab: "Exam score",
            data: EXAM,
            readout: function (x, y) {
                return "x = " + x.toFixed(1) + " ŷ = " + y.toFixed(1);
            }
        });

        var ra = byId("toolFitA"),
            rb = byId("toolFitB"),
            eq = byId("toolFitEq"),
            fit = byId("toolFitLine"),
            sq = byId("toolFitSsr"),
            stat = byId("toolFitStat");

        function update() {
            var a = +ra.value, b = +rb.value, i, ssr = 0;
            showEquation(eq, a, b, 1);
            for (i = 0; i < EXAM.length; i += 2) {
                var e = EXAM[i + 1] - (a + b * EXAM[i]);
                ssr += e * e;
            }
            stat.innerHTML = sq.checked
                ? "your line <b>" + group(ssr) + "</b>" +
                  (fit.checked ? "<span class=\"sep\">·</span>regression line <b>" + group(FIT_SSR) + "</b>" : "")
                : "";
            plot.set({ a: a, b: b, fit: fit.checked });
        }

        ra.addEventListener("input", update);
        rb.addEventListener("input", update);
        fit.addEventListener("change", update);
        sq.addEventListener("change", update);
        byId("toolFitReset").addEventListener("click", function () {
            ra.value = 115.7; rb.value = 0;
            fit.checked = false; sq.checked = false;
            update();
        });

        ra.value = 115.7; rb.value = 0;
        update();
    }

    function start() { lineTool(); fitTool(); }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
})();
