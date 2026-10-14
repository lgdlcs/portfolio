# LgdLcs — Terminal Portfolio

Interactive terminal-style portfolio website. Pure HTML/CSS/JS, no dependencies.

## Commands

| Command | Description |
|---------|-------------|
| `help` | List available commands |
| `about` | Short bio |
| `avatar` | ASCII-digitized profile picture |
| `projects` | Projects list |
| `stack` | Tech stack |
| `contact` | Links |
| `clear` | Clear terminal |
| `snake` | 🐍 Play Snake |
| `matrix` | Matrix rain effect |

## Avatar & hologram

`img/avatar.png` is digitized into `js/avatar.js` by `python tools/ascii-avatar.py` (needs Pillow).
The same ASCII rows feed the `avatar` command and the rotating 3D hologram in the top-right corner (`js/hologram.js`).

## Deploy

Push to GitHub and enable GitHub Pages from Settings → Pages → main branch.

## License

MIT
