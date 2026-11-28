// ========================================================
// SERVICE: Environment, Light/Dark Detection & SVG Helpers
// ========================================================

const EnvironmentService = (function () {
    const svgRawCache = {};
    let hoverTick = 0;

    function detectLightMode() {
        const html = document.documentElement;
        const body = document.body;
        if (!html) return false;
        if (html.classList.contains('light') || (body && body.classList.contains('light'))) return true;
        if (html.classList.contains('dark') || (body && body.classList.contains('dark'))) return false;
        if (html.getAttribute('data-theme') === 'light' || (body && body.getAttribute('data-theme') === 'light')) return true;
        try {
            const cs = window.getComputedStyle(body || html);
            if (cs.colorScheme === 'light') return true;
            const m = (cs.color || '').match(/\d+/g);
            if (m && m.length >= 3) {
                const lum = parseInt(m[0], 10) + parseInt(m[1], 10) + parseInt(m[2], 10);
                if (lum < 320) return true;
            }
        } catch (e) {}
        return false;
    }

    function isFloatingOrOverlay(el) {
        if (!el.closest('#root')) return true;
        if (el.closest('#ag-custom-theme-panel, [role="dialog"], [role="tooltip"], [role="menu"], [role="listbox"], [role="menuitem"], [data-radix-popper-content-wrapper], [data-side]')) {
            return true;
        }
        return false;
    }

    function restartActionSticker(img) {
        if (!img) return;
        try {
            const dataUri = img.dataset.agSrc || img.getAttribute('src') || '';
            if (dataUri.indexOf('data:image/svg+xml;base64,') !== 0) return;
            img.dataset.agSrc = dataUri;
            let raw = svgRawCache[dataUri];
            if (!raw) {
                raw = atob(dataUri.split(',')[1]);
                svgRawCache[dataUri] = raw;
            }
            hoverTick = (hoverTick % 16) + 1;
            img.src = 'data:image/svg+xml;base64,' + btoa(raw + ' '.repeat(hoverTick));
        } catch (e) {}
    }

    function detectAiWorking() {
        try {
            // 1. Check composer/input area for an active Stop / Cancel generation button
            const wrap = document.querySelector('.ag-custom-input-wrapper');
            const scope = (wrap && wrap.parentElement) ? wrap.parentElement : document;
            const stopBtns = scope.querySelectorAll('button, [role="button"]');
            for (let i = 0; i < stopBtns.length; i++) {
                const b = stopBtns[i];
                if (b.closest('#ag-custom-theme-panel')) continue;
                const r = b.getBoundingClientRect();
                if (r.width === 0 || r.height === 0) continue;
                const label = ((b.getAttribute('aria-label') || '') + ' ' + (b.getAttribute('title') || '') + ' ' + (b.textContent || '')).trim();
                if (/\b(stop|cancel|abort)\b/i.test(label) && !/cancel\s+edit/i.test(label)) {
                    return true;
                }
            }
            // 2. Check main chat area for explicit streaming / thinking / busy indicators
            const busyEl = document.querySelector('[data-streaming="true"], [aria-busy="true"]:not(#ag-custom-theme-panel *)');
            if (busyEl && !busyEl.closest('#ag-custom-theme-panel, nav, aside')) {
                const r = busyEl.getBoundingClientRect();
                if (r.width > 0 && r.height > 0) return true;
            }
        } catch (e) {}
        return false;
    }

    return {
        detectLightMode,
        isFloatingOrOverlay,
        restartActionSticker,
        detectAiWorking
    };
})();
