// ========================================================
// VIEWMODEL: Reactive Theme State, Commands & Typing Logic
// ========================================================

const ThemeViewModel = (function () {
    const defaultLang = (typeof navigator !== 'undefined' && /^vi\b/i.test(navigator.language || '')) ? 'vi' : 'en';
    let config = {
        enabled: true,
        activeTheme: 'jade-dragon',
        autoSeason: false,
        bgDim: 69,
        bgMode: 'theme',          // 'theme' | 'custom'
        customWallpaper: null,
        lang: defaultLang,        // 'en' | 'vi'
        sfxEnabled: true,
        bgmEnabled: false,
        aiChimeEnabled: true,
        soundVolume: 55
    };

    const typingState = {
        keys: [],
        lastParticle: 0,
        pauseTimer: null,
        clearTimer: null
    };

    const aiTracker = {
        status: 'idle',          // 'idle' | 'thinking' | 'done'
        seenWorkingSince: 0,
        seenStoppedSince: 0,
        thinkingStartedAt: 0,
        doneTimer: null
    };

    let lastLightMode = false;
    const listeners = [];

    function subscribe(fn) {
        if (typeof fn === 'function') listeners.push(fn);
    }

    function notify(reason) {
        for (let i = 0; i < listeners.length; i++) {
            try { listeners[i](reason); } catch (e) {}
        }
    }

    function getState() {
        return config;
    }

    function getThemes() {
        return THEMES;
    }

    function getThemeById(id) {
        return THEMES.find(item => item.id === id) || THEMES[0];
    }

    function getActiveTheme() {
        return getThemeById(config.activeTheme);
    }

    function syncLightMode() {
        const current = EnvironmentService.detectLightMode();
        const changed = current !== lastLightMode;
        lastLightMode = current;
        return { isLight: current, changed: changed };
    }

    function getLastLightMode() {
        return lastLightMode;
    }

    function applySeasonalIfActive() {
        if (config.autoSeason && typeof resolveSeasonalTheme === 'function') {
            config.activeTheme = resolveSeasonalTheme().themeId;
        }
    }

    function initPersistence() {
        const local = StorageService.loadLocal();
        if (local) {
            config = Object.assign(config, local);
            applySeasonalIfActive();
        }
        StorageService.loadDisk(
            (diskParsed) => {
                config = Object.assign(config, diskParsed);
                applySeasonalIfActive();
                StorageService.saveLocal(config);
                notify('disk-loaded');
            },
            () => {
                const existingLocal = StorageService.loadLocal();
                if (existingLocal) {
                    config = Object.assign(config, existingLocal);
                    applySeasonalIfActive();
                    StorageService.save(config);
                }
            }
        );
    }

    // ---- Commands invoked by Views ----
    function setEnabled(enabled) {
        config.enabled = !!enabled;
        notify('config-changed');
        StorageService.save(config);
    }

    function setBgDim(dim) {
        config.bgDim = parseInt(dim, 10) || 0;
        notify('config-changed');
        StorageService.save(config);
    }

    function setActiveTheme(themeId) {
        if (!config.enabled) return;
        config.autoSeason = false;
        config.activeTheme = themeId;
        notify('theme-changed');
        StorageService.save(config);
    }

    function setAutoSeason(enabled) {
        config.autoSeason = !!enabled;
        if (config.autoSeason && typeof resolveSeasonalTheme === 'function') {
            config.activeTheme = resolveSeasonalTheme().themeId;
        }
        notify('theme-changed');
        StorageService.save(config);
    }

    function setBgMode(mode) {
        config.bgMode = mode;
        notify('config-changed');
        StorageService.save(config);
    }

    function setCustomWallpaper(dataUrl) {
        config.customWallpaper = dataUrl;
        config.bgMode = 'custom';
        notify('config-changed');
        StorageService.save(config);
    }

    function setLang(lang) {
        config.lang = lang === 'en' ? 'en' : 'vi';
        notify('lang-changed');
        StorageService.save(config);
    }

    function setSfxEnabled(enabled) {
        config.sfxEnabled = !!enabled;
        notify('sound-changed');
        StorageService.save(config);
    }

    function setBgmEnabled(enabled) {
        config.bgmEnabled = !!enabled;
        notify('sound-changed');
        StorageService.save(config);
    }

    function setAiChimeEnabled(enabled) {
        config.aiChimeEnabled = !!enabled;
        notify('sound-changed');
        StorageService.save(config);
    }

    function setSoundVolume(vol) {
        const parsed = parseInt(vol, 10);
        config.soundVolume = isNaN(parsed) ? 55 : Math.max(0, Math.min(100, parsed));
        notify('sound-changed');
        StorageService.save(config);
    }

    // ---- AI Working / Done Reaction State Machine ----
    function getAiState() {
        return aiTracker.status;
    }

    function syncAiStatus(isWorking) {
        const now = Date.now();
        if (isWorking) {
            aiTracker.seenStoppedSince = 0;
            if (!aiTracker.seenWorkingSince) aiTracker.seenWorkingSince = now;
            if (aiTracker.status !== 'thinking' && now - aiTracker.seenWorkingSince >= 300) {
                clearTimeout(aiTracker.doneTimer);
                aiTracker.status = 'thinking';
                aiTracker.thinkingStartedAt = now;
                notify('ai-state-changed');
                return { state: 'thinking', changed: true, justCompleted: false, durationMs: 0 };
            }
            return { state: aiTracker.status, changed: false, justCompleted: false, durationMs: 0 };
        }

        // Not working now
        aiTracker.seenWorkingSince = 0;
        if (aiTracker.status === 'thinking') {
            if (!aiTracker.seenStoppedSince) aiTracker.seenStoppedSince = now;
            if (now - aiTracker.seenStoppedSince >= 600) {
                const durationMs = now - (aiTracker.thinkingStartedAt || now);
                aiTracker.seenStoppedSince = 0;
                clearTimeout(aiTracker.doneTimer);
                if (durationMs >= 1200) {
                    aiTracker.status = 'done';
                    notify('ai-state-changed');
                    aiTracker.doneTimer = setTimeout(() => {
                        if (aiTracker.status === 'done') {
                            aiTracker.status = 'idle';
                            notify('ai-state-changed');
                        }
                    }, 5000);
                    return { state: 'done', changed: true, justCompleted: true, durationMs: durationMs };
                } else {
                    aiTracker.status = 'idle';
                    notify('ai-state-changed');
                    return { state: 'idle', changed: true, justCompleted: false, durationMs: durationMs };
                }
            }
        }
        return { state: aiTracker.status, changed: false, justCompleted: false, durationMs: 0 };
    }

    // ---- Typing Reaction State Logic ----
    function recordKeystroke() {
        const now = Date.now();
        typingState.keys.push(now);
        typingState.keys = typingState.keys.filter(k => now - k < 1000);
        const fast = typingState.keys.length > 6;
        let shouldSpawnParticle = false;
        if (now - typingState.lastParticle > 120) {
            typingState.lastParticle = now;
            shouldSpawnParticle = true;
        }
        const active = getActiveTheme();
        const fx = active.typingFx || getThemeById('code-cat').typingFx;
        return { fast, shouldSpawnParticle, fx };
    }

    function scheduleTypingTimers(onPause, onClear) {
        clearTimeout(typingState.pauseTimer);
        clearTimeout(typingState.clearTimer);
        typingState.pauseTimer = setTimeout(onPause, 1500);
        typingState.clearTimer = setTimeout(onClear, 6000);
    }

    function resetTypingTimers() {
        clearTimeout(typingState.pauseTimer);
        clearTimeout(typingState.clearTimer);
        typingState.keys = [];
    }

    // Load persisted state immediately on ViewModel creation
    initPersistence();

    return {
        subscribe,
        getState,
        getThemes,
        getThemeById,
        getActiveTheme,
        syncLightMode,
        getLastLightMode,
        initPersistence,
        setEnabled,
        setBgDim,
        setActiveTheme,
        setAutoSeason,
        setBgMode,
        setCustomWallpaper,
        setLang,
        setSfxEnabled,
        setBgmEnabled,
        setAiChimeEnabled,
        setSoundVolume,
        getAiState,
        syncAiStatus,
        recordKeystroke,
        scheduleTypingTimers,
        resetTypingTimers
    };
})();
