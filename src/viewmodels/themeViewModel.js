// ========================================================
// VIEWMODEL: Reactive Theme State, Commands & Typing Logic
// ========================================================

const ThemeViewModel = (function () {
    let config = {
        enabled: true,
        activeTheme: 'jade-dragon',
        bgDim: 69,
        bgMode: 'theme',          // 'theme' | 'custom'
        customWallpaper: null
    };

    const typingState = {
        keys: [],
        lastParticle: 0,
        pauseTimer: null,
        clearTimer: null
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

    function initPersistence() {
        const local = StorageService.loadLocal();
        if (local) {
            config = Object.assign(config, local);
        }
        StorageService.loadDisk(
            (diskParsed) => {
                config = Object.assign(config, diskParsed);
                StorageService.saveLocal(config);
                notify('disk-loaded');
            },
            () => {
                const existingLocal = StorageService.loadLocal();
                if (existingLocal) {
                    config = Object.assign(config, existingLocal);
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
        config.activeTheme = themeId;
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
        setBgMode,
        setCustomWallpaper,
        recordKeystroke,
        scheduleTypingTimers,
        resetTypingTimers
    };
})();
