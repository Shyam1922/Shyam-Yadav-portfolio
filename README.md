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
| `assets/`    | Put your photo and project screenshots here |

## Things still to fill in (search `EDIT` in index.html)

- GitHub and LinkedIn URLs (in the side nav)
- GitHub repo link for each project (`href="#"` buttons)
- Your photo: replace the `photo-placeholder` div with `<img src="assets/me.jpg" alt="Shyam Yadav">`
- Optional: swap a project's mock screen for a real screenshot (`<img>` inside `.screen`)

Change the rotating hero words in `script.js` (`const roles = [...]`).
Change the accent color with `--accent` / `--accent-2` in `styles.css`.

## Deploy (free)

- **GitHub Pages:** push this folder to a repo → Settings → Pages → deploy from `main`.
- **Netlify / Vercel:** drag and drop the folder, or import the repo.

Note: `resume.pdf` is git-ignored because it includes your phone number. To add a Résumé button, make a
phone-free PDF, remove `resume.pdf` from `.gitignore`, and point the hero's second button at `resume.pdf`.
