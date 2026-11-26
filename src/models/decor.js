// ========================================================
// MODEL: Background SVG Art & Living Scene Decor Config
// ========================================================

function svgUri(svg) {
    return 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")';
}

const SVG = {
    dragon: (c) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 420 220' fill='none' stroke-linecap='round'><path d='M20 170 C 70 70, 130 210, 190 120 S 280 25, 335 95 S 390 120, 398 65' stroke='" + c + "' stroke-width='9'/><path d='M20 170 C 70 70, 130 210, 190 120 S 280 25, 335 95 S 390 120, 398 65' stroke='" + c + "' stroke-width='18' stroke-dasharray='2 12' stroke-opacity='0.65'/><circle cx='398' cy='62' r='10' fill='" + c + "'/><path d='M400 54 l14 -16 M392 54 l4 -20' stroke='" + c + "' stroke-width='3.2'/><path d='M75 115 q12 -24 28 -8 M245 65 q14 -24 30 -6' stroke='" + c + "' stroke-width='3.2'/></svg>",
    phoenixWings: (c) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 220' fill='none' stroke='" + c + "' stroke-linecap='round'><path d='M200 150 C140 90, 60 60, 15 95 C60 115, 110 135, 175 160' stroke-width='5'/><path d='M200 150 C260 90, 340 60, 385 95 C340 115, 290 135, 225 160' stroke-width='5'/><path d='M200 160 C150 120, 80 110, 35 140' stroke-width='3.5' stroke-opacity='0.7'/><path d='M200 160 C250 120, 320 110, 365 140' stroke-width='3.5' stroke-opacity='0.7'/><path d='M200 130 L200 205 M185 170 L165 215 M215 170 L235 215' stroke-width='3'/></svg>",
    clouds: (c) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 120' fill='none' stroke='" + c + "' stroke-width='2.5' stroke-linecap='round'><path d='M20 90 q0 -30 30 -30 q5 -30 40 -25 q20 -25 50 0 q35 -5 35 30 q30 0 30 25 Z'/><path d='M70 70 a12 12 0 1 1 18 10 M135 52 a14 14 0 1 1 20 12'/><path d='M200 100 q10 -20 30 -14 q10 -18 32 -8 q20 0 20 22'/></svg>",
    moon: (c) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><mask id='m'><rect width='100' height='100' fill='white'/><circle cx='64' cy='38' r='33' fill='black'/></mask><radialGradient id='g' cx='40%' cy='60%'><stop offset='0' stop-color='#ffffff'/><stop offset='1' stop-color='" + c + "'/></radialGradient></defs><circle cx='50' cy='50' r='38' fill='url(#g)' mask='url(#m)'/></svg>",
    cat: (c, eye) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 140' fill='" + c + "'><ellipse cx='55' cy='100' rx='30' ry='36'/><circle cx='55' cy='48' r='21'/><polygon points='37,38 39,14 51,30'/><polygon points='59,30 71,14 73,38'/><path d='M80 128 Q115 118 108 84 Q105 72 98 77 Q104 96 78 112 Z'/><ellipse cx='47' cy='47' rx='3.2' ry='4.5' fill='" + eye + "'/><ellipse cx='63' cy='47' rx='3.2' ry='4.5' fill='" + eye + "'/></svg>",
    planet: (c) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 140'><defs><radialGradient id='p' cx='35%' cy='35%'><stop offset='0' stop-color='#cfe8ff'/><stop offset='0.5' stop-color='" + c + "'/><stop offset='1' stop-color='#0b1330'/></radialGradient></defs><circle cx='100' cy='70' r='42' fill='url(#p)'/><ellipse cx='100' cy='72' rx='90' ry='18' fill='none' stroke='" + c + "' stroke-width='3' stroke-opacity='0.8' transform='rotate(-14 100 72)'/></svg>",
    mountains: (c) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 160' fill='none' stroke='" + c + "' stroke-width='2'><path d='M0 150 L75 55 L145 130 L230 35 L320 135 L370 85 L400 125' stroke-opacity='0.55'/><path d='M40 155 L120 80 L195 145 L285 65 L380 155' stroke-opacity='0.35'/></svg>",
    torii: (c) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 180' fill='none' stroke='" + c + "' stroke-width='4' stroke-linecap='round'><path d='M20 35 Q100 52 180 35' stroke-width='7'/><line x1='35' y1='62' x2='165' y2='62' stroke-width='5'/><line x1='55' y1='42' x2='50' y2='170' stroke-width='6'/><line x1='145' y1='42' x2='150' y2='170' stroke-width='6'/><line x1='100' y1='42' x2='100' y2='62' stroke-width='4'/></svg>",
    sakuraBranch: (c) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 160' fill='none'><path d='M300 20 Q200 45 120 30 Q60 20 15 65 M180 38 Q140 80 85 95' stroke='#881337' stroke-width='4' stroke-linecap='round'/><circle cx='120' cy='30' r='10' fill='" + c + "'/><circle cx='175' cy='40' r='12' fill='" + c + "'/><circle cx='85' cy='95' r='9' fill='" + c + "'/><circle cx='45' cy='48' r='11' fill='" + c + "'/><circle cx='230' cy='32' r='10' fill='" + c + "'/></svg>",
    sharkSilhouette: (c) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 110' fill='" + c + "'><path d='M195 58 C160 35, 125 36, 105 38 L92 12 C90 25, 88 35, 85 40 C60 44, 38 50, 22 56 L6 34 C10 48, 10 64, 6 78 L22 62 C45 68, 80 74, 115 72 L104 92 C118 82, 128 74, 135 71 C165 69, 185 64, 195 58 Z' fill-opacity='0.32'/></svg>",
    chessBoard: (c) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 180' fill='none' stroke='" + c + "'><polygon points='60,40 340,40 390,160 10,160' stroke-width='2.5' stroke-opacity='0.45'/><line x1='130' y1='40' x2='105' y2='160' stroke-width='1.5' stroke-opacity='0.35'/><line x1='200' y1='40' x2='200' y2='160' stroke-width='1.5' stroke-opacity='0.35'/><line x1='270' y1='40' x2='295' y2='160' stroke-width='1.5' stroke-opacity='0.35'/><line x1='45' y1='75' x2='355' y2='75' stroke-width='1.5' stroke-opacity='0.35'/><line x1='28' y1='115' x2='372' y2='115' stroke-width='1.5' stroke-opacity='0.35'/></svg>",
    aurora: (c1, c2) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 180'><defs><linearGradient id='au' x1='0' y1='0' x2='1' y2='0'><stop offset='0%' stop-color='" + c1 + "' stop-opacity='0'/><stop offset='30%' stop-color='" + c1 + "' stop-opacity='0.55'/><stop offset='70%' stop-color='" + c2 + "' stop-opacity='0.55'/><stop offset='100%' stop-color='" + c2 + "' stop-opacity='0'/></linearGradient></defs><path d='M0 120 Q125 30 250 100 T500 70 L500 170 Q375 110 250 150 T0 160 Z' fill='url(#au)'/></svg>",
    cyberWave: (c) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 140' fill='none' stroke='" + c + "'><path d='M0 70 Q125 10 250 70 T500 70' stroke-width='2' stroke-opacity='0.45'/><path d='M0 90 Q125 30 250 90 T500 90' stroke-width='1.2' stroke-opacity='0.25'/></svg>",
    christmasTree: (c) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 260' fill='none' stroke='" + c + "' stroke-linecap='round' stroke-linejoin='round'><polygon points='110,25 60,95 160,95' stroke-width='3.5' fill='" + c + "' fill-opacity='0.12'/><polygon points='110,70 42,155 178,155' stroke-width='3.5' fill='" + c + "' fill-opacity='0.12'/><polygon points='110,120 24,215 196,215' stroke-width='3.5' fill='" + c + "' fill-opacity='0.12'/><rect x='96' y='215' width='28' height='32' stroke-width='3'/><circle cx='110' cy='18' r='9' fill='#facc15' stroke='#fef08a' stroke-width='2'/><circle cx='85' cy='82' r='4.5' fill='#ef4444' stroke='none'/><circle cx='135' cy='135' r='5' fill='#facc15' stroke='none'/><circle cx='75' cy='142' r='4.5' fill='#38bdf8' stroke='none'/><circle cx='148' cy='192' r='5.5' fill='#ef4444' stroke='none'/><circle cx='70' cy='195' r='5' fill='#facc15' stroke='none'/></svg>",
    codeWindow: (c) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200' fill='none'><rect x='6' y='6' width='288' height='188' rx='12' stroke='" + c + "' stroke-width='3'/><line x1='6' y1='34' x2='294' y2='34' stroke='" + c + "' stroke-width='2'/><circle cx='26' cy='20' r='5' fill='#ef4444'/><circle cx='44' cy='20' r='5' fill='#facc15'/><circle cx='62' cy='20' r='5' fill='#22c55e'/><rect x='26' y='54' width='70' height='9' rx='4.5' fill='#c084fc'/><rect x='104' y='54' width='90' height='9' rx='4.5' fill='#38bdf8'/><rect x='46' y='80' width='120' height='9' rx='4.5' fill='" + c + "'/><rect x='46' y='106' width='80' height='9' rx='4.5' fill='#facc15'/><rect x='134' y='106' width='100' height='9' rx='4.5' fill='#38bdf8'/><rect x='46' y='132' width='140' height='9' rx='4.5' fill='#f87171'/><rect x='26' y='158' width='34' height='9' rx='4.5' fill='#c084fc'/></svg>",
    tetBranch: (c) => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 200' fill='none'><path d='M320 25 Q215 55 135 35 Q70 20 15 72 M195 44 Q150 92 92 110' stroke='#92400e' stroke-width='4.5' stroke-linecap='round'/><line x1='245' y1='42' x2='245' y2='78' stroke='#facc15' stroke-width='2'/><ellipse cx='245' cy='94' rx='18' ry='14' fill='#ef4444' stroke='#facc15' stroke-width='2.5'/><rect x='237' y='78' width='16' height='4' fill='#facc15'/><rect x='237' y='106' width='16' height='4' fill='#facc15'/><line x1='245' y1='110' x2='245' y2='128' stroke='#facc15' stroke-width='2.5'/><circle cx='135' cy='35' r='11' fill='" + c + "'/><circle cx='135' cy='35' r='4' fill='#dc2626'/><circle cx='188' cy='46' r='12' fill='" + c + "'/><circle cx='188' cy='46' r='4.5' fill='#dc2626'/><circle cx='92' cy='110' r='10' fill='" + c + "'/><circle cx='92' cy='110' r='3.5' fill='#dc2626'/><circle cx='52' cy='52' r='11' fill='" + c + "'/><circle cx='52' cy='52' r='4' fill='#dc2626'/></svg>"
};

const DECOR = {
    'jade-dragon': {
        art: [
            { svg: SVG.dragon('#34d399'), css: 'left:4%;bottom:10%;width:580px;height:310px;--o:0.22;opacity:0.22;filter:drop-shadow(0 0 12px #10b981);animation:agDragonSoar 11s ease-in-out infinite;' },
            { svg: SVG.clouds('#6ee7b7'), css: 'left:0;top:14%;width:280px;height:120px;--o:0.18;opacity:0.18;animation:agDrift 38s linear infinite;' },
            { svg: SVG.clouds('#6ee7b7'), css: 'right:8%;bottom:14%;width:260px;height:110px;--o:0.18;opacity:0.18;animation:agArtFloat 9s ease-in-out infinite;' }
        ],
        particles: [
            { type: 'dot', color: '#6ee7b7', glow: '#10b981', count: 20, anim: 'rise', size: [3, 6], dur: [9, 18], o: 0.8 },
            { type: 'char', chars: ['🍃', '❖'], color: '#34d399', count: 8, anim: 'fall', size: [12, 18], dur: [13, 22], o: 0.55 }
        ]
    },
    'fire-phoenix': {
        art: [
            { svg: SVG.phoenixWings('#f472b6'), css: 'right:4%;bottom:6%;width:480px;height:270px;--o:0.26;opacity:0.26;filter:drop-shadow(0 0 12px #ec4899);animation:agPhoenixSoar 6s ease-in-out infinite;' }
        ],
        particles: [
            { type: 'flame', color: '#fb7185', glow: '#ec4899', count: 10, anim: 'rise', size: [8, 16], dur: [7, 14], o: 0.75 },
            { type: 'char', chars: ['🪶', '✦', '🔥'], color: '#fda4af', glow: '#f59e0b', count: 12, anim: 'rise', size: [11, 18], dur: [10, 18], o: 0.7 }
        ]
    },
    'space-astronaut': {
        art: [
            { svg: SVG.planet('#38bdf8'), css: 'right:5%;top:8%;width:250px;height:175px;--o:0.6;opacity:0.6;animation:agArtFloat 8s ease-in-out infinite;' }
        ],
        particles: [
            { type: 'dot', color: '#ffffff', glow: '#9fd2ff', count: 40, anim: 'twinkle', size: [1.5, 3.5], dur: [2, 5], o: 1 },
            { type: 'shoot', count: 4, anim: 'shoot', size: [100, 160], dur: [5, 11] }
        ]
    },
    'wise-owl': {
        art: [
            { svg: SVG.mountains('#d9a050'), css: 'right:2%;bottom:0;width:520px;height:210px;--o:0.24;opacity:0.24;' },
            { svg: SVG.clouds('#d9a050'), css: 'left:0;top:10%;width:300px;height:120px;--o:0.2;opacity:0.2;animation:agDrift 44s linear infinite;' }
        ],
        particles: [
            { type: 'char', chars: ['龍', '風', '月', '書', '道', '靈', '福', '雲', '心', '智'], color: '#e8b868', count: 14, anim: 'rise', size: [15, 28], dur: [16, 28], o: 0.34, font: "'KaiTi','STKaiti','SimSun',serif" },
            { type: 'dot', color: '#ffcf80', glow: '#d9a050', count: 12, anim: 'twinkle', size: [2, 4], dur: [3, 6], o: 0.65 }
        ]
    },
    'moon-witch': {
        art: [
            { svg: SVG.moon('#c4b5fd'), css: 'right:7%;top:6%;width:155px;height:155px;--o:0.78;opacity:0.78;filter:drop-shadow(0 0 30px rgba(196,181,253,0.85));animation:agArtGlow 6s ease-in-out infinite;' },
            { svg: SVG.clouds('#a855f7'), css: 'right:3%;top:12%;width:240px;height:100px;--o:0.22;opacity:0.22;animation:agArtFloat 10s ease-in-out infinite;' }
        ],
        particles: [
            { type: 'char', chars: ['✦', '✧', '⭐'], color: '#e9d5ff', glow: '#a855f7', count: 22, anim: 'twinkle', size: [8, 15], dur: [2, 5], o: 0.9 },
            { type: 'char', chars: ['🦇'], count: 5, anim: 'drift', size: [14, 22], dur: [18, 28], o: 0.65, filter: 'drop-shadow(0 0 4px #a855f7)' }
        ]
    },
    'fox-chibi': {
        art: [
            { svg: SVG.torii('#ff8a3a'), css: 'right:4%;bottom:0;width:240px;height:215px;--o:0.18;opacity:0.18;filter:drop-shadow(0 0 10px #e06030);' }
        ],
        particles: [
            { type: 'dot', color: '#ffb060', glow: '#ff7a30', count: 20, anim: 'rise', size: [2.5, 5.5], dur: [8, 16], o: 0.85 },
            { type: 'char', chars: ['🍁'], count: 9, anim: 'fall', size: [13, 21], dur: [12, 22], o: 0.6 },
            { type: 'flame', color: '#ff8a3a', glow: '#ff5a1a', count: 7, anim: 'bob', size: [12, 20], dur: [3, 6], o: 0.68 }
        ]
    },
    'sakura-bunny': {
        art: [
            { svg: SVG.sakuraBranch('#fda4af'), css: 'right:0;top:2%;width:340px;height:180px;--o:0.32;opacity:0.32;animation:agArtFloat 8s ease-in-out infinite;' }
        ],
        particles: [
            { type: 'char', chars: ['🌸', '💮'], count: 15, anim: 'fall', size: [12, 20], dur: [10, 20], o: 0.72 },
            { type: 'dot', color: '#fda4af', glow: '#fb7185', count: 16, anim: 'twinkle', size: [2, 4], dur: [2, 5], o: 0.85 }
        ]
    },
    'ocean-shark': {
        art: [
            { svg: SVG.sharkSilhouette('#22d3ee'), css: 'left:0;top:22%;width:240px;height:110px;--o:0.28;opacity:0.28;animation:agDrift 28s linear infinite;' },
            { svg: SVG.sharkSilhouette('#fb923c'), css: 'left:0;top:62%;width:190px;height:90px;--o:0.24;opacity:0.24;animation:agDrift 34s linear -14s infinite;' }
        ],
        particles: [
            { type: 'bubble', color: '#a5f3fc', glow: '#22d3ee', count: 22, anim: 'rise', size: [6, 16], dur: [8, 16], o: 0.75 },
            { type: 'dot', color: '#67e8f9', glow: '#06b6d4', count: 14, anim: 'twinkle', size: [2, 4], dur: [2, 5], o: 0.85 }
        ]
    },
    'gangster-pawn': {
        art: [
            { svg: SVG.chessBoard('#e5e7eb'), css: 'right:4%;bottom:4%;width:520px;height:240px;--o:0.22;opacity:0.22;filter:drop-shadow(0 0 10px rgba(255,255,255,0.4));' }
        ],
        particles: [
            { type: 'char', chars: ['♔', '♕', '♘', '♗', '♖', '♙', '♚', '♛', '♞', '♟'], color: '#f3f4f6', glow: 'rgba(255,255,255,0.6)', count: 16, anim: 'rise', size: [14, 24], dur: [12, 22], o: 0.45 },
            { type: 'dot', color: '#ffffff', glow: '#d1d5db', count: 18, anim: 'twinkle', size: [2, 4], dur: [2, 5], o: 0.8 }
        ]
    },
    'ice-penguin': {
        art: [
            { svg: SVG.aurora('#38bdf8', '#34d399'), css: 'left:0;top:2%;width:100vw;height:220px;animation:agAuroraWave 9s ease-in-out infinite;' }
        ],
        particles: [
            { type: 'char', chars: ['❄️', '❅', '❆'], color: '#e0f2fe', glow: '#60a5fa', count: 18, anim: 'fall', size: [11, 20], dur: [10, 20], o: 0.75 },
            { type: 'dot', color: '#ffffff', glow: '#93c5fd', count: 16, anim: 'twinkle', size: [2, 4], dur: [2, 5], o: 0.85 }
        ]
    },
    'ai-robot': {
        art: [
            { svg: SVG.cyberWave('#38bdf8'), css: 'left:0;bottom:8%;width:100vw;height:160px;animation:agAuroraWave 10s ease-in-out infinite;' }
        ],
        particles: [
            { type: 'bokeh', color: 'rgba(56,189,248,0.22)', count: 6, anim: 'bokeh', size: [80, 160], dur: [12, 22], o: 1 },
            { type: 'dot', color: '#e0f2fe', glow: '#38bdf8', count: 14, anim: 'rise', size: [2, 4], dur: [10, 18], o: 0.7 }
        ]
    },
    'black-cat': {
        art: [
            { svg: SVG.moon('#f5c060'), css: 'right:6%;top:6%;width:120px;height:120px;--o:0.45;opacity:0.45;filter:drop-shadow(0 0 25px rgba(245,190,90,0.6));animation:agArtGlow 6s ease-in-out infinite;' },
            { svg: SVG.cat('#050505', '#f5b030'), css: 'right:3%;bottom:-6px;width:170px;height:200px;opacity:0.85;' }
        ],
        particles: [
            { type: 'char', chars: ['🐾'], count: 6, anim: 'rise', size: [12, 18], dur: [16, 26], o: 0.35, filter: 'sepia(1) saturate(3) brightness(1.1)' },
            { type: 'dot', color: '#ffd27a', glow: '#f5a623', count: 20, anim: 'bob', size: [3, 6], dur: [3, 6], o: 0.9 }
        ]
    },
    'noel-snowman': {
        art: [
            { svg: SVG.christmasTree('#34d399'), css: 'right:3%;bottom:2%;width:240px;height:280px;--o:0.28;opacity:0.28;filter:drop-shadow(0 0 14px #10b981);animation:agArtGlow 5s ease-in-out infinite;' },
            { svg: SVG.clouds('#fecdd3'), css: 'left:0;top:12%;width:260px;height:110px;--o:0.16;opacity:0.16;animation:agDrift 36s linear infinite;' }
        ],
        particles: [
            { type: 'char', chars: ['❄️', '❅', '🎄', '🎁', '🔔'], color: '#ffffff', glow: '#f87171', count: 20, anim: 'fall', size: [12, 20], dur: [10, 20], o: 0.78 },
            { type: 'dot', color: '#fef08a', glow: '#ef4444', count: 18, anim: 'twinkle', size: [2.5, 5], dur: [2, 5], o: 0.9 }
        ]
    },
    'tet-lion': {
        art: [
            { svg: SVG.tetBranch('#facc15'), css: 'right:0;top:3%;width:320px;height:200px;opacity:0.42;filter:drop-shadow(0 0 14px rgba(250,204,21,0.55));animation:agArtFloat 7s ease-in-out infinite;' },
            { svg: SVG.clouds('#fde047'), css: 'left:0;bottom:10%;width:280px;height:115px;--o:0.18;opacity:0.18;animation:agDrift 38s linear infinite;' }
        ],
        particles: [
            { type: 'char', chars: ['🧧', '🌼', '🏮', '🪙', '✨'], color: '#fef08a', glow: '#ef4444', count: 18, anim: 'fall', size: [13, 20], dur: [11, 21], o: 0.82 },
            { type: 'dot', color: '#facc15', glow: '#dc2626', count: 20, anim: 'twinkle', size: [2.5, 5.5], dur: [2, 5], o: 0.92 }
        ]
    },
    'code-cat': {
        art: [
            { svg: SVG.codeWindow('#22c55e'), css: 'right:3%;bottom:4%;width:300px;height:200px;--o:0.22;opacity:0.22;filter:drop-shadow(0 0 14px rgba(34,197,94,0.5));animation:agArtFloat 8s ease-in-out infinite;' }
        ],
        particles: [
            { type: 'char', chars: ['{ }', '</>', '01', ';', '=>', '()'], color: '#4ade80', glow: '#22c55e', font: 'monospace', count: 18, anim: 'rise', size: [11, 17], dur: [12, 22], o: 0.6 },
            { type: 'char', chars: ['🐛', '☕'], count: 5, anim: 'drift', size: [13, 17], dur: [24, 36], o: 0.55 },
            { type: 'dot', color: '#4ade80', glow: '#22c55e', count: 14, anim: 'twinkle', size: [2, 4], dur: [2, 5], o: 0.85 }
        ]
    }
};
