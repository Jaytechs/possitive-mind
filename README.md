# Positive Mind

Mobile-first, offline-first PWA for personal growth. React + TypeScript + Vite, IndexedDB (`idb`), `vite-plugin-pwa`, Lucide icons. No backend, no accounts, no API keys.

## Run
```
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then builds to dist/
npm run preview    # serves the production build (service worker only runs here / on HTTPS)
```
## Test the PWA and offline mode
1. `npm run build && npm run preview`, open the URL in Chrome.
2. DevTools > Application > Service Workers: confirm it is activated. Manifest: confirm icons.
3. Reload once online, tick **Offline** in the Network tab, reload. The app and saved entries should load; save a new entry.
4. On Android, open the deployed HTTPS URL and use "Install app".

## Structure
`src/pages` (Home, Practice, PerspectiveShift, Journal, Growth, Settings, Onboarding, Challenge, Evening), `src/components`, `src/services/{database,export,notifications}`, `src/data` (original content), `src/hooks`, `src/types`.
Entries live in IndexedDB; preferences, reminder settings, seven-day progress and the unfinished Perspective Shift draft live in localStorage (`pm.*`).

## Known limits
- Reminders show only while the app is open. True background push needs a push server and is not implemented.
- Data is not encrypted at rest.
- The safety message is a keyword check and not a substitute for crisis support; add region-specific emergency numbers and review age and data-protection rules before public release.
- Automated and on-device tests (offline, 320px layouts, Android) have not been run yet.
