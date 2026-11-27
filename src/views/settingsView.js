// ========================================================
// VIEW: Settings Modal Nav Hook & Theme Picker Overlay
// ========================================================

const SettingsView = (function () {
    const SETTINGS_I18N = {
        vi: {
            toggleTitle: 'Giao diện tùy chỉnh (Custom Theme)',
            toggleDesc: 'Gạt tắt (OFF) để quay về giao diện mặc định gốc (Default) ngay lập tức.',
            seasonTitle: '🗓️ Tự động đổi theo mùa / lễ hội',
            seasonDesc: (label, name) => `Tự động chọn linh vật theo lịch năm (Tết 🦁 • Xuân 🌸 • Hè 🦈 • Thu 🦊 • Halloween 🎃 • Đông ❄️ • Noel ⛄). Hôm nay: <b>${label} → ${name}</b>. Bấm chọn mẫu bất kỳ bên dưới để đổi tay.`,
            dimTitle: 'Độ tối',
            dimDesc: 'Điều chỉnh độ rõ của nền để dễ đọc nội dung.',
            themesTitle: (n) => `Bong bóng chat & Chủ đề (${n} Mẫu)`,
            themesDesc: 'Mỗi mẫu có linh vật, màu nền và chuyển động riêng biệt (bay lượn, bơi lội, trôi nổi...).',
            bgTitle: 'Hình nền khung chat',
            bgDesc: '"Theo màu chủ đề" sẽ tự đổi nền cùng tông và hiệu ứng cảnh vật theo mẫu bạn chọn.',
            bgThemeBtn: '🎨 Theo màu chủ đề',
            bgCustomBtn: '📁 Ảnh của tôi...'
        },
        en: {
            toggleTitle: 'Enable Custom Theme',
            toggleDesc: 'Switch OFF to instantly restore the native default Antigravity interface.',
            seasonTitle: '🗓️ Auto-Switch by Season & Holiday',
            seasonDesc: (label, name) => `Automatically picks mascots across the year (Lunar New Year 🦁 • Spring 🌸 • Summer 🦈 • Autumn 🦊 • Halloween 🎃 • Winter ❄️ • Christmas ⛄). Today: <b>${label} → ${name}</b>. Click any card below to override manually.`,
            dimTitle: 'Background Dimming',
            dimDesc: 'Adjust background contrast for comfortable text readability.',
            themesTitle: (n) => `Chat Bubbles & Mascot Themes (${n} Presets)`,
            themesDesc: 'Each preset features a unique Chibi mascot, color palette, typing pose, and hover stage.',
            bgTitle: 'Chat Wallpaper',
            bgDesc: '"Match Theme" automatically adapts background scenery and ambient particles to your chosen mascot.',
            bgThemeBtn: '🎨 Match Theme',
            bgCustomBtn: '📁 Custom Image...'
        }
    };

    function isLeafText(el, txt) {
        return el && el.children.length === 0 && (el.textContent || '').trim() === txt;
    }

    function isInsideFloatingLayer(el) {
        if (el.closest('[role="dialog"], [aria-modal="true"]')) return true;
        let curr = el.parentElement;
        while (curr && curr !== document.body) {
            const pos = window.getComputedStyle(curr).position;
            if (pos === 'fixed') return true;
            curr = curr.parentElement;
        }
        return false;
    }

    function findSettingsNav() {
        const leaves = document.querySelectorAll('span, div, button, a, p, li');
        for (let i = 0; i < leaves.length; i++) {
            const n = leaves[i];
            if (!isLeafText(n, 'Appearance')) continue;
            if (n.closest('pre, code, .ag-custom-user-bubble, #ag-custom-theme-panel, [class*="markdown"], [class*="prose"], textarea, [contenteditable="true"]')) continue;
            const nr = n.getBoundingClientRect();
            if (nr.width === 0 || nr.height === 0) continue;

            let tab = n;
            let list = n.parentElement;
            for (let depth = 0; depth < 5 && list; depth++) {
                const kids = list.querySelectorAll('*');
                let hasGeneral = false, hasShortcuts = false, hasNotif = false;
                for (let k = 0; k < kids.length; k++) {
                    if (isLeafText(kids[k], 'General')) hasGeneral = true;
                    else if (isLeafText(kids[k], 'Shortcuts')) hasShortcuts = true;
                    else if (isLeafText(kids[k], 'Notifications')) hasNotif = true;
                }
                if (hasGeneral && hasShortcuts && hasNotif) {
                    const shortNav = (list.textContent || '').length < 400;
                    if (isInsideFloatingLayer(list) || shortNav) return { tab: tab, list: list };
                    break;
                }
                tab = list;
                list = list.parentElement;
            }
        }
        return null;
    }

    function renderOverlay(modal, vm) {
        let panel = document.getElementById('ag-custom-theme-panel');
        if (panel && panel.parentElement !== modal) {
            panel.remove();
            panel = null;
        }
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'ag-custom-theme-panel';
            modal.appendChild(panel);
        }
        panel.style.display = 'block';

        const config = vm.getState();
        const lang = config.lang === 'en' ? 'en' : 'vi';
        const txt = SETTINGS_I18N[lang];
        const themes = vm.getThemes();
        const seasonInfo = resolveSeasonalTheme();
        const seasonTheme = vm.getThemeById(seasonInfo.themeId);
        const seasonThemeLoc = localizeTheme(seasonTheme, lang);
        const seasonLabel = lang === 'en' ? seasonInfo.labelEn : seasonInfo.labelVi;
        const opacityStyle = config.enabled ? '1' : '0.4';
        const pointerStyle = config.enabled ? 'auto' : 'none';

        panel.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;">
                <div style="font-size: 18px; font-weight: 600; color: #fff;">Custom Theme</div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <select id="ag-lang-select" title="Language / Ngôn ngữ" style="background: #1c1c22; border: 1px solid rgba(255,255,255,0.18); color: #eee; padding: 4px 10px; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600; outline: none;">
                        <option value="en" ${lang === 'en' ? 'selected' : ''}>🇺🇸 English</option>
                        <option value="vi" ${lang === 'vi' ? 'selected' : ''}>🇻🇳 Tiếng Việt</option>
                    </select>
                    <button id="ag-close-settings-btn" title="Close" style="background: rgba(255,255,255,0.08); border: none; color: #bbb; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;">✕</button>
                </div>
            </div>

            <div class="ag-toggle-card">
                <div>
                    <div class="ag-section-title" style="margin: 0; font-size: 14px;">${txt.toggleTitle}</div>
                    <div class="ag-section-desc" style="margin: 4px 0 0; font-size: 12px;">${txt.toggleDesc}</div>
                </div>
                <label class="ag-switch">
                    <input type="checkbox" id="ag-enable-toggle" ${config.enabled ? 'checked' : ''}>
                    <span class="ag-toggle-slider"></span>
                </label>
            </div>

            <div id="ag-theme-controls-body" style="opacity: ${opacityStyle}; pointer-events: ${pointerStyle}; transition: opacity 0.25s ease;">
                <div class="ag-toggle-card" style="margin-bottom: 22px; background: rgba(255,255,255,0.035) !important;">
                    <div style="padding-right: 14px;">
                        <div class="ag-section-title" style="margin: 0; font-size: 14px;">${txt.seasonTitle}</div>
                        <div class="ag-section-desc" style="margin: 4px 0 0; font-size: 12px; line-height: 1.45;">${txt.seasonDesc(seasonLabel, seasonThemeLoc.name)}</div>
                    </div>
                    <label class="ag-switch">
                        <input type="checkbox" id="ag-season-toggle" ${config.autoSeason ? 'checked' : ''}>
                        <span class="ag-toggle-slider"></span>
                    </label>
                </div>

                <div class="ag-section-title">${txt.dimTitle}</div>
                <div class="ag-section-desc">${txt.dimDesc}</div>
                <div class="ag-slider-row">
                    <input type="range" class="ag-slider" id="ag-dim-slider" min="0" max="100" value="${config.bgDim}" />
                    <span class="ag-slider-val" id="ag-dim-val">${config.bgDim}%</span>
                </div>

                <div class="ag-section-title">${txt.themesTitle(themes.length)}</div>
                <div class="ag-section-desc">${txt.themesDesc}</div>
                <div class="ag-theme-grid" id="ag-theme-grid">
                    ${themes.map(t => {
                        const isSel = t.id === config.activeTheme;
                        const loc = localizeTheme(t, lang);
                        return `
                            <div class="ag-theme-card ${isSel ? 'selected' : ''}" data-theme-id="${t.id}">
                                <div class="ag-card-bg-swatch" style="background: ${THEME_BG[t.id]};"></div>
                                <div class="ag-card-bubble-preview" style="background: ${t.bubbleBg}; border: 1px solid ${t.bubbleBorder}; color: ${t.bubbleText};">
                                    <img class="ag-card-sticker" src="${t.sticker}" alt="" />
                                    <img class="ag-card-sticker-action" src="${t.actionSticker || t.sticker}" alt="" />
                                    <span>${loc.previewText}</span>
                                </div>
                                <div class="ag-card-title" style="position: relative;">${loc.name}</div>
                                <div class="ag-card-motion-tag">${loc.motionDesc}</div>
                                ${isSel ? '<span class="ag-card-check">✓</span>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="ag-section-title">${txt.bgTitle}</div>
                <div class="ag-section-desc">${txt.bgDesc}</div>
                <div class="ag-bg-mode-row">
                    <button class="ag-bg-mode-btn ${config.bgMode !== 'custom' ? 'selected' : ''}" data-bg-mode="theme">${txt.bgThemeBtn}</button>
                    <button class="ag-bg-mode-btn ${config.bgMode === 'custom' ? 'selected' : ''}" data-bg-mode="custom">${txt.bgCustomBtn}</button>
                    <input type="file" id="ag-wallpaper-input" accept="image/*" style="display: none;" />
                </div>
            </div>
        `;

        const langSelect = panel.querySelector('#ag-lang-select');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                vm.setLang(e.target.value);
                renderOverlay(modal, vm);
            });
        }

        const closeBtn = panel.querySelector('#ag-close-settings-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                panel.style.display = 'none';
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
            });
        }

        const toggle = panel.querySelector('#ag-enable-toggle');
        toggle.addEventListener('change', (e) => {
            vm.setEnabled(e.target.checked);
            const enabledNow = vm.getState().enabled;
            const controls = panel.querySelector('#ag-theme-controls-body');
            if (controls) {
                controls.style.opacity = enabledNow ? '1' : '0.4';
                controls.style.pointerEvents = enabledNow ? 'auto' : 'none';
            }
        });

        const seasonToggle = panel.querySelector('#ag-season-toggle');
        if (seasonToggle) {
            seasonToggle.addEventListener('change', (e) => {
                vm.setAutoSeason(e.target.checked);
                renderOverlay(modal, vm);
            });
        }

        const slider = panel.querySelector('#ag-dim-slider');
        const valSpan = panel.querySelector('#ag-dim-val');
        slider.addEventListener('input', (e) => {
            vm.setBgDim(e.target.value);
            valSpan.innerText = vm.getState().bgDim + '%';
        });

        panel.querySelectorAll('.ag-theme-card').forEach(card => {
            const tid = card.getAttribute('data-theme-id');
            card.addEventListener('mouseenter', () => {
                const previewBubble = card.querySelector('.ag-card-bubble-preview');
                if (previewBubble) ChatView.spawnHoverBurst(previewBubble, tid);
                EnvironmentService.restartActionSticker(card.querySelector('.ag-card-sticker-action'));
            });
            card.addEventListener('click', () => {
                if (!vm.getState().enabled) return;
                vm.setActiveTheme(tid);
                renderOverlay(modal, vm);
            });
        });

        const wpInput = panel.querySelector('#ag-wallpaper-input');
        panel.querySelectorAll('.ag-bg-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-bg-mode');
                if (mode === 'custom') {
                    wpInput.click();
                    return;
                }
                vm.setBgMode(mode);
                renderOverlay(modal, vm);
            });
        });

        wpInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (re) => {
                    vm.setCustomWallpaper(re.target.result);
                    renderOverlay(modal, vm);
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    function refreshIfOpen(vm) {
        const openPanel = document.getElementById('ag-custom-theme-panel');
        if (openPanel && openPanel.style.display !== 'none' && openPanel.parentElement) {
            renderOverlay(openPanel.parentElement, vm);
        }
    }

    function hookModal(vm) {
        document.querySelectorAll('#ag-custom-theme-tab-btn').forEach(el => {
            if (el.closest('.ag-custom-user-bubble, [class*="markdown"], [class*="prose"], p, pre, code')) el.remove();
        });

        const found = findSettingsNav();
        if (!found) {
            const p = document.getElementById('ag-custom-theme-panel');
            if (p && !document.body.contains(p.parentElement)) p.remove();
            return;
        }
        const appearanceTab = found.tab;
        const parentList = found.list;

        if (parentList.querySelector('#ag-custom-theme-tab-btn')) {
            return;
        }

        document.querySelectorAll('#ag-custom-theme-tab-btn').forEach(el => el.remove());
        const stalePanel = document.getElementById('ag-custom-theme-panel');
        if (stalePanel) stalePanel.style.display = 'none';

        let modal = parentList.closest('[role="dialog"]');
        if (!modal) {
            let curr = parentList.parentElement;
            while (curr && curr !== document.body && curr !== document.documentElement) {
                const r = curr.getBoundingClientRect();
                if (r.width >= 480 && r.width <= window.innerWidth - 20 && r.height >= 350) {
                    modal = curr;
                    break;
                }
                curr = curr.parentElement;
            }
        }
        if (!modal) {
            modal = document.querySelector('[role="dialog"]') || parentList.parentElement.parentElement;
        }
        if (!modal) return;
        modal.style.position = 'relative';

        let templateTab = appearanceTab;
        const allSiblings = Array.from(parentList.children);
        const shortcutsTab = allSiblings.find(c => (c.textContent || '').trim() === 'Shortcuts');
        const notifTab = allSiblings.find(c => (c.textContent || '').trim() === 'Notifications');
        if (shortcutsTab && !shortcutsTab.className.includes('active')) {
            templateTab = shortcutsTab;
        } else if (notifTab) {
            templateTab = notifTab;
        }

        const newTab = templateTab.cloneNode(true);
        newTab.id = 'ag-custom-theme-tab-btn';
        newTab.style.cursor = 'pointer';
        newTab.style.outline = 'none';

        let replacedText = false;
        const innerNodes = newTab.querySelectorAll('*');
        for (let i = 0; i < innerNodes.length; i++) {
            if (innerNodes[i].children.length === 0 && (innerNodes[i].textContent || '').trim().length > 0) {
                innerNodes[i].textContent = 'Custom theme';
                replacedText = true;
                break;
            }
        }
        if (!replacedText) {
            newTab.textContent = 'Custom theme';
        }
        const refLeaf = (templateTab.querySelector('*') && Array.from(templateTab.querySelectorAll('*')).find(el => el.children.length === 0 && (el.textContent || '').trim().length > 0)) || templateTab;
        const refStyle = window.getComputedStyle(refLeaf);
        const targetLeaf = (newTab.querySelector('*') && Array.from(newTab.querySelectorAll('*')).find(el => el.children.length === 0 && (el.textContent || '').trim().length > 0)) || newTab;
        targetLeaf.style.fontSize = refStyle.fontSize;
        targetLeaf.style.fontWeight = refStyle.fontWeight;
        targetLeaf.style.lineHeight = refStyle.lineHeight;
        targetLeaf.style.letterSpacing = refStyle.letterSpacing;
        targetLeaf.style.color = refStyle.color;

        if (appearanceTab.nextSibling) {
            parentList.insertBefore(newTab, appearanceTab.nextSibling);
        } else {
            parentList.appendChild(newTab);
        }

        newTab.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            Array.from(parentList.children).forEach(c => {
                c.classList.remove('active', 'selected');
                c.style.outline = 'none';
            });
            newTab.classList.add('active');
            newTab.style.outline = '2px solid var(--ag-theme-accent, #e06030)';

            renderOverlay(modal, vm);
        });

        parentList.addEventListener('click', (e) => {
            if (e.target && !e.target.closest('#ag-custom-theme-tab-btn')) {
                newTab.classList.remove('active');
                newTab.style.outline = 'none';
                const panel = document.getElementById('ag-custom-theme-panel');
                if (panel) panel.style.display = 'none';
            }
        });
    }

    return {
        hookModal,
        renderOverlay,
        refreshIfOpen
    };
})();
