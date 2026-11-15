# Happy Thanksgiving 🦃

A turkey landing page with Cosmic tucked behind a shortcut. One Node server runs both on port 1621.

## Quick start

```bash
cd happy-thanksgiving   # the folder that contains package.json and index.js
pnpm install
pnpm start
```

Open http://localhost:1621 for the turkey. Press `,` twice quickly to open Cosmic, which also lives at `/cosmic`.

While editing, `pnpm dev` restarts the server whenever you save `index.js`. Changes inside `static/` only need a browser refresh.

If you see `ERR_PNPM_NO_SCRIPT_OR_SERVER`, pnpm is running in a folder that does not have this `package.json`. `cd` into the folder that holds it and try again.

## Make it yours

| To change | Edit |
| --- | --- |
| Greeting text | `static/index.html` |
| Colors, fonts, sizes | the `:root` tokens and rules in `static/thanksgiving.css` |
| Turkey and tail colors | the `--c` values on the feathers in `static/index.html` |
| Shortcut key, number of presses, timing | `SHORTCUT` at the top of `static/thanksgiving.js` |
| Port | the `PORT` environment variable, or the default in `index.js` |
| Cosmic routes | `index.js` |

The turkey gobbles when clicked, and a countdown line appears in the 60 days before Thanksgiving (the fourth Thursday of November).

## Host it

- **Anything that runs Node** (Render, Railway, Fly, a VPS): runs the full site, turkey and Cosmic. `Dockerfile` and `render.yaml` are included.
- **GitHub Pages**: Pages only serves static files and cannot run the Cosmic server, so `.github/workflows/deploy.yml` publishes just the landing page, and the double comma does nothing there. Push to `main` and set **Settings → Pages → Source** to **GitHub Actions**.

## Files

- `index.js` – Express and Bare server, port 1621
- `static/index.html`, `static/thanksgiving.css`, `static/thanksgiving.js` – the landing page
- `static/cosmic.html` – Cosmic home (previously `index.html`)
- `static/` – the rest of Cosmic
- `LICENSE` – Cosmic is GPL-3.0
