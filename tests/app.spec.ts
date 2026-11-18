import { expect, test } from '@playwright/test'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const publicScreenshots = path.resolve('public/screenshots')
const layoutScreenshots = path.resolve('test-results/layouts')

test('serves crawlable fallback content, metadata, manifest, and legal pages', async ({ browser, baseURL }) => {
  if (!baseURL) throw new Error('Playwright baseURL is required.')
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page).toHaveTitle('Positive Mind — Private Personal Growth')
  expect((await page.title()).length).toBeLessThan(60)
  expect(await page.locator('html').getAttribute('lang')).toBe('en')
  await expect(page.getByRole('heading', { name: 'Positive Mind' })).toBeVisible()
  await expect(page.getByRole('listitem')).toHaveCount(5)
  await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Terms of use' })).toBeVisible()
  const description = await page.locator('meta[name="description"]').getAttribute('content')
  expect(description?.length).toBeLessThan(160)
  expect(await page.locator('meta[name="theme-color"]').getAttribute('content')).toBe('#718775')
  const metadata = await page.locator('script[type="application/ld+json"]').textContent()
  const structuredData = JSON.parse(metadata ?? '{}') as Record<string, unknown>
  expect(structuredData).toMatchObject({
    '@type': 'WebApplication',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0' },
  })
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toContain('https://')
  expect(description).toBeTruthy()
  expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toContain('social-preview.png')
  expect(await page.locator('meta[name="twitter:card"]').getAttribute('content')).toBe('summary_large_image')
  expect(await page.locator('meta[name="google-site-verification"]').getAttribute('content')).toBe('REPLACE_WITH_SEARCH_CONSOLE_VERIFICATION_TOKEN')

  const manifestResponse = await page.request.get(`${baseURL}/manifest.webmanifest`)
  expect(manifestResponse.ok()).toBe(true)
  const manifest = await manifestResponse.json() as {
    name: string; short_name: string; description: string; id: string; start_url: string; scope: string; display: string
    orientation: string; background_color: string; theme_color: string; lang: string; categories: string[]
    icons: Array<{ src: string; sizes: string; purpose?: string }>
    screenshots: Array<{ src: string; sizes: string }>; shortcuts: Array<{ name: string; url: string }>
  }
  expect(manifest).toMatchObject({
    name: 'Positive Mind',
    short_name: 'Positive Mind',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F7F6F1',
    theme_color: '#718775',
    lang: 'en',
  })
  expect(manifest.description.length).toBeGreaterThan(0)
  expect(manifest.display).toBe('standalone')
  expect(manifest.categories).toContain('lifestyle')
  expect(manifest.icons.map(icon => icon.sizes)).toEqual(['192x192', '512x512', '512x512'])
  expect(manifest.icons[2].purpose).toBe('maskable')
  expect(manifest.shortcuts.map(shortcut => shortcut.name)).toEqual(['Perspective Shift', 'Evening reflection'])
  expect(manifest.shortcuts.map(shortcut => shortcut.url)).toEqual(['/#/shift', '/#/evening'])
  expect(manifest.screenshots).toHaveLength(2)
  for (const [index, screenshot] of manifest.screenshots.entries()) {
    const url = new URL(screenshot.src, `${baseURL}/manifest.webmanifest`)
    const response = await page.request.get(url.href)
    expect(response.ok()).toBe(true)
    const png = await response.body()
    const dimensions = index === 0 ? [390, 844] : [1280, 800]
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual(dimensions)
  }
  const appleIcon = await page.request.get(`${baseURL}/icons/apple-touch-icon.png`)
  expect((await appleIcon.body()).readUInt32BE(16)).toBe(180)
  const socialPreview = await page.request.get(`${baseURL}/social-preview.png`)
  expect([ (await socialPreview.body()).readUInt32BE(16), (await socialPreview.body()).readUInt32BE(20) ]).toEqual([1200, 630])
  const worker = await page.request.get(`${baseURL}/sw.js`)
  const workerSource = await worker.text()
  for (const precached of ['index.html', 'manifest.webmanifest', 'privacy.html', 'terms.html', 'robots.txt', 'sitemap.xml', 'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'screenshots/pm-narrow.png', 'screenshots/pm-wide.png', 'dm-sans-latin-wght-normal-', 'lora-latin-wght-normal-', 'assets/index-']) {
    expect(workerSource).toContain(precached)
  }

  const robots = await page.request.get(`${baseURL}/robots.txt`)
  const robotsText = await robots.text()
  expect(robotsText).toContain('User-agent: *')
  expect(robotsText).toContain('Allow: /')
  expect(robotsText).toContain('Sitemap:')
  const sitemap = await page.request.get(`${baseURL}/sitemap.xml`)
  const sitemapText = await sitemap.text()
  expect(sitemapText.match(/<loc>/g)).toHaveLength(1)
  expect(sitemapText).toContain('<loc>https://positivemindwithjonathan.vercel.app/</loc>')
  await page.goto('/privacy.html')
  await expect(page.getByRole('heading', { name: 'Privacy' })).toBeVisible()
  await page.goto('/terms.html')
  await expect(page.getByRole('heading', { name: 'Terms of use' })).toBeVisible()
  await context.close()
})

test('installs, runs offline, and keeps personal data on the device', async ({ page, context, baseURL }) => {
  const consoleErrors: string[] = []
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', error => consoleErrors.push(error.message))

  await page.goto('/')
  await expect(page).toHaveTitle('Positive Mind — Private Personal Growth')
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  const serviceWorker = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready
    return { scope: registration.scope, scriptURL: registration.active?.scriptURL }
  })
  expect(serviceWorker.scope).toBe(`${baseURL}/`)
  expect(serviceWorker.scriptURL).toContain('/sw.js')
  await page.reload()
  await page.waitForFunction(() => !!navigator.serviceWorker.controller)

  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('button', { name: 'Get started' })).toBeVisible()

  await page.getByRole('button', { name: 'Get started' }).click()
  for (let step = 0; step < 3; step++) await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Begin my journey' }).click()
  await expect(page.getByRole('link', { name: 'Practise' })).toBeVisible()

  await mkdir(publicScreenshots, { recursive: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: path.join(publicScreenshots, 'pm-narrow.png') })
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.screenshot({ path: path.join(publicScreenshots, 'pm-wide.png') })

  await page.getByRole('link', { name: 'Practise', exact: true }).click()
  await page.getByRole('link', { name: 'Mental clarity' }).click()
  await page.getByLabel('What has been occupying your mind lately?').fill('Offline mind entry')
  await page.getByLabel('What is one small step you can take?').fill('Take one useful step')
  await page.getByRole('button', { name: 'Save privately' }).click()

  await page.getByRole('link', { name: 'Practise', exact: true }).click()
  await page.getByRole('link', { name: 'Gratitude' }).click()
  await page.getByLabel('I am grateful for').first().fill('A helpful friend')
  await page.getByRole('button', { name: 'Save', exact: true }).click()

  await page.getByRole('link', { name: 'Shift' }).click()
  await page.getByRole('button', { name: 'Begin with my own words' }).click()
  await page.getByLabel('What happened?').fill('An offline challenge')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Worried' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('What are you telling yourself about this?').fill('I can find another way forward')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('Write a more balanced view').fill('One difficult moment does not define me')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('Describe it').fill('Ask for support and make a plan')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Save session' }).click()
  await expect(page.getByText('Session saved to your journal.')).toBeVisible()

  await page.getByRole('button', { name: 'Begin with my own words' }).click()
  await page.getByLabel('What happened?').fill('Unfinished draft survives reload')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Worried' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('What are you telling yourself about this?').fill('This draft should remain here')
  await page.reload()
  await expect(page.getByLabel('What are you telling yourself about this?')).toHaveValue('This draft should remain here')

  await page.goto(`${baseURL}/#/journal`)
  await expect(page.locator('.entry').filter({ hasText: 'Offline mind entry' })).toHaveCount(1)
  await expect(page.locator('.entry').filter({ hasText: 'A helpful friend' })).toHaveCount(1)
  await expect(page.locator('.entry').filter({ hasText: 'An offline challenge' })).toHaveCount(1)
  await page.goto(`${baseURL}/#/settings`)
  await expect(page.getByText('Available offline')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Read the privacy page' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Read the terms of use' })).toBeVisible()
  await page.goto(`${baseURL}/#/journal`)

  const clearEntry = page.locator('.entry').filter({ hasText: 'Offline mind entry' })
  await clearEntry.locator('summary').click()
  await clearEntry.getByRole('button', { name: 'Edit' }).click()
  await page.getByLabel('On my mind').fill('Edited offline mind entry')
  await page.getByRole('button', { name: 'Save changes' }).click()
  const editedEntry = page.locator('.entry').filter({ hasText: 'Edited offline mind entry' })
  await expect(editedEntry).toBeVisible()
  const editedDetails = editedEntry.locator('details')
  if (await editedDetails.getAttribute('open') === null) await editedDetails.locator('summary').click()
  await editedEntry.getByRole('button', { name: 'Delete', exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete entry' }).click()
  await expect(page.getByText('Edited offline mind entry')).toHaveCount(0)

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export as JSON' }).click()
  const download = await downloadPromise
  await mkdir(path.resolve('test-results'), { recursive: true })
  const exportPath = path.resolve('test-results', 'offline-export.json')
  await download.saveAs(exportPath)
  const exported = JSON.parse(await readFile(exportPath, 'utf8')) as { entries: Array<{ data: Record<string, unknown> }> }
  expect(exported.entries).toHaveLength(2)
  expect(JSON.stringify(exported)).toContain('A helpful friend')

  await page.goto(`${baseURL}/#/settings`)
  await page.getByRole('button', { name: 'Delete all my data' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete all data' }).click()
  await expect(page.getByRole('button', { name: 'Get started' })).toBeVisible()
  const remainingEntries = await page.evaluate(async () => {
    const request = indexedDB.open('positive-mind')
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    const records = await new Promise<unknown[]>((resolve, reject) => {
      const read = db.transaction('entries').objectStore('entries').getAll()
      read.onsuccess = () => resolve(read.result)
      read.onerror = () => reject(read.error)
    })
    db.close()
    return records.length
  })
  expect(remainingEntries).toBe(0)
  expect(consoleErrors).toEqual([])
})

test('shows a working install action when the browser offers installation', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('pm.prefs', JSON.stringify({
      onboarded: true, goals: [], routine: 'combination', identity: '', theme: 'system', reduceMotion: false, largeText: false,
    }))
  })
  await page.goto('/#/settings')
  await page.evaluate(() => {
    const event = new Event('beforeinstallprompt', { cancelable: true })
    Object.defineProperty(event, 'prompt', { value: async () => { (window as Window & { installPrompted?: boolean }).installPrompted = true } })
    window.dispatchEvent(event)
  })
  await page.getByRole('button', { name: 'Install app' }).click()
  await expect.poll(() => page.evaluate(() => (window as Window & { installPrompted?: boolean }).installPrompted)).toBe(true)
})

test('keeps controls reachable without horizontal scrolling at common viewport widths', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('pm.prefs', JSON.stringify({
      onboarded: true, goals: [], routine: 'combination', identity: '', theme: 'system', reduceMotion: false, largeText: false,
    }))
  })
  await mkdir(layoutScreenshots, { recursive: true })

  for (const width of [320, 360, 390, 430, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/#/shift')
    await page.evaluate(() => localStorage.removeItem('pm.shiftDraft'))
    await page.reload()
    await page.getByRole('button', { name: 'Begin with my own words' }).click()
    await page.getByLabel('What happened?').fill('Layout check')
    const layout = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      pageWidth: document.documentElement.scrollWidth,
      outOfBounds: [...document.querySelectorAll('button, input, select, textarea, a:not(.skip)')]
        .filter(element => element.getClientRects().length > 0)
        .map(element => element.getBoundingClientRect())
        .filter(rect => rect.left < -1 || rect.right > document.documentElement.clientWidth + 1).length,
    }))
    expect(layout.pageWidth, `horizontal page overflow at ${width}px`).toBeLessThanOrEqual(layout.viewportWidth)
    expect(layout.outOfBounds, `controls outside the viewport at ${width}px`).toBe(0)
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled()
    await page.screenshot({ path: path.join(layoutScreenshots, `${width}px.png`), fullPage: true })
  }
})
