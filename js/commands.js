const COMMANDS = {
    help: () => [
        { text: 'Available commands:', cls: 'accent' },
        { text: '' },
        { text: '  help        Show this message' },
        { text: '  about       Who am I' },
        { text: '  avatar      My face, digitized' },
        { text: '  projects    Things I\'ve built' },
        { text: '  stack       Tech I use' },
        { text: '  contact     Get in touch' },
        { text: '  clear       Clear the terminal' },
        { text: '  secret      🤫' },
        { text: '' },
        { text: 'Tip: use ↑/↓ for history, Tab for autocomplete', cls: 'dim' },
    ],

    about: () => [
        { text: 'LgdLcs — Developer & builder.', cls: 'accent' },
        { text: '' },
        { text: 'Based in France, near Annecy (French Alps).' },
        { text: 'Building side projects, shipping fast, learning by doing.' },
        { text: 'Currently exploring mobile apps, web platforms, and AI tooling.' },
        { text: '' },
        { text: 'Sport', cls: 'accent' },
        { text: '  🏃 Running     4 marathons, PB 3h45 in Paris. ~1000 km a year.' },
        { text: '  🧗 Also        Climbing, swimming, cycling.' },
        { text: '' },
        { text: 'Family', cls: 'accent' },
        { text: '  👶 Dad since 2026 of a wonderful little girl.' },
    ],

    projects: () => [
        { text: 'Projects (2026)', cls: 'accent' },
        { text: '' },
        { text: '🔥 carte-incendies              — Real-time wildfire map of France: satellites, winds, forecasts', link: 'https://github.com/lgdlcs/carte-incendies' },
        { text: '🧰 my-claudecode-terminal-setup — Claude Code terminal touches: tab color, sound, statusline', link: 'https://github.com/lgdlcs/my-claudecode-terminal-setup' },
        { text: '🤖 agent-ship-fast              — Ship a SaaS on Stripe in minutes, driven by your AI agent', link: 'https://github.com/lgdlcs/agent-ship-fast' },
        { text: '🚀 cosmic-td                    — Auto-chess × tower defense in space, multiplayer browser game', link: 'https://github.com/lgdlcs/cosmic-td' },
        { text: '🗼 element-td-3d                — 3D elemental tower defense (WIP)', link: 'https://github.com/lgdlcs/element-td-3d' },
        { text: '🧩 alttab-components            — Vanilla scroll-driven web components gallery', link: 'https://github.com/lgdlcs/alttab-components' },
        { text: '⚔️ bravefable                   — Bravefable landing page', link: 'https://github.com/lgdlcs/bravefable' },
        { text: '🪂 aero-bi                      — Paragliding & speed riding school website', link: 'https://github.com/lgdlcs/aero-bi' },
    ],

    stack: () => [
        { text: 'Tech Stack', cls: 'accent' },
        { text: '' },
        { text: 'Frontend    → Bro do you even read code ?' },
        { text: 'Backend     → Bro do you even read code ?' },
        { text: 'Tools       → Git, Omarchy' },
        { text: 'AI          → OpenClaw, Claude Code, personal harness, status line' },
    ],

    avatar: () => AVATAR_ASCII.map(text => ({ text, cls: 'ascii' })),

    contact: () => [
        { text: 'Contact', cls: 'accent' },
        { text: '' },
        { text: 'GitHub      → github.com/lgdlcs', link: 'https://github.com/lgdlcs' },
        { text: 'Email       → legrand.lucas0@gmail.com', link: 'mailto:legrand.lucas0@gmail.com' },
    ],

    secret: () => [
        { text: '// Gaming stats — don\'t judge me', cls: 'dim' },
        { text: '' },
        { text: '🎮 Player profile', cls: 'accent' },
        { text: '' },
        { text: '  World of Warcraft   Since Burning Crusade (2007)' },
        { text: '  /played             ~365 days. Yes, days.', cls: 'dim' },
        { text: '' },
        { text: '  League of Legends   Since Season 2 (2012)' },
        { text: '  Hours played        ~5000h. No regrets.', cls: 'dim' },
        { text: '' },
        { text: '  Total time gaming   Enough to have built 10 startups 🫠' },
        { text: '' },
        { text: 'Psst... try typing the name of a classic game 🐍', cls: 'dim' },
    ],

    ls: () => [
        { text: 'about.txt    avatar.ascii    projects.md    stack.json    contact.txt', cls: 'dim' },
    ],

    sudo: () => [
        { text: 'Nice try 😏' },
    ],

    'rm -rf /': () => [
        { text: 'Not on my watch 🛡️' },
    ],

    whoami: () => [
        { text: 'visitor' },
    ],

    date: () => [
        { text: new Date().toString() },
    ],

    echo: (args) => [
        { text: args || '' },
    ],
};

const COMMAND_NAMES = Object.keys(COMMANDS).filter(c => c !== 'rm -rf /');

// Shown by the Claude Code style spinner before each answer
const THINKING_WORDS = [
    'Vibecoding', 'Prompt-whispering', 'Yak-shaving', 'Bikeshedding', 'Hallucinating responsibly',
    'Rubber-ducking', 'Spaghettifying', 'Centering a div', 'Negotiating with CSS', 'Deploying on a Friday',
    'Blaming the cache', 'Reticulating splines', 'Rewriting it in Rust', 'Grepping the void', 'Compiling excuses',
    'Herding subagents', 'Burning tokens', 'Stuffing the context window', 'Summoning Opus', 'Ignoring the linter',
    'Reading the docs (lol)', 'Mansplaining regex', 'Overengineering', 'Waking up the hamsters', 'Shipping it anyway',
    'Carb-loading', 'Hitting the wall at km 30', 'Chasing a sub-3h45', 'Chalking up', 'Clipping in',
    'Swimming in logs', 'Changing a diaper', 'Negotiating nap time', 'Running on 4h of sleep', 'Ricing Omarchy',
];
