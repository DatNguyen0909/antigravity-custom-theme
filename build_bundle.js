// ========================================================
// MVVM BUNDLER: Compiles src/ + stickers/ -> clean_bundle.js
// ========================================================
const fs = require('fs');
const path = require('path');

const root = __dirname;
const stickersDir = path.join(root, 'stickers');
const srcDir = path.join(root, 'src');

function readSvgDataUri(filePath) {
    if (!fs.existsSync(filePath)) return null;
    let content = fs.readFileSync(filePath, 'utf8');
    const sanitized = content.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#)/g, 'va');
    if (sanitized !== content) {
        fs.writeFileSync(filePath, sanitized, 'utf8');
        content = sanitized;
    }
    return 'data:image/svg+xml;base64,' + Buffer.from(content, 'utf8').toString('base64');
}

// 1. Auto-discover all mascot SVG folders (stickers/<id>/idle.svg, action.svg, typing.svg)
const stickersMap = {};
for (const entry of fs.readdirSync(stickersDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const id = entry.name;
    const dir = path.join(stickersDir, id);
    stickersMap[id] = {
        idle: readSvgDataUri(path.join(dir, 'idle.svg')),
        action: readSvgDataUri(path.join(dir, 'action.svg')),
        typing: readSvgDataUri(path.join(dir, 'typing.svg'))
    };
}

// 2. Concatenate View CSS stylesheets
const cssFiles = [
    'views/styles/base.css',
    'views/styles/mascots.css',
    'views/styles/settings.css'
];
const masterCss = cssFiles
    .map(rel => fs.readFileSync(path.join(srcDir, rel), 'utf8'))
    .join('\n\n');

// 3. Concatenate MVVM JavaScript modules in dependency order
const jsModules = [
    'models/themes.js',
    'models/backgrounds.js',
    'models/decor.js',
    'services/storageService.js',
    'services/environmentService.js',
    'viewmodels/themeViewModel.js',
    'views/backgroundView.js',
    'views/chatView.js',
    'views/settingsView.js',
    'app.js'
];
const modulesSource = jsModules
    .map(rel => `// ---- [${rel}] ----\n` + fs.readFileSync(path.join(srcDir, rel), 'utf8'))
    .join('\n\n');

// 4. Emit self-contained IIFE bundle for Electron preload injection
const bundleCode = `// ========================================================
// ANTIGRAVITY CUSTOM THEME ENGINE (v7.0 - MVVM Architecture)
// ========================================================
(function () {
    try {
        console.log('[AntigravityCustomTheme] Initializing v7 MVVM Theme Engine...');
        const STICKERS = ${JSON.stringify(stickersMap)};
        const THEME_CSS = ${JSON.stringify(masterCss)};

${modulesSource}
    } catch (err) {
        console.error('[AntigravityCustomTheme] Fatal error:', err);
    }
})();
`;

const outPath = path.join(root, 'clean_bundle.js');
fs.writeFileSync(outPath, bundleCode, 'utf8');
console.log(
    `Successfully built clean_bundle.js (${bundleCode.length} bytes, ${Object.keys(stickersMap).length} themes, ${jsModules.length} MVVM modules)`
);
