const COMMANDS = {
    help: () => [
        { text: 'Available commands:', cls: 'accent' },
        { text: '' },
        { text: '  help        Show this message' },
        { text: '  about       Who am I' },
        { text: '  projects    Things I\'ve built' },
        { text: '  stack       Tech I use' },
        { text: '  contact     Get in touch' },
        { text: '  clear       Clear the terminal' },
        { text: '  secret      🤫' },
        { text: '' },
        { text: 'Tip: use ↑/↓ for history, Tab for autocomplete', cls: 'dim' },
    ],

    about: () => [
        { text: 'Lucas \'LLD\' Legrand — Developer & builder.', cls: 'accent' },
        { text: '' },
        { text: 'Based in France, near Annecy (French Alps).' },
        { text: 'Building side projects, shipping fast, learning by doing.' },
        { text: 'Currently exploring mobile apps, web platforms, and AI tooling.' },
    ],

    projects: () => [
        { text: 'Projects (2026)', cls: 'accent' },
        { text: '' },
        { text: '🎬 snipvid        — Auto photo-to-video editor for events', link: 'https://github.com/lgdlcs/snipvid' },
        { text: '🎿 ski-platform   — Ski resort conditions & weather aggregator', link: 'https://github.com/lgdlcs/ski-platform' },
        { text: '🥙 meat-grill     — Restaurant showcase website', link: 'https://github.com/lgdlcs/meat-grill' },
        { text: '🪂 aero-bi        — Paragliding & speed riding school website', link: 'https://github.com/lgdlcs/aero-bi' },
        { text: '📰 limedia        — Media content platform (WIP)', link: 'https://github.com/lgdlcs/limedia' },
        { text: '🎮 videoGame      — Game project (WIP)', link: 'https://github.com/lgdlcs/videoGame' },
        { text: '🛤️  ThePath        — Personal project (WIP)', link: 'https://github.com/lgdlcs/ThePath' },
    ],

    stack: () => [
        { text: 'Tech Stack', cls: 'accent' },
        { text: '' },
        { text: 'Frontend    → Next.js, React, Tailwind CSS, TypeScript' },
        { text: 'Mobile      → Flutter, Dart' },
        { text: 'Backend     → Cloudflare Workers, Supabase, Firebase' },
        { text: 'Tools       → Git, VS Code, Vercel, GitHub Actions' },
        { text: 'AI          → OpenClaw, Claude' },
    ],

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
        { text: 'about.txt    projects.md    stack.json    contact.txt', cls: 'dim' },
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
