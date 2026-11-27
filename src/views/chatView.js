// ========================================================
// VIEW: Chat Bubbles, Input Composer, Stickers & Typing FX
// ========================================================

const ChatView = (function () {
    function spawnHoverBurst(containerEl, themeId) {
        const theme = ThemeViewModel.getThemeById(themeId);
        const list = theme.hoverBursts || ThemeViewModel.getThemeById('fox-chibi').hoverBursts;
        for (let i = 0; i < 6; i++) {
            const p = document.createElement('span');
            p.className = 'ag-burst-p';
            p.textContent = list[i % list.length];
            const angle = (-Math.PI * 0.92) + (i / 5) * (Math.PI * 0.84) + (Math.random() - 0.5) * 0.25;
            const dist = 28 + Math.random() * 26;
            const bx = Math.cos(angle) * dist;
            const by = Math.sin(angle) * dist - 10;
            const br = ((Math.random() - 0.5) * 90).toFixed(0) + 'deg';
            p.style.setProperty('--bx', bx.toFixed(1) + 'px');
            p.style.setProperty('--by', by.toFixed(1) + 'px');
            p.style.setProperty('--br', br);
            containerEl.appendChild(p);
            setTimeout(() => { if (p.parentNode) p.remove(); }, 860);
        }
    }

    function syncInputSticker(wrap, vm) {
        if (!wrap) return;
        const img = wrap.querySelector(':scope > .ag-input-sticker');
        if (!img) return;
        const theme = vm.getActiveTheme();
        const typingNow = theme.typingSticker && wrap.classList.contains('ag-typing') && !wrap.classList.contains('ag-typing-pause');
        wrap.classList.toggle('ag-has-typing-svg', !!theme.typingSticker);
        const want = typingNow ? theme.typingSticker : theme.sticker;
        if (img.getAttribute('src') !== want) img.src = want;
    }

    function clearTypingState(wrap, vm) {
        if (!wrap) return;
        wrap.classList.remove('ag-typing', 'ag-typing-fast', 'ag-typing-pause');
        wrap.style.removeProperty('--ag-type-speed');
        wrap.querySelectorAll(':scope > .ag-think-bubble, :scope > .ag-type-p').forEach(n => n.remove());
        vm.resetTypingTimers();
        syncInputSticker(wrap, vm);
    }

    function updateTypingSafetyNet(container, field, vm) {
        if (!container || !field || !container.classList.contains('ag-typing')) return;
        const val = (field.value !== undefined ? field.value : (field.innerText || '')).trim();
        const focused = document.activeElement === field || field.contains(document.activeElement);
        if (!focused || val.length === 0) clearTypingState(container, vm);
    }

    function spawnTypeParticle(wrap, fx) {
        if (wrap.querySelectorAll(':scope > .ag-type-p').length >= 6) return;
        const p = document.createElement('span');
        p.className = 'ag-type-p' + (fx.mono ? ' mono' : '');
        p.textContent = fx.particles[Math.floor(Math.random() * fx.particles.length)];
        p.style.setProperty('--tx', (-12 - Math.random() * 30).toFixed(0) + 'px');
        p.style.setProperty('--ty', (-26 - Math.random() * 18).toFixed(0) + 'px');
        p.style.setProperty('--tr', ((Math.random() - 0.5) * 60).toFixed(0) + 'deg');
        wrap.appendChild(p);
        setTimeout(() => { if (p.parentNode) p.remove(); }, 900);
    }

    function showThinkBubble(wrap, fx, lang) {
        if (wrap.querySelector(':scope > .ag-think-bubble')) return;
        const b = document.createElement('span');
        b.className = 'ag-think-bubble' + (fx.mono ? ' mono' : '');
        b.textContent = (lang === 'en' && fx.thinkEn) ? fx.thinkEn : fx.think;
        wrap.appendChild(b);
    }

    function wireTypingEvents(vm) {
        if (window.__agTypeWired) return;
        window.__agTypeWired = true;
        document.addEventListener('input', (e) => {
            if (!vm.getState().enabled) return;
            const t = e.target;
            if (!t || !(t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
            const wrap = t.closest('.ag-custom-input-wrapper');
            if (!wrap) return;
            const val = (t.value !== undefined ? t.value : (t.innerText || '')).trim();
            if (val.length === 0) {
                clearTypingState(wrap, vm);
                return;
            }

            const result = vm.recordKeystroke();
            wrap.classList.add('ag-typing');
            wrap.classList.toggle('ag-typing-fast', result.fast);
            wrap.classList.remove('ag-typing-pause');
            wrap.style.setProperty('--ag-type-speed', result.fast ? '0.45s' : '0.9s');
            wrap.querySelectorAll(':scope > .ag-think-bubble').forEach(n => n.remove());
            syncInputSticker(wrap, vm);

            if (result.shouldSpawnParticle) {
                spawnTypeParticle(wrap, result.fx);
            }

            vm.scheduleTypingTimers(
                () => {
                    wrap.classList.remove('ag-typing-fast');
                    wrap.classList.add('ag-typing-pause');
                    syncInputSticker(wrap, vm);
                    showThinkBubble(wrap, result.fx, vm.getState().lang);
                },
                () => clearTypingState(wrap, vm)
            );
        }, true);

        document.addEventListener('focusout', (e) => {
            const wrap = e.target && e.target.closest && e.target.closest('.ag-custom-input-wrapper');
            if (wrap) clearTypingState(wrap, vm);
        }, true);
    }

    function makeContainersTransparent(vm) {
        if (!vm.getState().enabled) return;
        const textarea = document.querySelector('textarea, [contenteditable="true"]');
        if (textarea) {
            let curr = textarea.parentElement;
            while (curr && curr !== document.body && curr !== document.documentElement) {
                if (curr.classList.contains('ag-custom-input-wrapper')) {
                    curr = curr.parentElement;
                    continue;
                }
                if (curr.tagName === 'ASIDE' || curr.tagName === 'NAV' || curr.getAttribute('role') === 'dialog' || curr.classList.contains('monaco-editor')) {
                    break;
                }
                curr.style.setProperty('background-color', 'transparent', 'important');
                curr.style.setProperty('--background', 'transparent', 'important');
                curr = curr.parentElement;
            }
        }
    }

    function cleanupAll() {
        document.querySelectorAll('.ag-custom-user-bubble').forEach(el => el.classList.remove('ag-custom-user-bubble'));
        document.querySelectorAll('.ag-custom-input-wrapper').forEach(el => {
            el.classList.remove('ag-custom-input-wrapper', 'ag-typing', 'ag-typing-fast', 'ag-typing-pause');
        });
        document.querySelectorAll('.ag-bubble-sticker, .ag-bubble-sticker-action, .ag-input-sticker, .ag-input-sticker-action, .ag-sparkle, .ag-type-p, .ag-think-bubble').forEach(el => el.remove());
    }

    function updateElements(vm) {
        const config = vm.getState();
        if (!config.enabled) return;
        const theme = vm.getActiveTheme();
        const stickerData = theme.sticker;
        const actionStickerData = theme.actionSticker || theme.sticker;

        // Clean up any wrongly-matched tooltips or portals first
        document.querySelectorAll('.ag-custom-user-bubble').forEach(b => {
            const txt = (b.innerText || '').trim();
            if (!b.closest('#root') || EnvironmentService.isFloatingOrOverlay(b) || /^(Light|Dark|System|Default|Verbose)$/i.test(txt)) {
                b.classList.remove('ag-custom-user-bubble');
                b.querySelectorAll('.ag-bubble-sticker, .ag-bubble-sticker-action, .ag-sparkle, .ag-burst-p').forEach(s => s.remove());
            }
        });

        // 1. Style Chat Input Box & Sticker first (and get its geometry reference)
        const textarea = document.querySelector('textarea, [contenteditable="true"]');
        if (!textarea) return;

        const inputContainer = textarea.closest('[class*="prompt"], [class*="composer"], [class*="input"], form') || textarea.parentElement.parentElement;
        if (!inputContainer) return;

        if (!inputContainer.classList.contains('ag-custom-input-wrapper')) {
            inputContainer.classList.add('ag-custom-input-wrapper');
        }
        const existingInputStickers = inputContainer.querySelectorAll(':scope > .ag-input-sticker');
        if (existingInputStickers.length === 0) {
            const img = document.createElement('img');
            img.className = 'ag-input-sticker';
            img.src = stickerData;
            inputContainer.appendChild(img);
        } else {
            existingInputStickers.forEach((img, idx) => {
                if (idx > 0) img.remove();
            });
            syncInputSticker(inputContainer, vm);
        }
        inputContainer.querySelectorAll(':scope > .ag-input-sticker-action').forEach(img => img.remove());
        updateTypingSafetyNet(inputContainer, textarea, vm);

        const inputRect = inputContainer.getBoundingClientRect();
        if (inputRect.width < 100) return;

        // 2. Identify Native User Message Bubbles above the input box
        const allDivs = document.querySelectorAll('div');
        const candidateBubbles = [];

        for (let i = 0; i < allDivs.length; i++) {
            const el = allDivs[i];

            if (el === inputContainer ||
                inputContainer.contains(el) ||
                el.contains(inputContainer) ||
                el.id === 'ag-custom-bg' ||
                el.id === 'ag-custom-overlay' ||
                el.id === 'ag-custom-theme-panel' ||
                el.closest('#ag-custom-theme-panel, [role="dialog"], [role="tooltip"], [role="menu"], [role="listbox"], [data-radix-popper-content-wrapper], pre, code, table, button, [role="button"], aside, nav, header') ||
                EnvironmentService.isFloatingOrOverlay(el)) {
                continue;
            }

            if (el.querySelector('pre, table, textarea, input')) {
                continue;
            }

            const elRect = el.getBoundingClientRect();
            if (elRect.width < 40 || elRect.height < 26) continue;
            if (elRect.bottom > inputRect.top + 16 || elRect.bottom < 35) continue;

            const rightDiff = Math.abs(elRect.right - inputRect.right);
            const leftIndent = elRect.left - inputRect.left;
            if (rightDiff > 48 || leftIndent < 15) continue;

            const style = window.getComputedStyle(el);
            const radius = parseFloat(style.borderRadius) || 0;
            const bg = style.backgroundColor || '';
            const isAlreadyStyled = el.classList.contains('ag-custom-user-bubble');

            if (!isAlreadyStyled) {
                if (radius < 8) continue;
                if (!bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') continue;
            }

            const text = (el.innerText || '').trim();
            if (!text || text.length > 4000) continue;
            if (/^(Light|Dark|System|Default|Verbose)$/i.test(text)) continue;
            if (/^Worked for|\d+\s+files?\s+changed/i.test(text)) continue;

            candidateBubbles.push(el);
        }

        const finalBubbles = candidateBubbles.filter(el => {
            return !candidateBubbles.some(other => other !== el && other.contains(el));
        });

        finalBubbles.forEach(bubble => {
            bubble.querySelectorAll('.ag-custom-user-bubble').forEach(inner => {
                inner.classList.remove('ag-custom-user-bubble');
                inner.querySelectorAll('.ag-bubble-sticker, .ag-bubble-sticker-action').forEach(s => s.remove());
            });

            if (!bubble.classList.contains('ag-custom-user-bubble')) {
                bubble.classList.add('ag-custom-user-bubble');
            }
            if (bubble.parentElement) {
                bubble.parentElement.style.setProperty('overflow', 'visible', 'important');
            }

            const existingStickers = bubble.querySelectorAll(':scope > .ag-bubble-sticker');
            if (existingStickers.length === 0) {
                const img = document.createElement('img');
                img.className = 'ag-bubble-sticker';
                img.src = stickerData;
                bubble.appendChild(img);
            } else {
                existingStickers.forEach((img, idx) => {
                    if (idx > 0) img.remove();
                    else if (img.src !== stickerData) img.src = stickerData;
                });
            }

            const existingActionStickers = bubble.querySelectorAll(':scope > .ag-bubble-sticker-action');
            if (existingActionStickers.length === 0) {
                const actImg = document.createElement('img');
                actImg.className = 'ag-bubble-sticker-action';
                actImg.src = actionStickerData;
                actImg.dataset.agSrc = actionStickerData;
                bubble.appendChild(actImg);
            } else {
                existingActionStickers.forEach((img, idx) => {
                    if (idx > 0) img.remove();
                    else if ((img.dataset.agSrc || img.src) !== actionStickerData) {
                        img.src = actionStickerData;
                        img.dataset.agSrc = actionStickerData;
                    }
                });
            }

            const glyph = theme.sparkle || '✦';
            const existingSparkles = bubble.querySelectorAll(':scope > .ag-sparkle');
            if (existingSparkles.length !== 3) {
                existingSparkles.forEach(s => s.remove());
                ['s1', 's2', 's3'].forEach(cls => {
                    const sp = document.createElement('span');
                    sp.className = 'ag-sparkle ' + cls;
                    sp.textContent = glyph;
                    bubble.appendChild(sp);
                });
            } else {
                existingSparkles.forEach(sp => {
                    if (sp.textContent !== glyph) sp.textContent = glyph;
                });
            }

            if (!bubble.dataset.agHoverWired) {
                bubble.dataset.agHoverWired = '1';
                bubble.addEventListener('mouseenter', () => {
                    const st = vm.getState();
                    if (!st.enabled) return;
                    spawnHoverBurst(bubble, st.activeTheme);
                    EnvironmentService.restartActionSticker(bubble.querySelector(':scope > .ag-bubble-sticker-action'));
                });
            }
        });
    }

    return {
        spawnHoverBurst,
        wireTypingEvents,
        makeContainersTransparent,
        cleanupAll,
        updateElements
    };
})();
