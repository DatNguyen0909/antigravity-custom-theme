// ========================================================
// MODEL: Unified Theme Definitions (Single Source of Truth)
// ========================================================

const LEGACY_THEME_MAP = {
    'magic-cat': 'fire-phoenix',
    'ocean-koi': 'ocean-shark',
    'thunder-spirit': 'gangster-pawn',
    'minimalist': 'ai-robot',
    'ancient-scroll': 'wise-owl',
    'galaxy': 'space-astronaut'
};

const THEME_DEFINITIONS = [
    {
        id: 'jade-dragon',
        name: 'Rồng ngọc',
        motionDesc: '🐉 Bay lượn xuyên qua mây lớn & mây nhỏ',
        previewText: 'Xin chào 🐉',
        accent: '#10b981',
        bubbleBg: 'rgba(12, 38, 30, 0.94)',
        bubbleBorder: 'rgba(16, 185, 129, 0.65)',
        bubbleText: '#ecfdf5',
        inputBorder: 'rgba(16, 185, 129, 0.5)',
        sparkle: '❖',
        hoverBursts: ['🐉', '❖', '🍃', '✨', '🟢'],
        typingFx: { particles: ['☁️', '☁', '💨'], think: '💨 hừm...' }
    },
    {
        id: 'fire-phoenix',
        name: 'Phượng hoàng lửa',
        motionDesc: '🔥 Sải cánh bay qua mây lửa & thái dương',
        previewText: 'Xin chào 🔥',
        accent: '#ec4899',
        bubbleBg: 'rgba(40, 15, 35, 0.94)',
        bubbleBorder: 'rgba(236, 72, 153, 0.65)',
        bubbleText: '#fdf2f8',
        inputBorder: 'rgba(236, 72, 153, 0.5)',
        sparkle: '🔥',
        hoverBursts: ['🔥', '🪶', '✨', '💛', '💖'],
        typingFx: { particles: ['🔥', '✦', '🪶'], think: '🔥 ...' }
    },
    {
        id: 'space-astronaut',
        name: 'Phi hành gia thiên hà',
        motionDesc: '🪐 Bật Jetpack bay quanh các hành tinh',
        previewText: 'Xin chào 🚀',
        accent: '#38bdf8',
        bubbleBg: 'rgba(15, 23, 42, 0.95)',
        bubbleBorder: 'rgba(56, 189, 248, 0.65)',
        bubbleText: '#f0f9ff',
        inputBorder: 'rgba(56, 189, 248, 0.5)',
        sparkle: '★',
        hoverBursts: ['🚀', '🪐', '☄️', '🌟', '💫'],
        typingFx: { particles: ['📡', '✦', '★'], think: '📡 ...' }
    },
    {
        id: 'wise-owl',
        name: 'Cú thông thái cổ thư',
        motionDesc: '🦉 Bay qua đỉnh núi cổ phong & đèn lồng',
        previewText: 'Xin chào 📜',
        accent: '#d97706',
        bubbleBg: 'rgba(246, 235, 209, 0.95)',
        bubbleBorder: 'rgba(180, 120, 50, 0.75)',
        bubbleText: '#2d1805',
        inputBorder: 'rgba(180, 120, 50, 0.55)',
        sparkle: '✿',
        hoverBursts: ['🦉', '龍', '福', '📜', '✨'],
        typingFx: { particles: ['🪶', '✒️', '福'], think: '📜 để xem...' }
    },
    {
        id: 'moon-witch',
        name: 'Phù thủy ánh trăng',
        motionDesc: '🌙 Cưỡi chổi bay qua trăng khuyết & tháp cổ',
        previewText: 'Xin chào 🌙',
        accent: '#a855f7',
        bubbleBg: 'rgba(35, 18, 50, 0.94)',
        bubbleBorder: 'rgba(168, 85, 247, 0.65)',
        bubbleText: '#fdf4ff',
        inputBorder: 'rgba(168, 85, 247, 0.5)',
        sparkle: '✧',
        hoverBursts: ['🌙', '🦇', '✨', '⭐', '💜'],
        typingFx: { particles: ['✨', '🔮', '⭐'], think: '🔮 ...' }
    },
    {
        id: 'fox-chibi',
        name: 'Hồ ly chibi',
        motionDesc: '⛩️ Phóng qua cổng Torii & lửa hồ ly',
        previewText: 'Xin chào 🦊',
        accent: '#e06030',
        bubbleBg: 'rgba(48, 22, 20, 0.95)',
        bubbleBorder: 'rgba(225, 105, 65, 0.65)',
        bubbleText: '#fff5eb',
        inputBorder: 'rgba(225, 105, 65, 0.5)',
        sparkle: '✦',
        hoverBursts: ['🔥', '🍁', '🦊', '✦', '🧡'],
        typingFx: { particles: ['🔥', '🍁', '✦'], think: '❓ ...' }
    },
    {
        id: 'sakura-bunny',
        name: 'Thỏ ngọc anh đào',
        motionDesc: '🌸 Nhảy lò cò qua rừng hoa anh đào',
        previewText: 'Xin chào 🌸',
        accent: '#fb7185',
        bubbleBg: 'rgba(46, 16, 28, 0.94)',
        bubbleBorder: 'rgba(251, 113, 133, 0.68)',
        bubbleText: '#fff1f2',
        inputBorder: 'rgba(251, 113, 133, 0.52)',
        sparkle: '🌸',
        hoverBursts: ['🌸', '🐰', '🍡', '💗', '🌸'],
        typingFx: { particles: ['🌸', '🌸', '💗'], think: '🥕 ...' }
    },
    {
        id: 'ocean-shark',
        name: 'Cá mập đại dương',
        motionDesc: '🦈 Vây cá rẽ sóng sau chat rồi phóng vọt lên',
        previewText: 'Xin chào 🦈',
        accent: '#22d3ee',
        bubbleBg: 'rgba(8, 34, 48, 0.94)',
        bubbleBorder: 'rgba(34, 211, 238, 0.65)',
        bubbleText: '#ecfeff',
        inputBorder: 'rgba(34, 211, 238, 0.5)',
        sparkle: '🫧',
        hoverBursts: ['🦈', '🌊', '🫧', '💧', '🐟'],
        typingFx: { particles: ['🫧', '💧', '🫧'], think: '🌊 ...' }
    },
    {
        id: 'gangster-pawn',
        name: 'Chốt gangster',
        motionDesc: '😎 Xe cầm chùy tới → Chốt hóa Hậu rút súng',
        previewText: 'Xin chào ♟',
        accent: '#e5e7eb',
        bubbleBg: 'rgba(14, 14, 16, 0.95)',
        bubbleBorder: 'rgba(229, 231, 235, 0.62)',
        bubbleText: '#f9fafb',
        inputBorder: 'rgba(229, 231, 235, 0.45)',
        sparkle: '♟',
        hoverBursts: ['♟', '😎', '♛', '💥', '🔫'],
        typingFx: { particles: ['💵', '♟', '💥'], think: '😎 hmm...' }
    },
    {
        id: 'ice-penguin',
        name: 'Cánh cụt băng tuyết',
        motionDesc: '🧊 Trượt bụng & nhảy qua các tảng băng nổi',
        previewText: 'Xin chào ❄️',
        accent: '#60a5fa',
        bubbleBg: 'rgba(12, 26, 48, 0.94)',
        bubbleBorder: 'rgba(96, 165, 250, 0.68)',
        bubbleText: '#eff6ff',
        inputBorder: 'rgba(96, 165, 250, 0.52)',
        sparkle: '❄️',
        hoverBursts: ['❄️', '🐧', '❅', '💎', '❄️'],
        typingFx: { particles: ['❄️', '❅', '❄️'], think: '🧊 ...' }
    },
    {
        id: 'ai-robot',
        name: 'Robot AI tối giản',
        motionDesc: '🤖 Lướt ván từ trường qua cổng Hologram',
        previewText: 'Xin chào 🤖',
        accent: '#94a3b8',
        bubbleBg: 'rgba(28, 28, 32, 0.92)',
        bubbleBorder: 'rgba(255, 255, 255, 0.35)',
        bubbleText: '#f8fafc',
        inputBorder: 'rgba(255, 255, 255, 0.25)',
        sparkle: '✧',
        hoverBursts: ['🤖', '◇', '⚡', '✧', '💠'],
        typingFx: { particles: ['01', '10', '⚡'], think: 'Analyzing ▓▓░░', mono: true }
    },
    {
        id: 'black-cat',
        name: 'Mèo than',
        motionDesc: '🐾 Nhảy trên mái nhà đêm trăng & cuộn len',
        previewText: 'Xin chào 🐾',
        accent: '#f5a623',
        bubbleBg: 'rgba(28, 24, 22, 0.95)',
        bubbleBorder: 'rgba(245, 166, 35, 0.65)',
        bubbleText: '#fff7ed',
        inputBorder: 'rgba(245, 166, 35, 0.5)',
        sparkle: '✦',
        hoverBursts: ['🐾', '🐟', '✨', '💛', '🐾'],
        typingFx: { particles: ['🐾', '🐾', '✦'], think: '💤 ...' }
    },
    {
        id: 'noel-snowman',
        name: 'Người tuyết Giáng Sinh',
        motionDesc: '🎄 Cưỡi tuần lộc phát quà qua rừng thông Noel',
        previewText: 'Giáng Sinh an lành ⛄🎄',
        accent: '#ef4444',
        bubbleBg: 'rgba(34, 14, 18, 0.94)',
        bubbleBorder: 'rgba(248, 113, 113, 0.72)',
        bubbleText: '#fff5f5',
        inputBorder: 'rgba(239, 68, 68, 0.55)',
        sparkle: '🎄',
        hoverBursts: ['⛄', '🎄', '🎁', '❄️', '🔔'],
        typingFx: { particles: ['🔔', '❄️', '🎁'], think: '🥕 ...' }
    },
    {
        id: 'tet-lion',
        name: 'Kỳ Lân Múa Tết',
        motionDesc: '🦁 Nhảy Mai Hoa Thung hái Lộc & pháo Tết',
        previewText: 'Chúc Mừng Năm Mới 🧧🦁',
        accent: '#f59e0b',
        bubbleBg: 'rgba(46, 10, 14, 0.95)',
        bubbleBorder: 'rgba(250, 204, 21, 0.78)',
        bubbleText: '#fef9c3',
        inputBorder: 'rgba(245, 158, 11, 0.6)',
        sparkle: '🧧',
        hoverBursts: ['🦁', '🧧', '🌼', '🪙', '🏮'],
        typingFx: { particles: ['🥁', '🪙', '🧧'], think: '🧧 ...' }
    },
    {
        id: 'code-cat',
        name: 'Mèo Code dạo',
        motionDesc: '🐛 Cưỡi con trỏ chuột đi bắt bug',
        previewText: 'Hello World 💻',
        accent: '#22c55e',
        bubbleBg: 'rgba(13, 17, 23, 0.95)',
        bubbleBorder: 'rgba(34, 197, 94, 0.65)',
        bubbleText: '#e6edf3',
        inputBorder: 'rgba(34, 197, 94, 0.5)',
        sparkle: '</>',
        hoverBursts: ['🐛', '💻', '☕', '✓', '🐱'],
        typingFx: { particles: [';', '{ }', '</>', '=>'], think: '☕ compiling...', mono: true }
    }
];

const THEMES = THEME_DEFINITIONS.map(def => {
    const assets = STICKERS[def.id] || {};
    return Object.assign({}, def, {
        sticker: assets.idle || '',
        actionSticker: assets.action || assets.idle || '',
        typingSticker: assets.typing || null
    });
});
