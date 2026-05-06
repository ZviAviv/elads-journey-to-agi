# Elad's Journey to AGI

A crash course site on Claude Code Desktop, built for Elad.

## Run locally

Open `index.html` in any browser. No build step. No dependencies.

For the cleanest experience, serve over HTTP:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Edit content

- Each module is a standalone HTML file in `modules/`.
- Glossary is in `glossary.html`.
- Tips index is in `tips.html`.
- Shared styles in `styles.css`. Site behavior in `app.js`.

To add a new module: create `modules/17-your-module.html` (copy any existing module as a template), then add an entry to the `SECTIONS` array in `app.js`.

## Deploy

Connected to Netlify via the GitHub repo. Pushing to `main` triggers an auto-deploy.

`netlify.toml` configures the publish directory.

## Stack

Vanilla HTML, CSS, JS. No framework. No build. Inter (display) and JetBrains Mono (code) loaded from rsms.me and Google Fonts.
