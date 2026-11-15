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

## Play with the turkey

- Click or tap the **head** to make it gobble, the **belly** to tickle it, the **hat** to tip it, the **wings** to flap, the **feet** to hop.
- Click a **tail feather** to ruffle it and cycle its color.
- The eyes follow your pointer, and it blinks now and then.
- **Feed** drops corn into its beak, and its belly grows with each kernel. **Colors** swaps the whole tail between four palettes. **Hat** takes the hat off and on.
- **Hat** cycles Pilgrim, Chef, Party and None. **Strut** fans the tail out or lets it relax.
- Feed gives it corn, pie, apples or grapes. Its head tilts toward your pointer, it falls asleep after 25 quiet seconds, and eight quick clicks make it dizzy.
- It remembers its colors, hat and treats between visits (saved in your browser).
- **Sound** is off until you turn it on. The gobble is synthesized in the browser, so there are no audio files.

Everything lives in `static/thanksgiving.js`. Add phrases to `PHRASES`, palettes to `THEMES`, or new click reactions to the `parts` object.

## Host it

- **Anything that runs Node** (Render, Railway, Fly, a VPS): runs the full site, turkey and Cosmic. `Dockerfile` and `render.yaml` are included.
- **GitHub Pages**: Pages only serves static files and cannot run the Cosmic server, so `.github/workflows/deploy.yml` publishes just the landing page, and the double comma does nothing there. Push to `main` and set **Settings → Pages → Source** to **GitHub Actions**.

## Files

- `index.js` – Express and Bare server, port 1621
- `static/index.html`, `static/thanksgiving.css`, `static/thanksgiving.js` – the landing page
- `static/cosmic.html` – Cosmic home (previously `index.html`)
- `static/` – the rest of Cosmic
- `LICENSE` – Cosmic is GPL-3.0
