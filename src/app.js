// ========================================================
// APP BOOTSTRAP: Wire MVVM Bindings & Lifecycle Observers
// ========================================================

function applyTheme() {
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
    applyTheme();
    if (reason === 'disk-loaded') {
        SettingsView.refreshIfOpen(ThemeViewModel);
    }
});

ChatView.wireTypingEvents(ThemeViewModel);

function tick() {
    BackgroundView.injectStyles();
    if (ThemeViewModel.getState().enabled) {
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
