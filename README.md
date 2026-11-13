# Shyam Yadav — Portfolio

Plain HTML/CSS/JS. No build step.

## Run locally

```bash
python -m http.server 5500
```

Then open http://localhost:5500

## Files

| File | What's in it |
| --- | --- |
| `index.html` | All the content: hero, projects, about, stats, experience, contact |
| `styles.css` | Colors (top of file, `:root`), layout, animations |
| `script.js`  | Hero sphere, scrambling role word, scroll reveals, theme toggle, contact form |
| `resume.pdf` | Local only (git-ignored) — contains your phone number |
| `assets/projects/` | Project screenshots (WebP, ~1100px wide) shown in the device frames |
| `assets/icons/`    | Tech logos for the "My stack" section (devicon / simple-icons SVGs) |

## Things still to fill in (search `EDIT` in index.html)

- Your photo: replace the `photo-placeholder` div with `<img src="assets/me.jpg" alt="Shyam Yadav">`

To change a project screenshot, drop a new image in `assets/projects/` and update the `<img>` inside that
project's `.screen`. Add `screen--scroll` to the `.screen` for tall full-page shots: they scroll on hover.
To add a tool to the stack, copy an `<li>` in the `#stack` section and put its SVG in `assets/icons/`.

Change the rotating hero words in `script.js` (`const roles = [...]`).
Change the accent color with `--accent` / `--accent-2` in `styles.css`.

## Deploy (free)

- **GitHub Pages:** push this folder to a repo → Settings → Pages → deploy from `main`.
- **Netlify / Vercel:** drag and drop the folder, or import the repo.

Note: `resume.pdf` is git-ignored because it includes your phone number. To add a Résumé button, make a
phone-free PDF, remove `resume.pdf` from `.gitignore`, and point the hero's second button at `resume.pdf`.
