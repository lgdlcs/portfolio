(() => {
    const output = document.getElementById('output');
    const input = document.getElementById('input');
    const terminal = document.getElementById('terminal');
    const history = [];
    let histIdx = -1;

    function printLine(text, cls, link) {
        const div = document.createElement('div');
        div.className = 'line' + (cls ? ' ' + cls : '');
        if (link) {
            const a = document.createElement('a');
            a.href = link;
            a.target = '_blank';
            a.rel = 'noopener';
            a.textContent = text;
            div.appendChild(a);
        } else {
            div.textContent = text;
        }
        output.appendChild(div);
    }

    function printCommand(cmd) {
        const div = document.createElement('div');
        div.className = 'line cmd-echo';
        div.innerHTML = `<span class="prompt-echo">visitor@lgdlcs ~ $&nbsp;</span><span class="cmd-text">${escapeHtml(cmd)}</span>`;
        output.appendChild(div);
    }

    function escapeHtml(s) {
        return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function scrollBottom() {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    // Claude Code style "thinking" spinner shown before each answer
    const SPINNER = ['·', '✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳', '✢'];
    let thinking = null;

    function think(done) {
        const word = THINKING_WORDS[Math.floor(Math.random() * THINKING_WORDS.length)];
        const duration = 600 + Math.random() * 900;
        const start = performance.now();
        const div = document.createElement('div');
        div.className = 'line thinking';
        output.appendChild(div);
        scrollBottom();

        let frame = 0;
        const render = () => {
            const secs = ((performance.now() - start) / 1000).toFixed(1);
            div.innerHTML = `<span class="spinner">${SPINNER[frame++ % SPINNER.length]}</span> ${word}… <span class="dim">(${secs}s · esc to interrupt)</span>`;
        };
        render();
        const timer = setInterval(render, 120);

        const finish = (interrupted) => {
            clearInterval(timer);
            clearTimeout(timeout);
            thinking = null;
            const secs = ((performance.now() - start) / 1000).toFixed(1);
            div.className = 'line dim';
            div.textContent = interrupted ? '⎿  Interrupted by user. Rude.' : `✻ ${word}… done in ${secs}s`;
            if (!interrupted) done();
            scrollBottom();
        };
        const timeout = setTimeout(() => finish(false), duration);
        thinking = { interrupt: () => finish(true) };
    }

    function execute(raw) {
        const trimmed = raw.trim();
        if (!trimmed || thinking) return;

        printCommand(trimmed);
        history.unshift(trimmed);
        histIdx = -1;

        // special: clear
        if (trimmed.toLowerCase() === 'clear') {
            output.innerHTML = '';
            return;
        }

        think(() => run(trimmed));
    }

    function run(trimmed) {
        const lower = trimmed.toLowerCase();

        // special: rm -rf /
        if (lower === 'rm -rf /' || lower === 'rm -rf / --no-preserve-root') {
            COMMANDS['rm -rf /']().forEach(l => printLine(l.text, l.cls, l.link));
            scrollBottom();
            return;
        }

        // special: snake
        if (lower === 'snake') {
            printLine('Starting Snake... Press q to quit.', 'dim');
            scrollBottom();
            setTimeout(() => Snake.init(), 200);
            return;
        }

        // special: exit / q (when not in snake)
        if (lower === 'exit' || lower === 'q') {
            if (Snake.isActive()) { Snake.quit(); return; }
            printLine('There is no escape. Type help for commands.', 'dim');
            scrollBottom();
            return;
        }

        // special: matrix
        if (lower === 'matrix') {
            startMatrix();
            scrollBottom();
            return;
        }

        // echo with args
        if (lower.startsWith('echo ')) {
            const result = COMMANDS.echo(trimmed.slice(5));
            result.forEach(l => printLine(l.text, l.cls, l.link));
            scrollBottom();
            return;
        }

        // sudo with anything
        if (lower.startsWith('sudo')) {
            COMMANDS.sudo().forEach(l => printLine(l.text, l.cls, l.link));
            scrollBottom();
            return;
        }

        // normal commands
        const cmd = COMMANDS[lower];
        if (cmd) {
            cmd().forEach(l => printLine(l.text, l.cls, l.link));
        } else {
            printLine(`command not found: ${trimmed}. Type help for available commands.`, 'dim');
        }
        scrollBottom();
    }

    // Matrix rain effect
    function startMatrix() {
        const mc = document.getElementById('matrix-canvas');
        mc.style.display = 'block';
        mc.width = window.innerWidth;
        mc.height = window.innerHeight;
        const mctx = mc.getContext('2d');
        const cols = Math.floor(mc.width / 14);
        const drops = Array(cols).fill(0);
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

        const mInterval = setInterval(() => {
            mctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            mctx.fillRect(0, 0, mc.width, mc.height);
            mctx.fillStyle = '#4ade80';
            mctx.font = '14px JetBrains Mono, monospace';
            for (let i = 0; i < cols; i++) {
                const ch = chars[Math.floor(Math.random() * chars.length)];
                mctx.fillText(ch, i * 14, drops[i] * 14);
                if (drops[i] * 14 > mc.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }, 33);

        setTimeout(() => {
            clearInterval(mInterval);
            mc.style.display = 'none';
            input.focus();
        }, 5000);
    }

    // Tab autocomplete
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const val = input.value.toLowerCase();
            if (!val) return;
            const matches = [...COMMAND_NAMES, 'snake', 'matrix', 'clear'].filter(c => c.startsWith(val));
            if (matches.length === 1) input.value = matches[0];
        }
        // History
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx]; }
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (histIdx > 0) { histIdx--; input.value = history[histIdx]; }
            else { histIdx = -1; input.value = ''; }
        }
        if (e.key === 'Escape' && thinking) thinking.interrupt();
        if (e.key === 'Enter') {
            const val = input.value;
            input.value = '';
            execute(val);
        }
    });

    // Click anywhere to focus input
    terminal.addEventListener('click', () => input.focus());

    // Auto-type help on load
    function autoType(text, i) {
        if (i <= text.length) {
            input.value = text.slice(0, i);
            setTimeout(() => autoType(text, i + 1), 80);
        } else {
            setTimeout(() => {
                input.value = '';
                execute(text);
            }, 300);
        }
    }

    // Welcome
    printLine('Welcome to LgdLcs\'s terminal portfolio.', 'accent');
    printLine('Type a command or just explore. Tab to autocomplete.', 'dim');
    printLine('');
    setTimeout(() => autoType('help', 0), 600);
})();
