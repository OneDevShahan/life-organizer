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
| Settings / Profile | Change synced theme and view your signed-in account |

Modules are listed in [`src/data/modules.ts`](./src/data/modules.ts); add a registry entry, route, and feature module to extend the app.

## Firebase setup

The app uses Firebase **email/password authentication** and user-scoped Firestore collections. Each signed-in account reads and writes only under `users/{uid}`; Firestore snapshots sync changes between signed-in devices. Sample browser data is not migrated or uploaded.

1. In Firebase Console, enable **Authentication → Email/Password** and create the Firestore database.
2. Set the six `VITE_FIREBASE_*` values from the Firebase web app config in `.env.local` (start from `.env.example`).
3. Publish [`firestore.rules`](./firestore.rules) in Firestore → Rules, or run `firebase login` and `firebase deploy --only firestore:rules --project life-organizer-dea64` with Firebase CLI.
4. Add `localhost` and your GitHub Pages hostname to Authentication → Settings → Authorized domains.

The Firebase web config is public client configuration, not a server secret. Firestore rules enforce account ownership. Do not put service-account keys in the frontend or store sensitive/regulated medical data without reviewing applicable requirements.

## Deploy to GitHub Pages

Deployment is configured by [`.github/workflows/static.yml`](./.github/workflows/static.yml).

1. In **Settings → Pages**, select **GitHub Actions** as the build and deployment source.
2. In **Settings → Secrets and variables → Actions → Variables**, add the six `VITE_FIREBASE_*` values from your web config. They are public client settings, so repository variables are appropriate.
3. Push to `master` (or run **Deploy to GitHub Pages** from the Actions tab).
4. Open the Pages URL shown in the successful workflow deployment.

The workflow builds with the repository's Pages base path. App routes use hash URLs, so refreshing a nested route works on static hosting. Auth and cloud sync stay disabled in the deployed app until the Actions variables are configured.

## Commands

```bash
npm run dev      # local development
npm run build    # type-check and production build
npm run preview  # preview the production build locally
```
