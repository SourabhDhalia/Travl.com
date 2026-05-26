# Travl.com

Travl.com is a scalable Express and Handlebars travel guide for Indian
destinations. The app has been moved away from one hard-coded page per place
into shared routes, data services, reusable templates, and backend APIs.

The current build includes a protected destination library, reusable destination
detail pages, admin content editing, backend-driven currency conversion, a small
site assistant, contact and feedback submissions, legacy route redirects, and
responsive UI updates for the home, destination, search, and library screens.

## What Changed Recently

- Replaced hard-coded destination templates with a shared destination data model,
  seed data, services, and reusable Handlebars views.
- Added `/more` as a reliable paginated destination library with `grid` and `alt`
  layouts. Grid pages now fill from the available destination data instead of a
  fixed six-card page.
- Fixed the `/more?layout=grid&page=1` server error caused by passing
  `layout` as a render variable to express-handlebars.
- Added protected destination browsing. Visitors are redirected to login before
  opening `/more` or `/destinations/:slug`.
- Added auth, admin dashboards, destination create/edit/delete screens,
  submission cleanup, and admin approval routes.
- Added backend APIs for search, currency rates, and the AI guide.
- Restored image-scroll/parallax behavior with transform-based JavaScript instead
  of `background-attachment: fixed`, heavy filters, or backdrop blur.
- Updated UI assets for the feedback and AI side buttons, search hover/focus
  states, destination cards, destination detail panels, maps, and alternate
  destination rows.
- Added Node tests that cover routes, redirects, auth-gated pages, pagination,
  currency, search, and assistant responses.
- Added GitHub Actions CI and Vercel serverless routing.

## Architecture

- `src/app.js` configures Express, Handlebars, sessions, static assets, routes,
  and error handling.
- `src/server.js` starts the local server. Vercel imports `src/app.js` directly.
- `src/routes` maps public pages, auth, admin, and API endpoints.
- `src/controllers` contains request handlers and render context composition.
- `src/services` contains destination lookup, site content, submissions,
  currency-rate, and assistant logic.
- `src/models` contains MongoDB models for users, destinations, site content,
  currency-rate cache, and submissions.
- `src/data` contains fallback seed content so local pages can render without
  MongoDB.
- `templates` contains layouts, partials, and reusable views.
- `public/assets` contains the active CSS and browser JavaScript.
- `test/app.test.js` verifies the main server behavior with Node's test runner.

## Environment

Create `.env` from `.env.example`.

```bash
cp .env.example .env
```

Required for production:

- `MDBKEY`: MongoDB Atlas connection string. `MONGODB_URI` is also accepted.
- `SESSION_SECRET`: long random value for signed sessions.

Optional:

- `EXCHANGE_RATES_API_KEY`: exchangeratesapi.io key. Without it, the converter
  uses safe fallback rates.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: optional seed-time admin account.
- `PORT`: local server port. Defaults to `3000`.
- `FORMSPREE_CONTACT_URL` and `FORMSPREE_FEEDBACK_URL`: reserved for external
  form integrations.

## Development

Use Node.js 22.x. The repo includes `.nvmrc`, and Vercel reads the same runtime
from `package.json`.

```bash
nvm use
npm install
npm run dev
```

Visit `http://localhost:3000`.

Common pages:

- `/`: home page.
- `/login` and `/register`: account access.
- `/more?layout=grid&page=1`: paginated destination library.
- `/more?layout=alt&page=1`: alternate destination library layout.
- `/destinations/taj-mahal`: reusable destination detail page.
- `/currency`: backend-driven currency converter.
- `/admin`: admin dashboard for approved admins.

See [USAGE.md](USAGE.md) for route, admin, content, and deployment usage.

## Seed MongoDB

The app can render from fallback data, but production content should be seeded
into MongoDB:

```bash
npm run seed
```

The seed loads the destination library and homepage copy into MongoDB. If
`ADMIN_EMAIL` and `ADMIN_PASSWORD` are set, it also creates or promotes that
account as an admin.

New destinations should be added through `/admin/destinations/new` when MongoDB
is connected. For fallback-only development, add entries to
`src/data/destinations.js` with a unique `slug`, images, summary, location,
facts, foods, myths, gallery, and optional `legacyPaths`.

## Quality

```bash
npm test
npm run audit
```

The GitHub workflow runs install, tests, and audit checks on pushes and pull
requests.

## Deployment

Vercel is the source of truth. Configure `MDBKEY`, `SESSION_SECRET`,
`ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optionally `EXCHANGE_RATES_API_KEY` in
Vercel project settings.

`vercel.json` routes all requests to `src/app.js` through `@vercel/node`.
