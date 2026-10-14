// 3D hologram of the ASCII avatar, projected in the top-right corner.
(() => {
    const host = document.getElementById('hologram');
    const canvas = document.getElementById('hologram-canvas');
    const ctx = canvas.getContext('2d');
    const GLYPHS = '01<>/\\{}[]#%@*+=';
    const FOCAL = 520;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const rows = AVATAR_ASCII.length;
    const cols = Math.max(...AVATAR_ASCII.map(l => l.length));

    // One point per non-blank glyph. Depth combines a per-row cylinder (so the bust
    // turns like a solid) with brightness (so the face has relief).
    const points = [];
    AVATAR_ASCII.forEach((line, r) => {
        const first = line.search(/\S/);
        if (first < 0) return;
        const center = cols / 2;
        const half = Math.max(center - first, line.length - center) + 1;
        for (let c = first; c < line.length; c++) {
            const ch = line[c];
            if (ch === ' ') continue;
            const lum = AVATAR_RAMP.indexOf(ch) / (AVATAR_RAMP.length - 1);
            const dx = (c - center) / half;
            const round = Math.sqrt(Math.max(0, 1 - dx * dx));
            points.push({ ch, lum, c: c - center, r: r - rows / 2, round, half });
        }
    });

    let W = 0, H = 0, cell = 0, glitchUntil = 0, glitchRow = 0, glitchShift = 0;
    const pointer = { x: 0, y: 0 };

    function resize() {
        const rect = host.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        W = rect.width;
        H = rect.height;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cell = (W * 0.8) / cols;
    }

    function drawBase(t) {
        const cx = W / 2;
        const by = H - 34;
        const rx = W * 0.34;

        // Light cone rising from the emitter
        const cone = ctx.createLinearGradient(0, by, 0, by - H * 0.75);
        cone.addColorStop(0, 'rgba(34, 211, 238, 0.22)');
        cone.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = cone;
        ctx.beginPath();
        ctx.moveTo(cx - rx * 0.55, by);
        ctx.lineTo(cx - W * 0.48, by - H * 0.75);
        ctx.lineTo(cx + W * 0.48, by - H * 0.75);
        ctx.lineTo(cx + rx * 0.55, by);
        ctx.closePath();
        ctx.fill();

        ctx.lineWidth = 1;
        [1, 0.7, 0.42].forEach((k, i) => {
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.55 - i * 0.12})`;
            ctx.setLineDash(i === 1 ? [6, 5] : i === 2 ? [2, 4] : []);
            ctx.lineDashOffset = (i % 2 ? -1 : 1) * t * 18;
            ctx.beginPath();
            ctx.ellipse(cx, by, rx * k, rx * k * 0.22, 0, 0, Math.PI * 2);
            ctx.stroke();
        });
        ctx.setLineDash([]);

        const glow = ctx.createRadialGradient(cx, by, 0, cx, by, rx * 0.5);
        glow.addColorStop(0, 'rgba(165, 243, 252, 0.9)');
        glow.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.ellipse(cx, by, rx * 0.5, rx * 0.11, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    function frame(now) {
        // Hidden on small screens: keep ticking so it reappears on resize.
        if (!W) { if (!reduceMotion) requestAnimationFrame(frame); return; }
        const t = now / 1000;
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';
        drawBase(t);

        const yaw = (reduceMotion ? 0.35 : Math.sin(t * 0.55) * 0.5) + pointer.x * 0.25;
        const pitch = (reduceMotion ? 0 : Math.sin(t * 0.37) * 0.06) + pointer.y * 0.12;
        const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
        const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
        const flicker = reduceMotion ? 1 : 0.88 + Math.random() * 0.12;
        const scan = ((t * 0.3) % 1.3 - 0.15) * rows - rows / 2;

        if (!reduceMotion && now > glitchUntil && Math.random() < 0.012) {
            glitchUntil = now + 90 + Math.random() * 160;
            glitchRow = Math.random() * rows - rows / 2;
            glitchShift = (Math.random() - 0.5) * 18;
        }
        const glitching = now < glitchUntil;

        const cx = W / 2;
        const cy = (H - 60) / 2 + 4;
        const bob = reduceMotion ? 0 : Math.sin(t * 1.3) * 3;
        ctx.font = `${Math.max(6, Math.round(cell * 1.55))}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (const p of points) {
            const x = p.c * cell;
            const y = p.r * cell * 2;
            const z = p.round * p.half * cell * 0.85 + p.lum * cell * 2.2;

            const x1 = x * cosY + z * sinY;
            const z1 = z * cosY - x * sinY;
            const y1 = y * cosP - z1 * sinP;
            const z2 = z1 * cosP + y * sinP;
            const s = FOCAL / (FOCAL - z2);

            let px = cx + x1 * s;
            const py = cy + y1 * s + bob;
            const onScan = Math.abs(p.r - scan) < 1.2;
            const onGlitch = glitching && Math.abs(p.r - glitchRow) < 2.5;
            if (onGlitch) px += glitchShift;

            const facing = 0.55 + 0.45 * Math.max(0, z2 / (p.half * cell * 0.85 + cell * 2.2));
            const alpha = (0.25 + p.lum * 0.75) * facing * flicker * (onScan ? 1.8 : 1);
            const ch = onGlitch || (!reduceMotion && Math.random() < 0.004)
                ? GLYPHS[(Math.random() * GLYPHS.length) | 0]
                : p.ch;

            if (onGlitch) {
                ctx.fillStyle = `rgba(244, 114, 182, ${alpha * 0.6})`;
                ctx.fillText(ch, px - 2, py);
            }
            ctx.fillStyle = onScan
                ? `rgba(207, 250, 254, ${Math.min(1, alpha)})`
                : `rgba(${80 + p.lum * 90 | 0}, ${200 + p.lum * 50 | 0}, 255, ${Math.min(1, alpha)})`;
            ctx.fillText(ch, px, py);
        }

        // Scanlines carved out of the drawing only, so the page behind stays untouched
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        for (let y = (t * 12) % 3; y < H; y += 3) ctx.fillRect(0, y, W, 1);

        ctx.globalCompositeOperation = 'source-over';
        if (!reduceMotion) requestAnimationFrame(frame);
    }

    window.addEventListener('pointermove', (e) => {
        pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    window.addEventListener('resize', resize);

    resize();
    document.fonts.ready.then(() => requestAnimationFrame(frame));
})();
