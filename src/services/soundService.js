// ========================================================
// SERVICE: Velvet Studio Acoustic & Lookahead Audio Engine
// - Hardware-clock lookahead scheduler (0.000ms jitter, zero stutter!)
// - Velvet Felt Grand Piano, Warm Mellow Nylon/Harp/Zither,
//   Deep Acoustic Bass & Lush Pad in Stereo Concert Hall Reverb
// - Zero harsh high-harmonic buzz anywhere!
// ========================================================

const SoundService = (function () {
    let ctx = null;
    let masterGain = null;
    let fxGain = null;
    let bgmGain = null;
    let reverbNode = null;
    let reverbSend = null;
    let noiseBuf = null;

    const stringCache = new Map();
    const pianoCache = new Map();

    let state = {
        enabled: true,
        sfxEnabled: true,
        bgmEnabled: false,
        volume: 65,
        themeId: 'jade-dragon'
    };

    let lastKeyTime = 0;
    let keyToggle = 0;
    let lookaheadTimer = null;
    let nextStepTime = 0;
    let bgmStep = 0;
    let unlockWired = false;

    const SOUND_META = {
        'jade-dragon':       { vi: 'Vuốt Cổ Tranh tơ • Cổ Tranh, Piano & Tiêu Ấm',        en: 'Silk Guzheng Sweep • Guzheng, Piano & Warm Xiao' },
        'fire-phoenix':      { vi: 'Lửa hồng ấm • Giao hưởng Piano, Đàn Hạc & Trầm Ấm',   en: 'Warm Flame • Cinematic Piano, Harp & Warm Pad' },
        'space-astronaut':   { vi: 'Bộ đàm NASA • Synthwave Không gian Vũ trụ',            en: 'NASA Radio Squelch • Dreamy Cosmic Synthwave' },
        'wise-owl':          { vi: 'Mõ gỗ & tiếng Cú • Guitar Nylon & Piano Đêm Tĩnh',     en: 'Woodblock & Owl Hoot • Nylon Guitar & Night Piano' },
        'moon-witch':        { vi: 'Đũa phép pha lê • Đàn Hạc, Piano & Hộp nhạc Huyền ảo', en: 'Crystal Wand • Concert Harp, Piano & Celesta' },
        'fox-chibi':         { vi: 'Phách gỗ & Chuông đền • Đàn Koto Ấm & Piano Hoàng Hôn', en: 'Shrine Clack • Mellow Twilight Koto & Felt Piano' },
        'sakura-bunny':      { vi: 'Nảy Mochi mềm • Độc tấu Piano & Guitar Mùa Xuân',      en: 'Soft Mochi Bounce • Spring Grand Piano & Guitar' },
        'ocean-shark':       { vi: 'Bọt nước biển sâu • Piano Đại Dương, Hạc & Sóng Êm',   en: 'Ocean Bubbles • Deep-Sea Felt Piano, Harp & Tide' },
        'gangster-pawn':     { vi: 'Máy đánh chữ & TING! • Jazz Lounge Piano & Upright Bass', en: 'Vintage Typewriter • Velvet Jazz Lounge Piano & Bass' },
        'ice-penguin':       { vi: 'Tuyết xốp & pha lê • Piano Nỉ Ấm & Hộp Nhạc Mùa Đông', en: 'Snow Crunch • Cozy Winter Felt Piano & Celesta' },
        'ai-robot':          { vi: 'Chirp dữ liệu AI • Điện tử Ambient Tương lai',         en: 'AI Data Chirps • Futuristic Clean Chill-Electro' },
        'black-cat':         { vi: 'Tiếng Mèo Meow~ • Bản Giao Hưởng Piano Đêm Mưa (2 Chương)', en: 'Soft Meow • 2-Movement Rainy Midnight Piano Nocturne' },
        'noel-snowman':      { vi: 'Chuông tuyết ấm • Bản Ballad Piano & Hộp Nhạc Đêm Noel', en: 'Warm Sleigh Chime • Flowing Fireside Christmas Piano' },
        'tet-lion':          { vi: 'Trống Xuân ấm • Hòa tấu Đàn Tranh, Piano & Sáo Xuân',  en: 'Spring Drum • Flowing Blossom Zither, Piano & Flute' },
        'code-cat':          { vi: 'Phím cơ Custom Thocky • Lo-Fi Piano, Guitar & Đĩa than', en: 'Creamy Thocky Switch • Lo-Fi Felt Piano & Guitar' },
        'pixel-knight':      { vi: 'Nhảy & Ăn xu 8-bit • Nhạc điện tử 4 nút NES RPG',      en: '8-Bit Jump & Coin • Retro 4-Ch NES Chiptune' },
        'cloud-whale':       { vi: 'Đàn Hạc mây • Bản Hòa Tấu Piano & Hạc kiểu Ghibli',    en: 'Cloud Harp • Soaring Ghibli-Style Piano & Harp' },
        'halloween-pumpkin': { vi: 'Gõ mộc cầm gỗ • Bản Nocturne Hộp Nhạc & Piano Bí Ẩn',  en: 'Wooden Xylophone • Enchanted Moonlight Piano & Celesta' },
        'midautumn-carp':    { vi: 'Đàn Tranh & Trống ếch • Đàn Tranh, Guitar & Piano Trăng Rằm', en: 'Lotus Zither • Moonlit Đàn Tranh, Guitar & Piano' },
        'valentine-cupid':   { vi: 'Cung đàn Hạc • Guitar Nylon & Jazz Piano Lãng Mạn',    en: 'Harp Bowstring • Romantic Nylon Guitar & Felt Piano' },
        'summer-corgi':      { vi: 'Ukulele nắng biển • Guitar Acoustic, Ukulele & Sóng Biển', en: 'Sunny Ukulele • Breezy Acoustic Guitar & Ocean Surf' }
    };

    function getMeta(themeId, lang) {
        const item = SOUND_META[themeId] || SOUND_META['jade-dragon'];
        return lang === 'en' ? item.en : item.vi;
    }

    function m2f(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    // True 2.4-second Velvety Stereo Concert Hall Impulse Response
    function buildConcertHallReverb(c) {
        const sr = c.sampleRate;
        const dur = 2.4;
        const len = Math.floor(sr * dur);
        const ir = c.createBuffer(2, len, sr);
        for (let ch = 0; ch < 2; ch++) {
            const data = ir.getChannelData(ch);
            let lp = 0;
            for (let i = 0; i < len; i++) {
                const t = i / sr;
                const env = Math.min(1, t / 0.028) * Math.exp(-t * 2.15);
                const white = Math.random() * 2 - 1;
                // Dark, warm wooden concert hall air absorption (zero metallic ring!)
                const alpha = Math.max(0.05, 0.28 - t * 0.10);
                lp = lp + alpha * (white - lp);
                data[i] = lp * env * 0.58;
            }
        }
        const conv = c.createConvolver();
        conv.buffer = ir;
        return conv;
    }

    function ensureContext() {
        if (!ctx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            ctx = new AC();

            masterGain = ctx.createGain();
            fxGain = ctx.createGain();
            bgmGain = ctx.createGain();
            reverbSend = ctx.createGain();
            reverbSend.gain.value = 0.52;

            reverbNode = buildConcertHallReverb(ctx);

            reverbSend.connect(reverbNode);
            reverbNode.connect(bgmGain);

            fxGain.connect(masterGain);
            bgmGain.connect(masterGain);
            masterGain.connect(ctx.destination);

            // Soft organic pink noise buffer (rain, surf, vinyl, brush, felt)
            const len = Math.floor(ctx.sampleRate * 2.5);
            noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
            const data = noiseBuf.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0;
            for (let i = 0; i < len; i++) {
                const w = Math.random() * 2 - 1;
                b0 = 0.997 * b0 + w * 0.029;
                b1 = 0.985 * b1 + w * 0.032;
                b2 = 0.950 * b2 + w * 0.048;
                data[i] = (b0 + b1 + b2 + w * 0.20) * 0.46;
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
        masterGain.gain.setTargetAtTime(state.enabled ? v : 0, now, 0.04);
        fxGain.gain.setTargetAtTime(state.sfxEnabled ? 0.90 : 0, now, 0.02);
        bgmGain.gain.setTargetAtTime(state.bgmEnabled ? 0.76 : 0, now, 0.08);
    }

    // ========================================================
    // VELVET STUDIO INSTRUMENTS (Exact Hardware Timestamp `when`)
    // ========================================================

    // 1. Beloved "Mèo Đen" Studio Felt Grand Piano (Unison detuned strings + 2.6s sustain pedal!)
    function getPianoBuffer(midi) {
        if (pianoCache.has(midi)) return pianoCache.get(midi);

        const sr = ctx.sampleRate;
        const freq = m2f(midi);
        const dur = 2.6;
        const len = Math.floor(sr * dur);
        const buf = ctx.createBuffer(1, len, sr);
        const out = buf.getChannelData(0);

        const baseAmps = [1.0, 0.40, 0.17, 0.07, 0.028];
        const maxH = midi > 76 ? 3 : (midi > 64 ? 4 : 5);

        for (let h = 1; h <= maxH; h++) {
            const amp = baseAmps[h - 1] * (midi > 70 ? Math.pow(0.72, h - 1) : 1.0);
            const inharm = Math.sqrt(1 + 0.00025 * h * h);
            const f1 = freq * h * inharm;
            if (f1 > sr * 0.40) break;

            const w1 = (2 * Math.PI * f1) / sr;
            const c1 = Math.cos(w1), s1 = Math.sin(w1);
            let re1 = 1, im1 = 0;

            const useUnison = h <= 2;
            const w2 = w1 * 1.00055;
            const c2 = Math.cos(w2), s2 = Math.sin(w2);
            let re2 = 1, im2 = 0;

            const decayPerSample = Math.exp(-(0.80 + h * 0.58) / sr);
            let env = amp * (useUnison ? 0.26 : 0.42);

            for (let i = 0; i < len; i++) {
                const nr1 = re1 * c1 - im1 * s1;
                im1 = re1 * s1 + im1 * c1;
                re1 = nr1;

                let sample = im1;
                if (useUnison) {
                    const nr2 = re2 * c2 - im2 * s2;
                    im2 = re2 * s2 + im2 * c2;
                    re2 = nr2;
                    sample += im2;
                }
                out[i] += sample * env;
                env *= decayPerSample;
            }
        }

        let peak = 0.001;
        const scan = Math.min(len, Math.floor(sr * 0.2));
        for (let i = 0; i < scan; i++) {
            const a = Math.abs(out[i]);
            if (a > peak) peak = a;
        }
        const norm = 0.78 / peak;
        for (let i = 0; i < len; i++) out[i] *= norm;

        const attSamples = Math.floor(sr * 0.007);
        const relSamples = Math.floor(sr * 0.06);
        for (let i = 0; i < attSamples; i++) {
            out[i] *= 0.5 * (1 - Math.cos((Math.PI * i) / attSamples));
        }
        for (let i = 0; i < relSamples; i++) {
            out[len - 1 - i] *= (i / relSamples);
        }

        pianoCache.set(midi, buf);
        return buf;
    }

    function pianoAt(midi, vol, when, dest) {
        if (!ctx) return;
        const buf = getPianoBuffer(midi);
        const t0 = Math.max(ctx.currentTime, when || ctx.currentTime);
        const src = ctx.createBufferSource();
        src.buffer = buf;

        const g = ctx.createGain();
        g.gain.setValueAtTime(vol, t0);

        // Gentle natural stereo piano spread (low notes slightly left, high notes slightly right)
        if (ctx.createStereoPanner && dest !== fxGain) {
            const pan = ctx.createStereoPanner();
            pan.pan.setValueAtTime(Math.max(-0.45, Math.min(0.45, (midi - 64) * 0.018)), t0);
            src.connect(g);
            g.connect(pan);
            pan.connect(dest || bgmGain);
        } else {
            src.connect(g);
            g.connect(dest || bgmGain);
        }

        if (reverbSend) {
            const rg = ctx.createGain();
            rg.gain.value = vol * 0.78;
            src.connect(rg);
            rg.connect(reverbSend);
        }
        src.start(t0);
    }

    function pianoChordAt(midis, vol, when, rollSec) {
        const per = vol / Math.sqrt(midis.length);
        const roll = rollSec === undefined ? 0.032 : rollSec;
        midis.forEach((m, i) => {
            pianoAt(m, per * (i === midis.length - 1 ? 1.10 : 0.90), when + i * roll);
        });
    }

    // 2. Warm Mellow Karplus-Strong Acoustic Plucked String ('guitar' | 'harp' | 'zither' | 'ukulele')
    // Always smoothed & warm-body filtered so ZERO metallic harshness ever occurs!
    function getPluckedBuffer(style, midi) {
        const key = style + ':' + midi;
        if (stringCache.has(key)) return stringCache.get(key);

        const sr = ctx.sampleRate;
        const freq = m2f(midi);
        const dur = style === 'ukulele' ? 1.45 : 2.3;
        const len = Math.floor(sr * dur);
        const buf = ctx.createBuffer(1, len, sr);
        const out = buf.getChannelData(0);

        const N = Math.max(10, Math.round(sr / freq));
        // Always >= 5 smoothing passes so strings sound like warm wood & silk/nylon, never harsh wire!
        const smoothPasses = style === 'harp' ? 8 : (style === 'guitar' ? 7 : (style === 'ukulele' ? 6 : 5));
        const ring = new Float32Array(N);
        for (let i = 0; i < N; i++) {
            const pos = i / N;
            const tri = pos < 0.32 ? (pos / 0.32) : ((1 - pos) / 0.68);
            ring[i] = (Math.random() * 2 - 1) * 0.42 + (tri * 2 - 1) * 0.58;
        }
        for (let p = 0; p < smoothPasses; p++) {
            let prev = ring[N - 1];
            for (let i = 0; i < N; i++) {
                const cur = ring[i];
                ring[i] = 0.5 * (cur + prev);
                prev = cur;
            }
        }
        let mean = 0;
        for (let i = 0; i < N; i++) mean += ring[i];
        mean /= N;
        for (let i = 0; i < N; i++) out[i] = ring[i] - mean;

        const decay = style === 'ukulele' ? 0.9935 : 0.9968;
        const damp = style === 'zither' ? 0.44 : 0.50;
        for (let i = N; i < len; i++) {
            out[i] = decay * ((1 - damp) * out[i - N] + damp * out[i - N + 1]);
        }

        let peak = 0.001;
        for (let i = 0; i < N * 3 && i < len; i++) {
            const a = Math.abs(out[i]);
            if (a > peak) peak = a;
        }
        const norm = 0.76 / peak;
        for (let i = 0; i < len; i++) out[i] *= norm;

        const att = Math.floor(sr * 0.005);
        const rel = Math.floor(sr * 0.05);
        for (let i = 0; i < att; i++) out[i] *= (i / att);
        for (let i = 0; i < rel; i++) out[len - 1 - i] *= (i / rel);

        stringCache.set(key, buf);
        return buf;
    }

    function stringAt(style, midi, vol, when, dest) {
        if (!ctx) return;
        const buf = getPluckedBuffer(style, midi);
        const t0 = Math.max(ctx.currentTime, when || ctx.currentTime);
        const src = ctx.createBufferSource();
        src.buffer = buf;

        // Warm wooden soundboard lowpass so high plucks are velvety smooth
        const flt = ctx.createBiquadFilter();
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(style === 'zither' ? 2100 : 1750, t0);

        const g = ctx.createGain();
        g.gain.setValueAtTime(vol, t0);

        src.connect(flt);
        flt.connect(g);
        g.connect(dest || bgmGain);

        if (reverbSend) {
            const rg = ctx.createGain();
            rg.gain.value = vol * 0.72;
            flt.connect(rg);
            rg.connect(reverbSend);
        }
        src.start(t0);
    }

    function strumAt(style, midis, vol, when, rollSec) {
        const per = vol / Math.sqrt(midis.length);
        const step = rollSec === undefined ? 0.025 : rollSec;
        midis.forEach((m, i) => stringAt(style, m, per, when + i * step));
    }

    // 3. Deep Velvet Acoustic Upright / Sub Bass (Zero noise-burst thump, 100% warm round bass!)
    function bassAt(midi, dur, vol, when) {
        if (!ctx) return;
        const t0 = Math.max(ctx.currentTime, when || ctx.currentTime);
        const f = m2f(midi);
        const o1 = ctx.createOscillator();
        const o2 = ctx.createOscillator();
        const g = ctx.createGain();

        o1.type = 'sine';
        o2.type = 'triangle';
        o1.frequency.setValueAtTime(f, t0);
        o2.frequency.setValueAtTime(f * 2, t0);

        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.18, t0);
        g2.gain.exponentialRampToValueAtTime(0.02, t0 + Math.min(0.25, dur * 0.5));

        const flt = ctx.createBiquadFilter();
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(320, t0);

        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(vol, t0 + 0.014);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

        o1.connect(g);
        o2.connect(g2);
        g2.connect(flt);
        flt.connect(g);
        g.connect(bgmGain);

        o1.start(t0);
        o2.start(t0);
        o1.stop(t0 + dur + 0.03);
        o2.stop(t0 + dur + 0.03);
    }

    // 4. Cashmere-Warm Velvet Cello / Choir Pad (Pure Sine + Soft Octave, 0% buzz!)
    function warmPadAt(midis, dur, vol, when) {
        if (!ctx) return;
        const t0 = Math.max(ctx.currentTime, when || ctx.currentTime);
        const per = vol / Math.sqrt(midis.length);
        midis.forEach((m, idx) => {
            const f = m2f(m);
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f * (1 + (idx % 2 === 0 ? 0.001 : -0.001)), t0);

            const g = ctx.createGain();
            g.gain.setValueAtTime(0.0001, t0);
            g.gain.linearRampToValueAtTime(per, t0 + Math.min(0.65, dur * 0.38));
            g.gain.setValueAtTime(per * 0.85, t0 + dur * 0.68);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

            osc.connect(g);
            g.connect(bgmGain);
            if (reverbSend) g.connect(reverbSend);

            osc.start(t0);
            osc.stop(t0 + dur + 0.05);
        });
    }

    // 5. Silky Breathy Ocarina / Bamboo Xiao Flute (Pure warm sine + soft 2nd harmonic, capped warm!)
    function softFluteAt(midi, dur, vol, when, graceMidi) {
        if (!ctx) return;
        const t0 = Math.max(ctx.currentTime, when || ctx.currentTime);
        // Keep in warm, sweet register (never shrill!)
        const safeMidi = midi > 79 ? midi - 12 : midi;
        const targetF = m2f(safeMidi);
        const startF = graceMidi ? m2f(graceMidi > 79 ? graceMidi - 12 : graceMidi) : targetF;

        const osc = ctx.createOscillator();
        const over = ctx.createOscillator();
        const overG = ctx.createGain();
        osc.type = 'sine';
        over.type = 'sine';
        osc.frequency.setValueAtTime(startF, t0);
        over.frequency.setValueAtTime(startF * 2, t0);
        if (startF !== targetF) {
            osc.frequency.exponentialRampToValueAtTime(targetF, t0 + 0.12);
            over.frequency.exponentialRampToValueAtTime(targetF * 2, t0 + 0.12);
        }
        overG.gain.value = 0.14;

        // Gentle delayed breath vibrato
        const lfo = ctx.createOscillator();
        const lfoG = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(4.8, t0);
        lfoG.gain.setValueAtTime(0.01, t0);
        lfoG.gain.linearRampToValueAtTime(targetF * 0.0065, t0 + Math.min(0.35, dur * 0.45));
        lfo.connect(lfoG);
        lfoG.connect(osc.frequency);

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(vol, t0 + Math.min(0.14, dur * 0.28));
        g.gain.setValueAtTime(vol * 0.84, t0 + dur * 0.72);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

        osc.connect(g);
        over.connect(overG);
        overG.connect(g);
        g.connect(bgmGain);
        if (reverbSend) g.connect(reverbSend);

        lfo.start(t0);
        osc.start(t0);
        over.start(t0);
        lfo.stop(t0 + dur + 0.04);
        osc.stop(t0 + dur + 0.04);
        over.stop(t0 + dur + 0.04);
    }

    // 6. Pure Crystal Celesta / Music-Box / Vibraphone Droplet
    function celestaAt(midi, dur, vol, when) {
        if (!ctx) return;
        const t0 = Math.max(ctx.currentTime, when || ctx.currentTime);
        const f = m2f(midi);
        const o1 = ctx.createOscillator();
        const g1 = ctx.createGain();
        o1.type = 'sine';
        o1.frequency.setValueAtTime(f, t0);

        g1.gain.setValueAtTime(0.0001, t0);
        g1.gain.linearRampToValueAtTime(vol, t0 + 0.008);
        g1.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

        o1.connect(g1);
        g1.connect(bgmGain);
        if (reverbSend) g1.connect(reverbSend);

        o1.start(t0);
        o1.stop(t0 + dur + 0.03);
    }

    // ---- Low-level Scheduled Noise / Percussion / Retro Helpers ----
    function toneAt(type, fStart, fEnd, dur, vol, when, dest, cutoff) {
        if (!ctx) return;
        const t0 = Math.max(ctx.currentTime, when || ctx.currentTime);
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(Math.max(20, fStart), t0);
        if (fEnd && fEnd !== fStart) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(20, fEnd), t0 + dur);
        }
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(vol, t0 + Math.min(0.007, dur * 0.18));
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
        g.connect(dest || bgmGain);
        osc.start(t0);
        osc.stop(t0 + dur + 0.02);
    }

    function noiseAt(fType, fStart, fEnd, q, dur, vol, when, dest) {
        if (!ctx || !noiseBuf) return;
        const t0 = Math.max(ctx.currentTime, when || ctx.currentTime);
        const src = ctx.createBufferSource();
        src.buffer = noiseBuf;
        src.loop = true;

        const flt = ctx.createBiquadFilter();
        flt.type = fType || 'bandpass';
        flt.frequency.setValueAtTime(fStart, t0);
        if (fEnd && fEnd !== fStart) {
            flt.frequency.exponentialRampToValueAtTime(Math.max(40, fEnd), t0 + dur);
        }
        flt.Q.setValueAtTime(q || 1.1, t0);

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(vol, t0 + Math.min(0.015, dur * 0.22));
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

        src.connect(flt);
        flt.connect(g);
        g.connect(dest || bgmGain);
        src.start(t0, Math.random() * 1.3, dur + 0.03);
    }

    function fmKey(carrierFreq, ratio, modIndex, dur, vol, delaySec) {
        if (!ctx) return;
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
        outG.connect(fxGain);
        mod.start(t0);
        car.start(t0);
        mod.stop(t0 + dur + 0.02);
        car.stop(t0 + dur + 0.02);
    }

    function softKickAt(vol, when) {
        toneAt('sine', 92, 36, 0.16, vol || 0.14, when, bgmGain, 190);
    }

    function softBrushAt(vol, dur, when) {
        noiseAt('highpass', 5200, 4600, 0.7, dur || 0.06, vol || 0.024, when, bgmGain);
    }

    // ========================================================
    // PART 1: 21 BESPOKE KEYSTROKE SYNTHESIZERS (Immediate ctx.currentTime)
    // ========================================================
    const KEY_SYNTHS = {
        'jade-dragon': (sp) => {
            const now = ctx.currentTime;
            const notes = sp ? [62, 65, 69, 74, 77] : [62, 67, 74].map(n => n + (keyToggle % 3) * 2);
            notes.forEach((m, i) => stringAt('zither', m, 0.14, now + i * 0.022, fxGain));
        },
        'fire-phoenix': (sp) => {
            const now = ctx.currentTime;
            noiseAt('bandpass', 280, sp ? 2000 : 1500, 1.8, sp ? 0.15 : 0.08, 0.15, now, fxGain);
            stringAt('harp', sp ? 74 : (65 + (keyToggle % 4) * 2), 0.14, now + 0.01, fxGain);
        },
        'space-astronaut': (sp) => {
            const now = ctx.currentTime;
            if (sp) {
                noiseAt('bandpass', 2200, 1800, 1.8, 0.05, 0.13, now, fxGain);
                toneAt('sine', 2475, 2475, 0.08, 0.12, now + 0.045, fxGain);
                noiseAt('bandpass', 2000, 1600, 2.0, 0.045, 0.10, now + 0.13, fxGain);
            } else {
                const hi = 1650 + (keyToggle % 3) * 260;
                fmKey(hi, 1.5, 1.8, 0.06, 0.09, 0);
                toneAt('sine', hi * 1.15, 540, 0.06, 0.08, now, fxGain);
            }
        },
        'wise-owl': (sp) => {
            const now = ctx.currentTime;
            if (sp) {
                toneAt('sine', 466, 435, 0.14, 0.13, now, fxGain, 900);
                toneAt('sine', 455, 392, 0.24, 0.14, now + 0.16, fxGain, 900);
            } else {
                const pitches = [690, 740, 640];
                fmKey(pitches[keyToggle % 3], 1.47, 1.9, 0.065, 0.14, 0);
                noiseAt('bandpass', 2600, 1800, 1.4, 0.03, 0.07, now + 0.01, fxGain);
            }
        },
        'moon-witch': (sp) => {
            const now = ctx.currentTime;
            const notes = sp ? [76, 79, 83, 88] : [76 + (keyToggle % 4) * 2, 83 + (keyToggle % 3) * 2];
            notes.forEach((m, i) => stringAt('harp', m, 0.13, now + i * 0.025, fxGain));
            if (sp) toneAt('sine', 240, 620, 0.08, 0.11, now + 0.02, fxGain);
        },
        'fox-chibi': (sp) => {
            const now = ctx.currentTime;
            fmKey(sp ? 1180 : 1450, 1.62, 2.4, 0.06, 0.13, 0);
            stringAt('zither', sp ? 62 : (69 + (keyToggle % 4) * 2), 0.14, now + 0.015, fxGain);
        },
        'sakura-bunny': (sp) => {
            const now = ctx.currentTime;
            if (sp) {
                pianoAt(77, 0.17, now, fxGain);
                pianoAt(81, 0.19, now + 0.06, fxGain);
            } else {
                const f0 = 310 + (keyToggle % 3) * 35;
                toneAt('sine', f0, f0 * 1.85, 0.09, 0.13, now, fxGain);
            }
        },
        'ocean-shark': (sp) => {
            const now = ctx.currentTime;
            if (sp) {
                pianoAt(48, 0.22, now, fxGain);
                pianoAt(55, 0.20, now + 0.08, fxGain);
            } else {
                [0, 0.028, 0.056].forEach((d, i) => {
                    const bf = 230 + i * 105 + (keyToggle % 2) * 40;
                    toneAt('sine', bf, bf * 2.05, 0.05, 0.10, now + d, fxGain);
                });
            }
        },
        'gangster-pawn': (sp) => {
            const now = ctx.currentTime;
            if (sp) {
                noiseAt('bandpass', 1600, 3200, 2.2, 0.075, 0.16, now, fxGain);
                fmKey(2349.3, 2.41, 1.8, 0.36, 0.14, 0.065);
            } else {
                noiseAt('bandpass', 3400, 1800, 2.6, 0.024, 0.19, now, fxGain);
                fmKey(420 + (keyToggle % 3) * 35, 3.1, 2.1, 0.03, 0.12, 0);
                toneAt('triangle', 145, 70, 0.032, 0.14, now, fxGain);
            }
        },
        'ice-penguin': (sp) => {
            const now = ctx.currentTime;
            noiseAt('bandpass', 1800 + (keyToggle % 2) * 350, 950, 1.4, 0.05, 0.14, now, fxGain);
            pianoAt(sp ? 84 : (76 + (keyToggle % 4) * 2), 0.14, now + 0.01, fxGain);
        },
        'ai-robot': (sp) => {
            const now = ctx.currentTime;
            const pool = [720, 980, 1320, 1760, 2180, 620, 1540];
            const count = sp ? 5 : 3;
            for (let i = 0; i < count; i++) {
                const f1 = pool[(keyToggle + i * 2) % pool.length];
                const f2 = pool[(keyToggle + i * 3 + 1) % pool.length];
                toneAt('sine', f1, f2, 0.03, 0.10, now + i * 0.03, fxGain);
            }
        },
        'black-cat': (sp) => {
            const now = ctx.currentTime;
            if (sp) {
                toneAt('triangle', 620, 900, 0.11, 0.11, now, fxGain, 1700);
                toneAt('triangle', 900, 510, 0.18, 0.11, now + 0.09, fxGain, 1500);
            } else {
                pianoAt(69 + (keyToggle % 5) * 2, 0.16, now, fxGain);
            }
        },
        'noel-snowman': (sp) => {
            const now = ctx.currentTime;
            noiseAt('highpass', 6000, 6000, 1.2, 0.04, 0.065, now, fxGain);
            if (sp) {
                [72, 76, 79].forEach((m, i) => pianoAt(m, 0.15, now + i * 0.055, fxGain));
            } else {
                pianoAt(72 + (keyToggle % 5) * 2, 0.14, now, fxGain);
            }
        },
        'tet-lion': (sp) => {
            const now = ctx.currentTime;
            if (sp) {
                toneAt('sine', 155, 58, 0.20, 0.20, now, fxGain);
                [65, 69, 72, 77].forEach((m, i) => stringAt('zither', m, 0.14, now + i * 0.025, fxGain));
            } else {
                const pent = [65, 67, 69, 72, 74];
                stringAt('zither', pent[keyToggle % pent.length], 0.15, now, fxGain);
            }
        },
        'code-cat': (sp) => {
            const now = ctx.currentTime;
            const bodyFreq = sp ? 115 : (168 + (Math.random() - 0.5) * 22);
            toneAt('triangle', bodyFreq, bodyFreq * 0.56, sp ? 0.068 : 0.048, sp ? 0.22 : 0.17, now, fxGain, 880);
            noiseAt('bandpass', sp ? 1650 : 2400, 1400, 2.8, 0.022, 0.16, now, fxGain);
        },
        'pixel-knight': (sp) => {
            const now = ctx.currentTime;
            if (sp) {
                toneAt('square', 987.77, 987.77, 0.06, 0.07, now, fxGain, 3200);
                toneAt('square', 1318.5, 1318.5, 0.18, 0.07, now + 0.06, fxGain, 3200);
            } else {
                const steps = [440, 523.25, 587.33, 659.25, 783.99];
                const f = steps[keyToggle % steps.length];
                toneAt('square', f, f * 1.18, 0.045, 0.06, now, fxGain, 2600);
            }
        },
        'cloud-whale': (sp) => {
            const now = ctx.currentTime;
            const chordNotes = sp ? [65, 69, 72, 76] : [65 + (keyToggle % 5) * 2];
            chordNotes.forEach((m, i) => stringAt('harp', m, 0.15, now + i * 0.03, fxGain));
        },
        'halloween-pumpkin': (sp) => {
            const now = ctx.currentTime;
            const notes = [69, 72, 76, 77, 81];
            if (sp) {
                [69, 72, 76, 81].forEach((m, i) => pianoAt(m, 0.14, now + i * 0.04, fxGain));
            } else {
                fmKey(m2f(notes[keyToggle % notes.length]), 2.0, 1.1, 0.08, 0.11, 0);
            }
        },
        'midautumn-carp': (sp) => {
            const now = ctx.currentTime;
            const pent = [67, 69, 71, 74, 76];
            if (sp) {
                [67, 71, 74, 79].forEach((m, i) => stringAt('zither', m, 0.14, now + i * 0.028, fxGain));
            } else {
                stringAt('zither', pent[keyToggle % pent.length], 0.15, now, fxGain);
            }
        },
        'valentine-cupid': (sp) => {
            const now = ctx.currentTime;
            if (sp) {
                [65, 69, 72, 76].forEach((m, i) => stringAt('guitar', m, 0.15, now + i * 0.032, fxGain));
            } else {
                const rom = [65, 69, 72, 74, 76];
                stringAt('guitar', rom[keyToggle % rom.length], 0.16, now, fxGain);
            }
        },
        'summer-corgi': (sp) => {
            const now = ctx.currentTime;
            if (sp) {
                [60, 64, 67, 72].forEach((m, i) => stringAt('ukulele', m, 0.14, now + i * 0.02, fxGain));
            } else {
                const uke = [60, 64, 67, 69, 72];
                stringAt('ukulele', uke[keyToggle % uke.length], 0.16, now, fxGain);
            }
        }
    };

    // ========================================================
    // PART 2: 21 HARDWARE-SCHEDULED VELVET BGM ARRANGEMENTS
    // Every `tick(s, t)` receives exact hardware timestamp `t`!
    // ========================================================
    const BGM_ENGINES = {
        // 1. Jade Dragon: Flowing Silk Guzheng + Felt Piano + Warm Bamboo Xiao
        'jade-dragon': {
            sec: 0.26, len: 32,
            tick: (s, t) => {
                const bars = [[50, 57, 62, 65], [46, 53, 58, 62], [43, 50, 55, 62], [45, 52, 57, 64]];
                const c = bars[Math.floor(s / 8)];
                const sub = s % 8;
                if (sub === 0) {
                    warmPadAt([c[0], c[1], c[2]], 2.1, 0.055, t);
                    pianoAt(c[0], 0.12, t);
                }
                const arp = [0, 1, 2, 3, 2, 1, 2, 3];
                stringAt('zither', c[arp[sub]] + 12, sub === 0 ? 0.11 : 0.08, t);
                const xiao = { 2: [74, 1.2, 72], 8: [77, 1.0, 74], 12: [76, 1.0], 18: [74, 1.2, 72], 24: [69, 1.6, 67] };
                if (xiao[s]) softFluteAt(xiao[s][0], xiao[s][1], 0.068, t, xiao[s][2]);
            }
        },
        // 2. Fire Phoenix: Majestic Cinematic Felt Piano + Concert Harp + Warm Swelling Pad
        'fire-phoenix': {
            sec: 0.24, len: 32,
            tick: (s, t) => {
                const bars = [[50, 57, 62, 65], [46, 53, 58, 62], [53, 60, 65, 69], [48, 55, 60, 64]];
                const c = bars[Math.floor(s / 8)];
                const sub = s % 8;
                if (sub === 0) {
                    warmPadAt([c[0], c[1], c[2]], 1.9, 0.07, t);
                    softKickAt(0.12, t);
                    pianoAt(c[0] - 12, 0.14, t);
                }
                const arp = [0, 1, 2, 3, 2, 1, 2, 3];
                stringAt('harp', c[arp[sub]], 0.085, t);
                const anthem = { 0: 74, 3: 77, 6: 81, 8: 79, 12: 77, 16: 81, 20: 84, 24: 79, 28: 76 };
                if (anthem[s]) pianoAt(anthem[s], 0.16, t);
            }
        },
        // 3. Space Astronaut: [COSMIC SCI-FI] Smooth Interstellar Arpeggio & Deep Space Pad
        'space-astronaut': {
            sec: 0.20, len: 32,
            tick: (s, t) => {
                const bars = [[45, 52, 57, 64], [41, 48, 53, 60], [48, 55, 60, 67], [43, 50, 55, 62]];
                const c = bars[Math.floor(s / 8)];
                if (s % 8 === 0) {
                    warmPadAt([c[0], c[1], c[2], c[3]], 1.65, 0.075, t);
                    bassAt(c[0] - 12, 1.5, 0.13, t);
                }
                const pat = [12, 16, 19, 24, 19, 16, 19, 24];
                celestaAt(c[0] + pat[s % 8], 0.55, 0.048, t);
            }
        },
        // 4. Wise Owl: Peaceful Fingerpicked Nylon Guitar & Nocturnal Felt Piano
        'wise-owl': {
            sec: 0.27, len: 32,
            tick: (s, t) => {
                const bars = [[52, 59, 64, 67], [48, 55, 60, 64], [45, 52, 57, 64], [47, 54, 59, 66]];
                const c = bars[Math.floor(s / 8)];
                const pick = [0, 1, 2, 3, 2, 1, 2, 1];
                stringAt('guitar', c[pick[s % 8]], s % 8 === 0 ? 0.13 : 0.085, t);
                const mel = { 2: 76, 6: 74, 10: 72, 14: 71, 18: 69, 22: 72, 26: 71 };
                if (mel[s]) pianoAt(mel[s], 0.14, t);
            }
        },
        // 5. Moon Witch: Enchanted Fantasy Harp, Warm Pad & Celesta Waltz
        'moon-witch': {
            sec: 0.24, len: 24,
            tick: (s, t) => {
                const bars = [[52, 59, 64, 67], [48, 55, 60, 64], [45, 52, 57, 64], [47, 54, 59, 63]];
                const c = bars[Math.floor(s / 6)];
                const beat = s % 6;
                if (beat === 0) {
                    bassAt(c[0] - 12, 1.35, 0.12, t);
                    warmPadAt([c[1], c[2]], 1.4, 0.05, t);
                }
                const pat = [0, 1, 2, 3, 2, 1];
                stringAt('harp', c[pat[beat]] + 12, 0.08, t);
                const mel = { 0: 76, 3: 79, 6: 83, 9: 81, 12: 79, 15: 76, 18: 75, 21: 76 };
                if (mel[s]) celestaAt(mel[s], 0.9, 0.068, t);
            }
        },
        // 6. Fox Chibi: FIXED! Mellow Spirited-Away Twilight (Warm Koto + Felt Piano + Soft Ocarina)
        'fox-chibi': {
            sec: 0.25, len: 32,
            tick: (s, t) => {
                // Warm consonant Japanese pentatonic (Dm9 - Bbmaj7 - Cadd9 - Am7) - zero harsh half-steps!
                const bars = [[50, 57, 60, 65], [46, 53, 58, 62], [48, 55, 60, 64], [45, 52, 57, 60]];
                const c = bars[Math.floor(s / 8)];
                const sub = s % 8;
                if (sub === 0) {
                    pianoChordAt(c, 0.13, t, 0.035);
                    warmPadAt([c[0], c[1], c[2]], 1.9, 0.048, t);
                }
                const pat = [0, 1, 2, 3, 2, 1, 2, 3];
                stringAt('zither', c[pat[sub]] + 12, 0.075, t);
                const twilight = { 2: [74, 1.0, 72], 6: [72, 0.6], 8: [69, 1.2], 18: [72, 0.9, 69], 22: [74, 0.7], 24: [69, 1.4] };
                if (twilight[s]) softFluteAt(twilight[s][0], twilight[s][1], 0.062, t, twilight[s][2]);
            }
        },
        // 7. Sakura Bunny: Flowing Yiruma-Style Spring Felt Grand Piano & Acoustic Guitar
        'sakura-bunny': {
            sec: 0.23, len: 32,
            tick: (s, t) => {
                const bars = [[53, 60, 65, 69], [55, 62, 67, 71], [52, 59, 64, 67], [57, 64, 69, 72]];
                const c = bars[Math.floor(s / 8)];
                const pat = [0, 1, 2, 3, 2, 1, 2, 3];
                pianoAt(c[pat[s % 8]], s % 8 === 0 ? 0.13 : 0.085, t);
                const spring = { 0: 77, 2: 79, 4: 81, 6: 84, 8: 83, 12: 79, 16: 76, 18: 79, 20: 81, 24: 77, 28: 76 };
                if (spring[s]) pianoAt(spring[s], 0.16, t + 0.008);
            }
        },
        // 8. Ocean Shark: FIXED! Deep Bioluminescent Ocean (Felt Piano + Harp + Warm Sub-Pad + Tide)
        'ocean-shark': {
            sec: 0.26, len: 32,
            tick: (s, t) => {
                if (s === 0) noiseAt('lowpass', 380, 200, 0.7, 3.4, 0.032, t, bgmGain);
                const bars = [[48, 55, 60, 63], [44, 51, 56, 60], [51, 58, 63, 67], [46, 53, 58, 62]]; // Cm9 - Abmaj7 - Ebmaj7 - Bb6
                const c = bars[Math.floor(s / 8)];
                const sub = s % 8;
                if (sub === 0) {
                    bassAt(c[0] - 12, 2.0, 0.14, t);
                    warmPadAt([c[0], c[1], c[2]], 2.1, 0.062, t);
                }
                const wave = [0, 1, 2, 3, 2, 1, 2, 3];
                stringAt('harp', c[wave[sub]] + 12, 0.075, t);
                const deep = { 0: 72, 4: 74, 8: 75, 12: 72, 16: 79, 20: 77, 24: 74, 28: 70 };
                if (deep[s]) pianoAt(deep[s], 0.15, t);
            }
        },
        // 9. Gangster Pawn: FIXED! Velvet Late-Night Jazz Lounge (Jazz Grand Piano + Smooth Upright Bass + Brush!)
        'gangster-pawn': {
            sec: 0.23, len: 24, // Smooth 12/8 Jazz Lounge Swing
            tick: (s, t) => {
                // Smooth warm Upright Bass (zero buzz!)
                const walk = [36, 39, 41, 43, 44, 43, 41, 38];
                if (s % 3 === 0) {
                    bassAt(walk[Math.floor(s / 3)], 0.62, 0.16, t);
                    softBrushAt(0.030, 0.07, t);
                }
                if (s % 6 === 5) softBrushAt(0.020, 0.035, t);
                // Smoky Jazz 9th Felt Piano Chords (Cm9 -> Fm9)
                if (s === 0) pianoChordAt([60, 63, 67, 70, 74], 0.14, t, 0.028);
                if (s === 12) pianoChordAt([53, 56, 60, 63, 67], 0.14, t, 0.028);
                // Cool Velvet Right-Hand Jazz Piano + Vibraphone Unison Licks!
                const lounge = { 2: 79, 5: 77, 6: 75, 9: 72, 14: 77, 17: 75, 18: 74, 20: 72 };
                if (lounge[s]) {
                    pianoAt(lounge[s], 0.155, t);
                    celestaAt(lounge[s], 0.65, 0.038, t);
                }
            }
        },
        // 10. Ice Penguin: Cozy Arctic Winter Felt Piano & Crystal Music-Box
        'ice-penguin': {
            sec: 0.23, len: 32,
            tick: (s, t) => {
                const bars = [[48, 55, 60, 64], [45, 52, 57, 60], [53, 60, 65, 69], [43, 50, 55, 59]];
                const c = bars[Math.floor(s / 8)];
                const pat = [0, 1, 2, 3, 2, 1, 2, 3];
                pianoAt(c[pat[s % 8]], 0.085, t);
                const snow = { 0: 76, 3: 79, 6: 84, 8: 81, 12: 76, 16: 77, 19: 81, 22: 79, 24: 74 };
                if (snow[s]) {
                    pianoAt(snow[s], 0.14, t);
                    celestaAt(snow[s], 0.7, 0.045, t);
                }
            }
        },
        // 11. AI Robot: [CLEAN FUTURISTIC ELECTRO] Smooth Ambient Pluck & Warm Sub
        'ai-robot': {
            sec: 0.16, len: 32,
            tick: (s, t) => {
                if (s % 8 === 0) {
                    softKickAt(0.14, t);
                    const roots = [40, 43, 45, 48];
                    bassAt(roots[Math.floor(s / 8)], 1.1, 0.13, t);
                }
                if (s % 4 === 2) softBrushAt(0.022, 0.025, t);
                const arp = [64, 67, 71, 76, 74, 71, 67, 71];
                celestaAt(arp[s % 8], 0.28, 0.052, t);
            }
        },
        // 12. Black Cat: UPGRADED 64-STEP 2-MOVEMENT MASTERPIECE!
        // Movement I (0..31): Intimate Rainy Midnight Solo Felt Piano
        // Movement II (32..63 - THE WOW LIFT!): Swelling Velvet Cello-Pad + Whispered Heartbeat + Shimmering Upper-Octave Harmony Duet!
        'black-cat': {
            sec: 0.26, len: 64,
            tick: (s, t) => {
                // Soft continuous rain outside the window
                if (s % 2 === 0) noiseAt('bandpass', 2300 + Math.random() * 700, 1650, 0.85, 0.24, 0.022, t, bgmGain);

                const prog = [
                    [50, 57, 60, 64, 69], // Dm9
                    [43, 50, 57, 59, 64], // G13
                    [48, 55, 59, 62, 67], // Cmaj9
                    [41, 48, 55, 57, 64], // Fmaj9
                    [50, 57, 60, 65, 69], // Dm11 (Movement II Lift!)
                    [43, 50, 55, 59, 65], // G9
                    [48, 55, 59, 64, 67], // Cmaj9
                    [45, 52, 57, 61, 67]  // A7b13 warm turnaround
                ];
                const bar = Math.floor(s / 8);
                const sub = s % 8;
                const c = prog[bar];
                const inLift = s >= 32;

                // Rolled lush 5-note Jazz-Nocturne chord on bar downbeat + gentle left-hand inner motion
                if (sub === 0) {
                    pianoChordAt(c, inLift ? 0.175 : 0.155, t, 0.038);
                    if (inLift) {
                        // Velvet Cello & Warm Choir Pad blooms underneath in Movement II!
                        warmPadAt([c[0] - 12, c[0], c[2], c[3]], 2.15, 0.072, t);
                    }
                } else if (sub === 4 || sub === 6) {
                    pianoAt(c[sub === 4 ? 2 : 3], 0.078, t);
                }

                // Subtle, cozy heartbeat pulse enters in Movement II
                if (inLift && (sub === 0 || sub === 5)) {
                    softKickAt(sub === 0 ? 0.10 : 0.065, t);
                }

                // Movement I: Tender, intimate solo melody with expressive grace notes
                const mov1 = {
                    2: [76, 74], 5: [74], 6: [72],
                    10: [71], 13: [72], 14: [69],
                    18: [74, 72], 21: [76], 22: [79],
                    26: [76], 29: [74], 30: [72]
                };
                if (mov1[s]) {
                    if (mov1[s][1]) pianoAt(mov1[s][1], 0.095, t);
                    pianoAt(mov1[s][0], 0.16, t + (mov1[s][1] ? 0.07 : 0));
                }

                // Movement II (WOW Climax): Soaring upper-register duet in warm 6ths/3rds + crystal shimmer!
                const mov2 = {
                    32: [81, 72], 34: [83, 74], 36: [84, 76], 38: [81, 72],
                    40: [79, 71], 43: [81, 72], 44: [76, 67],
                    48: [79, 71], 50: [81, 72], 52: [84, 76], 54: [86, 77],
                    56: [81, 73], 59: [79, 71], 60: [76, 69]
                };
                if (mov2[s]) {
                    pianoAt(mov2[s][1], 0.125, t);
                    pianoAt(mov2[s][0], 0.175, t + 0.018);
                    celestaAt(mov2[s][0], 0.95, 0.032, t + 0.018);
                }
            }
        },
        // 13. Noel Snowman: FIXED! Zero-Stutter Flowing Fireside Christmas Piano & Celesta Ballad!
        'noel-snowman': {
            sec: 0.23, len: 32, // Steady, silky-smooth flowing 4/4 cradle arpeggio (0% hiccup!)
            tick: (s, t) => {
                const bars = [
                    [48, 55, 60, 64], // Cmaj7
                    [45, 52, 57, 64], // Am9
                    [53, 60, 65, 69], // Fmaj7
                    [43, 50, 55, 62]  // G6
                ];
                const c = bars[Math.floor(s / 8)];
                const sub = s % 8;

                // Continuous, seamless left-hand Felt Piano cradle arpeggio!
                const cradle = [0, 1, 2, 3, 2, 1, 2, 3];
                pianoAt(c[cradle[sub]], sub === 0 ? 0.135 : 0.082, t);
                if (sub === 0) warmPadAt([c[0], c[2], c[3]], 1.85, 0.055, t);

                // Flowing, heartwarming fireside Christmas melody (Piano + Celesta)
                const xmas = {
                    0: 76, 2: 79, 4: 76, 6: 72,
                    8: 76, 10: 79, 12: 81,
                    16: 81, 18: 79, 20: 77, 22: 76,
                    24: 74, 28: 79
                };
                if (xmas[s]) {
                    pianoAt(xmas[s], 0.165, t);
                    celestaAt(xmas[s] + 12, 0.85, 0.035, t);
                }
            }
        },
        // 14. Tet Lion: Flowing Spring Peach-Blossom Silk Zither, Felt Piano & Soft Flute
        'tet-lion': {
            sec: 0.23, len: 32,
            tick: (s, t) => {
                const bars = [[53, 60, 65, 69], [50, 57, 62, 65], [46, 53, 58, 62], [48, 55, 60, 64]];
                const c = bars[Math.floor(s / 8)];
                const sub = s % 8;
                const pat = [0, 1, 2, 3, 2, 1, 2, 3];
                stringAt('zither', c[pat[sub]], sub === 0 ? 0.115 : 0.075, t);
                if (sub === 0) warmPadAt([c[0], c[1], c[2]], 1.85, 0.05, t);
                const xuan = { 0: 77, 2: 81, 4: 79, 6: 77, 8: 74, 12: 77, 16: 79, 18: 81, 20: 84, 24: 79, 28: 77 };
                if (xuan[s]) {
                    pianoAt(xuan[s], 0.145, t);
                    if (s % 4 === 0) softFluteAt(xuan[s], 0.85, 0.048, t);
                }
            }
        },
        // 15. Code Cat: Cozy Lo-Fi Hip-Hop Study Beat (Felt Jazz Piano + Nylon Guitar + Soft Boom-Bap)
        'code-cat': {
            sec: 0.21, len: 32,
            tick: (s, t) => {
                const p = s % 16;
                if (p === 0 || p === 7 || p === 10) softKickAt(0.16, t);
                if (p === 4 || p === 12) noiseAt('bandpass', 1800, 1100, 1.1, 0.075, 0.055, t, bgmGain);
                if (s % 2 === 0) softBrushAt(0.020, 0.03, t);
                const chords = [
                    [53, 57, 60, 64], // Fmaj7
                    [52, 55, 59, 62], // Em7
                    [50, 53, 57, 60], // Dm7
                    [48, 52, 55, 59]  // Cmaj7
                ];
                if (s % 8 === 0) pianoChordAt(chords[Math.floor(s / 8)], 0.155, t, 0.03);
                const lofi = { 2: 72, 5: 76, 9: 74, 14: 69, 18: 72, 21: 74, 25: 76, 28: 72 };
                if (lofi[s]) stringAt('guitar', lofi[s], 0.11, t);
            }
        },
        // 16. Pixel Knight: [RETRO 8-BIT] Clean, Pleasant 4-Channel NES Adventure Theme
        'pixel-knight': {
            sec: 0.14, len: 32,
            tick: (s, t) => {
                const roots = [48, 43, 45, 41];
                const r = roots[Math.floor(s / 8)];
                if (s % 2 === 0) toneAt('triangle', m2f(s % 4 === 0 ? r : r + 12), m2f(s % 4 === 0 ? r : r + 12), 0.11, 0.11, t, bgmGain);
                const arpOffsets = [12, 16, 19, 24];
                toneAt('square', m2f(r + arpOffsets[s % 4]), m2f(r + arpOffsets[s % 4]), 0.08, 0.024, t, bgmGain, 2200);
                if (s % 8 === 4) noiseAt('bandpass', 1800, 900, 1.0, 0.06, 0.06, t, bgmGain);
                const nes = { 0: 72, 2: 76, 4: 79, 6: 84, 8: 83, 12: 79, 16: 81, 18: 76, 20: 72, 24: 77, 26: 79, 28: 83 };
                if (nes[s]) toneAt('square', m2f(nes[s]), m2f(nes[s]), 0.19, 0.048, t, bgmGain, 2600);
            }
        },
        // 17. Cloud Whale: Soaring Studio-Ghibli Felt Grand Piano & Concert Harp Waltz
        'cloud-whale': {
            sec: 0.24, len: 24,
            tick: (s, t) => {
                const bars = [[53, 60, 64, 69], [55, 59, 62, 67], [52, 59, 64, 67], [45, 52, 57, 64]];
                const c = bars[Math.floor(s / 6)];
                const beat = s % 6;
                if (beat === 0) {
                    pianoAt(c[0], 0.145, t);
                    warmPadAt([c[0], c[2], c[3]], 1.45, 0.055, t);
                }
                const pat = [0, 1, 2, 3, 2, 1];
                stringAt('harp', c[pat[beat]] + 12, 0.08, t);
                const sky = { 0: 76, 3: 79, 6: 83, 9: 81, 12: 79, 15: 76, 18: 81, 21: 79 };
                if (sky[s]) pianoAt(sky[s], 0.165, t);
            }
        },
        // 18. Halloween Pumpkin: FIXED! Enchanting "Coraline" Moonlight Felt Piano & Music-Box Nocturne!
        'halloween-pumpkin': {
            sec: 0.23, len: 24, // Smooth 3/4 Mysterious Fairy-Tale Waltz (Zero harsh buzz!)
            tick: (s, t) => {
                const bars = [[45, 52, 57, 60], [41, 48, 53, 57], [50, 57, 62, 65], [40, 47, 52, 56]]; // Am - F - Dm - E
                const c = bars[Math.floor(s / 6)];
                const beat = s % 6;
                if (beat === 0) {
                    bassAt(c[0] - 12, 1.3, 0.13, t);
                    warmPadAt([c[1], c[2]], 1.35, 0.048, t);
                }
                const waltzPat = [0, 1, 2, 3, 2, 1];
                pianoAt(c[waltzPat[beat]], beat === 0 ? 0.12 : 0.075, t);

                const magic = { 0: 76, 2: 77, 4: 76, 6: 81, 10: 76, 12: 77, 14: 76, 16: 74, 18: 76 };
                if (magic[s]) {
                    pianoAt(magic[s], 0.15, t);
                    celestaAt(magic[s] + 12, 0.75, 0.042, t);
                }
            }
        },
        // 19. Mid-Autumn Carp: Moonlit Lotus Pond (Flowing Nylon Guitar, Silk Đàn Tranh & Felt Piano)
        'midautumn-carp': {
            sec: 0.25, len: 32,
            tick: (s, t) => {
                const bars = [[55, 62, 67, 71], [52, 59, 64, 67], [48, 55, 60, 64], [50, 57, 62, 66]];
                const c = bars[Math.floor(s / 8)];
                const sub = s % 8;
                if (sub === 0) {
                    warmPadAt([c[0], c[1], c[2]], 2.0, 0.052, t);
                    stringAt('guitar', c[0] - 12, 0.13, t);
                }
                const pat = [0, 1, 2, 3, 2, 1, 2, 3];
                stringAt('zither', c[pat[sub]], 0.082, t);
                const moon = { 0: 79, 4: 76, 6: 74, 8: 76, 12: 71, 16: 72, 20: 74, 24: 76, 28: 74 };
                if (moon[s]) pianoAt(moon[s], 0.155, t);
            }
        },
        // 20. Valentine Cupid: Intimate Fingerstyle Nylon Guitar & Romantic Felt Jazz Piano Ballad!
        'valentine-cupid': {
            sec: 0.24, len: 32,
            tick: (s, t) => {
                const bars = [[53, 57, 60, 64], [55, 59, 62, 65], [52, 55, 59, 64], [57, 60, 64, 67]];
                const c = bars[Math.floor(s / 8)];
                const sub = s % 8;
                if (sub === 0) bassAt(c[0] - 12, 1.8, 0.125, t);
                const finger = [0, 1, 2, 3, 2, 1, 2, 3];
                stringAt('guitar', c[finger[sub]], 0.095, t);
                const rom = { 2: 76, 5: 77, 8: 74, 14: 72, 18: 74, 21: 76, 24: 79, 28: 76 };
                if (rom[s]) pianoAt(rom[s], 0.155, t);
            }
        },
        // 21. Summer Corgi: Breezy Acoustic Beach Guitar, Ukulele & Gentle Ocean Surf
        'summer-corgi': {
            sec: 0.21, len: 32,
            tick: (s, t) => {
                if (s === 0) noiseAt('lowpass', 440, 220, 0.75, 2.8, 0.036, t, bgmGain);
                const bars = [[48, 55, 60, 64], [43, 50, 55, 59], [45, 52, 57, 60], [41, 48, 53, 57]];
                const c = bars[Math.floor(s / 8)];
                const sub = s % 8;
                if (sub === 0 || sub === 4) bassAt(c[0] - 12, 0.8, 0.125, t);
                if (sub === 2 || sub === 6) strumAt('ukulele', [c[1] + 12, c[2] + 12, c[3] + 12], 0.095, t, 0.018);
                const sunny = { 0: 76, 3: 79, 6: 81, 8: 79, 12: 74, 16: 76, 19: 79, 22: 84, 24: 81, 28: 79 };
                if (sunny[s]) stringAt('guitar', sunny[s], 0.135, t);
            }
        }
    };

    // ========================================================
    // HARDWARE-CLOCK LOOKAHEAD SCHEDULER (0.000ms Jitter!)
    // ========================================================
    function stopBgm() {
        if (lookaheadTimer) {
            clearInterval(lookaheadTimer);
            lookaheadTimer = null;
        }
    }

    function schedulerLoop() {
        if (!ctx || !state.enabled || !state.bgmEnabled) return;
        if (ctx.state === 'suspended') return;

        const eng = BGM_ENGINES[state.themeId] || BGM_ENGINES['jade-dragon'];
        // If tab was backgrounded and fell behind >0.5s, resync smoothly without burst
        if (nextStepTime < ctx.currentTime - 0.35) {
            nextStepTime = ctx.currentTime + 0.04;
        }

        // Schedule all notes falling within the next 220ms onto the hardware audio clock!
        while (nextStepTime < ctx.currentTime + 0.22) {
            try {
                eng.tick(bgmStep % eng.len, nextStepTime);
            } catch (e) {}
            nextStepTime += eng.sec;
            bgmStep++;
        }
    }

    function restartBgmIfNeeded() {
        stopBgm();
        if (!state.enabled || !state.bgmEnabled) return;
        const c = ensureContext();
        if (!c) return;
        bgmStep = 0;
        nextStepTime = c.currentTime + 0.05;
        schedulerLoop();
        lookaheadTimer = setInterval(schedulerLoop, 55);
    }

    function wireUserGestureUnlock() {
        if (unlockWired || typeof document === 'undefined') return;
        unlockWired = true;
        const unlock = () => {
            if (!state.enabled || (!state.sfxEnabled && !state.bgmEnabled)) return;
            if (ctx && ctx.state === 'suspended') {
                ctx.resume().then(() => {
                    if (state.bgmEnabled && !lookaheadTimer) restartBgmIfNeeded();
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
        } else if (prevTheme !== state.themeId || !prevBgm || !prevEnabled || !lookaheadTimer) {
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
        if (!prevFx && fxGain) fxGain.gain.setValueAtTime(0.90, c.currentTime);
        if (masterGain && !state.enabled) masterGain.gain.setValueAtTime(0.65, c.currentTime);
        try {
            keyToggle++;
            fn(false);
            setTimeout(() => { keyToggle++; try { fn(false); } catch (e) {} }, 140);
            setTimeout(() => {
                keyToggle++;
                try { fn(true); } catch (e) {}
                setTimeout(() => syncGainValues(), 480);
            }, 300);
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
