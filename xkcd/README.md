# /xkcd

One xkcd comic a day, with a button for a random one. Not linked from anywhere
on the site: it lives at `/xkcd` and you reach it by typing the address.

Plain HTML in a single file, like the rest of the site. No build step, no
dependencies, no network calls at runtime. The 37 images sit in `img/` and are
served from here rather than hot-linked from xkcd's servers.

## How the daily pick works

The comics are listed in `index.html` in a fixed, shuffled order. The page takes
the number of days since the epoch, modulo 37, and shows that one. So:

- everyone sees the same comic on the same day,
- it turns over at the viewer's local midnight,
- all 37 appear once before any repeats, about five weeks of cycle,
- the shuffle means consecutive days are unrelated comics rather than
  neighbouring comic numbers.

The random button picks any other comic and never lands on the one already
showing. **R** on the keyboard does the same thing.

## URL options

| URL | Does |
|---|---|
| `/xkcd/` | Today's comic |
| `/xkcd/?n=2048` | One specific comic by its xkcd number |
| `/xkcd/?embed=1` | Hides the heading and tightens the padding, for iframes |
| `/xkcd/?theme=dark` | Forces dark; `light` forces light. Otherwise it follows the viewer's system setting |

These combine: `/xkcd/?embed=1&theme=dark`.

## Embedding it

Fixed height, works anywhere:

```html
<iframe src="https://www.jesperlindmarker.com/xkcd/?embed=1"
        style="width:100%;max-width:700px;height:820px;border:0"
        title="xkcd of the day" loading="lazy"></iframe>
```

To have it size itself, the page posts its height to the parent whenever the
comic changes:

```html
<iframe id="xkcd" src="https://www.jesperlindmarker.com/xkcd/?embed=1"
        style="width:100%;max-width:700px;height:400px;border:0"
        title="xkcd of the day"></iframe>
<script>
  addEventListener("message", function (e) {
    if (e.data && e.data.type === "xkcd-height") {
      document.getElementById("xkcd").style.height = e.data.height + "px";
    }
  });
</script>
```

In embedded mode the comic is capped at 560px tall, so a fixed-height iframe
does not get a 1968px comic dropped into it. The credit line and the licence
note stay visible in embeds on purpose: attribution is a condition of the
licence, not decoration.

## The licence, and the one thing that would break it

The comics are Randall Munroe's, published under
[CC BY-NC 2.5](https://creativecommons.org/licenses/by-nc/2.5/). That allows
copying and sharing them, with attribution, for **non-commercial** use. A
personal academic site with no ads, no tracking-for-sale and nothing behind a
paywall is non-commercial, so this page is fine as it stands.

What would break it: putting ads on the site, or on this page specifically.
That turns a licensed use into an unlicensed one. If ads ever go on the site,
this page has to come down or get permission from Munroe directly.

The images are served unaltered, as required. The mouseover text is deliberately
not reproduced here: it is usually the actual punchline, and the comic title
links to the original page where it lives.

## Adding or removing comics

The list is the `COMICS` array near the bottom of `index.html`. Each entry is
`{n, t, f, w, h}`: comic number, title, filename in `img/`, and the file's
natural width and height. The dimensions are what stop small old comics being
upscaled into mush and what reserve the right space before the image loads, so
they need to be the real ones:

```
python3 -c "import struct;d=open('img/FILE.png','rb').read(33);print(struct.unpack('>II',d[16:24]))"
```

The modulo arithmetic adapts to the array length on its own, so adding a comic
just lengthens the cycle. Keep the order shuffled rather than sorted.

The same 37 comics, with notes on which week of SDS II each one suits, are in
the course repo at `Teaching/SDS II 2026/Assets/xkcd/index.md`.
