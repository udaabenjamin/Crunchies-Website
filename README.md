# Crunchies Fried Chicken homepage recreation

A standalone, dependency-free recreation of the supplied Crunchies homepage archive.

## Run locally

From this directory, run:

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Project layout

- `index.html` — homepage markup and original section order.
- `src/styles.css` — responsive styling, original colour palette and documented breakpoints.
- `src/app.js` — supported frontend interactions (mobile navigation, delivery/pickup preference, category selection, loyalty redirect, and modal behaviour).
- `public/images/` — all 19 original image assets copied from the supplied archive.
- `reference/original-homepage.html` — unmodified supplied HTML reference.
- `reference/original-assets/` — original CSS and JavaScript bundle files retained for reference.

## Scope notes

The source archive does not include the original backend, database, branch availability, authentication, cart/order APIs, or newsletter service. This recreation does not simulate those services. Links that depend on Crunchies' live ordering/account platform point to the original site. The newsletter form displays a clear unavailable-service message instead of pretending to submit.
