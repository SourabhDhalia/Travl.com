# Travl.com Usage Guide

This guide covers the current Travl.com app after the Express, Handlebars, data,
UI, and reliability refactor.

## Local Setup

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000` unless `PORT` is set.

Create local environment values from the example file:

```bash
cp .env.example .env
```

Minimum local development can run without MongoDB because destination and home
content fall back to `src/data`. Auth, persistent admin editing, sessions stored
in MongoDB, and saved submissions need `MDBKEY` or `MONGODB_URI`.

## Accounts And Access

Public visitors can open the home page, auth pages, currency converter, search
API, and assistant API.

Destination library and detail pages are protected:

- `/more`
- `/more?layout=grid&page=1`
- `/more?layout=alt&page=1`
- `/destinations/:slug`

If a visitor is not signed in, the app redirects them to
`/login?next=<requested-page>` and returns them after login.

Register at `/register`. Traveller accounts can browse the destination library.
Admin accounts can open `/admin` only when they have role `admin` and
`adminApproved` is true.

The super-admin email `admin@admin.com` can approve or reject pending admin
accounts at `/admin/approval`.

## Destination Library

Use `/more` for the destination library.

Query parameters:

- `layout=grid`: card grid view.
- `layout=alt`: alternating image and text layout.
- `page=1`: current page number.
- `limit=8`: optional page size. The controller caps the value for reliability.

Examples:

```text
/more?layout=grid&page=1
/more?layout=alt&page=2
/more?layout=grid&page=1&limit=12
```

The grid default is based on four columns and two rows, so page one shows eight
destinations when at least eight published destinations exist. The route no
longer hard-codes a six-card page.

## Destination Details

Reusable destination pages live at:

```text
/destinations/:slug
```

Example:

```text
/destinations/taj-mahal
```

The page reads destination data from MongoDB when connected. If MongoDB is not
available or empty, it falls back to `src/data/destinations.js`.

Legacy routes redirect with status 301 to the new reusable route. Examples:

```text
/tajMahal -> /destinations/taj-mahal
/elloraCaves -> /destinations/ellora-caves
/goldenTemple -> /destinations/golden-temple
```

## Search

Frontend search calls the backend endpoint:

```text
GET /api/search?q=taj
```

The response shape is:

```json
{
  "results": [
    {
      "name": "Taj Mahal",
      "slug": "taj-mahal",
      "region": "Agra, Uttar Pradesh",
      "url": "/destinations/taj-mahal",
      "legacyPaths": ["/tajMahal"]
    }
  ]
}
```

Search matches destination name, slug, region, and summary.

## Currency Converter

Open the converter at either route:

```text
/currency
/Moneyconvertor
```

Rates come from:

```text
GET /api/currency/latest?base=USD
```

When `EXCHANGE_RATES_API_KEY` is configured, the backend requests external
rates and caches them in MongoDB by base and date. Without a provider key or
database connection, the app uses safe fallback rates. API keys are never placed
in browser JavaScript.

## AI Guide

The floating AI guide posts to:

```text
POST /api/assistant
```

Payload:

```json
{
  "message": "How do I use Taj Mahal?"
}
```

The current assistant is deterministic site guidance. It can answer destination,
login, currency, feedback, admin, and navigation questions using app data.

## Admin Workflow

Open `/admin` after signing in as an approved admin.

Admin features:

- Review destination count, submission count, API status, and currency cache.
- Create destinations at `/admin/destinations/new`.
- Edit destinations at `/admin/destinations/:id/edit`.
- Delete destinations.
- Delete contact and feedback submissions.
- Approve or reject pending admin accounts from `/admin/approval` as
  `admin@admin.com`.

Destination editor fields:

- `name`
- `slug`
- `summary`
- `heroImage`
- `cardImage`
- `region`
- `bestTime`
- `order`
- `featured`
- `publishStatus`
- `locationLabel`
- `mapUrl`
- `embedUrl`
- `gallery`
- `facts`
- `foods`
- `myths`

`facts`, `foods`, and `myths` are JSON arrays. Invalid JSON returns the edit
page with an error instead of saving broken content.

## Adding Destinations Without Admin

For fallback data, add an object to `src/data/destinations.js`.

Required fields:

- `slug`
- `name`
- `region`
- `summary`
- `heroImage`
- `cardImage`
- `order`
- `publishStatus`

Useful optional fields:

- `featured`
- `bestTime`
- `legacyPaths`
- `location`
- `gallery`
- `facts`
- `foods`
- `myths`
- `seo`

After editing fallback content, run:

```bash
npm test
```

If MongoDB should receive the fallback data, run:

```bash
npm run seed
```

## UI Behavior

The UI uses shared CSS and JavaScript from `public/assets`.

Recent behavior to preserve:

- Feedback and AI side buttons align together.
- Search controls have hover and focus states.
- Destination cards use data-driven content and reliable pagination.
- Alternate destination rows keep the image and text visually connected while
  avoiding the old unwanted padding around images.
- Home, about, and destination hero images use transform-based parallax through
  `data-parallax-bg`.
- Heavy scrolling effects such as fixed backgrounds, backdrop blur, and filter
  effects were removed for better performance.

When changing visuals, test both desktop and mobile widths and watch for text
overflow, card overlap, and scroll lag.

## Testing

Run:

```bash
npm test
```

The tests cover:

- Homepage rendering from reusable content.
- Legacy destination redirects.
- Auth protection for destination pages.
- Destination library rendering and grid counts.
- Auth forms.
- Currency page shell.
- Search API.
- Currency API fallback behavior.
- AI guide responses.

Run the production dependency audit:

```bash
npm run audit
```

## Deployment

Deploy through Vercel.

Required Vercel environment variables:

- `MDBKEY`
- `SESSION_SECRET`

Recommended Vercel environment variables:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `EXCHANGE_RATES_API_KEY`

The Vercel config sends all requests to `src/app.js`, so Express handles pages,
APIs, static assets, and redirects from the same application entry point.
