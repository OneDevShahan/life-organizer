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
2. The supplied Firebase web config is the app default. To override it locally, copy `.env.example` to `.env.local` and fill in the six `VITE_FIREBASE_*` values.
3. Publish [`firestore.rules`](./firestore.rules) in Firestore → Rules, or run `firebase login` and `firebase deploy --only firestore:rules --project life-organizer-dea64` with Firebase CLI.
4. Add `localhost` and your GitHub Pages hostname to Authentication → Settings → Authorized domains.

The Firebase web config is public client configuration, not a server secret. Restrict its API key to the required Firebase APIs and expected websites in Google Cloud Console. Firestore rules enforce account ownership. Do not put service-account keys in the frontend or store sensitive/regulated medical data without reviewing applicable requirements.

## Deploy to GitHub Pages

Deployment is configured by [`.github/workflows/static.yml`](./.github/workflows/static.yml).

1. In **Settings → Pages**, select **GitHub Actions** as the build and deployment source.
2. Push to `master` (or run **Deploy to GitHub Pages** from the Actions tab). The supplied Firebase config is built in; repository variables are only needed if you want to override it.
3. Open the Pages URL shown in the successful workflow deployment.

The workflow builds with the repository's Pages base path. App routes use hash URLs, so refreshing a nested route works on static hosting. The bundled Firebase config initializes the app; Authentication and Firestore still require the Firebase Console setup above.

## Commands

```bash
npm run dev      # local development
npm run build    # type-check and production build
npm run preview  # preview the production build locally
```
