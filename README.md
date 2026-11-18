# Positive Mind

Positive Mind is a private, offline-first personal-growth PWA. It uses React, TypeScript, Vite, IndexedDB, and localStorage. There is no backend, account, analytics, advertising tracker, or external runtime request. Journal entries remain in the browser on the device.

## Run locally

```sh
npm install
npm run dev
npm run build
npm run preview
```

The production preview is available at `http://localhost:4173`. Service workers require HTTPS or a trusted local origin such as `localhost`.

## End-to-end and offline tests

Install the Playwright browser once with `npx playwright install chromium`, then run:

```sh
npm run test:e2e
```

This builds the production app and tests it through `npm run preview`. The suite checks the no-JavaScript crawlable fallback, metadata and public files, service-worker activation, a reload while offline, onboarding and journaling offline, IndexedDB persistence, editing, deletion, export, delete-all, draft recovery, installation prompt handling, and layouts at 320, 360, 390, 430, 768, and 1280 pixels. It captures the install-prompt screenshots in `public/screenshots/`; responsive test captures are saved in `test-results/layouts/`.

For Lighthouse 11 (which still includes the PWA category), start the production preview and run:

```sh
npx --yes lighthouse@11.7.1 http://127.0.0.1:4173/ --only-categories=pwa,accessibility,seo,best-practices --output=html --output-path=./lighthouse-report.html --chrome-flags="--headless=new"
```

## Vercel deployment

The Vercel SPA fallback and security/cache headers are in [`vercel.json`](./vercel.json). The current site is `https://positivemindwithjonathan.vercel.app/` at the domain root. The default Vite base is `/`. Import this repository into Vercel, keep the Vite defaults (`npm run build`, output directory `dist`), and deploy.

If you later move the app under a subfolder, set the Vercel build environment variable `VITE_BASE_PATH` to its exact path, including leading and trailing slashes (for example, `/your-app/`), update the URLs in [`index.html`](./index.html), [`public/robots.txt`](./public/robots.txt), and [`public/sitemap.xml`](./public/sitemap.xml), and add the matching prefix rewrites in [`vercel.json`](./vercel.json).

Vercel provisions HTTPS for its deployment URL and connected domains. Confirm the certificate is valid, and check that `https://positivemindwithjonathan.vercel.app/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, and `/privacy.html` return successfully. The security headers are configured in `vercel.json`; `index.html` and `sw.js` are not long-term cached, while hashed `/assets/` files may be cached immutably.

## Google Search Console

1. In Search Console, add a **URL-prefix property** for `https://positivemindwithjonathan.vercel.app/`. A Domain property is an alternative, but requires DNS verification instead.
2. Select the **HTML file** verification method. The provided file is [`public/googled15d505e0544c7ac.html`](./public/googled15d505e0544c7ac.html). Deploy it unchanged, confirm `https://positivemindwithjonathan.vercel.app/googled15d505e0544c7ac.html` is reachable, then use Search Console's **Verify** action. Do not rename or edit the file.
3. Submit `https://positivemindwithjonathan.vercel.app/sitemap.xml` under **Sitemaps**.
4. In **URL Inspection**, enter the root URL, run **Test live URL**, then choose **Request indexing**.

Google is intended to index the one public root page described by the sitemap. The app's hash-based practice routes are not separate crawlable pages. Private journal entries and drafts stay on the device and are never published. The linked static privacy and terms pages are public and could also be discovered by crawlers; the sitemap intentionally lists only the root page.

## Install and test offline on Android

On a real Android phone, open the deployed HTTPS URL in Chrome, allow it to finish loading, and visit Settings until it says **Available offline**. Use Chrome's **Install app** prompt or menu. Open the installed app once, then enable Airplane mode and reopen or reload it. Confirm the home screen and saved journal entries still load, and that a new entry can be saved. On iPhone or iPad, use Safari's **Share**, then **Add to Home Screen**.

## Privacy and limitations

Read the static [Privacy](./public/privacy.html) and [Terms of use](./public/terms.html) pages. The app does not encrypt data at rest; browser/device storage may be cleared by its owner or by platform policy. Export important entries from Settings.

Reminders appear only while the app is open. Background push notifications are not implemented. The safety message is a keyword check, not crisis support. Review applicable age and data-protection requirements before public release.

## Structure

`src/pages` contains the app screens; `src/services/database` contains the IndexedDB layer; preferences and unfinished Perspective Shift drafts use localStorage. No journal content is intended to be indexable.
