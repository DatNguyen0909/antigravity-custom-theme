// ========================================================
// APP BOOTSTRAP: Wire MVVM Bindings & Lifecycle Observers
// ========================================================

function syncSound() {
    const s = ThemeViewModel.getState();
    SoundService.configure({
        enabled: !!s.enabled,
        sfxEnabled: s.sfxEnabled !== false,
        bgmEnabled: !!s.bgmEnabled,
        aiChimeEnabled: s.aiChimeEnabled !== false,
        volume: typeof s.soundVolume === 'number' ? s.soundVolume : 55,
        themeId: s.activeTheme
    });
}

function applyTheme() {
    syncSound();
    const active = BackgroundView.render(ThemeViewModel);
    if (!active) {
        ChatView.cleanupAll();
        return;
    }
    ChatView.updateElements(ThemeViewModel);
    ChatView.makeContainersTransparent(ThemeViewModel);
}

// Reactive MVVM subscription: whenever ViewModel state changes, update Views
ThemeViewModel.subscribe((reason) => {
    if (reason === 'sound-changed') {
        syncSound();
        return;
    }
    if (reason === 'ai-state-changed') {
        if (ThemeViewModel.getState().enabled) {
            const wrap = document.querySelector('.ag-custom-input-wrapper');
            if (wrap) ChatView.syncInputSticker(wrap, ThemeViewModel);
        }
        return;
    }
    applyTheme();
    if (reason === 'disk-loaded') {
        SettingsView.refreshIfOpen(ThemeViewModel);
    }
});

ChatView.wireTypingEvents(ThemeViewModel);

function tick() {
    BackgroundView.injectStyles();
    if (ThemeViewModel.getState().enabled) {
        const aiRes = ThemeViewModel.syncAiStatus(EnvironmentService.detectAiWorking());
        if (aiRes.justCompleted) {
            ChatView.celebrateAiDone(ThemeViewModel);
            if (aiRes.durationMs >= 2000) {
                SoundService.playDoneChime(ThemeViewModel.getState().activeTheme);
            }
        }
        if (EnvironmentService.detectLightMode() !== ThemeViewModel.getLastLightMode()) {
            applyTheme();
        } else {
            ChatView.updateElements(ThemeViewModel);
            ChatView.makeContainersTransparent(ThemeViewModel);
        }
    }
    SettingsView.hookModal(ThemeViewModel);
}

function start() {
    ThemeViewModel.initPersistence();
    BackgroundView.injectStyles();
    applyTheme();

    const observer = new MutationObserver(tick);
    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });

    setInterval(tick, 450);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}
