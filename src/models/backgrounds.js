// ========================================================
// MODEL: Theme Backgrounds & Sidebar Frosted Glass Palettes
// ========================================================

function stars(color, size) {
    const s = size || 240;
    const pts = [[22, 34, 1.3], [130, 70, 1], [188, 170, 1.6], [64, 150, 1], [210, 40, 1.1], [100, 210, 1.4], [160, 118, 0.9]];
    return pts.map(p =>
        'radial-gradient(' + p[2] + 'px ' + p[2] + 'px at ' + p[0] + 'px ' + p[1] + 'px, ' + color + ', transparent 70%) 0 0/' + s + 'px ' + s + 'px repeat'
    ).join(', ');
}

function glow(x, y, w, h, color) {
    return 'radial-gradient(' + w + ' ' + h + ' at ' + x + ' ' + y + ', ' + color + ', transparent 70%) no-repeat';
}

const THEME_BG = {
    'fox-chibi': [
        stars('rgba(255,170,90,0.75)', 260),
        glow('85%', '15%', '45%', '40%', 'rgba(230,100,40,0.35)'),
        glow('10%', '90%', '50%', '45%', 'rgba(180,50,30,0.35)'),
        'linear-gradient(160deg, #2a120b 0%, #170a07 55%, #0e0605 100%)'
    ].join(', '),
    'black-cat': [
        stars('rgba(255,200,90,0.6)', 280),
        glow('80%', '20%', '40%', '35%', 'rgba(245,166,35,0.22)'),
        glow('15%', '85%', '45%', '40%', 'rgba(120,80,30,0.25)'),
        'linear-gradient(160deg, #1d1a17 0%, #121110 60%, #0a0909 100%)'
    ].join(', '),
    'space-astronaut': [
        stars('rgba(255,255,255,0.85)', 200),
        stars('rgba(150,210,255,0.6)', 330),
        glow('75%', '25%', '50%', '45%', 'rgba(56,120,248,0.35)'),
        glow('20%', '75%', '50%', '45%', 'rgba(130,70,220,0.30)'),
        'linear-gradient(160deg, #0b1330 0%, #070b1d 55%, #04060f 100%)'
    ].join(', '),
    'wise-owl': [
        glow('50%', '30%', '60%', '50%', 'rgba(217,150,60,0.25)'),
        glow('10%', '90%', '45%', '40%', 'rgba(140,90,30,0.30)'),
        'repeating-linear-gradient(0deg, rgba(255,220,160,0.025) 0px, rgba(255,220,160,0.025) 2px, transparent 2px, transparent 6px)',
        'linear-gradient(160deg, #2a1d0e 0%, #1a1209 60%, #100b06 100%)'
    ].join(', '),
    'ai-robot': [
        glow('70%', '20%', '50%', '45%', 'rgba(56,189,248,0.12)'),
        'linear-gradient(160deg, #1a1b1f 0%, #121316 60%, #0b0c0e 100%)'
    ].join(', '),
    'fire-phoenix': [
        stars('rgba(255,190,150,0.75)', 240),
        glow('80%', '20%', '45%', '40%', 'rgba(236,72,153,0.34)'),
        glow('15%', '85%', '50%', '45%', 'rgba(234,88,12,0.28)'),
        'linear-gradient(160deg, #2c0d22 0%, #1a0714 55%, #0e040b 100%)'
    ].join(', '),
    'jade-dragon': [
        stars('rgba(140,255,200,0.6)', 260),
        glow('80%', '18%', '45%', '40%', 'rgba(16,185,129,0.32)'),
        glow('12%', '88%', '50%', '45%', 'rgba(20,120,90,0.35)'),
        'repeating-radial-gradient(circle at 50% 120%, rgba(16,185,129,0.035) 0px, rgba(16,185,129,0.035) 2px, transparent 2px, transparent 22px)',
        'linear-gradient(160deg, #0a2a1f 0%, #071a14 55%, #040e0b 100%)'
    ].join(', '),
    'moon-witch': [
        stars('rgba(230,210,255,0.8)', 220),
        glow('82%', '14%', '14%', '14%', 'rgba(245,235,255,0.35)'),
        glow('82%', '14%', '40%', '38%', 'rgba(168,85,247,0.30)'),
        glow('15%', '88%', '50%', '45%', 'rgba(90,40,160,0.32)'),
        'linear-gradient(160deg, #1f1033 0%, #130a20 55%, #0a0612 100%)'
    ].join(', '),
    'sakura-bunny': [
        stars('rgba(255,200,220,0.75)', 240),
        glow('80%', '18%', '45%', '40%', 'rgba(251,113,133,0.34)'),
        glow('15%', '85%', '50%', '45%', 'rgba(219,39,119,0.28)'),
        'linear-gradient(160deg, #2d101e 0%, #1b0912 55%, #10050a 100%)'
    ].join(', '),
    'ocean-shark': [
        stars('rgba(165,243,252,0.65)', 250),
        glow('78%', '20%', '48%', '42%', 'rgba(34,211,238,0.32)'),
        glow('18%', '85%', '50%', '45%', 'rgba(2,132,199,0.34)'),
        'linear-gradient(160deg, #072638 0%, #041724 55%, #020c14 100%)'
    ].join(', '),
    'gangster-pawn': [
        stars('rgba(255,255,255,0.7)', 230),
        glow('82%', '16%', '42%', '38%', 'rgba(255,255,255,0.14)'),
        glow('16%', '88%', '50%', '45%', 'rgba(160,160,170,0.14)'),
        'repeating-conic-gradient(rgba(255,255,255,0.035) 0% 25%, transparent 0% 50%) 0 0/88px 88px',
        'linear-gradient(160deg, #1c1c1f 0%, #111113 55%, #060607 100%)'
    ].join(', '),
    'ice-penguin': [
        stars('rgba(224,242,254,0.85)', 210),
        glow('75%', '18%', '55%', '42%', 'rgba(96,165,250,0.32)'),
        glow('20%', '82%', '50%', '45%', 'rgba(45,212,191,0.24)'),
        'linear-gradient(160deg, #0c1f3d 0%, #071326 55%, #040a16 100%)'
    ].join(', '),
    'noel-snowman': [
        stars('rgba(254,240,138,0.85)', 220),
        stars('rgba(255,255,255,0.8)', 290),
        glow('82%', '18%', '48%', '42%', 'rgba(220,38,38,0.34)'),
        glow('16%', '86%', '52%', '46%', 'rgba(16,185,129,0.28)'),
        'linear-gradient(160deg, #240c11 0%, #0f1f17 55%, #07100c 100%)'
    ].join(', '),
    'tet-lion': [
        stars('rgba(253,224,71,0.85)', 230),
        stars('rgba(248,113,113,0.75)', 300),
        glow('82%', '18%', '48%', '42%', 'rgba(234,179,8,0.34)'),
        glow('16%', '86%', '52%', '46%', 'rgba(220,38,38,0.38)'),
        'linear-gradient(160deg, #2d080a 0%, #1c0507 55%, #0f0204 100%)'
    ].join(', '),
    'code-cat': [
        stars('rgba(74,222,128,0.55)', 240),
        glow('82%', '18%', '46%', '40%', 'rgba(34,197,94,0.22)'),
        glow('16%', '86%', '50%', '44%', 'rgba(168,85,247,0.20)'),
        'repeating-linear-gradient(0deg, rgba(139,148,158,0.035) 0px, rgba(139,148,158,0.035) 1px, transparent 1px, transparent 22px)',
        'linear-gradient(160deg, #0d1117 0%, #0a0e14 55%, #05070a 100%)'
    ].join(', '),
    'pixel-knight': [
        stars('rgba(250,204,21,0.75)', 200),
        stars('rgba(96,165,250,0.65)', 280),
        glow('82%', '18%', '46%', '40%', 'rgba(59,130,246,0.28)'),
        glow('16%', '86%', '50%', '44%', 'rgba(234,179,8,0.22)'),
        'repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 2px, transparent 2px, transparent 16px), repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 2px, transparent 2px, transparent 16px)',
        'linear-gradient(160deg, #15193b 0%, #0d1026 55%, #070814 100%)'
    ].join(', '),
    'cloud-whale': [
        stars('rgba(254,240,138,0.8)', 240),
        glow('80%', '20%', '52%', '46%', 'rgba(244,114,182,0.34)'),
        glow('20%', '84%', '55%', '48%', 'rgba(251,146,60,0.30)'),
        glow('50%', '45%', '60%', '50%', 'rgba(129,140,248,0.26)'),
        'linear-gradient(165deg, #1e1b4b 0%, #3b1c4a 52%, #4a1d35 100%)'
    ].join(', ')
};

const THEME_PANEL = {
    'fox-chibi': 'rgba(30, 14, 10, 0.78)',
    'black-cat': 'rgba(22, 20, 18, 0.80)',
    'space-astronaut': 'rgba(10, 16, 36, 0.78)',
    'wise-owl': 'rgba(32, 22, 12, 0.80)',
    'ai-robot': 'rgba(20, 21, 24, 0.80)',
    'fire-phoenix': 'rgba(32, 12, 24, 0.78)',
    'jade-dragon': 'rgba(8, 30, 22, 0.78)',
    'moon-witch': 'rgba(24, 13, 40, 0.78)',
    'sakura-bunny': 'rgba(34, 12, 22, 0.78)',
    'ocean-shark': 'rgba(6, 26, 38, 0.78)',
    'gangster-pawn': 'rgba(16, 16, 18, 0.82)',
    'ice-penguin': 'rgba(10, 22, 42, 0.78)',
    'noel-snowman': 'rgba(24, 12, 15, 0.80)',
    'tet-lion': 'rgba(32, 8, 10, 0.82)',
    'code-cat': 'rgba(13, 17, 23, 0.84)',
    'pixel-knight': 'rgba(14, 17, 38, 0.84)',
    'cloud-whale': 'rgba(28, 20, 52, 0.80)'
};

const THEME_BG_LIGHT = {
    'fox-chibi': [
        stars('rgba(234,88,12,0.32)', 250),
        glow('88%', '14%', '46%', '42%', 'rgba(251,146,60,0.34)'),
        glow('14%', '88%', '48%', '44%', 'rgba(244,63,94,0.22)'),
        glow('55%', '48%', '60%', '55%', 'rgba(254,215,170,0.28)'),
        'linear-gradient(145deg, #ffffff 0%, #fffaf5 48%, #fff1e6 100%)'
    ].join(', '),
    'black-cat': [
        stars('rgba(217,119,6,0.28)', 260),
        glow('86%', '16%', '44%', '40%', 'rgba(245,158,11,0.28)'),
        glow('14%', '86%', '48%', '42%', 'rgba(120,113,108,0.18)'),
        'linear-gradient(145deg, #ffffff 0%, #fafaf9 50%, #f5f5f4 100%)'
    ].join(', '),
    'space-astronaut': [
        stars('rgba(37,99,235,0.32)', 210),
        stars('rgba(124,58,237,0.25)', 310),
        glow('84%', '16%', '48%', '44%', 'rgba(56,189,248,0.32)'),
        glow('16%', '84%', '48%', '44%', 'rgba(139,92,246,0.24)'),
        'linear-gradient(145deg, #ffffff 0%, #f8fafc 48%, #eff6ff 100%)'
    ].join(', '),
    'wise-owl': [
        stars('rgba(180,83,9,0.25)', 260),
        glow('82%', '18%', '50%', '44%', 'rgba(245,158,11,0.28)'),
        glow('14%', '86%', '48%', '42%', 'rgba(217,119,6,0.20)'),
        'repeating-linear-gradient(0deg, rgba(180,120,50,0.025) 0px, rgba(180,120,50,0.025) 2px, transparent 2px, transparent 8px)',
        'linear-gradient(145deg, #fffdf9 0%, #fef9ee 52%, #fdf3dd 100%)'
    ].join(', '),
    'ai-robot': [
        stars('rgba(71,85,105,0.24)', 240),
        glow('84%', '16%', '48%', '42%', 'rgba(56,189,248,0.24)'),
        glow('16%', '86%', '48%', '42%', 'rgba(148,163,184,0.22)'),
        'linear-gradient(145deg, #ffffff 0%, #f8fafc 52%, #f1f5f9 100%)'
    ].join(', '),
    'fire-phoenix': [
        stars('rgba(219,39,119,0.30)', 240),
        glow('86%', '15%', '46%', '42%', 'rgba(244,114,182,0.34)'),
        glow('14%', '86%', '48%', '44%', 'rgba(251,146,60,0.28)'),
        'linear-gradient(145deg, #ffffff 0%, #fff8fa 48%, #fff0f5 100%)'
    ].join(', '),
    'jade-dragon': [
        stars('rgba(5,150,105,0.30)', 250),
        glow('86%', '15%', '46%', '42%', 'rgba(16,185,129,0.30)'),
        glow('14%', '86%', '48%', '44%', 'rgba(20,184,166,0.24)'),
        'repeating-radial-gradient(circle at 50% 120%, rgba(16,185,129,0.04) 0px, rgba(16,185,129,0.04) 2px, transparent 2px, transparent 24px)',
        'linear-gradient(145deg, #ffffff 0%, #f6fef9 50%, #ecfdf5 100%)'
    ].join(', '),
    'moon-witch': [
        stars('rgba(126,34,206,0.30)', 230),
        glow('85%', '15%', '46%', '42%', 'rgba(168,85,247,0.32)'),
        glow('14%', '86%', '48%', '44%', 'rgba(236,72,153,0.22)'),
        'linear-gradient(145deg, #ffffff 0%, #fcfaff 50%, #f5f0ff 100%)'
    ].join(', '),
    'sakura-bunny': [
        stars('rgba(225,29,72,0.28)', 240),
        glow('86%', '15%', '46%', '42%', 'rgba(251,113,133,0.32)'),
        glow('14%', '86%', '48%', '44%', 'rgba(244,114,182,0.26)'),
        'linear-gradient(145deg, #ffffff 0%, #fff9fa 50%, #fff1f4 100%)'
    ].join(', '),
    'ocean-shark': [
        stars('rgba(2,132,199,0.30)', 240),
        glow('84%', '16%', '48%', '42%', 'rgba(34,211,238,0.32)'),
        glow('15%', '86%', '50%', '44%', 'rgba(56,189,248,0.26)'),
        'linear-gradient(145deg, #ffffff 0%, #f7fdff 50%, #ecfeff 100%)'
    ].join(', '),
    'gangster-pawn': [
        stars('rgba(30,41,59,0.24)', 230),
        glow('84%', '16%', '44%', '38%', 'rgba(100,116,139,0.18)'),
        'repeating-conic-gradient(rgba(15,23,42,0.035) 0% 25%, transparent 0% 50%) 0 0/88px 88px',
        'linear-gradient(145deg, #ffffff 0%, #f8fafc 52%, #f1f5f9 100%)'
    ].join(', '),
    'ice-penguin': [
        stars('rgba(37,99,235,0.28)', 220),
        glow('82%', '16%', '52%', '42%', 'rgba(96,165,250,0.32)'),
        glow('16%', '84%', '48%', '44%', 'rgba(45,212,191,0.24)'),
        'linear-gradient(145deg, #ffffff 0%, #f8fbff 50%, #eff6ff 100%)'
    ].join(', '),
    'noel-snowman': [
        stars('rgba(220,38,38,0.28)', 230),
        stars('rgba(5,150,105,0.28)', 290),
        glow('85%', '16%', '46%', '42%', 'rgba(239,68,68,0.28)'),
        glow('15%', '86%', '50%', '44%', 'rgba(16,185,129,0.26)'),
        'linear-gradient(145deg, #ffffff 0%, #fffafa 48%, #f2fbf6 100%)'
    ].join(', '),
    'tet-lion': [
        stars('rgba(217,119,6,0.32)', 230),
        stars('rgba(220,38,38,0.28)', 290),
        glow('85%', '15%', '48%', '42%', 'rgba(250,204,21,0.34)'),
        glow('15%', '86%', '50%', '44%', 'rgba(239,68,68,0.26)'),
        'linear-gradient(145deg, #ffffff 0%, #fffdf5 48%, #fff5f5 100%)'
    ].join(', '),
    'code-cat': [
        stars('rgba(22,163,74,0.30)', 240),
        glow('84%', '16%', '46%', '42%', 'rgba(34,197,94,0.24)'),
        glow('15%', '86%', '50%', '44%', 'rgba(168,85,247,0.18)'),
        'repeating-linear-gradient(0deg, rgba(15,23,42,0.035) 0px, rgba(15,23,42,0.035) 1px, transparent 1px, transparent 22px)',
        'linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #f0fdf4 100%)'
    ].join(', '),
    'pixel-knight': [
        stars('rgba(37,99,235,0.28)', 220),
        glow('84%', '16%', '46%', '42%', 'rgba(250,204,21,0.28)'),
        glow('15%', '86%', '50%', '44%', 'rgba(59,130,246,0.22)'),
        'repeating-linear-gradient(0deg, rgba(15,23,42,0.03) 0px, rgba(15,23,42,0.03) 2px, transparent 2px, transparent 16px), repeating-linear-gradient(90deg, rgba(15,23,42,0.03) 0px, rgba(15,23,42,0.03) 2px, transparent 2px, transparent 16px)',
        'linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #eff6ff 100%)'
    ].join(', '),
    'cloud-whale': [
        stars('rgba(236,72,153,0.28)', 240),
        glow('84%', '16%', '50%', '44%', 'rgba(244,114,182,0.32)'),
        glow('16%', '84%', '52%', '46%', 'rgba(251,146,60,0.26)'),
        glow('50%', '48%', '58%', '50%', 'rgba(129,140,248,0.22)'),
        'linear-gradient(145deg, #ffffff 0%, #fff7fa 48%, #fff1e6 100%)'
    ].join(', ')
};

const THEME_PANEL_LIGHT = {
    'fox-chibi': 'rgba(255, 255, 255, 0.88)',
    'black-cat': 'rgba(255, 255, 255, 0.88)',
    'space-astronaut': 'rgba(255, 255, 255, 0.88)',
    'wise-owl': 'rgba(255, 253, 248, 0.88)',
    'ai-robot': 'rgba(255, 255, 255, 0.90)',
    'fire-phoenix': 'rgba(255, 255, 255, 0.88)',
    'jade-dragon': 'rgba(255, 255, 255, 0.88)',
    'moon-witch': 'rgba(255, 255, 255, 0.88)',
    'sakura-bunny': 'rgba(255, 255, 255, 0.88)',
    'ocean-shark': 'rgba(255, 255, 255, 0.88)',
    'gangster-pawn': 'rgba(255, 255, 255, 0.90)',
    'ice-penguin': 'rgba(255, 255, 255, 0.88)',
    'noel-snowman': 'rgba(255, 255, 255, 0.88)',
    'tet-lion': 'rgba(255, 255, 255, 0.88)',
    'code-cat': 'rgba(255, 255, 255, 0.90)',
    'pixel-knight': 'rgba(255, 255, 255, 0.90)',
    'cloud-whale': 'rgba(255, 255, 255, 0.88)'
};
