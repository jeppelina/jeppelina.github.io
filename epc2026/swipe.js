/* /epc2026 swipe stack
   Pointer-driven Tinder-style card deck. Mobile-first, also works with mouse,
   keyboard arrows, and two big buttons. After the last card, the stack flips
   to an end state with a scroll-down CTA. */

(function () {
    'use strict';

    // ---------- Nav (hamburger + scrolled border) ----------
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
    const nav = document.getElementById('nav');
    if (nav) {
        const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ---------- Swipe stack ----------
    const stack = document.getElementById('swipe-stack');
    if (!stack) return;

    const cards = Array.from(stack.querySelectorAll('.swipe-card'));
    const progress = document.getElementById('swipe-progress');
    const dots = progress ? Array.from(progress.querySelectorAll('span')) : [];
    const btnSkip = document.getElementById('btn-skip');
    const btnYes = document.getElementById('btn-yes');
    const replayBtn = document.getElementById('replay');
    const actions = document.getElementById('swipe-actions');

    let current = 0;
    const SWIPE_THRESHOLD = 90;     // px past center to commit
    const VELOCITY_THRESHOLD = 0.45;// px per ms to commit on flick
    let drag = null;                // { card, startX, startY, lastX, lastT, dx, dy, locked }

    function setDepths() {
        cards.forEach((card, i) => {
            const offset = i - current;
            if (offset < 0) {
                card.dataset.depth = 'hidden';
                card.classList.remove('is-active');
            } else if (offset === 0) {
                card.dataset.depth = '';
                card.classList.add('is-active');
                card.style.transform = '';
                card.style.opacity = '';
            } else if (offset <= 3) {
                card.dataset.depth = String(offset);
                card.classList.remove('is-active');
                card.style.transform = '';
                card.style.opacity = '';
            } else {
                card.dataset.depth = 'hidden';
                card.classList.remove('is-active');
            }
        });
        updateProgress();
        updateActions();
    }

    function updateProgress() {
        dots.forEach((d, i) => {
            d.classList.remove('is-current', 'is-done');
            if (i < current) d.classList.add('is-done');
            else if (i === current) d.classList.add('is-current');
        });
    }

    function updateActions() {
        const finished = current >= cards.length;
        if (actions) actions.style.visibility = finished ? 'hidden' : 'visible';
    }

    function activeCard() {
        return cards[current] || null;
    }

    function commitSwipe(direction) {
        const card = activeCard();
        if (!card) return;
        const target = (direction === 'right') ? card.dataset.target : null;
        const off = (direction === 'right' ? 1 : -1) * (window.innerWidth + 200);
        const rot = direction === 'right' ? 20 : -20;
        card.classList.remove('is-dragging');
        card.style.transform = `translate(${off}px, 40px) rotate(${rot}deg)`;
        card.style.opacity = '0';
        // Stamp visibility
        const stampYes = card.querySelector('.stamp-yes');
        const stampSkip = card.querySelector('.stamp-skip');
        if (stampYes) stampYes.style.opacity = direction === 'right' ? '1' : '0';
        if (stampSkip) stampSkip.style.opacity = direction === 'left' ? '1' : '0';

        current += 1;
        setTimeout(() => {
            if (current >= cards.length) {
                finishStack();
            } else {
                setDepths();
            }
            // After the card flies off, take the visitor to whatever they
            // matched with. We update the URL hash so :target styling fires
            // (e.g. the agenda-item pulse), then smooth-scroll.
            if (target) {
                const el = document.querySelector(target);
                if (el) {
                    // Set the hash without an extra jump, then animate.
                    if (history.replaceState) {
                        history.replaceState(null, '', target);
                    } else {
                        location.hash = target;
                    }
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }, 320);
    }

    function finishStack() {
        stack.classList.add('is-finished');
        // Mark every dot as done now that the deck is exhausted.
        dots.forEach(d => { d.classList.remove('is-current'); d.classList.add('is-done'); });
        updateActions();
        const end = document.getElementById('swipe-end');
        if (end) end.setAttribute('aria-hidden', 'false');
    }

    function resetStack() {
        cards.forEach(card => {
            card.style.transform = '';
            card.style.opacity = '';
            card.classList.remove('is-revealed', 'is-active', 'is-dragging');
            const sy = card.querySelector('.stamp-yes');
            const ss = card.querySelector('.stamp-skip');
            if (sy) sy.style.opacity = '0';
            if (ss) ss.style.opacity = '0';
        });
        current = 0;
        stack.classList.remove('is-finished');
        const end = document.getElementById('swipe-end');
        if (end) end.setAttribute('aria-hidden', 'true');
        setDepths();
    }

    // ---------- Drag handling ----------
    function onPointerDown(e) {
        const card = activeCard();
        if (!card) return;
        // Let the reveal button receive its click without starting a drag.
        if (e.target.closest('.reveal-btn')) return;
        drag = {
            card,
            startX: e.clientX,
            startY: e.clientY,
            lastX: e.clientX,
            lastT: performance.now(),
            dx: 0,
            dy: 0,
            locked: null
        };
        card.setPointerCapture && card.setPointerCapture(e.pointerId);
        card.classList.add('is-dragging');
    }

    function onPointerMove(e) {
        if (!drag) return;
        const dx = e.clientX - drag.startX;
        const dy = e.clientY - drag.startY;

        // Determine if this gesture is horizontal (swipe) or vertical (scroll).
        if (drag.locked === null) {
            if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
                drag.locked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
            }
        }
        if (drag.locked === 'y') {
            // Cancel the drag, let the browser scroll.
            drag.card.classList.remove('is-dragging');
            drag.card.style.transform = '';
            drag = null;
            return;
        }

        drag.dx = dx;
        drag.dy = dy;
        const t = performance.now();
        drag.velocity = (e.clientX - drag.lastX) / Math.max(1, t - drag.lastT);
        drag.lastX = e.clientX;
        drag.lastT = t;

        const rot = dx / 18;
        drag.card.style.transform = `translate(${dx}px, ${dy * 0.4}px) rotate(${rot}deg)`;

        const stampYes = drag.card.querySelector('.stamp-yes');
        const stampSkip = drag.card.querySelector('.stamp-skip');
        const yesOp = Math.min(1, Math.max(0, dx / SWIPE_THRESHOLD));
        const skipOp = Math.min(1, Math.max(0, -dx / SWIPE_THRESHOLD));
        if (stampYes) stampYes.style.opacity = String(yesOp);
        if (stampSkip) stampSkip.style.opacity = String(skipOp);
    }

    function onPointerUp(e) {
        if (!drag) return;
        const { card, dx } = drag;
        const v = drag.velocity || 0;
        drag = null;
        card.classList.remove('is-dragging');

        const past = Math.abs(dx) > SWIPE_THRESHOLD;
        const flicked = Math.abs(v) > VELOCITY_THRESHOLD;

        if (past || flicked) {
            commitSwipe(dx > 0 ? 'right' : 'left');
        } else {
            card.style.transform = '';
            const sy = card.querySelector('.stamp-yes');
            const ss = card.querySelector('.stamp-skip');
            if (sy) sy.style.opacity = '0';
            if (ss) ss.style.opacity = '0';
        }
    }

    stack.addEventListener('pointerdown', onPointerDown);
    stack.addEventListener('pointermove', onPointerMove);
    stack.addEventListener('pointerup', onPointerUp);
    stack.addEventListener('pointercancel', onPointerUp);

    // ---------- Reveal toggles ----------
    cards.forEach(card => {
        const btn = card.querySelector('.reveal-btn');
        if (!btn) return;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.add('is-revealed');
        });
    });

    // ---------- Buttons ----------
    if (btnSkip) btnSkip.addEventListener('click', () => commitSwipe('left'));
    if (btnYes)  btnYes.addEventListener('click',  () => commitSwipe('right'));
    if (replayBtn) replayBtn.addEventListener('click', resetStack);

    // ---------- Keyboard ----------
    document.addEventListener('keydown', (e) => {
        if (current >= cards.length) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); commitSwipe('right'); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); commitSwipe('left'); }
        else if (e.key === 'Enter' || e.key === ' ') {
            const card = activeCard();
            const btn = card && card.querySelector('.reveal-btn');
            if (btn && !card.classList.contains('is-revealed')) {
                e.preventDefault();
                card.classList.add('is-revealed');
            }
        }
    });

    setDepths();
})();
