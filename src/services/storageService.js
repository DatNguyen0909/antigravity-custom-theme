// ========================================================
// SERVICE: Persistent Storage (localStorage + Electron Disk)
// ========================================================

const StorageService = (function () {
    const STORAGE_KEY = 'ag_custom_theme_config';
    const WALLPAPER_KEY = 'ag_custom_theme_wallpaper';

    function getBridge() {
        try {
            if (typeof storageAPI !== 'undefined' && storageAPI && typeof storageAPI.getItems === 'function') {
                return storageAPI;
            }
        } catch (e) {}
        try {
            if (typeof electron_1 !== 'undefined' && electron_1 && electron_1.ipcRenderer) {
                return {
                    getItems: () => electron_1.ipcRenderer.invoke('storage:get-items'),
                    updateItems: (changes) => electron_1.ipcRenderer.invoke('storage:update-items', changes)
                };
            }
        } catch (e) {}
        try {
            if (window.nativeStorage && typeof window.nativeStorage.getItems === 'function') {
                return window.nativeStorage;
            }
        } catch (e) {}
        return null;
    }

    function normalizeConfig(rawStr, wallpaperStr) {
        if (!rawStr) return null;
        try {
            const parsed = typeof rawStr === 'string' ? JSON.parse(rawStr) : Object.assign({}, rawStr);
            if (!parsed || typeof parsed !== 'object') return null;
            delete parsed.wallpaper;
            if (parsed.bgMode === 'anime') parsed.bgMode = 'theme';
            if (parsed.activeTheme && LEGACY_THEME_MAP[parsed.activeTheme]) {
                parsed.activeTheme = LEGACY_THEME_MAP[parsed.activeTheme];
            }
            if (parsed.activeTheme && !THEMES.some(t => t.id === parsed.activeTheme)) {
                parsed.activeTheme = THEMES[0].id;
            }
            if (typeof wallpaperStr === 'string' && wallpaperStr.length > 0) {
                parsed.customWallpaper = wallpaperStr;
            }
            return parsed;
        } catch (e) {
            return null;
        }
    }

    function loadLocal() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? normalizeConfig(saved) : null;
        } catch (e) {
            return null;
        }
    }

    function saveLocal(config) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        } catch (e) {}
    }

    function save(config) {
        saveLocal(config);
        const bridge = getBridge();
        if (bridge && typeof bridge.updateItems === 'function') {
            try {
                const lightPayload = JSON.stringify({
                    enabled: config.enabled,
                    activeTheme: config.activeTheme,
                    autoSeason: config.autoSeason,
                    bgDim: config.bgDim,
                    bgMode: config.bgMode,
                    lang: config.lang,
                    sfxEnabled: config.sfxEnabled,
                    bgmEnabled: config.bgmEnabled,
                    soundVolume: config.soundVolume
                });
                const changes = {};
                changes[STORAGE_KEY] = lightPayload;
                if (config.bgMode === 'custom' && config.customWallpaper) {
                    changes[WALLPAPER_KEY] = config.customWallpaper;
                }
                Promise.resolve(bridge.updateItems(changes)).catch(() => {});
            } catch (e) {}
        }
    }

    function loadDisk(onLoaded, onMissingMigrate) {
        const bridge = getBridge();
        if (!bridge) return;
        try {
            Promise.resolve(bridge.getItems()).then(items => {
                if (items && items[STORAGE_KEY]) {
                    const parsed = normalizeConfig(items[STORAGE_KEY], items[WALLPAPER_KEY]);
                    if (parsed && onLoaded) onLoaded(parsed);
                } else if (onMissingMigrate) {
                    onMissingMigrate();
                }
            }).catch(() => {});
        } catch (e) {}
    }

    return {
        loadLocal,
        saveLocal,
        save,
        loadDisk
    };
})();
