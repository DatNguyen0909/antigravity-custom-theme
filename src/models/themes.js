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
        previewText: 'Chân long hộ mệnh 🐉❖',
        previewTextEn: 'Awaken the Jade Pearl 🐉',
        accent: '#10b981',
        bubbleBg: 'rgba(12, 38, 30, 0.94)',
        bubbleBorder: 'rgba(16, 185, 129, 0.65)',
        bubbleText: '#ecfdf5',
        inputBorder: 'rgba(16, 185, 129, 0.5)',
        sparkle: '❖',
        hoverBursts: ['🐉', '❖', '🍃', '✨', '🟢'],
        typingFx: { particles: ['☁️', '☁', '💨'], think: '💨 tích linh khí...', thinkEn: '💨 gathering qi...' }
    },
    {
        id: 'fire-phoenix',
        name: 'Phượng hoàng lửa',
        nameEn: 'Fire Phoenix',
        motionDesc: '🔥 Sải cánh bay qua mây lửa & thái dương',
        motionDescEn: '🔥 Glides across blazing clouds & golden sun',
        previewText: 'Niết bàn rực lửa 🔥🪶',
        previewTextEn: 'Rise from the Ashes 🔥',
        accent: '#ec4899',
        bubbleBg: 'rgba(40, 15, 35, 0.94)',
        bubbleBorder: 'rgba(236, 72, 153, 0.65)',
        bubbleText: '#fdf2f8',
        inputBorder: 'rgba(236, 72, 153, 0.5)',
        sparkle: '🔥',
        hoverBursts: ['🔥', '🪶', '✨', '💛', '💖'],
        typingFx: { particles: ['🔥', '✦', '🪶'], think: '🔥 ủ lửa...', thinkEn: '🔥 igniting...' }
    },
    {
        id: 'space-astronaut',
        name: 'Phi hành gia thiên hà',
        nameEn: 'Galaxy Astronaut',
        motionDesc: '🪐 Bật Jetpack bay quanh các hành tinh',
        motionDescEn: '🪐 Jetpack flight around ringed planets',
        previewText: 'Houston, rõ tín hiệu! 🚀',
        previewTextEn: '3... 2... 1... Liftoff! 🚀',
        accent: '#38bdf8',
        bubbleBg: 'rgba(15, 23, 42, 0.95)',
        bubbleBorder: 'rgba(56, 189, 248, 0.65)',
        bubbleText: '#f0f9ff',
        inputBorder: 'rgba(56, 189, 248, 0.5)',
        sparkle: '★',
        hoverBursts: ['🚀', '🪐', '☄️', '🌟', '💫'],
        typingFx: { particles: ['📡', '✦', '★'], think: '📡 dò sóng...', thinkEn: '📡 scanning...' }
    },
    {
        id: 'wise-owl',
        name: 'Cú thông thái cổ thư',
        nameEn: 'Ancient Scroll Owl',
        motionDesc: '🦉 Bay qua đỉnh núi cổ phong & đèn lồng',
        motionDescEn: '🦉 Delivers secret scrolls over misty peaks',
        previewText: 'Thiên cơ bất khả lộ 📜',
        previewTextEn: 'Ancient Wisdom Awaits 📜',
        accent: '#d97706',
        bubbleBg: 'rgba(246, 235, 209, 0.95)',
        bubbleBorder: 'rgba(180, 120, 50, 0.75)',
        bubbleText: '#2d1805',
        inputBorder: 'rgba(180, 120, 50, 0.55)',
        sparkle: '✿',
        hoverBursts: ['🦉', '龍', '福', '📜', '✨'],
        typingFx: { particles: ['🪶', '✒️', '福'], think: '📜 tra cổ thư...', thinkEn: '📜 reading scroll...' }
    },
    {
        id: 'moon-witch',
        name: 'Phù thủy ánh trăng',
        nameEn: 'Moonlight Witch',
        motionDesc: '🌙 Cưỡi chổi bay qua trăng khuyết & tháp cổ',
        motionDescEn: '🌙 Broomstick flight past crescent moon & spire',
        previewText: 'Úm ba la hóa phép! 🌙✨',
        previewTextEn: 'Brewing Midnight Magic 🌙',
        accent: '#a855f7',
        bubbleBg: 'rgba(35, 18, 50, 0.94)',
        bubbleBorder: 'rgba(168, 85, 247, 0.65)',
        bubbleText: '#fdf4ff',
        inputBorder: 'rgba(168, 85, 247, 0.5)',
        sparkle: '✧',
        hoverBursts: ['🌙', '🦇', '✨', '⭐', '💜'],
        typingFx: { particles: ['✨', '🔮', '⭐'], think: '🔮 niệm chú...', thinkEn: '🔮 casting spell...' }
    },
    {
        id: 'fox-chibi',
        name: 'Hồ ly chibi',
        nameEn: 'Chibi Kitsune',
        motionDesc: '⛩️ Phóng qua cổng Torii & lửa hồ ly',
        motionDescEn: '⛩️ Dashes through Torii gates & foxfire',
        previewText: 'Kon-kon! Có đậu phụ ko? 🦊',
        previewTextEn: 'Kon-kon! Foxfire Ready 🦊',
        accent: '#e06030',
        bubbleBg: 'rgba(48, 22, 20, 0.95)',
        bubbleBorder: 'rgba(225, 105, 65, 0.65)',
        bubbleText: '#fff5eb',
        inputBorder: 'rgba(225, 105, 65, 0.5)',
        sparkle: '✦',
        hoverBursts: ['🔥', '🍁', '🦊', '✦', '🧡'],
        typingFx: { particles: ['🔥', '🍁', '✦'], think: '🦊 bày trò gì đây...', thinkEn: '🦊 plotting tricks...' }
    },
    {
        id: 'sakura-bunny',
        name: 'Thỏ ngọc anh đào',
        nameEn: 'Sakura Mochi Bunny',
        motionDesc: '🌸 Nhảy lò cò qua rừng hoa anh đào',
        motionDescEn: '🌸 Hops happily through cherry blossom woods',
        previewText: 'Mời bạn xiên bánh Mochi 🌸🍡',
        previewTextEn: 'Fresh Sakura Mochi! 🌸🍡',
        accent: '#fb7185',
        bubbleBg: 'rgba(46, 16, 28, 0.94)',
        bubbleBorder: 'rgba(251, 113, 133, 0.68)',
        bubbleText: '#fff1f2',
        inputBorder: 'rgba(251, 113, 133, 0.52)',
        sparkle: '🌸',
        hoverBursts: ['🌸', '🐰', '🍡', '💗', '🌸'],
        typingFx: { particles: ['🌸', '🌸', '💗'], think: '🍡 thèm bánh quá...', thinkEn: '🍡 craving mochi...' }
    },
    {
        id: 'ocean-shark',
        name: 'Cá mập đại dương',
        nameEn: 'Ocean Shark',
        motionDesc: '🦈 Vây cá rẽ sóng sau chat rồi phóng vọt lên',
        motionDescEn: '🦈 Dorsal fin slices waves before breaching high',
        previewText: 'Rẽ sóng săn mồi! 🦈🌊',
        previewTextEn: 'Chomp! Making Waves 🦈🌊',
        accent: '#22d3ee',
        bubbleBg: 'rgba(8, 34, 48, 0.94)',
        bubbleBorder: 'rgba(34, 211, 238, 0.65)',
        bubbleText: '#ecfeff',
        inputBorder: 'rgba(34, 211, 238, 0.5)',
        sparkle: '🫧',
        hoverBursts: ['🦈', '🌊', '🫧', '💧', '🐟'],
        typingFx: { particles: ['🫧', '💧', '🫧'], think: '🌊 rình mồi...', thinkEn: '🌊 circling...' }
    },
    {
        id: 'gangster-pawn',
        name: 'Chốt gangster',
        nameEn: 'Gangster Pawn',
        motionDesc: '😎 Xe cầm chùy tới → Chốt hóa Hậu rút súng',
        motionDescEn: '😎 Rook attacks → Pawn promotes to Queen & draws',
        previewText: 'Lên hàng 8 thành Trùm! ♟😎',
        previewTextEn: 'Checkmate, Boss. ♟😎',
        accent: '#e5e7eb',
        bubbleBg: 'rgba(14, 14, 16, 0.95)',
        bubbleBorder: 'rgba(229, 231, 235, 0.62)',
        bubbleText: '#f9fafb',
        inputBorder: 'rgba(229, 231, 235, 0.45)',
        sparkle: '♟',
        hoverBursts: ['♟', '😎', '♛', '💥', '🔫'],
        typingFx: { particles: ['💵', '♟', '💥'], think: '😎 tính nước cờ...', thinkEn: '😎 plotting move...' }
    },
    {
        id: 'ice-penguin',
        name: 'Cánh cụt băng tuyết',
        nameEn: 'Glacier Penguin',
        motionDesc: '🧊 Trượt bụng & nhảy qua các tảng băng nổi',
        motionDescEn: '🧊 Belly-slides & leaps across Arctic icebergs',
        previewText: 'Trượt băng cực mát! ❄️🐧',
        previewTextEn: 'Zero Degrees, 100% Chill ❄️',
        accent: '#60a5fa',
        bubbleBg: 'rgba(12, 26, 48, 0.94)',
        bubbleBorder: 'rgba(96, 165, 250, 0.68)',
        bubbleText: '#eff6ff',
        inputBorder: 'rgba(96, 165, 250, 0.52)',
        sparkle: '❄️',
        hoverBursts: ['❄️', '🐧', '❅', '💎', '❄️'],
        typingFx: { particles: ['❄️', '❅', '❄️'], think: '🧊 buốt não quá...', thinkEn: '🧊 brain freeze...' }
    },
    {
        id: 'ai-robot',
        name: 'Robot AI tối giản',
        nameEn: 'Minimalist AI Bot',
        motionDesc: '🤖 Lướt ván từ trường qua cổng Hologram',
        motionDescEn: '🤖 Hoverboards through neon hologram gates',
        previewText: 'Bíp bíp! Hệ thống sẵn sàng 🤖',
        previewTextEn: 'BEEP BOOP // ONLINE 🤖',
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
        previewText: 'Meow~ Đưa cá khô đây 🐾🐟',
        previewTextEn: 'Purr... Feed Me Now 🐾🐟',
        accent: '#f5a623',
        bubbleBg: 'rgba(28, 24, 22, 0.95)',
        bubbleBorder: 'rgba(245, 166, 35, 0.65)',
        bubbleText: '#fff7ed',
        inputBorder: 'rgba(245, 166, 35, 0.5)',
        sparkle: '✦',
        hoverBursts: ['🐾', '🐟', '✨', '💛', '🐾'],
        typingFx: { particles: ['🐾', '🐾', '✦'], think: '🐾 rình chấm đỏ...', thinkEn: '🐾 laser target...' }
    },
    {
        id: 'noel-snowman',
        name: 'Người tuyết Giáng Sinh',
        nameEn: 'Christmas Snowman',
        motionDesc: '🎄 Cưỡi tuần lộc phát quà qua rừng thông Noel',
        motionDescEn: '🎄 Rides reindeer sleigh over snowy pine woods',
        previewText: 'Ho Ho Ho! Phát quà thôi ⛄🎄',
        previewTextEn: 'Jingle All the Way! ⛄🎄',
        accent: '#ef4444',
        bubbleBg: 'rgba(34, 14, 18, 0.94)',
        bubbleBorder: 'rgba(248, 113, 113, 0.72)',
        bubbleText: '#fff5f5',
        inputBorder: 'rgba(239, 68, 68, 0.55)',
        sparkle: '🎄',
        hoverBursts: ['⛄', '🎄', '🎁', '❄️', '🔔'],
        typingFx: { particles: ['🔔', '❄️', '🎁'], think: '🎁 gói quà nào...', thinkEn: '🎁 wrapping gifts...' }
    },
    {
        id: 'tet-lion',
        name: 'Kỳ Lân Múa Tết',
        nameEn: 'Lunar New Year Lion',
        motionDesc: '🦁 Nhảy Mai Hoa Thung hái Lộc & pháo Tết',
        motionDescEn: '🦁 Leaps plum-blossom poles with lucky firecrackers',
        previewText: 'Tùng dinh dinh! Hái Lộc 🧧🦁',
        previewTextEn: 'Lucky Drums & Prosperity 🧧🦁',
        accent: '#f59e0b',
        bubbleBg: 'rgba(46, 10, 14, 0.95)',
        bubbleBorder: 'rgba(250, 204, 21, 0.78)',
        bubbleText: '#fef9c3',
        inputBorder: 'rgba(245, 158, 11, 0.6)',
        sparkle: '🧧',
        hoverBursts: ['🦁', '🧧', '🌼', '🪙', '🏮'],
        typingFx: { particles: ['🥁', '🪙', '🧧'], think: '🧧 xin lì xì...', thinkEn: '🧧 lucky money...' }
    },
    {
        id: 'code-cat',
        name: 'Mèo Code dạo',
        nameEn: 'Hacker Code Cat',
        motionDesc: '🐛 Cưỡi con trỏ chuột đi bắt bug',
        motionDescEn: '🐛 Surfs a mouse cursor to catch flying bugs',
        previewText: 'Code mượt 0 Bug! 💻🐛',
        previewTextEn: 'git push --force 💻🐱',
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
        previewText: 'INSERT COIN • 1UP! 🗡️🪙',
        previewTextEn: 'INSERT COIN • 1UP! 🗡️🪙',
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
        previewText: 'Cưỡi mây trôi hoàng hôn 🐋🌈',
        previewTextEn: 'Drifting Above the Clouds 🐋🌈',
        accent: '#f472b6',
        bubbleBg: 'rgba(32, 22, 58, 0.94)',
        bubbleBorder: 'rgba(244, 114, 182, 0.68)',
        bubbleText: '#fdf2f8',
        inputBorder: 'rgba(244, 114, 182, 0.52)',
        sparkle: '☁️',
        hoverBursts: ['🐋', '🌈', '☁️', '🫧', '✨'],
        typingFx: { particles: ['☁️', '♪', '🫧'], think: '🌈 ngân nga...', thinkEn: '🌈 humming...' }
    },
    {
        id: 'halloween-pumpkin',
        name: 'Bí Ngô Ma Trơi',
        nameEn: 'Halloween Pumpkin',
        motionDesc: '🎃 Mở nắp đầu ma con thả kẹo & bay dưới trăng máu',
        motionDescEn: '🎃 Baby ghost pops out with candy & broomstick flight',
        previewText: 'Cho kẹo hay bị ghẹo! 🎃🍬',
        previewTextEn: 'Trick or Treat! BOO! 🎃🍬',
        accent: '#f97316',
        bubbleBg: 'rgba(34, 14, 28, 0.95)',
        bubbleBorder: 'rgba(249, 115, 22, 0.72)',
        bubbleText: '#fff7ed',
        inputBorder: 'rgba(249, 115, 22, 0.55)',
        sparkle: '🎃',
        hoverBursts: ['🎃', '👻', '🍬', '🦇', '🍭'],
        typingFx: { particles: ['🍬', '👻', '🍭'], think: '👻 ghẹo ai giờ...', thinkEn: '👻 spooky vibes...' }
    },
    {
        id: 'midautumn-carp',
        name: 'Cá Chép Trung Thu',
        nameEn: 'Mid-Autumn Lantern Carp',
        motionDesc: '🏮 Ăn bánh nướng & vượt Vũ Môn dưới trăng rằm',
        motionDescEn: '🏮 Munches mooncake & leaps the Dragon Gate',
        previewText: 'Rước đèn vượt Vũ Môn! 🏮🌕',
        previewTextEn: 'Over the Dragon Gate! 🏮🌕',
        accent: '#fbbf24',
        bubbleBg: 'rgba(42, 18, 12, 0.94)',
        bubbleBorder: 'rgba(251, 191, 36, 0.75)',
        bubbleText: '#fef9c3',
        inputBorder: 'rgba(251, 191, 36, 0.55)',
        sparkle: '🏮',
        hoverBursts: ['🏮', '🥮', '🌕', '⭐', '🐟'],
        typingFx: { particles: ['🏮', '⭐', '🥮'], think: '🥮 nhân thập cẩm...', thinkEn: '🥮 mooncake time...' }
    },
    {
        id: 'valentine-cupid',
        name: 'Tiểu Thần Cupid',
        nameEn: 'Valentine Cupid',
        motionDesc: '💘 Dán tim hồng & bay lượn giữa mây kẹo bông',
        motionDescEn: '💘 Patches hearts & flies across cotton-candy clouds',
        previewText: 'Nhắm trúng tim bạn rồi! 💘',
        previewTextEn: 'Target Locked: Your Heart 💘',
        accent: '#f43f5e',
        bubbleBg: 'rgba(46, 14, 26, 0.94)',
        bubbleBorder: 'rgba(244, 63, 94, 0.72)',
        bubbleText: '#fff1f2',
        inputBorder: 'rgba(244, 63, 94, 0.55)',
        sparkle: '💘',
        hoverBursts: ['💘', '💌', '💕', '🌹', '✨'],
        typingFx: { particles: ['💘', '💌', '💕'], think: '💌 viết thư tình...', thinkEn: '💌 sealing love...' }
    },
    {
        id: 'summer-corgi',
        name: 'Corgi Mùa Hè',
        nameEn: 'Summer Beach Corgi',
        motionDesc: '🏖️ Uống dừa bị cua kẹp & lướt ván sóng biển',
        motionDescEn: '🏖️ Sips coconut, crab pinch & rides ocean waves',
        previewText: 'Aloha! Lướt sóng uống dừa 🏖️🥥',
        previewTextEn: 'Surf’s Up, Good Boy! 🏖️🥥',
        accent: '#06b6d4',
        bubbleBg: 'rgba(8, 38, 46, 0.94)',
        bubbleBorder: 'rgba(6, 182, 212, 0.72)',
        bubbleText: '#ecfeff',
        inputBorder: 'rgba(6, 182, 212, 0.55)',
        sparkle: '🏖️',
        hoverBursts: ['🏖️', '🥥', '🦀', '🌺', '🌊'],
        typingFx: { particles: ['🏖️', '🐚', '🦀'], think: '🥥 chill chút đã...', thinkEn: '🥥 beach mode...' }
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

const AI_STATUS_LABELS = {
    'jade-dragon': ['🐉 Đang luyện linh khí...', '🐉 Gathering Jade Qi...', '✨ Đắc đạo rồi!', '✨ Jade Mastery Done!'],
    'fire-phoenix': ['🔥 Đang ủ lửa thần...', '🔥 Igniting Embers...', '✨ Niết bàn hoàn tất!', '✨ Blazing Complete!'],
    'space-astronaut': ['📡 Đang quét radar...', '📡 Scanning Cosmos...', '🚀 Nhiệm vụ hoàn tất!', '🚀 Mission Complete!'],
    'wise-owl': ['🔍 Đang tra cổ thư...', '🔍 Consulting Scrolls...', '📜 Đã đóng triện xong!', '📜 Wisdom Sealed!'],
    'moon-witch': ['🔮 Đang soi cầu pha lê...', '🔮 Gazing Crystal Ball...', '✨ Phép thuật hoàn thành!', '✨ Spell Complete!'],
    'fox-chibi': ['🦊 Đang xoay lửa hồ ly...', '🦊 Spinning Foxfire...', '🔔 Kon-kon! Xong rồi!', '🔔 Kon-kon! All Done!'],
    'sakura-bunny': ['🔍 Đang soi cánh hoa...', '🔍 Inspecting Petals...', '🍡 Xong rồi! Mời Mochi!', '🍡 Done! Mochi Time!'],
    'ocean-shark': ['🌊 Đang dò sóng sonar...', '🌊 Pinging Sonar...', '🦈 Săn mồi thành công!', '🦈 Splash! All Done!'],
    'gangster-pawn': ['♟ Đang tính nước cờ...', '♟ Calculating Moves...', '♛ Chiếu hết! GG!', '♛ Checkmate! GG!'],
    'ice-penguin': ['🧭 Đang xem la bàn băng...', '🧭 Checking Frost Map...', '☕ Xong rồi! Uống cacao!', '☕ Done! Cocoa Time!'],
    'ai-robot': ['⚙️ Đang xử lý dữ liệu...', '⚙️ Processing Data...', '✓ Hoàn tất 100%!', '✓ Task Complete!'],
    'black-cat': ['💡 Đang nảy ý tưởng...', '💡 Brainstorming...', '🐟 Meow~ Xong rồi!', '🐟 Meow~ All Done!'],
    'noel-snowman': ['🔍 Đang soi danh sách quà...', '🔍 Checking Gift List...', '🎁 Ho Ho Ho! Xong rồi!', '🎁 Ho Ho Ho! Done!'],
    'tet-lion': ['🏮 Đang bấm quẻ đầu năm...', '🏮 Reading Fortune...', '🧧 Khai xuân thành công!', '🧧 Prosperous Done!'],
    'code-cat': ['☕ Đang phân tích code...', '☕ Reviewing Code...', '✓ 0 Bugs! Xong rồi!', '✓ 0 Bugs! Shipped!'],
    'pixel-knight': ['🗺️ Đang dò bản đồ 8-bit...', '🗺️ Scanning Dungeon...', '★ STAGE CLEAR!', '★ STAGE CLEAR!'],
    'cloud-whale': ['☁️ Đang ngẫm giữa mây...', '☁️ Drifting in Thought...', '🌈 Cầu vồng hiện rồi!', '🌈 Rainbow Complete!'],
    'halloween-pumpkin': ['🔍 Ma con đang dò kẹo...', '🔍 Scouting Candy Map...', '🍬 Boo-yah! Xong rồi!', '🍬 Boo-yah! All Done!'],
    'midautumn-carp': ['🏮 Đang soi ánh trăng...', '🏮 Reflecting by Moon...', '🌕 Rằm sáng! Xong rồi!', '🌕 Moonlit Success!'],
    'valentine-cupid': ['💘 Đang ngắm mục tiêu...', '💘 Locking Target...', '💌 Trúng tim rồi!', '💌 Bullseye! Done!'],
    'summer-corgi': ['🗺️ Đang xem bản đồ biển...', '🗺️ Reading Beach Map...', '🥥 Aloha! Xong rồi!', '🥥 Aloha! All Done!']
};

const THEMES = THEME_DEFINITIONS.map(def => {
    const assets = STICKERS[def.id] || {};
    const ai = AI_STATUS_LABELS[def.id] || ['🧠 Đang suy nghĩ...', '🧠 Thinking...', '✨ Xong rồi!', '✨ Done!'];
    return Object.assign({}, def, {
        sticker: assets.idle || '',
        actionSticker: assets.action || assets.idle || '',
        typingSticker: assets.typing || null,
        thinkingSticker: assets.thinking || null,
        doneSticker: assets.done || null,
        aiThinking: ai[0],
        aiThinkingEn: ai[1],
        aiDone: ai[2],
        aiDoneEn: ai[3]
    });
});
