/* Site-wide visit counting with GoatCounter (jeppelina.goatcounter.com).
 *
 * Every page includes this one file:
 *     <script src="/assets/js/analytics.js" defer></script>
 * It loads GoatCounter's count.js (which records the page view) and adds
 * click events for things a page view cannot show:
 *     outbound: <host><path>   links that leave the site
 *     download: <path>         PDFs, data files, slides source and the like
 *     email: click             mailto links (the address is not recorded)
 * A page can set window.goatcounter before this file to adjust settings;
 * 404.html does that to record the missing address as "404: <path>".
 */
(function () {
    'use strict';

    var ENDPOINT = 'https://jeppelina.goatcounter.com/count';
    var DOWNLOAD = /\.(pdf|zip|csv|tsv|xlsx?|docx?|pptx?|rds|rdata|r|rmd|qmd|py|ipynb|do|dta|bib|tex|ics|epub|mp3|mp4)$/i;

    window.goatcounter = window.goatcounter || {};
    window.goatcounter.endpoint = ENDPOINT;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.setAttribute('data-goatcounter', ENDPOINT);
    document.head.appendChild(s);

    function sameSite(host) {
        return host.replace(/^www\./, '') === location.hostname.replace(/^www\./, '');
    }

    function eventFor(a) {
        var proto = a.protocol;
        if (proto === 'mailto:') return 'email: click';
        if (proto !== 'http:' && proto !== 'https:') return null;
        if (!sameSite(a.hostname)) {
            return 'outbound: ' + a.hostname.replace(/^www\./, '') + a.pathname.replace(/\/$/, '');
        }
        if (DOWNLOAD.test(a.pathname)) return 'download: ' + a.pathname;
        return null;
    }

    function onClick(e) {
        if (e.type === 'auxclick' && e.button !== 1) return;
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a || a.hasAttribute('data-goatcounter-click')) return;
        var name = eventFor(a);
        if (!name || !window.goatcounter || !window.goatcounter.count) return;
        window.goatcounter.count({
            path: name,
            title: name === 'email: click' ? 'Email link'
                : (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80) || name,
            event: true
        });
    }

    document.addEventListener('click', onClick, true);
    document.addEventListener('auxclick', onClick, true);
})();
