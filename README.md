# AquaYield

A two-part prototype for an AI-assisted RAS (recirculating aquaculture
system) monitoring product: a live sensor dashboard and a 3D device
simulation, kept in sync in real time in the browser.

## Structure

```
dashboard/            # Tank monitoring dashboard (charts, alerts, AI assistant)
  index.html
  css/styles.css
  js/app.js
  js/config.example.js  # template for the AI config — copy to config.js
  js/config.js           # NOT committed — your real Groq API key goes here

simulation/            # 3D device/tank mockup (Three.js)
  index.html
  css/styles.css
  js/app.js

_original_single_file_backup/   # old single-file versions, kept locally only
                                 # (git-ignored — see "Before this cleanup" below)
```

## Running it

Both pages talk to each other over `BroadcastChannel`/`localStorage`, which
only works when they're served from the same origin — opening the raw
files with `file://` will not sync. Serve the folder locally, e.g.:

```bash
python3 -m http.server 8000
```

Then open:
- `http://localhost:8000/dashboard/index.html`
- `http://localhost:8000/simulation/index.html`

in two tabs. Moving a slider in the simulation panel updates the
dashboard live, and vice versa.

## AI assistant setup

The dashboard's "Ask AquaYield AI" panel calls the Groq API directly from
the browser. To use it locally:

1. Get a key at https://console.groq.com/keys
2. Copy `dashboard/js/config.example.js` to `dashboard/js/config.js`
3. Paste your key into `dashboard/js/config.js`

`dashboard/js/config.js` is git-ignored, so your key never gets committed.

**Important:** this calls Groq directly from client-side JavaScript, so
even with the key kept out of git, anyone who opens the deployed page and
looks at devtools/view-source can read the key straight out of the page
and use your quota. That's acceptable for local development or a private
prototype, but **do not deploy this dashboard publicly as-is** with a
real key in `config.js` — first put the Groq call behind a small backend
that holds the key server-side and proxies the request.

## Before this cleanup

This started as two single-file HTML prototypes with all CSS/JS inline,
including a Groq API key hardcoded in plain text. Those originals are
kept in `_original_single_file_backup/` for local reference and are
git-ignored. **If that key was ever exposed anywhere (shared, uploaded,
etc.), rotate it at https://console.groq.com/keys** — the one that was
in the original file should be treated as compromised regardless of what
happens to this repo.
