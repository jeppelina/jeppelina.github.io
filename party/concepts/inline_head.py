"""Embed head.js + the head images into each concept page, so the pages work when opened as plain files.
Re-run after changing head.js or the images:  python3 inline_head.py"""
import base64, glob, json, os, re
here = os.path.dirname(os.path.abspath(__file__))
from io import BytesIO
from PIL import Image
def small(f, size=360, q=68):
    im = Image.open(f); im = im.resize((size, size), Image.LANCZOS); buf = BytesIO()
    im.save(buf, 'WEBP', quality=q, method=6); return buf.getvalue()
imgs = {os.path.basename(f)[:-5]: 'data:image/webp;base64,' + base64.b64encode(small(f)).decode()
        for f in sorted(glob.glob(os.path.join(here, 'heads', '*.webp')))}
js = open(os.path.join(here, 'head.js')).read()
block = ('<!--head:start-->\n<script>window.PDP_HEADS=' + json.dumps(imgs) + ';</script>\n<script>\n' + js + '\n</script>\n<!--head:end-->')
for f in sorted(glob.glob(os.path.join(here, '[1-5]-*.html'))):
    s = open(f).read()
    if '<!--head:start-->' in s:
        s = re.sub(r'<!--head:start-->.*?<!--head:end-->', lambda m: block, s, flags=re.S)
    else:
        assert '<script src="head.js"></script>' in s, f
        s = s.replace('<script src="head.js"></script>', block)
    open(f, 'w').write(s)
    print(os.path.basename(f), os.path.getsize(f) // 1024, 'KB')
