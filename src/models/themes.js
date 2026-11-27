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
        nameEn: 'Jade Dragon',
        motionDesc: '🐉 Bay lượn xuyên qua mây lớn & mây nhỏ',
        motionDescEn: '🐉 Soars gracefully through drifting jade clouds',
        previewText: 'Xin chào 🐉',
        previewTextEn: 'Hello there 🐉',
        accent: '#10b981',
        bubbleBg: 'rgba(12, 38, 30, 0.94)',
        bubbleBorder: 'rgba(16, 185, 129, 0.65)',
        bubbleText: '#ecfdf5',
        inputBorder: 'rgba(16, 185, 129, 0.5)',
        sparkle: '❖',
        hoverBursts: ['🐉', '❖', '🍃', '✨', '🟢'],
        typingFx: { particles: ['☁️', '☁', '💨'], think: '💨 hừm...', thinkEn: '💨 hmm...' }
    },
    {
        id: 'fire-phoenix',
        name: 'Phượng hoàng lửa',
        nameEn: 'Fire Phoenix',
        motionDesc: '🔥 Sải cánh bay qua mây lửa & thái dương',
        motionDescEn: '🔥 Glides across blazing clouds & golden sun',
        previewText: 'Xin chào 🔥',
        previewTextEn: 'Hello there 🔥',
        accent: '#ec4899',
        bubbleBg: 'rgba(40, 15, 35, 0.94)',
        bubbleBorder: 'rgba(236, 72, 153, 0.65)',
        bubbleText: '#fdf2f8',
        inputBorder: 'rgba(236, 72, 153, 0.5)',
        sparkle: '🔥',
        hoverBursts: ['🔥', '🪶', '✨', '💛', '💖'],
        typingFx: { particles: ['🔥', '✦', '🪶'], think: '🔥 ...', thinkEn: '🔥 ...' }
    },
    {
        id: 'space-astronaut',
        name: 'Phi hành gia thiên hà',
        nameEn: 'Galaxy Astronaut',
        motionDesc: '🪐 Bật Jetpack bay quanh các hành tinh',
        motionDescEn: '🪐 Jetpack flight around ringed planets',
        previewText: 'Xin chào 🚀',
        previewTextEn: 'Hello there 🚀',
        accent: '#38bdf8',
        bubbleBg: 'rgba(15, 23, 42, 0.95)',
        bubbleBorder: 'rgba(56, 189, 248, 0.65)',
        bubbleText: '#f0f9ff',
        inputBorder: 'rgba(56, 189, 248, 0.5)',
        sparkle: '★',
        hoverBursts: ['🚀', '🪐', '☄️', '🌟', '💫'],
        typingFx: { particles: ['📡', '✦', '★'], think: '📡 ...', thinkEn: '📡 ...' }
    },
    {
        id: 'wise-owl',
        name: 'Cú thông thái cổ thư',
        nameEn: 'Ancient Scroll Owl',
        motionDesc: '🦉 Bay qua đỉnh núi cổ phong & đèn lồng',
        motionDescEn: '🦉 Delivers secret scrolls over misty peaks',
        previewText: 'Xin chào 📜',
        previewTextEn: 'Greetings 📜',
        accent: '#d97706',
        bubbleBg: 'rgba(246, 235, 209, 0.95)',
        bubbleBorder: 'rgba(180, 120, 50, 0.75)',
        bubbleText: '#2d1805',
        inputBorder: 'rgba(180, 120, 50, 0.55)',
        sparkle: '✿',
        hoverBursts: ['🦉', '龍', '福', '📜', '✨'],
        typingFx: { particles: ['🪶', '✒️', '福'], think: '📜 để xem...', thinkEn: '📜 let me see...' }
    },
    {
        id: 'moon-witch',
        name: 'Phù thủy ánh trăng',
        nameEn: 'Moonlight Witch',
        motionDesc: '🌙 Cưỡi chổi bay qua trăng khuyết & tháp cổ',
        motionDescEn: '🌙 Broomstick flight past crescent moon & spire',
        previewText: 'Xin chào 🌙',
        previewTextEn: 'Hello there 🌙',
        accent: '#a855f7',
        bubbleBg: 'rgba(35, 18, 50, 0.94)',
        bubbleBorder: 'rgba(168, 85, 247, 0.65)',
        bubbleText: '#fdf4ff',
        inputBorder: 'rgba(168, 85, 247, 0.5)',
        sparkle: '✧',
        hoverBursts: ['🌙', '🦇', '✨', '⭐', '💜'],
        typingFx: { particles: ['✨', '🔮', '⭐'], think: '🔮 ...', thinkEn: '🔮 ...' }
    },
    {
        id: 'fox-chibi',
        name: 'Hồ ly chibi',
        nameEn: 'Chibi Kitsune',
        motionDesc: '⛩️ Phóng qua cổng Torii & lửa hồ ly',
        motionDescEn: '⛩️ Dashes through Torii gates & foxfire',
        previewText: 'Xin chào 🦊',
        previewTextEn: 'Hello there 🦊',
        accent: '#e06030',
        bubbleBg: 'rgba(48, 22, 20, 0.95)',
        bubbleBorder: 'rgba(225, 105, 65, 0.65)',
        bubbleText: '#fff5eb',
        inputBorder: 'rgba(225, 105, 65, 0.5)',
        sparkle: '✦',
        hoverBursts: ['🔥', '🍁', '🦊', '✦', '🧡'],
        typingFx: { particles: ['🔥', '🍁', '✦'], think: '❓ ...', thinkEn: '❓ ...' }
    },
    {
        id: 'sakura-bunny',
        name: 'Thỏ ngọc anh đào',
        nameEn: 'Sakura Mochi Bunny',
        motionDesc: '🌸 Nhảy lò cò qua rừng hoa anh đào',
        motionDescEn: '🌸 Hops happily through cherry blossom woods',
        previewText: 'Xin chào 🌸',
        previewTextEn: 'Hello there 🌸',
        accent: '#fb7185',
        bubbleBg: 'rgba(46, 16, 28, 0.94)',
        bubbleBorder: 'rgba(251, 113, 133, 0.68)',
        bubbleText: '#fff1f2',
        inputBorder: 'rgba(251, 113, 133, 0.52)',
        sparkle: '🌸',
        hoverBursts: ['🌸', '🐰', '🍡', '💗', '🌸'],
        typingFx: { particles: ['🌸', '🌸', '💗'], think: '🥕 ...', thinkEn: '🥕 ...' }
    },
    {
        id: 'ocean-shark',
        name: 'Cá mập đại dương',
        nameEn: 'Ocean Shark',
        motionDesc: '🦈 Vây cá rẽ sóng sau chat rồi phóng vọt lên',
        motionDescEn: '🦈 Dorsal fin slices waves before breaching high',
        previewText: 'Xin chào 🦈',
        previewTextEn: 'Hello there 🦈',
        accent: '#22d3ee',
        bubbleBg: 'rgba(8, 34, 48, 0.94)',
        bubbleBorder: 'rgba(34, 211, 238, 0.65)',
        bubbleText: '#ecfeff',
        inputBorder: 'rgba(34, 211, 238, 0.5)',
        sparkle: '🫧',
        hoverBursts: ['🦈', '🌊', '🫧', '💧', '🐟'],
        typingFx: { particles: ['🫧', '💧', '🫧'], think: '🌊 ...', thinkEn: '🌊 ...' }
    },
    {
        id: 'gangster-pawn',
        name: 'Chốt gangster',
        nameEn: 'Gangster Pawn',
        motionDesc: '😎 Xe cầm chùy tới → Chốt hóa Hậu rút súng',
        motionDescEn: '😎 Rook attacks → Pawn promotes to Queen & draws',
        previewText: 'Xin chào ♟',
        previewTextEn: 'Sup boss ♟',
        accent: '#e5e7eb',
        bubbleBg: 'rgba(14, 14, 16, 0.95)',
        bubbleBorder: 'rgba(229, 231, 235, 0.62)',
        bubbleText: '#f9fafb',
        inputBorder: 'rgba(229, 231, 235, 0.45)',
        sparkle: '♟',
        hoverBursts: ['♟', '😎', '♛', '💥', '🔫'],
        typingFx: { particles: ['💵', '♟', '💥'], think: '😎 hmm...', thinkEn: '😎 hmm...' }
    },
    {
        id: 'ice-penguin',
        name: 'Cánh cụt băng tuyết',
        nameEn: 'Glacier Penguin',
        motionDesc: '🧊 Trượt bụng & nhảy qua các tảng băng nổi',
        motionDescEn: '🧊 Belly-slides & leaps across Arctic icebergs',
        previewText: 'Xin chào ❄️',
        previewTextEn: 'Stay cool ❄️',
        accent: '#60a5fa',
        bubbleBg: 'rgba(12, 26, 48, 0.94)',
        bubbleBorder: 'rgba(96, 165, 250, 0.68)',
        bubbleText: '#eff6ff',
        inputBorder: 'rgba(96, 165, 250, 0.52)',
        sparkle: '❄️',
        hoverBursts: ['❄️', '🐧', '❅', '💎', '❄️'],
        typingFx: { particles: ['❄️', '❅', '❄️'], think: '🧊 ...', thinkEn: '🧊 ...' }
    },
    {
        id: 'ai-robot',
        name: 'Robot AI tối giản',
        nameEn: 'Minimalist AI Bot',
        motionDesc: '🤖 Lướt ván từ trường qua cổng Hologram',
        motionDescEn: '🤖 Hoverboards through neon hologram gates',
        previewText: 'Xin chào 🤖',
        previewTextEn: 'Hello Human 🤖',
        accent: '#94a3b8',
        bubbleBg: 'rgba(28, 28, 32, 0.92)',
        bubbleBorder: 'rgba(255, 255, 255, 0.35)',
        bubbleText: '#f8fafc',
        inputBorder: 'rgba(255, 255, 255, 0.25)',
        sparkle: '✧',
        hoverBursts: ['🤖', '◇', '⚡', '✧', '💠'],
        typingFx: { particles: ['01', '10', '⚡'], think: 'Analyzing ▓▓░░', thinkEn: 'Analyzing ▓▓░░', mono: true }
    },
    {
        id: 'black-cat',
        name: 'Mèo than',
        nameEn: 'Midnight Cat',
        motionDesc: '🐾 Nhảy trên mái nhà đêm trăng & cuộn len',
        motionDescEn: '🐾 Leaps across moonlit rooftops & red yarn',
        previewText: 'Xin chào 🐾',
        previewTextEn: 'Meow there 🐾',
        accent: '#f5a623',
        bubbleBg: 'rgba(28, 24, 22, 0.95)',
        bubbleBorder: 'rgba(245, 166, 35, 0.65)',
        bubbleText: '#fff7ed',
        inputBorder: 'rgba(245, 166, 35, 0.5)',
        sparkle: '✦',
        hoverBursts: ['🐾', '🐟', '✨', '💛', '🐾'],
        typingFx: { particles: ['🐾', '🐾', '✦'], think: '💤 ...', thinkEn: '💤 ...' }
    },
    {
        id: 'noel-snowman',
        name: 'Người tuyết Giáng Sinh',
        nameEn: 'Christmas Snowman',
        motionDesc: '🎄 Cưỡi tuần lộc phát quà qua rừng thông Noel',
        motionDescEn: '🎄 Rides reindeer sleigh over snowy pine woods',
        previewText: 'Giáng Sinh an lành ⛄🎄',
        previewTextEn: 'Merry Christmas ⛄🎄',
        accent: '#ef4444',
        bubbleBg: 'rgba(34, 14, 18, 0.94)',
        bubbleBorder: 'rgba(248, 113, 113, 0.72)',
        bubbleText: '#fff5f5',
        inputBorder: 'rgba(239, 68, 68, 0.55)',
        sparkle: '🎄',
        hoverBursts: ['⛄', '🎄', '🎁', '❄️', '🔔'],
        typingFx: { particles: ['🔔', '❄️', '🎁'], think: '🥕 ...', thinkEn: '🥕 ...' }
    },
    {
        id: 'tet-lion',
        name: 'Kỳ Lân Múa Tết',
        nameEn: 'Lunar New Year Lion',
        motionDesc: '🦁 Nhảy Mai Hoa Thung hái Lộc & pháo Tết',
        motionDescEn: '🦁 Leaps plum-blossom poles with lucky firecrackers',
        previewText: 'Chúc Mừng Năm Mới 🧧🦁',
        previewTextEn: 'Happy Lunar New Year 🧧🦁',
        accent: '#f59e0b',
        bubbleBg: 'rgba(46, 10, 14, 0.95)',
        bubbleBorder: 'rgba(250, 204, 21, 0.78)',
        bubbleText: '#fef9c3',
        inputBorder: 'rgba(245, 158, 11, 0.6)',
        sparkle: '🧧',
        hoverBursts: ['🦁', '🧧', '🌼', '🪙', '🏮'],
        typingFx: { particles: ['🥁', '🪙', '🧧'], think: '🧧 ...', thinkEn: '🧧 ...' }
    },
    {
        id: 'code-cat',
        name: 'Mèo Code dạo',
        nameEn: 'Hacker Code Cat',
        motionDesc: '🐛 Cưỡi con trỏ chuột đi bắt bug',
        motionDescEn: '🐛 Surfs a mouse cursor to catch flying bugs',
        previewText: 'Hello World 💻',
        previewTextEn: 'Hello World 💻',
        accent: '#22c55e',
        bubbleBg: 'rgba(13, 17, 23, 0.95)',
        bubbleBorder: 'rgba(34, 197, 94, 0.65)',
        bubbleText: '#e6edf3',
        inputBorder: 'rgba(34, 197, 94, 0.5)',
        sparkle: '</>',
        hoverBursts: ['🐛', '💻', '☕', '✓', '🐱'],
        typingFx: { particles: [';', '{ }', '</>', '=>'], think: '☕ compiling...', thinkEn: '☕ compiling...', mono: true }
    },
    {
        id: 'pixel-knight',
        name: 'Pixel Hiệp Sĩ 8-bit',
        nameEn: '8-Bit Pixel Knight',
        motionDesc: '🗡️ Nhảy qua ống nước & cụng gạch rơi xu vàng',
        motionDescEn: '🗡️ Side-scrolls over pipes & hits coin blocks',
        previewText: 'INSERT COIN 🗡️',
        previewTextEn: 'INSERT COIN 🗡️',
        accent: '#facc15',
        bubbleBg: 'rgba(18, 22, 46, 0.95)',
        bubbleBorder: 'rgba(250, 204, 21, 0.72)',
        bubbleText: '#fef9c3',
        inputBorder: 'rgba(250, 204, 21, 0.55)',
        sparkle: '🪙',
        hoverBursts: ['🗡️', '🪙', '🛡️', '+100', '⭐'],
        typingFx: { particles: ['+1', '🪙', '⚔️'], think: '🕹️ LV.1...', thinkEn: '🕹️ LV.1...', mono: true }
    },
    {
        id: 'cloud-whale',
        name: 'Cá Voi Mây',
        nameEn: 'Sunset Cloud Whale',
        motionDesc: '🐋 Bơi giữa đảo nổi hoàng hôn & quẫy đuôi tạo mây',
        motionDescEn: '🐋 Swims past floating islands & trails clouds',
        previewText: 'Xin chào 🐋🌈',
        previewTextEn: 'Hello sky 🐋🌈',
        accent: '#f472b6',
        bubbleBg: 'rgba(32, 22, 58, 0.94)',
        bubbleBorder: 'rgba(244, 114, 182, 0.68)',
        bubbleText: '#fdf2f8',
        inputBorder: 'rgba(244, 114, 182, 0.52)',
        sparkle: '☁️',
        hoverBursts: ['🐋', '🌈', '☁️', '🫧', '✨'],
        typingFx: { particles: ['☁️', '♪', '🫧'], think: '🌈 ...', thinkEn: '🌈 ...' }
    },
    {
        id: 'halloween-pumpkin',
        name: 'Bí Ngô Ma Trơi',
        nameEn: 'Halloween Pumpkin',
        motionDesc: '🎃 Mở nắp đầu ma con thả kẹo & bay dưới trăng máu',
        motionDescEn: '🎃 Baby ghost pops out with candy & broomstick flight',
        previewText: 'Cho kẹo hay bị ghẹo 🎃🍬',
        previewTextEn: 'Trick or Treat 🎃🍬',
        accent: '#f97316',
        bubbleBg: 'rgba(34, 14, 28, 0.95)',
        bubbleBorder: 'rgba(249, 115, 22, 0.72)',
        bubbleText: '#fff7ed',
        inputBorder: 'rgba(249, 115, 22, 0.55)',
        sparkle: '🎃',
        hoverBursts: ['🎃', '👻', '🍬', '🦇', '🍭'],
        typingFx: { particles: ['🍬', '👻', '🍭'], think: '👻 ghẹo nè...', thinkEn: '👻 Trick or Treat?...' }
    },
    {
        id: 'midautumn-carp',
        name: 'Cá Chép Trung Thu',
        nameEn: 'Mid-Autumn Lantern Carp',
        motionDesc: '🏮 Ăn bánh nướng & vượt Vũ Môn dưới trăng rằm',
        motionDescEn: '🏮 Munches mooncake & leaps the Dragon Gate',
        previewText: 'Tết Trung Thu rước đèn 🏮🌕',
        previewTextEn: 'Happy Mid-Autumn 🏮🌕',
        accent: '#fbbf24',
        bubbleBg: 'rgba(42, 18, 12, 0.94)',
        bubbleBorder: 'rgba(251, 191, 36, 0.75)',
        bubbleText: '#fef9c3',
        inputBorder: 'rgba(251, 191, 36, 0.55)',
        sparkle: '🏮',
        hoverBursts: ['🏮', '🥮', '🌕', '⭐', '🐟'],
        typingFx: { particles: ['🏮', '⭐', '🥮'], think: '🌕 trông trăng...', thinkEn: '🌕 mooncake?...' }
    },
    {
        id: 'valentine-cupid',
        name: 'Tiểu Thần Cupid',
        nameEn: 'Valentine Cupid',
        motionDesc: '💘 Dán tim hồng & bay lượn giữa mây kẹo bông',
        motionDescEn: '💘 Patches hearts & flies across cotton-candy clouds',
        previewText: 'Gửi ngàn yêu thương 💘💌',
        previewTextEn: 'Happy Valentine 💘💌',
        accent: '#f43f5e',
        bubbleBg: 'rgba(46, 14, 26, 0.94)',
        bubbleBorder: 'rgba(244, 63, 94, 0.72)',
        bubbleText: '#fff1f2',
        inputBorder: 'rgba(244, 63, 94, 0.55)',
        sparkle: '💘',
        hoverBursts: ['💘', '💌', '💕', '🌹', '✨'],
        typingFx: { particles: ['💘', '💌', '💕'], think: '💌 thương ai...', thinkEn: '💌 Dear you...' }
    },
    {
        id: 'summer-corgi',
        name: 'Corgi Mùa Hè',
        nameEn: 'Summer Beach Corgi',
        motionDesc: '🏖️ Uống dừa bị cua kẹp & lướt ván sóng biển',
        motionDescEn: '🏖️ Sips coconut, crab pinch & rides ocean waves',
        previewText: 'Chào mùa hè rực rỡ 🏖️🥥',
        previewTextEn: 'Sunny Aloha Vibes 🏖️🥥',
        accent: '#06b6d4',
        bubbleBg: 'rgba(8, 38, 46, 0.94)',
        bubbleBorder: 'rgba(6, 182, 212, 0.72)',
        bubbleText: '#ecfeff',
        inputBorder: 'rgba(6, 182, 212, 0.55)',
        sparkle: '🏖️',
        hoverBursts: ['🏖️', '🥥', '🦀', '🌺', '🌊'],
        typingFx: { particles: ['🏖️', '🐚', '🦀'], think: '🥥 mát quá...', thinkEn: '🥥 Aloha!...' }
    }
];

function resolveSeasonalTheme(now) {
    const d = now || new Date();
    const m = d.getMonth() + 1;
    const day = d.getDate();

    // 1. Special Holidays take priority
    if (m === 2 && day >= 10 && day <= 16) {
        return { themeId: 'valentine-cupid', labelVi: '💘 Mùa Valentine', labelEn: '💘 Valentine Season' };
    }
    if ((m === 10 && day >= 15) || (m === 11 && day <= 2)) {
        return { themeId: 'halloween-pumpkin', labelVi: '🎃 Lễ hội Halloween', labelEn: '🎃 Halloween Season' };
    }
    if (m === 12 && day >= 10) {
        return { themeId: 'noel-snowman', labelVi: '🎄 Mùa Giáng Sinh (Noel)', labelEn: '🎄 Christmas Season' };
    }
    if (m === 1 || (m === 2 && day <= 22)) {
        return { themeId: 'tet-lion', labelVi: '🧧 Mùa Lễ Tết Đầu Năm', labelEn: '🧧 Lunar New Year Season' };
    }

    // 2. Full Seasonal & Festival Calendar
    if ((m === 2 && day > 22) || m === 3 || m === 4) {
        return { themeId: 'sakura-bunny', labelVi: '🌸 Mùa Xuân Anh Đào', labelEn: '🌸 Cherry Blossom Spring' };
    }
    if (m >= 5 && (m < 8 || (m === 8 && day < 15))) {
        return { themeId: 'summer-corgi', labelVi: '🏖️ Mùa Hè Bãi Biển', labelEn: '🏖️ Tropical Beach Summer' };
    }
    if ((m === 8 && day >= 15) || m === 9 || (m === 10 && day <= 5)) {
        return { themeId: 'midautumn-carp', labelVi: '🏮 Mùa Trăng Trung Thu', labelEn: '🏮 Mid-Autumn Moon Season' };
    }
    if (m === 10 && day >= 6 && day < 15) {
        return { themeId: 'fox-chibi', labelVi: '🍁 Mùa Thu Lá Phong', labelEn: '🍁 Autumn Maple Season' };
    }
    return { themeId: 'ice-penguin', labelVi: '❄️ Chớm Đông Băng Tuyết', labelEn: '❄️ Early Winter Frost' };
}

function localizeTheme(theme, lang) {
    const isEn = lang === 'en';
    return {
        name: (isEn && theme.nameEn) ? theme.nameEn : theme.name,
        motionDesc: (isEn && theme.motionDescEn) ? theme.motionDescEn : theme.motionDesc,
        previewText: (isEn && theme.previewTextEn) ? theme.previewTextEn : theme.previewText
    };
}

const THEMES = THEME_DEFINITIONS.map(def => {
    const assets = STICKERS[def.id] || {};
    return Object.assign({}, def, {
        sticker: assets.idle || '',
        actionSticker: assets.action || assets.idle || '',
        typingSticker: assets.typing || null
    });
});
