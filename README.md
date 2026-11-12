# Life Organizer

A responsive personal dashboard for events, memories, medicine routines, search, calendar, favorites, settings, and profile.

## Run locally

```bash
npm ci
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Modules

| Module | What it does |
| --- | --- |
| Dashboard | At-a-glance stats, upcoming events, and medicine reminders |
| Events & Memories | Add, favorite, and remove dated moments |
| Medicine Library | Track medicine details and reminder times |
| Search | Search event and medicine details from the header |
| Calendar | View events by month |
| Favorites | Review pinned events and medicines |
| Settings / Profile | Change theme and view the local demo profile |

Modules are listed in [`src/data/modules.ts`](./src/data/modules.ts); add a registry entry, route, and feature module to extend the app.

## Data and Firebase

The current app is a **client-side demo**: its sample data and edits are stored in this browser's `localStorage`. The Firebase SDK initializer exists in `src/services/firebase.ts`, but authentication and Firestore/Storage persistence are **not yet connected to the modules**. The sign-in control is a demo toggle, not real authentication. Do not store sensitive or medical data in this version.

## Deploy to GitHub Pages

Deployment is configured by [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

1. In **Settings → Pages**, select **GitHub Actions** as the build and deployment source. GitHub requires this one-time repository setting.
2. Push to `main` or `master` (or run **Deploy to GitHub Pages** from the Actions tab).
3. Open the Pages URL shown in the successful workflow deployment.

The workflow builds with the repository's Pages base path. App routes use hash URLs, so refreshing a nested route works on static hosting.

## Commands

```bash
npm run dev      # local development
npm run build    # type-check and production build
npm run preview  # preview the production build locally
```
