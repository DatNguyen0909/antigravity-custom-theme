// ========================================================
// SERVICE: 21-Theme Multi-Track Genre Sequencer & Foley FX
// True multi-voice synthesis: Drums + Bass + Chords + Lead
// + 21 unmistakable physical/iconic Foley keystroke synths
// ========================================================

const SoundService = (function () {
    let ctx = null;
    let masterGain = null;
    let fxGain = null;
    let bgmGain = null;
    let delayNode = null;
    let noiseBuf = null;

    let state = {
        enabled: true,
        sfxEnabled: true,
        bgmEnabled: false,
        volume: 60,
        themeId: 'jade-dragon'
    };

    let lastKeyTime = 0;
    let keyToggle = 0;
    let bgmTimer = null;
    let bgmStep = 0;
    let unlockWired = false;

    const SOUND_META = {
        'jade-dragon':       { vi: 'Vuốt đàn Cổ Tranh • Tiên hiệp Tiêu Trúc',      en: 'Guzheng Glissando • Immortal Flute & Zither' },
        'fire-phoenix':      { vi: 'Lửa bùng gió rít • Trống trận Taiko hào hùng',  en: 'Blazing Whoosh • Epic Taiko & Fire Strings' },
        'space-astronaut':   { vi: 'Bộ đàm NASA & Laser • Synthwave Vũ trụ 80s',   en: 'NASA Radio Squelch • Driving 80s Synthwave' },
        'wise-owl':          { vi: 'Gõ mõ gỗ & tiếng Cú • Chuông thiền & Tiêu đêm', en: 'Temple Woodblock & Owl Hoot • Zen Bowl' },
        'moon-witch':        { vi: 'Đũa phép kim tuyến & vạc sôi • Waltz Phép thuật', en: 'Pixie Wand & Potion Pop • 3/4 Magic Waltz' },
        'fox-chibi':         { vi: 'Phách gỗ Kabuki Nhật • Lễ hội Koto & Taiko',   en: 'Kabuki Wood Clack • Matsuri Koto & Taiko' },
        'sakura-bunny':      { vi: 'Lò xo hoạt hình Boing! • Kawaii Anime Pop',    en: 'Cartoon Spring Boing! • Kawaii Anime Beat' },
        'ocean-shark':       { vi: 'Quẫy nước & Bass Cá Mập • Deep Sea Groove',    en: 'Water Splash & Jaws Bass • Deep Sea Beat' },
        'gangster-pawn':     { vi: 'Máy đánh chữ & chuông TING! • Mafia Jazz Noir', en: 'Vintage Typewriter & Bell • Mafia Jazz Swing' },
        'ice-penguin':       { vi: 'Giẫm tuyết xốp & băng vỡ • Vũ điệu Cánh Cụt',   en: 'Crunchy Snowstep • Penguin Polka & Glass' },
        'ai-robot':          { vi: 'Giọng Robot R2-D2 đa tần • Cyberpunk Electro', en: 'R2-D2 Robot Chirps • Cyberpunk Electro Arp' },
        'black-cat':         { vi: 'Tiếng Mèo Meow~ & gừ ấm • Mưa đêm Jazz Piano', en: 'Cute Meow & Purr • Rainy Lo-Fi Jazz Piano' },
        'noel-snowman':      { vi: 'Chùm lục lạc rung vang • Giai điệu Jingle Noel', en: 'Sleigh Bell Shake • Festive Jingle Groove' },
        'tet-lion':          { vi: 'Trống Lân & Chũm chọe đồng • Hội Xuân Rộn Ràng', en: 'Lion Drum & Cymbal Crash • Festive Tet Beat' },
        'code-cat':          { vi: 'Phím cơ Custom Thocky • Lo-Fi Hip-Hop Chill',  en: 'Creamy Thocky Switch • Boom-Bap Lo-Fi Beat' },
        'pixel-knight':      { vi: 'Nhảy & Ăn xu 8-bit NES • Chiptune 4 Kênh RPG', en: 'NES Jump & 1UP Coin • 4-Ch 8-Bit Chiptune' },
        'cloud-whale':       { vi: 'Cá Voi ngân vang & Hạc • Ghibli Sky Waltz 3/4', en: 'Echoing Whale & Harp • Ghibli Sky Waltz' },
        'halloween-pumpkin': { vi: 'Xương khô lốc cốc & Ma trơi • Waltz Organ Cổ',  en: 'Rattling Bones & Ghost • Haunted Organ Waltz' },
        'midautumn-carp':    { vi: 'Trống ếch & Đàn Bầu • Rước đèn đêm Trung Thu',  en: 'Frog Drum & Dan Bau • Lantern Parade Beat' },
        'valentine-cupid':   { vi: 'Bắn dây cung xé gió • Bossa Nova Lãng mạn',    en: 'Bowstring Arrow Twang • Romantic Bossa Nova' },
        'summer-corgi':      { vi: 'Steel Drum & Ukulele • Sóng biển & Bongo Hè',  en: 'Steelpan & Bark • Surf Ukulele & Bongo' }
    };

    function getMeta(themeId, lang) {
        const item = SOUND_META[themeId] || SOUND_META['jade-dragon'];
        return lang === 'en' ? item.en : item.vi;
    }

    function m2f(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    function ensureContext() {
        if (!ctx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            ctx = new AC();

            masterGain = ctx.createGain();
            fxGain = ctx.createGain();
            bgmGain = ctx.createGain();

            // Stereo-style warm echo bus for spatial depth
            delayNode = ctx.createDelay(1.0);
            delayNode.delayTime.value = 0.23;
            const delayFb = ctx.createGain();
            delayFb.gain.value = 0.25;
            const delayFilter = ctx.createBiquadFilter();
            delayFilter.type = 'lowpass';
            delayFilter.frequency.value = 2400;

            delayNode.connect(delayFilter);
            delayFilter.connect(delayFb);
            delayFb.connect(delayNode);
            delayFilter.connect(bgmGain);

            fxGain.connect(masterGain);
            bgmGain.connect(masterGain);
            masterGain.connect(ctx.destination);

            // 2.0s rich white+pink noise buffer for realistic percussion, surf, rain, vinyl, radio, snow
            const len = Math.floor(ctx.sampleRate * 2.0);
            noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
            const data = noiseBuf.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0;
            for (let i = 0; i < len; i++) {
                const w = Math.random() * 2 - 1;
                b0 = 0.997 * b0 + w * 0.029;
                b1 = 0.985 * b1 + w * 0.032;
                b2 = 0.950 * b2 + w * 0.048;
                data[i] = (b0 + b1 + b2 + w * 0.28) * 0.5;
            }

            syncGainValues();
        }
        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }
        return ctx;
    }

    function syncGainValues() {
        if (!masterGain || !ctx) return;
        const v = Math.max(0, Math.min(100, state.volume)) / 100;
        const now = ctx.currentTime;
        masterGain.gain.setTargetAtTime(state.enabled ? v : 0, now, 0.03);
        fxGain.gain.setTargetAtTime(state.sfxEnabled ? 0.92 : 0, now, 0.02);
        bgmGain.gain.setTargetAtTime(state.bgmEnabled ? 0.58 : 0, now, 0.06);
    }

    // ========================================================
    // MULTI-SYNTHESIS PRIMITIVES (FM, Plucked, Vibrato, Drums)
    // ========================================================
    function tone(type, fStart, fEnd, dur, vol, dest, delaySec, cutoff) {
        const t0 = ctx.currentTime + (delaySec || 0);
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(Math.max(20, fStart), t0);
        if (fEnd && fEnd !== fStart) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(20, fEnd), t0 + dur);
        }
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(vol, t0 + Math.min(0.006, dur * 0.18));
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

        if (cutoff) {
            const flt = ctx.createBiquadFilter();
            flt.type = 'lowpass';
            flt.frequency.setValueAtTime(cutoff, t0);
            osc.connect(flt);
            flt.connect(g);
        } else {
            osc.connect(g);
        }
        g.connect(dest || fxGain);
        osc.start(t0);
        osc.stop(t0 + dur + 0.02);
    }

    // 2-Operator FM Synthesis (real metallic bells, woodblocks, electric pianos, steel drums, brass)
    function fm(carrierFreq, ratio, modIndex, dur, vol, dest, delaySec, wet) {
        const t0 = ctx.currentTime + (delaySec || 0);
        const car = ctx.createOscillator();
        const mod = ctx.createOscillator();
        const modG = ctx.createGain();
        const outG = ctx.createGain();

        car.type = 'sine';
        mod.type = 'sine';
        car.frequency.setValueAtTime(carrierFreq, t0);
        mod.frequency.setValueAtTime(carrierFreq * ratio, t0);

        modG.gain.setValueAtTime(carrierFreq * modIndex, t0);
        modG.gain.exponentialRampToValueAtTime(0.1, t0 + dur * 0.75);

        outG.gain.setValueAtTime(0.0001, t0);
        outG.gain.linearRampToValueAtTime(vol, t0 + 0.004);
        outG.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

        mod.connect(modG);
        modG.connect(car.frequency);
        car.connect(outG);
        outG.connect(dest || fxGain);
        if (wet && delayNode) outG.connect(delayNode);

        mod.start(t0);
        car.start(t0);
        mod.stop(t0 + dur + 0.02);
        car.stop(t0 + dur + 0.02);
    }

    // Rich Plucked String (Guzheng, Koto, Ukulele, Harp, Dan Bau, Guitar)
    function pluck(freq, dur, vol, dest, delaySec, brightness, bendFrom, wet) {
        const t0 = ctx.currentTime + (delaySec || 0);
        const osc = ctx.createOscillator();
        const sub = ctx.createOscillator();
        const flt = ctx.createBiquadFilter();
        const g = ctx.createGain();

        osc.type = 'sawtooth';
        sub.type = 'triangle';
        const f0 = bendFrom || freq;
        osc.frequency.setValueAtTime(f0, t0);
        sub.frequency.setValueAtTime(f0, t0);
        if (bendFrom && bendFrom !== freq) {
            osc.frequency.exponentialRampToValueAtTime(freq, t0 + Math.min(0.14, dur * 0.45));
            sub.frequency.exponentialRampToValueAtTime(freq, t0 + Math.min(0.14, dur * 0.45));
        }

        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(brightness || 3200, t0);
        flt.frequency.exponentialRampToValueAtTime(Math.max(350, freq * 1.4), t0 + dur * 0.85);

        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(vol, t0 + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

        osc.connect(flt);
        sub.connect(flt);
        flt.connect(g);
        g.connect(dest || fxGain);
        if (wet && delayNode) g.connect(delayNode);

        osc.start(t0);
        sub.start(t0);
        osc.stop(t0 + dur + 0.02);
        sub.stop(t0 + dur + 0.02);
    }

    // Expressive Wind / Bowed / Theremin / Whale Voice with LFO Vibrato
    function sing(wave, fStart, fEnd, dur, vol, dest, delaySec, vibRate, vibDepth, cutoff, wet) {
        const t0 = ctx.currentTime + (delaySec || 0);
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoG = ctx.createGain();
        const flt = ctx.createBiquadFilter();
        const g = ctx.createGain();

        osc.type = wave || 'sine';
        osc.frequency.setValueAtTime(fStart, t0);
        if (fEnd && fEnd !== fStart) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(30, fEnd), t0 + dur * 0.85);
        }

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(vibRate || 5.5, t0);
        lfoG.gain.setValueAtTime(vibDepth || 6, t0);
        lfo.connect(lfoG);
        lfoG.connect(osc.frequency);

        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(cutoff || 2200, t0);

        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(vol, t0 + Math.min(0.09, dur * 0.25));
        g.gain.setValueAtTime(vol * 0.82, t0 + dur * 0.68);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

        osc.connect(flt);
        flt.connect(g);
        g.connect(dest || fxGain);
        if (wet && delayNode) g.connect(delayNode);

        lfo.start(t0);
        osc.start(t0);
        lfo.stop(t0 + dur + 0.02);
        osc.stop(t0 + dur + 0.02);
    }

    // Filtered Noise (Drums, Surf, Rain, Fire, Typewriter, Snow, Cymbals)
    function noise(fType, fStart, fEnd, q, dur, vol, dest, delaySec) {
        if (!noiseBuf) return;
        const t0 = ctx.currentTime + (delaySec || 0);
        const src = ctx.createBufferSource();
        src.buffer = noiseBuf;
        src.loop = true;

        const flt = ctx.createBiquadFilter();
        flt.type = fType || 'bandpass';
        flt.frequency.setValueAtTime(fStart, t0);
        if (fEnd && fEnd !== fStart) {
            flt.frequency.exponentialRampToValueAtTime(Math.max(40, fEnd), t0 + dur);
        }
        flt.Q.setValueAtTime(q || 1.4, t0);

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(vol, t0 + Math.min(0.008, dur * 0.2));
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

        src.connect(flt);
        flt.connect(g);
        g.connect(dest || fxGain);
        src.start(t0, Math.random() * 1.1, dur + 0.03);
    }

    // ---- Percussion Kit Helpers for Multi-Track BGM ----
    function kick(vol, fTop, dur, dest) {
        tone('sine', fTop || 135, 38, dur || 0.14, vol || 0.24, dest || bgmGain);
    }
    function snare(vol, dur, dest) {
        tone('triangle', 190, 110, 0.06, (vol || 0.14) * 0.7, dest || bgmGain);
        noise('bandpass', 2200, 1400, 1.2, dur || 0.11, vol || 0.14, dest || bgmGain);
    }
    function rim(vol, freq, dest) {
        fm(freq || 820, 1.53, 1.8, 0.045, vol || 0.11, dest || bgmGain);
    }
    function hat(vol, dur, freq, dest) {
        noise('highpass', freq || 6200, freq || 6200, 0.9, dur || 0.045, vol || 0.07, dest || bgmGain);
    }
    function chord(midis, wave, dur, vol, cutoff, dest, strumMs) {
        midis.forEach((m, i) => {
            tone(wave || 'triangle', m2f(m), m2f(m), dur, vol / Math.sqrt(midis.length), dest || bgmGain, (i * (strumMs || 0)) / 1000, cutoff || 1500);
        });
    }

    // ========================================================
    // PART 1: 21 ICONIC FOLEY KEYSTROKE SYNTHESIZERS
    // ========================================================
    const KEY_SYNTHS = {
        // 1. Jade Dragon: Cascading Guzheng 3-string sweep (Space/Enter = 5-string glissando + bronze bell!)
        'jade-dragon': (sp) => {
            const scale = [62, 65, 67, 69, 72, 74, 77, 81];
            if (sp) {
                [62, 65, 69, 74, 77].forEach((m, i) => pluck(m2f(m), 0.36, 0.09, fxGain, i * 0.024, 3800));
                fm(587.33, 2.74, 1.6, 0.42, 0.08, fxGain, 0.05);
            } else {
                const base = (keyToggle * 2) % 5;
                for (let i = 0; i < 3; i++) {
                    pluck(m2f(scale[base + i]), 0.20, 0.075, fxGain, i * 0.018, 3600);
                }
            }
        },
        // 2. Fire Phoenix: Blazing Fire Whoosh + Crackle (Space/Enter = Rising Phoenix Cry!)
        'fire-phoenix': (sp) => {
            noise('bandpass', 280, sp ? 2600 : 1900, 2.2, sp ? 0.18 : 0.09, sp ? 0.22 : 0.16, fxGain);
            noise('highpass', 3800, 3800, 1.5, 0.04, 0.09, fxGain, 0.02);
            if (sp) {
                sing('sawtooth', 523.25, 1046.5, 0.26, 0.09, fxGain, 0.01, 8, 12, 2600);
            } else {
                tone('sawtooth', 260, 540, 0.08, 0.07, fxGain, 0, 1600);
            }
        },
        // 3. Space Astronaut: Sci-Fi Laser Chirp + NASA Walkie-Talkie Roger Beep & Static Squelch!
        'space-astronaut': (sp) => {
            if (sp) {
                noise('bandpass', 2200, 1800, 1.8, 0.055, 0.14, fxGain);
                tone('sine', 2475, 2475, 0.085, 0.13, fxGain, 0.045);
                noise('bandpass', 2000, 1600, 2.0, 0.045, 0.11, fxGain, 0.13);
            } else {
                const hi = 1650 + (keyToggle % 3) * 280;
                fm(hi, 1.5, 2.2, 0.065, 0.095, fxGain);
                tone('sine', hi * 1.2, 520, 0.065, 0.09, fxGain);
            }
        },
        // 4. Wise Owl: Hollow Temple Woodblock "Coc!" + Realistic Owl Hoot "Hoo-hoo~" on Space/Enter!
        'wise-owl': (sp) => {
            if (sp) {
                sing('sine', 466, 435, 0.14, 0.14, fxGain, 0, 5, 4, 900);
                sing('sine', 455, 392, 0.24, 0.15, fxGain, 0.16, 5.5, 6, 900);
            } else {
                const pitches = [690, 740, 640];
                fm(pitches[keyToggle % 3], 1.47, 2.1, 0.065, 0.15, fxGain);
                noise('bandpass', 2800, 1900, 1.5, 0.03, 0.08, fxGain, 0.01);
            }
        },
        // 5. Moon Witch: Sparkling 4-Note Magic Wand Sweep + Bubbling Cauldron Pop!
        'moon-witch': (sp) => {
            if (sp) {
                tone('sine', 210, 540, 0.075, 0.14, fxGain, 0);
                tone('sine', 280, 720, 0.085, 0.14, fxGain, 0.065);
                [1318, 1661, 1975, 2637].forEach((f, i) => fm(f, 2.0, 1.2, 0.16, 0.06, fxGain, 0.08 + i * 0.022));
            } else {
                const wand = [1318, 1661, 2093, 2637];
                wand.forEach((f, i) => tone('sine', f, f, 0.07, 0.05, fxGain, i * 0.015));
                tone('sine', 250, 580, 0.055, 0.09, fxGain, 0.01);
            }
        },
        // 6. Fox Chibi: Sharp Japanese Kabuki Hyoshigi Wood Clack ("KAN!") + Shrine Suzu
        'fox-chibi': (sp) => {
            fm(sp ? 1180 : 1480, 1.62, 3.2, 0.07, 0.16, fxGain);
            tone('triangle', sp ? 160 : 980, sp ? 78 : 940, sp ? 0.15 : 0.04, 0.16, fxGain);
            if (sp) {
                fm(1480, 1.62, 3.2, 0.07, 0.15, fxGain, 0.085);
                [2960, 3520, 4186].forEach((f, i) => tone('sine', f, f, 0.09, 0.045, fxGain, 0.03 + i * 0.012));
            }
        },
        // 7. Sakura Bunny: Cute Cartoon Spring "Boing-oing!" Bounce
        'sakura-bunny': (sp) => {
            const t0 = ctx.currentTime;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sine';
            const f0 = sp ? 260 : (310 + (keyToggle % 3) * 35);
            osc.frequency.setValueAtTime(f0, t0);
            osc.frequency.exponentialRampToValueAtTime(f0 * 2.05, t0 + 0.055);
            osc.frequency.exponentialRampToValueAtTime(f0 * 1.45, t0 + 0.095);
            osc.frequency.exponentialRampToValueAtTime(f0 * 1.85, t0 + 0.135);
            g.gain.setValueAtTime(0.0001, t0);
            g.gain.linearRampToValueAtTime(0.15, t0 + 0.008);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.15);
            osc.connect(g);
            g.connect(fxGain);
            osc.start(t0);
            osc.stop(t0 + 0.17);
        },
        // 8. Ocean Shark: Rapid 3-Bubble Water Plop + Dramatic 2-Note Jaws Bass on Space/Enter!
        'ocean-shark': (sp) => {
            if (sp) {
                tone('sawtooth', 82.41, 82.41, 0.14, 0.18, fxGain, 0, 260);
                tone('sawtooth', 87.31, 87.31, 0.22, 0.20, fxGain, 0.15, 290);
                noise('bandpass', 750, 320, 1.5, 0.16, 0.14, fxGain, 0.04);
            } else {
                [0, 0.028, 0.058].forEach((d, i) => {
                    const bf = 220 + i * 110 + (keyToggle % 2) * 45;
                    tone('sine', bf, bf * 2.1, 0.05, 0.11, fxGain, d);
                });
            }
        },
        // 9. Gangster Pawn: Vintage 1940s Typewriter Metal Hammer + Carriage Return "Kich-TING!!" Bell!
        'gangster-pawn': (sp) => {
            if (sp) {
                // Carriage slide + crisp brass bell DING!
                noise('bandpass', 1600, 3200, 2.2, 0.075, 0.18, fxGain, 0);
                fm(2349.3, 2.41, 2.2, 0.38, 0.16, fxGain, 0.065);
                tone('sine', 4698.6, 4698.6, 0.25, 0.07, fxGain, 0.065);
            } else {
                // Sharp metallic hammer strike on paper roller
                noise('bandpass', 3400, 1800, 2.6, 0.025, 0.22, fxGain);
                fm(420 + (keyToggle % 3) * 35, 3.1, 2.5, 0.032, 0.14, fxGain);
                tone('triangle', 145, 70, 0.035, 0.16, fxGain);
            }
        },
        // 10. Ice Penguin: Crunchy Snow Footstep ("Xop!") + Ice Shard Tinkle (Space/Enter = Ice Slide!)
        'ice-penguin': (sp) => {
            if (sp) {
                noise('bandpass', 1200, 4200, 2.0, 0.16, 0.14, fxGain);
                [2093, 2637, 3136].forEach((f, i) => fm(f, 2.5, 1.4, 0.18, 0.07, fxGain, 0.04 + i * 0.035));
            } else {
                noise('bandpass', 1750 + (keyToggle % 2) * 350, 950, 1.4, 0.055, 0.18, fxGain);
                fm(2637 + (keyToggle % 3) * 330, 2.5, 1.3, 0.075, 0.065, fxGain, 0.012);
            }
        },
        // 11. AI Robot: R2-D2 Multi-Pitch Astromech Data Chirps!
        'ai-robot': (sp) => {
            const pool = [720, 980, 1320, 1760, 2180, 620, 1540];
            const count = sp ? 5 : 3;
            for (let i = 0; i < count; i++) {
                const f1 = pool[(keyToggle + i * 2) % pool.length];
                const f2 = pool[(keyToggle + i * 3 + 1) % pool.length];
                tone('sine', f1, f2, 0.032, 0.11, fxGain, i * 0.030);
            }
        },
        // 12. Black Cat: Cute Pitch-Bent "Mew~" & Collar Bell + Full "Meow~ + Purrr" on Space/Enter!
        'black-cat': (sp) => {
            if (sp) {
                sing('triangle', 620, 920, 0.11, 0.13, fxGain, 0, 6, 8, 2200);
                sing('triangle', 920, 510, 0.18, 0.13, fxGain, 0.09, 6, 8, 1800);
                sing('sawtooth', 48, 44, 0.24, 0.07, fxGain, 0.12, 24, 6, 220);
            } else {
                const f = 740 + (keyToggle % 3) * 70;
                sing('triangle', f, f * 1.25, 0.055, 0.095, fxGain, 0, 6, 4, 2000);
                fm(3136, 2.2, 1.1, 0.06, 0.045, fxGain, 0.005);
            }
        },
        // 13. Noel Snowman: Multi-Burst Sleigh Bell Shake + 3-Note Holiday Flourish!
        'noel-snowman': (sp) => {
            const hits = sp ? [0, 0.045, 0.09, 0.14] : [0, 0.038];
            hits.forEach((d) => {
                noise('highpass', 5800, 5800, 1.4, 0.04, 0.09, fxGain, d);
                fm(2637, 2.32, 1.5, 0.09, 0.065, fxGain, d);
            });
            if (sp) {
                [1318.5, 1568, 2093].forEach((f, i) => fm(f, 2.0, 1.1, 0.20, 0.08, fxGain, i * 0.06));
            }
        },
        // 14. Tet Lion: Lion Dance Drum ("Tung!" / "Cac!") + Bronze Cymbal Crash ("XOENG!")!
        'tet-lion': (sp) => {
            if (sp) {
                tone('sine', 165, 58, 0.20, 0.26, fxGain);
                noise('bandpass', 3800, 2400, 0.8, 0.26, 0.18, fxGain, 0.01);
                fm(1046, 3.41, 3.8, 0.24, 0.10, fxGain, 0.01);
            } else if (keyToggle % 2 === 0) {
                tone('sine', 155, 65, 0.10, 0.22, fxGain);
            } else {
                fm(880, 1.58, 2.4, 0.045, 0.15, fxGain);
                noise('highpass', 4500, 4500, 1.1, 0.05, 0.08, fxGain);
            }
        },
        // 15. Code Cat: Creamy Custom 'Thocky' Mechanical Switch (Kept & Polished!)
        'code-cat': (sp) => {
            const bodyFreq = sp ? 115 : (168 + (Math.random() - 0.5) * 22);
            tone('triangle', bodyFreq, bodyFreq * 0.56, sp ? 0.068 : 0.048, sp ? 0.22 : 0.17, fxGain, 0, 880);
            noise('bandpass', sp ? 1650 : 2400, 1400, 2.8, 0.022, 0.16, fxGain);
        },
        // 16. Pixel Knight: NES 8-Bit Blip, Mario-style Jump on Space, 1UP Coin on Enter!
        'pixel-knight': (sp) => {
            if (sp) {
                tone('square', 987.77, 987.77, 0.06, 0.075, fxGain, 0, 3400);
                tone('square', 1318.5, 1318.5, 0.18, 0.075, fxGain, 0.06, 3400);
            } else {
                const steps = [440, 523.25, 587.33, 659.25, 783.99];
                const f = steps[keyToggle % steps.length];
                tone('square', f, f * 1.18, 0.045, 0.065, fxGain, 0, 2800);
            }
        },
        // 17. Cloud Whale: Echoing Sky Whale Call Glide + Rolled Harp Harmonics!
        'cloud-whale': (sp) => {
            if (sp) {
                sing('sine', 392, 587.33, 0.34, 0.13, fxGain, 0, 5, 8, 1600, true);
                [65, 69, 72, 76].forEach((m, i) => pluck(m2f(m), 0.30, 0.06, fxGain, i * 0.03, 2800));
            } else {
                const start = 440 + (keyToggle % 4) * 55;
                sing('sine', start, start * 1.28, 0.14, 0.11, fxGain, 0, 5, 5, 1500, true);
            }
        },
        // 18. Halloween Pumpkin: Rattling Dry Skeleton Bones + Spooky Ghost "Wooo~" on Space/Enter!
        'halloween-pumpkin': (sp) => {
            if (sp) {
                sing('sine', 784, 466.16, 0.32, 0.13, fxGain, 0, 9.5, 22, 1800, true);
            } else {
                const spooky = [523.25, 554.37, 622.25, 739.99];
                const f = spooky[keyToggle % spooky.length];
                fm(f, 2.92, 2.2, 0.065, 0.14, fxGain);
                fm(f * 1.06, 2.92, 2.0, 0.05, 0.09, fxGain, 0.028);
            }
        },
        // 19. Mid-Autumn Carp: Vietnamese Trong Ech ("Cac-Tung!") + Plucked Dan Bau Pitch Bend!
        'midautumn-carp': (sp) => {
            if (sp) {
                fm(920, 1.55, 2.2, 0.04, 0.14, fxGain, 0);
                tone('triangle', 220, 130, 0.09, 0.18, fxGain, 0.045);
                tone('triangle', 220, 130, 0.12, 0.18, fxGain, 0.12);
            } else {
                const scale = [587.33, 659.25, 783.99, 880];
                const target = scale[keyToggle % scale.length];
                pluck(target, 0.22, 0.10, fxGain, 0, 2800, target * 0.86);
                fm(880, 1.5, 1.8, 0.03, 0.07, fxGain);
            }
        },
        // 20. Valentine Cupid: Bowstring Twang + Arrow Whoosh + Heart Chime!
        'valentine-cupid': (sp) => {
            pluck(sp ? 220 : 293.66, 0.14, 0.13, fxGain, 0, 2400, sp ? 185 : 246.94);
            noise('bandpass', 900, 3400, 2.4, 0.065, 0.12, fxGain, 0.015);
            if (sp) {
                [65, 69, 72, 76, 77].forEach((m, i) => fm(m2f(m), 2.0, 0.9, 0.22, 0.065, fxGain, 0.05 + i * 0.025));
            } else {
                fm(1046.5 + (keyToggle % 3) * 130, 2.0, 1.0, 0.12, 0.065, fxGain, 0.045);
            }
        },
        // 21. Summer Corgi: Caribbean Steelpan + Happy Corgi "Arf!" / Fizzy Pop on Space/Enter!
        'summer-corgi': (sp) => {
            if (sp) {
                // Playful little Corgi "Arf!" + fizzy splash
                sing('sawtooth', 360, 620, 0.075, 0.12, fxGain, 0, 4, 4, 1500);
                sing('sawtooth', 620, 310, 0.065, 0.10, fxGain, 0.055, 4, 4, 1300);
                noise('highpass', 3200, 5500, 1.2, 0.08, 0.10, fxGain, 0.09);
            } else {
                const island = [60, 64, 67, 69, 72, 76];
                const f = m2f(island[keyToggle % island.length]);
                fm(f, 2.0, 1.45, 0.12, 0.12, fxGain);
                tone('sine', f * 3, f * 2.98, 0.05, 0.04, fxGain);
            }
        }
    };

    // ========================================================
    // PART 2: 21 DISTINCT MULTI-TRACK GENRE BGM ARRANGEMENTS
    // Each theme runs its own composer(step) with unique drums,
    // basslines, chord voicings, time signature & lead instrument!
    // ========================================================
    const BGM_ENGINES = {
        // 1. Jade Dragon: Tiên Hiệp Guzheng Arpeggio + Soaring Vibrato Xiao Flute (Dm - Bb - Gm - A)
        'jade-dragon': {
            ms: 220, len: 32,
            tick: (s) => {
                const roots = [50, 46, 43, 45];
                const bar = Math.floor(s / 8);
                const sub = s % 8;
                const r = roots[bar];
                const arp = [0, 7, 12, 15, 12, 7, 10, 7];
                pluck(m2f(r + arp[sub]), 0.48, 0.065, bgmGain, 0, 2900, null, true);
                if (s === 0) fm(m2f(62), 2.74, 1.4, 1.6, 0.06, bgmGain, 0, true);
                const mel = { 2: 74, 5: 77, 8: 76, 12: 74, 14: 72, 18: 69, 21: 72, 24: 69, 28: 67 };
                if (mel[s]) sing('sine', m2f(mel[s]), m2f(mel[s]), 0.62, 0.085, bgmGain, 0, 5.5, 6, 2000, true);
            }
        },
        // 2. Fire Phoenix: Epic Tribal Taiko War Drums + Heroic Blazing Strings
        'fire-phoenix': {
            ms: 175, len: 32,
            tick: (s) => {
                const pat = s % 8;
                if (pat === 0 || pat === 3 || pat === 6) kick(0.24, 110, 0.22);
                if (pat === 4 || pat === 7) rim(0.10, 620);
                if (s % 4 === 0) noise('bandpass', 1500, 900, 2.0, 0.09, 0.04, bgmGain);
                const chords = [[50, 57, 62], [46, 53, 58], [48, 55, 60], [50, 57, 65]];
                if (s % 8 === 0) chord(chords[Math.floor(s / 8)], 'sawtooth', 1.3, 0.085, 1250);
                const lead = { 0: 69, 3: 72, 6: 74, 8: 77, 12: 76, 14: 72, 16: 74, 20: 76, 22: 79, 24: 74 };
                if (lead[s]) sing('sawtooth', m2f(lead[s]), m2f(lead[s]), 0.45, 0.075, bgmGain, 0, 6, 5, 1900, true);
            }
        },
        // 3. Space Astronaut: 80s Sci-Fi Driving Synthwave Bass + Interstellar Organ Chords
        'space-astronaut': {
            ms: 150, len: 32,
            tick: (s) => {
                const bassRoots = [45, 41, 36, 43]; // Am - F - C - G
                const b = bassRoots[Math.floor(s / 8)];
                // Driving 16th-note analog saw bass pulse!
                pluck(m2f(s % 2 === 0 ? b : b + 12), 0.14, 0.095, bgmGain, 0, 1100);
                if (s % 8 === 0) kick(0.20, 125, 0.16);
                if (s % 8 === 4) snare(0.11, 0.14);
                const pads = [[57, 60, 64, 69], [53, 57, 60, 69], [55, 60, 64, 67], [55, 59, 62, 67]];
                if (s % 8 === 0) chord(pads[Math.floor(s / 8)], 'sawtooth', 1.15, 0.07, 1300);
                const arp = [76, 72, 69, 72];
                if (s % 2 === 1) fm(m2f(arp[(s >> 1) % 4]), 2.0, 0.8, 0.22, 0.045, bgmGain, 0, true);
            }
        },
        // 4. Wise Owl: Midnight Zen Monastery (Singing Bowl + Woodblock + Shakuhachi/Xiao)
        'wise-owl': {
            ms: 280, len: 24,
            tick: (s) => {
                if (s === 0 || s === 12) fm(m2f(52), 2.76, 1.3, 2.8, 0.09, bgmGain, 0, true);
                if (s % 6 === 3) fm(680, 1.47, 1.8, 0.06, 0.065, bgmGain);
                const zen = { 2: 64, 5: 67, 7: 69, 10: 71, 14: 74, 17: 71, 19: 69, 22: 64 };
                if (zen[s]) sing('sine', m2f(zen[s]) * 0.98, m2f(zen[s]), 0.78, 0.085, bgmGain, 0, 5, 7, 1400, true);
            }
        },
        // 5. Moon Witch: 3/4 Mystical Magic-Academy Celesta Waltz (24 steps = 4 bars of 3/4)
        'moon-witch': {
            ms: 195, len: 24,
            tick: (s) => {
                const beat = s % 6; // 3/4 Waltz: 0, 2, 4
                const bassBar = [40, 45, 40, 47][Math.floor(s / 6)];
                if (beat === 0) pluck(m2f(bassBar), 0.28, 0.10, bgmGain, 0, 900);
                if (beat === 2 || beat === 4) chord([bassBar + 12, bassBar + 15, bassBar + 19], 'triangle', 0.14, 0.055, 1400);
                // Chromatic wizardry celesta melody!
                const waltz = { 0: 71, 2: 76, 3: 79, 4: 78, 6: 76, 8: 83, 10: 81, 12: 78, 14: 76, 15: 79, 16: 78, 18: 75, 20: 76, 22: 71 };
                if (waltz[s]) fm(m2f(waltz[s]), 2.0, 1.15, 0.36, 0.085, bgmGain, 0, true);
            }
        },
        // 6. Fox Chibi: Japanese Shrine Matsuri (Hirajoshi Koto Ostinato + Taiko + Fue)
        'fox-chibi': {
            ms: 165, len: 32,
            tick: (s) => {
                const koto = [62, 63, 67, 69, 72, 69, 67, 63]; // D In-Sen Japanese scale!
                pluck(m2f(koto[s % 8]), 0.24, 0.075, bgmGain, 0, 3400, null, true);
                if (s % 8 === 0 || s % 8 === 6) kick(0.18, 145, 0.14);
                if (s % 8 === 4) fm(1380, 1.62, 2.8, 0.05, 0.08, bgmGain); // Hyoshigi clack!
                const fue = { 0: 74, 4: 75, 6: 79, 8: 81, 12: 79, 16: 84, 20: 81, 22: 79, 24: 74 };
                if (fue[s]) sing('triangle', m2f(fue[s]), m2f(fue[s]), 0.42, 0.075, bgmGain, 0, 6.5, 8, 2400, true);
            }
        },
        // 7. Sakura Bunny: Upbeat Kawaii Anime Slice-of-Life Pop
        'sakura-bunny': {
            ms: 155, len: 32,
            tick: (s) => {
                if (s % 4 === 0) kick(0.18, 150, 0.11);
                if (s % 8 === 4) snare(0.09, 0.08);
                if (s % 2 === 1) hat(0.045, 0.03, 7000);
                const roots = [53, 55, 52, 57]; // F - G - Em - Am
                const r = roots[Math.floor(s / 8)];
                if (s % 4 === 2) chord([r + 12, r + 16, r + 19], 'triangle', 0.16, 0.07, 2200);
                const cute = { 0: 77, 2: 79, 3: 81, 6: 84, 8: 83, 10: 79, 12: 76, 16: 76, 18: 79, 20: 81, 24: 84, 26: 81, 28: 77 };
                if (cute[s]) fm(m2f(cute[s]), 3.0, 0.9, 0.20, 0.08, bgmGain, 0, true);
            }
        },
        // 8. Ocean Shark: Deep Sea Sub-Bass Groove & Sonar Echo
        'ocean-shark': {
            ms: 190, len: 32,
            tick: (s) => {
                if (s % 4 === 0) kick(0.24, 95, 0.20);
                // Deep pulsing half-step ocean bass motif (C2 -> Db2)
                const subNotes = [36, 36, 37, 36, 39, 36, 37, 36];
                if (s % 2 === 0) tone('sawtooth', m2f(subNotes[(s >> 1) % 8]), m2f(subNotes[(s >> 1) % 8]), 0.24, 0.095, bgmGain, 0, 320);
                if (s === 0 || s === 16) fm(1046.5, 1.0, 0.4, 0.55, 0.055, bgmGain, 0, true); // Sonar ping!
                if (s % 8 === 4) tone('sine', 240, 520, 0.09, 0.055, bgmGain); // Bubble!
                const aqua = { 2: 67, 6: 70, 10: 72, 14: 68, 18: 67, 22: 63, 26: 65 };
                if (aqua[s]) pluck(m2f(aqua[s]), 0.45, 0.065, bgmGain, 0, 1400, null, true);
            }
        },
        // 9. Gangster Pawn: 1940s Mafia Jazz Noir (Walking Upright Bass + Brush Swing + Finger Snap!)
        'gangster-pawn': {
            ms: 175, len: 24, // Triplet swing grid (6 steps per bar = 2 bars of 12/8 swing!)
            tick: (s) => {
                // Walking Upright Jazz Bass on every quarter beat (0, 3, 6, 9...)
                const walk = [36, 39, 41, 42, 43, 46, 43, 39]; // Bluesy C minor walk!
                if (s % 3 === 0) pluck(m2f(walk[Math.floor(s / 3)]), 0.38, 0.15, bgmGain, 0, 620);
                // Classic Jazz Swing Ride Cymbal: "tss --- ts-tss"
                if (s % 3 === 0) hat(0.065, 0.09, 5200);
                if (s % 6 === 5) hat(0.045, 0.04, 5800);
                // Cool Finger Snap on beats 2 & 4 (steps 3, 9, 15, 21)
                if (s % 6 === 3) rim(0.095, 1250);
                // Smoky Muted Jazz Rhodes & Trumpet licks
                if (s === 0 || s === 12) chord([60, 63, 67, 70], 'triangle', 0.55, 0.065, 1100);
                const noir = { 2: 72, 5: 75, 6: 74, 8: 72, 11: 70, 15: 67, 17: 70, 18: 71, 20: 72 };
                if (noir[s]) sing('sawtooth', m2f(noir[s]) * 0.97, m2f(noir[s]), 0.35, 0.07, bgmGain, 0, 5.5, 5, 1250, true);
            }
        },
        // 10. Ice Penguin: Bouncy Penguin Waddle Pizzicato Polka + Shimmering Aurora Bells
        'ice-penguin': {
            ms: 165, len: 32,
            tick: (s) => {
                const bass = [48, 55, 48, 55, 53, 60, 55, 62];
                if (s % 4 === 0) pluck(m2f(bass[Math.floor(s / 4)]), 0.18, 0.11, bgmGain, 0, 1100);
                if (s % 4 === 2) chord([72, 76, 79], 'sine', 0.09, 0.055, 3000);
                const ice = { 0: 76, 2: 79, 4: 84, 6: 81, 8: 79, 12: 76, 16: 77, 18: 81, 20: 86, 22: 83, 24: 84 };
                if (ice[s]) fm(m2f(ice[s]), 2.5, 1.1, 0.26, 0.07, bgmGain, 0, true);
            }
        },
        // 11. AI Robot: Cyberpunk / Daft-Style Tight Electro Sequencer
        'ai-robot': {
            ms: 135, len: 32,
            tick: (s) => {
                if (s % 4 === 0) kick(0.20, 140, 0.12);
                if (s % 8 === 4) snare(0.11, 0.08);
                if (s % 2 === 1) hat(0.055, 0.025, 7800);
                const arp = [52, 64, 59, 64, 55, 67, 62, 67, 57, 69, 64, 69, 50, 62, 57, 62];
                const note = arp[s % 16];
                fm(m2f(note + (s >= 16 ? 12 : 0)), 2.0, 1.6, 0.11, 0.075, bgmGain, 0, s % 4 === 0);
            }
        },
        // 12. Black Cat: Cozy Rain on Rooftop + Late-Night Felt Jazz Piano
        'black-cat': {
            ms: 235, len: 32,
            tick: (s) => {
                // Soft continuous rain droplets
                if (s % 2 === 0) noise('bandpass', 2600 + Math.random() * 900, 1800, 1.0, 0.16, 0.028, bgmGain);
                const jazz = [
                    [50, 57, 60, 64, 69], // Dm9
                    [43, 53, 57, 59, 64], // G13
                    [48, 55, 59, 62, 67], // Cmaj9
                    [45, 55, 61, 64, 69]  // A7
                ];
                if (s % 8 === 0) chord(jazz[Math.floor(s / 8)], 'triangle', 1.65, 0.095, 920, bgmGain, 28);
                const piano = { 3: 76, 5: 74, 6: 72, 11: 71, 14: 69, 19: 74, 21: 76, 23: 79, 27: 76, 30: 72 };
                if (piano[s]) tone('triangle', m2f(piano[s]), m2f(piano[s]), 0.55, 0.075, bgmGain, 0, 1150);
            }
        },
        // 13. Noel Snowman: Festive Sleigh-Bell Rhythm & Classic Holiday Jingle Melody!
        'noel-snowman': {
            ms: 175, len: 32,
            tick: (s) => {
                if (s % 2 === 0) {
                    noise('highpass', 5800, 5800, 1.3, 0.045, 0.055, bgmGain);
                    fm(2637, 2.3, 1.2, 0.06, 0.03, bgmGain);
                }
                const bass = [48, 55, 48, 55, 53, 60, 55, 43];
                if (s % 4 === 0) pluck(m2f(bass[Math.floor(s / 4)]), 0.28, 0.10, bgmGain, 0, 1000);
                // Cheerful holiday bell melody!
                const jingle = {
                    0: 76, 2: 76, 4: 76, 8: 76, 10: 76, 12: 76,
                    16: 76, 18: 79, 20: 72, 23: 74, 24: 76
                };
                if (jingle[s]) fm(m2f(jingle[s]), 2.0, 1.1, 0.34, 0.09, bgmGain, 0, true);
            }
        },
        // 14. Tet Lion: Festive Mai Hoa Thung Lion Drum Groove + Spring Zither!
        'tet-lion': {
            ms: 155, len: 32,
            tick: (s) => {
                const p = s % 8;
                // Authentic Lion Drum rhythm: TUNG - cac - TUNG - TUNG - XOENG!
                if (p === 0 || p === 3 || p === 4) tone('sine', 155, 62, 0.14, 0.20, bgmGain);
                if (p === 2 || p === 7) rim(0.11, 880);
                if (s === 0 || s === 16) noise('bandpass', 3800, 2500, 0.9, 0.22, 0.09, bgmGain); // Cymbal!
                const tetMel = { 0: 72, 2: 74, 4: 76, 6: 79, 8: 81, 10: 79, 12: 76, 16: 79, 18: 81, 20: 84, 22: 81, 24: 79, 28: 72 };
                if (tetMel[s]) pluck(m2f(tetMel[s]), 0.28, 0.09, bgmGain, 0, 3600, null, true);
            }
        },
        // 15. Code Cat: True Boom-Bap Lo-Fi Hip-Hop Chillhop (Kick + Snare + Vinyl + Rhodes 7ths)
        'code-cat': {
            ms: 185, len: 32,
            tick: (s) => {
                const p = s % 16;
                // Boom-bap swung drums
                if (p === 0 || p === 7 || p === 10) kick(0.24, 118, 0.15);
                if (p === 4 || p === 12) snare(0.12, 0.09);
                if (s % 2 === 0) hat(0.042, 0.03, 6500);
                if (Math.random() < 0.35) noise('bandpass', 3200, 3200, 3.0, 0.012, 0.025, bgmGain); // Vinyl dust!
                const rhodes = [
                    [53, 57, 60, 64], // Fmaj7
                    [52, 55, 59, 62], // Em7
                    [50, 53, 57, 60], // Dm7
                    [48, 52, 55, 59]  // Cmaj7
                ];
                if (s % 8 === 0) chord(rhodes[Math.floor(s / 8)], 'triangle', 1.35, 0.095, 1050, bgmGain, 20);
                const lofi = { 2: 72, 5: 76, 9: 74, 14: 69, 18: 72, 21: 74, 25: 76, 28: 72 };
                if (lofi[s]) tone('sine', m2f(lofi[s]), m2f(lofi[s]), 0.38, 0.065, bgmGain, 0, 1400);
            }
        },
        // 16. Pixel Knight: 4-Channel 8-Bit NES Adventure Soundtrack!
        'pixel-knight': {
            ms: 130, len: 32,
            tick: (s) => {
                const roots = [48, 43, 45, 41]; // C - G - Am - F
                const r = roots[Math.floor(s / 8)];
                // Ch1: Triangle NES Bass
                if (s % 2 === 0) tone('triangle', m2f(s % 4 === 0 ? r : r + 12), m2f(s % 4 === 0 ? r : r + 12), 0.11, 0.13, bgmGain);
                // Ch2: Fast 8-Bit Square Arpeggio
                const arpOffsets = [12, 16, 19, 24];
                tone('square', m2f(r + arpOffsets[s % 4]), m2f(r + arpOffsets[s % 4]), 0.08, 0.032, bgmGain, 0, 2600);
                // Ch3: Noise 8-Bit Percussion
                if (s % 8 === 4) noise('bandpass', 1800, 900, 1.0, 0.06, 0.08, bgmGain);
                if (s % 2 === 1) hat(0.035, 0.02, 5500);
                // Ch4: Heroic 8-Bit Lead Melody!
                const nes = { 0: 72, 2: 76, 4: 79, 6: 84, 8: 83, 12: 79, 16: 81, 18: 76, 20: 72, 24: 77, 26: 79, 28: 83 };
                if (nes[s]) tone('square', m2f(nes[s]), m2f(nes[s]), 0.20, 0.062, bgmGain, 0, 3200);
            }
        },
        // 17. Cloud Whale: 3/4 Studio-Ghibli-Inspired Sky Waltz (Harp + Expressive Violin/Flute)
        'cloud-whale': {
            ms: 215, len: 24,
            tick: (s) => {
                const bars = [[53, 60, 64, 69], [55, 59, 62, 67], [52, 59, 64, 67], [57, 60, 64, 72]];
                const c = bars[Math.floor(s / 6)];
                const beat = s % 6;
                if (beat < 4) pluck(m2f(c[beat]), 0.55, 0.065, bgmGain, 0, 2400, null, true);
                const sky = { 0: 72, 4: 74, 6: 76, 10: 79, 12: 81, 16: 79, 18: 76, 22: 74 };
                if (sky[s]) sing('triangle', m2f(sky[s]), m2f(sky[s]), 0.65, 0.08, bgmGain, 0, 5.2, 6, 1900, true);
            }
        },
        // 18. Halloween Pumpkin: Spooky 3/4 Haunted Waltz (Tuba Oom-Pah-Pah + Pipe Organ + Theremin!)
        'halloween-pumpkin': {
            ms: 175, len: 24,
            tick: (s) => {
                const roots = [36, 43, 36, 42]; // Cm sneaky tritone bass!
                const r = roots[Math.floor(s / 6)];
                const beat = s % 6;
                if (beat === 0) tone('sawtooth', m2f(r), m2f(r), 0.22, 0.12, bgmGain, 0, 420);
                if (beat === 2 || beat === 4) chord([r + 24, r + 27, r + 31], 'sawtooth', 0.11, 0.06, 1300);
                const ghost = { 0: 72, 2: 75, 4: 79, 6: 78, 9: 79, 12: 80, 14: 79, 16: 75, 18: 74, 21: 71 };
                if (ghost[s]) {
                    sing('sine', m2f(ghost[s]), m2f(ghost[s]), 0.34, 0.075, bgmGain, 0, 8.5, 12, 2200, true);
                    fm(m2f(ghost[s]), 2.92, 1.5, 0.08, 0.05, bgmGain);
                }
            }
        },
        // 19. Mid-Autumn Carp: Festive Lantern Parade (Frog Drum + Expressive Pitch-Bent Dan Bau!)
        'midautumn-carp': {
            ms: 175, len: 32,
            tick: (s) => {
                const p = s % 8;
                // Cheerful Vietnamese lantern parade frog-drum rhythm!
                if (p === 0 || p === 3) tone('triangle', 210, 125, 0.09, 0.13, bgmGain);
                if (p === 2 || p === 6 || p === 7) rim(0.08, 940);
                const bau = { 0: 67, 3: 69, 4: 71, 8: 74, 11: 76, 12: 79, 16: 76, 19: 74, 20: 71, 24: 69, 28: 67 };
                if (bau[s]) {
                    const target = m2f(bau[s]);
                    sing('triangle', target * 0.91, target, 0.45, 0.085, bgmGain, 0, 6, 7, 2300, true);
                }
            }
        },
        // 20. Valentine Cupid: Smooth Romantic Bossa Nova Café Groove!
        'valentine-cupid': {
            ms: 170, len: 32,
            tick: (s) => {
                const p = s % 16;
                // Authentic Bossa Nova Bass + Kick pattern (beats 1, 2+, 3, 4+)
                const bossaRoots = [53, 55, 52, 57]; // Fmaj7 - G6 - Em7 - A7
                const r = bossaRoots[Math.floor(s / 8)];
                if (p % 4 === 0 || p % 4 === 3) {
                    if (p % 4 === 0) kick(0.16, 110, 0.13);
                    pluck(m2f(r - 12), 0.24, 0.11, bgmGain, 0, 650);
                }
                // Classic Bossa Nova Cross-Stick Clave: 0, 3, 6, 10, 13
                if (p === 0 || p === 3 || p === 6 || p === 10 || p === 13) rim(0.075, 1120);
                if (s % 2 === 0) hat(0.032, 0.035, 6800);
                if (p === 2 || p === 6 || p === 10 || p === 14) {
                    chord([r + 12, r + 16, r + 19, r + 23], 'triangle', 0.18, 0.065, 1600, bgmGain, 12);
                }
                const love = { 1: 76, 4: 77, 7: 74, 11: 72, 17: 74, 20: 76, 23: 79, 27: 77 };
                if (love[s]) sing('sine', m2f(love[s]), m2f(love[s]), 0.42, 0.075, bgmGain, 0, 5, 4, 2000, true);
            }
        },
        // 21. Summer Corgi: Tropical Beach Party (Ocean Surf + Off-Beat Ukulele + Bongo + Steelpan!)
        'summer-corgi': {
            ms: 155, len: 32,
            tick: (s) => {
                // Gentle ocean wave wash every 2 bars
                if (s === 0) noise('lowpass', 520, 260, 0.8, 2.4, 0.045, bgmGain);
                // Bouncy island bass + kick
                const ukeRoots = [48, 43, 45, 41]; // C - G - Am - F!
                const r = ukeRoots[Math.floor(s / 8)];
                if (s % 4 === 0) {
                    kick(0.17, 130, 0.12);
                    pluck(m2f(r), 0.25, 0.11, bgmGain, 0, 800);
                }
                // Off-beat Hawaiian Ukulele Strum on '&' beats (steps 2, 6, 10, 14...)!
                if (s % 4 === 2) {
                    [12, 16, 19, 24].forEach((iv, i) => pluck(m2f(r + iv), 0.15, 0.045, bgmGain, i * 0.012, 3600));
                }
                // Tropical Bongo percussion
                if (s % 8 === 3 || s % 8 === 7) tone('triangle', s % 8 === 3 ? 340 : 250, 190, 0.065, 0.085, bgmGain);
                // Sunny Caribbean Steelpan Melody!
                const steel = { 0: 76, 3: 79, 6: 81, 8: 79, 12: 74, 16: 76, 19: 79, 22: 84, 24: 81, 28: 79 };
                if (steel[s]) fm(m2f(steel[s]), 2.0, 1.4, 0.24, 0.085, bgmGain, 0, true);
            }
        }
    };

    function stopBgm() {
        if (bgmTimer) {
            clearInterval(bgmTimer);
            bgmTimer = null;
        }
    }

    function playBgmStep() {
        if (!ctx || !state.enabled || !state.bgmEnabled) return;
        if (ctx.state === 'suspended') return;
        const eng = BGM_ENGINES[state.themeId] || BGM_ENGINES['jade-dragon'];
        try {
            eng.tick(bgmStep % eng.len);
        } catch (e) {}
        bgmStep++;
    }

    function restartBgmIfNeeded() {
        stopBgm();
        if (!state.enabled || !state.bgmEnabled) return;
        const c = ensureContext();
        if (!c) return;
        bgmStep = 0;
        const eng = BGM_ENGINES[state.themeId] || BGM_ENGINES['jade-dragon'];
        playBgmStep();
        bgmTimer = setInterval(playBgmStep, eng.ms);
    }

    function wireUserGestureUnlock() {
        if (unlockWired || typeof document === 'undefined') return;
        unlockWired = true;
        const unlock = () => {
            if (!state.enabled || (!state.sfxEnabled && !state.bgmEnabled)) return;
            if (ctx && ctx.state === 'suspended') {
                ctx.resume().then(() => {
                    if (state.bgmEnabled && !bgmTimer) restartBgmIfNeeded();
                }).catch(() => {});
            } else if (!ctx && state.bgmEnabled) {
                restartBgmIfNeeded();
            }
        };
        document.addEventListener('pointerdown', unlock, { passive: true });
        document.addEventListener('keydown', unlock, { passive: true });
    }

    // ---- Public API ----
    function configure(next) {
        const prevTheme = state.themeId;
        const prevBgm = state.bgmEnabled;
        const prevEnabled = state.enabled;

        if (typeof next.enabled === 'boolean') state.enabled = next.enabled;
        if (typeof next.sfxEnabled === 'boolean') state.sfxEnabled = next.sfxEnabled;
        if (typeof next.bgmEnabled === 'boolean') state.bgmEnabled = next.bgmEnabled;
        if (typeof next.volume === 'number') state.volume = next.volume;
        if (typeof next.themeId === 'string') state.themeId = next.themeId;

        wireUserGestureUnlock();
        if (ctx) syncGainValues();

        if (!state.enabled || !state.bgmEnabled) {
            stopBgm();
        } else if (prevTheme !== state.themeId || !prevBgm || !prevEnabled || !bgmTimer) {
            restartBgmIfNeeded();
        }
    }

    function playKeystroke(themeId, isSpecial) {
        if (!state.enabled || !state.sfxEnabled) return;
        const nowMs = Date.now();
        if (nowMs - lastKeyTime < 28) return;
        lastKeyTime = nowMs;
        keyToggle++;

        const c = ensureContext();
        if (!c) return;
        const fn = KEY_SYNTHS[themeId || state.themeId] || KEY_SYNTHS['jade-dragon'];
        try { fn(!!isSpecial); } catch (e) {}
    }

    function playSample(themeId) {
        const c = ensureContext();
        if (!c) return;
        const id = themeId || state.themeId;
        const fn = KEY_SYNTHS[id] || KEY_SYNTHS['jade-dragon'];
        const prevFx = state.sfxEnabled;
        if (!prevFx && fxGain) fxGain.gain.setValueAtTime(0.92, c.currentTime);
        if (masterGain && !state.enabled) masterGain.gain.setValueAtTime(0.60, c.currentTime);
        try {
            keyToggle++;
            fn(false);
            setTimeout(() => { keyToggle++; try { fn(false); } catch (e) {} }, 130);
            setTimeout(() => {
                keyToggle++;
                try { fn(true); } catch (e) {}
                setTimeout(() => syncGainValues(), 450);
            }, 280);
        } catch (e) {}
    }

    return {
        configure,
        playKeystroke,
        playSample,
        getMeta,
        stopBgm
    };
})();
