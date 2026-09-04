# Practice Lab

**Created by Claude** — built with [Claude Code](https://claude.com/claude-code).

Small single-page tools for the maths and mechanics behind game code. Each one lets you
write the answer yourself, draws what you wrote, and tells you when it only works by accident.

Published with GitHub Pages at <https://volodymyrbaisa.github.io/practice-lab/>. The root
page builds its menu and cards from the folders on disk — adding a folder is the only
step needed to make a new entry appear.

There are two collections. **Practices** (`practices/`) are the drills: you write the
answer, the page draws it and grades it. **References** (`references/`) are look-up
material — no grading, no answer to write. They share the same folder shape and the same
`meta.json`, and both are listed on the root page under their own heading.

## Adding a practice or a reference

Every entry is a self-contained folder. No build tooling, no framework, no shared
runtime — a page must open correctly on its own.

```
practices/                  references/
  your-practice-id/           your-reference-id/
    meta.json                   meta.json     same fields, same rules
    index.html                  index.html
```

Put it under `practices/` if the reader has to produce an answer the page can check.
Put it under `references/` if they are looking something up.

`meta.json`:

```json
{
  "id": "your-practice-id",
  "menu": "Short menu label",
  "title": "The Page Name",
  "summary": "One or two sentences on what you actually do on the page.",
  "why": "The mistake or confusion this exists to fix. Be specific about the failure.",
  "topics": ["vectors", "unreal"],
  "added": "2026-09-03",
  "entry": "index.html"
}
```

| Field     | Required | Notes                                                          |
| --------- | -------- | -------------------------------------------------------------- |
| `id`      | yes      | Must match the folder name exactly.                             |
| `menu`    | yes      | Sidebar label. Keep it to two or three words.                   |
| `title`   | yes      | Card heading and the page's own `<title>`.                      |
| `summary` | yes      | What you do on the page.                                        |
| `why`     | yes      | Why it exists — the specific mistake it targets.                |
| `topics`  | no       | Tags shown on the card. Name the concept, not an engine release.|
| `added`   | yes      | `YYYY-MM-DD`. Cards sort newest first; the newest is featured.  |
| `entry`   | no       | Defaults to `index.html`.                                       |

Then regenerate the index:

```bash
node tools/build-index.mjs
```

That writes `assets/manifest.js` (which sets `window.PRACTICES` and `window.REFERENCES`)
along with `practices/index.json` and `references/index.json`. All three are committed so
the site works when opened straight from disk, and the Pages workflow regenerates them on
every push — so if you forget to run it locally, the deployed site is still correct.

The script refuses an entry whose `meta.json` is missing a required field, whose `id`
does not match its folder, or whose entry file is absent. It reports the problem and
exits non-zero, which fails the build rather than quietly dropping the page.

## Local preview

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly from disk also works,
because the manifest is a plain script rather than a `fetch`.

## House rules for a page

- **Standalone.** One HTML file, its own styles and script inside it. Fonts from Google
  Fonts are fine; nothing else external.
- **Light and dark.** Define the full palette on `:root`, override it under
  `prefers-color-scheme: dark`, and set an explicit `background` on `body`.
- **Working at rest.** The page opens in a usable state with example values already in
  place, never an empty shell.
- **Check against more than one case.** If the page grades an answer, grade it at several
  randomised inputs, or against several situations. An answer that is right for the one
  arrangement on screen and wrong everywhere else is the exact bug these pages exist to
  catch. This rule is what makes something a practice rather than a reference.
