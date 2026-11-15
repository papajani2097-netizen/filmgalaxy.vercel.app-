This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Geist, a modern variable font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Netlify

This app is set up for deployment on [Netlify](https://www.netlify.com/).

1. Push the repository to GitHub.
2. In Netlify, choose "Add new site" > "Import an existing project".
3. Select the repository and keep the default build settings.
4. Netlify will use the `netlify.toml` file to install the Next.js plugin for production builds.

If you want to build locally, run:

```bash
npm run build
npm run start
```

## Movie details, watch availability, and AdSense

Movie detail pages at `/movie/{id}` use TMDB for the title, poster, overview,
release date, rating, genres, cast, and regional watch-provider listings.
Provider names and the availability URL come from TMDB's response; FilmGalaxy
does not construct streaming-provider URLs. Availability currently uses the
Pakistan region (`PK`). When TMDB does not provide an available provider or a
valid TMDB availability URL, the page displays “Official link currently
unavailable.”

Each movie detail page includes a separate, clearly labelled Advertisement
placement. It remains inactive until your site has been approved and configured
with AdSense. After approval, add the following public ad identifiers to your
deployment environment (or `.env.local` for local testing), then rebuild or
restart the app:

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-your-approved-client-id
NEXT_PUBLIC_ADSENSE_SLOT_ID=your-ad-unit-slot-id
```

The client ID must use the `ca-pub-` format and the slot ID must be numeric.
Do not put the TMDB token in either variable. Ads are not required to view movie
details or use watch-provider links; do not place ad overlays or interstitials
over those controls.
