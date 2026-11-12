# ✨ Life Organizer

> **Your personal space for the moments, routines, and plans that matter.**

[🚀 Open the live app](https://onedevshahan.github.io/life-organizer/) · [🛠️ Setup](#-get-started) · [🔥 Firebase](#-firebase-and-sync) · [🧪 Tests](#-quality-checks)

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-6d4aff?logo=github)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript)

## 🧭 Explore

| ✨ Module | What you can do |
| --- | --- |
| 🏠 Dashboard | Review upcoming moments, daily reminders, and at-a-glance stats |
| 📖 Events & Memories | Capture dated moments; favorite or remove entries |
| 💊 Medicine Library | Track dosage, dates, frequency, and a daily reminder time |
| 🔎 Search | Find events and medicines from the header |
| 🗓️ Calendar | Explore events by month |
| 💜 Favorites | Keep important events and medicines close |
| ⚙️ Settings | Choose a theme, export a backup, or restore your data |
| 👤 Profile | View your account details |

**Quick controls:** Collapse the desktop sidebar with its panel button; on mobile, use **☰** to show or hide navigation. Choose **Light**, **Dark**, or **System**. The bell opens your upcoming-items panel.

## 🚀 Get started

```bash
npm ci
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## 🔥 Firebase and sync

Email/password and Google sign-in use Firebase Authentication. User records sync across devices through Firestore under `users/{uid}`. Firestore rules restrict access to the signed-in user’s own data.

1. In Firebase Console, enable **Authentication → Sign-in method → Email/Password** and **Google**. Set a support email for Google.
2. Create the Firestore database if needed.
3. Publish [`firestore.rules`](./firestore.rules) in Firestore → **Rules**, or run:
   ```bash
   firebase login
   firebase deploy --only firestore:rules --project life-organizer-dea64
   ```
4. Add `localhost` and `onedevshahan.github.io` under Authentication → **Settings → Authorized domains**.

The supplied Firebase web configuration is included for the static deployment. It is **public client configuration, not a private key**. Restrict its API key to the Firebase APIs and websites you use. Never put service-account keys, passwords, or other server secrets in frontend code. Avoid storing sensitive or regulated health information in this app.

If Google sign-in finds an existing email/password account, the app verifies the existing password and links Google to that Firebase account. The same UID and Firestore data are preserved; identities are not merged without proving control of the existing account.

## 🔔 Reminders

- Optional browser notifications need permission and work **only while the app is open**; browser throttling may delay them.
- Events alert at their saved date/time. Medicines alert **once daily** at the saved reminder time between their start and end dates. The free-text frequency does not change alert timing.
- Notifications are not a substitute for medical advice and must not be used for urgent or safety-critical medication decisions.

## 📦 Back up your data

In **Settings → Your data**, export a versioned JSON backup or restore one. Import adds records and updates matching IDs; it **does not delete** records missing from the backup. Backups contain personal and medicine information—keep them private and secure.

## ♿ Accessibility

The app includes a skip-to-content link, visible keyboard focus, labeled navigation and controls, Escape-key panel dismissal, and validation messages linked to their form fields.

## 🧪 Quality checks

```bash
npm test       # unit and UI tests
npm run build  # strict TypeScript check and production build
npm run preview
```

## 🌐 Deploy

GitHub Pages deployment is handled by [`.github/workflows/static.yml`](./.github/workflows/static.yml).

1. In repository **Settings → Pages**, choose **GitHub Actions** as the source.
2. Push to `master` or run **Deploy to GitHub Pages** from Actions.
3. Open the Pages URL after the workflow succeeds.

The build configures the repository base path, and hash-based routes support page refreshes on static hosting.
