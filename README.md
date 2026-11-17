# MohammedZIMS — Portfolio

Static, dependency-free portfolio (Tailwind via CDN). Dark/light theme, crimson laser scanner, floating quick menu.

## File structure

```
portfolio-site/
├── index.html          # Markup + <head> SEO/social metadata
├── style.css           # All styles (dark/light theme via CSS variables)
├── script.js           # All behavior (theme, nav, animations, filters, contact form)
├── README.md           # This file
└── assets/
    └── image/          # Place project thumbnails, avatar photo, and og-preview.png here
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Features

- **Show More Projects**: shows 6 cards first with "Showing 6 of 8 projects" and a **Show More Projects (+2)** button. It works with the filters, and **Show Less** collapses and scrolls back to the section. Change `PROJECT_LIMIT` in `script.js`.
- **Floating menu** (bottom-right, three vertical buttons):
  1. **Contact** opens a flyout with GitHub, LinkedIn, Facebook and Email brand icons.
  2. **Laser scan** toggles the crimson scanner on or off (saved).
  3. **Back to top** appears after scrolling, and its ring shows scroll progress.
- **Crimson laser**: scanner on the hero and about photos, hover scan on project thumbnails, scroll-progress beam under the header.
- **Cursor glow**: a soft crimson glow follows the mouse, plus a spotlight inside project and skill cards (desktop and fine pointers only).
- **Smooth motion**: hero entrance, staggered scroll reveals, eased card entrances and hover lifts. Honors the reduced-motion setting.
- **Mobile**: the hero portrait card and the about photo appear before their text on small screens.
- Dark/light theme, live Bangladesh clock, scroll-spy nav, project filters.

## Customize

- **Laser colour**: edit `--laser`, `--laser-deep`, `--laser-hot` at the top of `style.css`. Accent colour in the Tailwind config (`accent`) is in `index.html`.
- **Email / social links**: edit `CONFIG.email` in `script.js`. Social links live in the floating menu, contact section and footer of `index.html`.
- **Images**: the pages currently use remote image URLs. To use local files, drop them in `assets/image/` and change the `src` in `index.html`, e.g. `assets/image/avatar.jpg`. Add `og-preview.png` (1200x630) for link previews.
- **Canonical / OG URL**: update the `canonical` link in `index.html` to your real domain.

## Deploy

Push the folder to GitHub and enable Pages, or drag it onto Netlify / Vercel.
