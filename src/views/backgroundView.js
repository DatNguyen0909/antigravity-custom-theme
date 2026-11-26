// ========================================================
// VIEW: Global Background, Dimming Overlay & Living Decor
// ========================================================

const BackgroundView = (function () {
    function rnd(a, b) {
        return a + Math.random() * (b - a);
    }

    function injectStyles() {
        let style = document.getElementById('ag-custom-theme-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'ag-custom-theme-style';
            style.textContent = THEME_CSS;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    function buildDecor(themeId) {
        const cfg = DECOR[themeId];
        const frag = document.createDocumentFragment();
        if (!cfg) return frag;

        (cfg.art || []).forEach(a => {
            const el = document.createElement('div');
            el.className = 'ag-art';
            el.style.cssText = a.css;
            el.style.backgroundImage = svgUri(a.svg);
            frag.appendChild(el);
        });

        (cfg.particles || []).forEach(p => {
            for (let i = 0; i < p.count; i++) {
                const el = document.createElement('span');
                el.className = 'ag-p ' + p.type;
                const size = rnd(p.size[0], p.size[1]);
                const dur = rnd(p.dur[0], p.dur[1]);
                const delay = -rnd(0, dur);
                const s = el.style;
                s.setProperty('--o', String(p.o == null ? 0.8 : p.o));
                s.setProperty('--sx', rnd(-60, 60).toFixed(0) + 'px');
                s.setProperty('--sy', rnd(-12, 8).toFixed(0) + 'vh');
                s.left = rnd(0, 100).toFixed(2) + 'vw';

                if (p.type === 'dot' || p.type === 'flame' || p.type === 'bokeh' || p.type === 'bubble') {
                    s.width = size + 'px';
                    s.height = size + 'px';
                    if (p.type !== 'bubble') {
                        s.background = p.type === 'flame'
                            ? 'radial-gradient(circle at 60% 40%, #fff3c0, ' + p.color + ' 55%, transparent 75%)'
                            : p.color;
                    }
                    if (p.glow) s.boxShadow = '0 0 ' + (size * 2).toFixed(0) + 'px ' + p.glow;
                } else if (p.type === 'char') {
                    el.textContent = p.chars[Math.floor(Math.random() * p.chars.length)];
                    s.fontSize = size + 'px';
                    if (p.color) s.color = p.color;
                    if (p.glow) s.textShadow = '0 0 8px ' + p.glow;
                    if (p.font) s.fontFamily = p.font;
                } else if (p.type === 'shoot') {
                    s.width = size + 'px';
                }
                if (p.filter) s.filter = p.filter;

                if (p.anim === 'rise') {
                    s.bottom = '-30px';
                    s.animation = 'agRise ' + dur + 's linear ' + delay + 's infinite';
                } else if (p.anim === 'fall') {
                    s.top = '-30px';
                    s.animation = 'agFall ' + dur + 's linear ' + delay + 's infinite';
                } else if (p.anim === 'twinkle') {
                    s.top = rnd(0, 100).toFixed(2) + 'vh';
                    s.animation = 'agTwinkle ' + dur + 's ease-in-out ' + delay + 's infinite';
                } else if (p.anim === 'drift') {
                    s.left = '0';
                    s.top = rnd(5, 45).toFixed(2) + 'vh';
                    s.animation = 'agDrift ' + dur + 's linear ' + delay + 's infinite';
                } else if (p.anim === 'bob') {
                    s.top = rnd(15, 85).toFixed(2) + 'vh';
                    s.animation = 'agFloatBob ' + dur + 's ease-in-out ' + delay + 's infinite';
                } else if (p.anim === 'shoot') {
                    s.left = rnd(45, 100).toFixed(2) + 'vw';
                    s.top = rnd(0, 35).toFixed(2) + 'vh';
                    s.animation = 'agShoot ' + dur + 's linear ' + delay + 's infinite';
                } else if (p.anim === 'bokeh') {
                    s.top = rnd(0, 90).toFixed(2) + 'vh';
                    s.animation = 'agBokeh ' + dur + 's ease-in-out ' + delay + 's infinite';
                }
                frag.appendChild(el);
            }
        });
        return frag;
    }

    function updateDecor(theme, mode, bgEl) {
        let decor = document.getElementById('ag-custom-decor');
        if (mode !== 'theme') {
            if (decor) decor.remove();
            return;
        }
        if (!decor) {
            decor = document.createElement('div');
            decor.id = 'ag-custom-decor';
            bgEl.after(decor);
        }
        if (decor.dataset.theme !== theme.id) {
            decor.innerHTML = '';
            decor.appendChild(buildDecor(theme.id));
            decor.dataset.theme = theme.id;
        }
    }

    function render(vm) {
        const config = vm.getState();
        let bgEl = document.getElementById('ag-custom-bg');
        let ovEl = document.getElementById('ag-custom-overlay');

        if (!config.enabled) {
            document.body.classList.remove('ag-theme-active', 'ag-light-mode');
            document.body.removeAttribute('data-ag-theme');
            if (bgEl) bgEl.style.display = 'none';
            if (ovEl) ovEl.style.display = 'none';
            const decorEl = document.getElementById('ag-custom-decor');
            if (decorEl) decorEl.remove();
            return false;
        }

        const theme = vm.getActiveTheme();
        const isLight = vm.syncLightMode().isLight;

        document.body.classList.add('ag-theme-active');
        document.body.classList.toggle('ag-light-mode', isLight);
        document.body.setAttribute('data-ag-theme', theme.id);

        const root = document.documentElement;
        root.style.setProperty('--ag-bg-dim', (config.bgDim / 100).toFixed(2));
        root.style.setProperty('--ag-theme-accent', theme.accent);
        root.style.setProperty('--ag-theme-bubble-bg', theme.bubbleBg);
        root.style.setProperty('--ag-theme-bubble-border', theme.bubbleBorder);
        root.style.setProperty('--ag-theme-bubble-text', theme.bubbleText);
        root.style.setProperty('--ag-theme-input-border', theme.inputBorder);

        if (!bgEl) {
            bgEl = document.createElement('div');
            bgEl.id = 'ag-custom-bg';
            document.body.prepend(bgEl);
        }
        bgEl.style.display = 'block';
        const panelMap = isLight ? THEME_PANEL_LIGHT : THEME_PANEL;
        root.style.setProperty('--ag-theme-panel', panelMap[theme.id] || (isLight ? 'rgba(248, 250, 252, 0.85)' : 'rgba(18, 14, 16, 0.78)'));

        const mode = (config.bgMode === 'custom' && config.customWallpaper) ? 'custom' : 'theme';
        let bgKey;
        if (mode === 'custom') {
            const img = config.customWallpaper;
            bgKey = 'custom:' + img.length;
            if (bgEl.dataset.bgKey !== bgKey) {
                bgEl.style.background = 'url("' + img + '") center / cover no-repeat';
            }
        } else {
            bgKey = 'theme:' + theme.id + (isLight ? ':light' : ':dark');
            if (bgEl.dataset.bgKey !== bgKey) {
                const bgMap = isLight ? THEME_BG_LIGHT : THEME_BG;
                bgEl.style.background = bgMap[theme.id] || bgMap['jade-dragon'];
            }
        }
        bgEl.dataset.bgKey = bgKey;
        updateDecor(theme, mode, bgEl);

        if (!ovEl) {
            ovEl = document.createElement('div');
            ovEl.id = 'ag-custom-overlay';
            document.body.prepend(ovEl);
        }
        ovEl.style.display = 'block';
        if (isLight && mode === 'theme') {
            const lightVeil = (((100 - config.bgDim) / 100) * 0.45).toFixed(2);
            root.style.setProperty('--ag-overlay-color', 'rgba(255, 255, 255, ' + lightVeil + ')');
        } else {
            const dimFactor = mode === 'theme' ? 0.5 : 1;
            root.style.setProperty('--ag-overlay-color', 'rgba(0, 0, 0, ' + ((config.bgDim / 100) * dimFactor).toFixed(2) + ')');
        }
        return true;
    }

    return {
        injectStyles,
        render
    };
})();
