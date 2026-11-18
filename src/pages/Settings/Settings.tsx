import { useEffect, useState } from 'react'
import { GOALS } from '../../data/content'
import { useApp } from '../../hooks/useApp'
import { Chips, Confirm, PageHead, TextArea } from '../../components/common/ui'
import { exportJournal } from '../../services/export/export'
import { askPermission, notificationsSupported, permission } from '../../services/notifications/notify'
import { usePwaStatus } from '../../services/pwa'
import type { ReminderSlot } from '../../types'

interface BIPEvent extends Event { prompt: () => Promise<void> }
let deferred: BIPEvent | null = null
if (typeof window !== 'undefined') window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault()
  deferred = e as BIPEvent
  window.dispatchEvent(new Event('pm:install-available'))
})

export function Settings() {
  const { prefs, setPrefs, notif, setNotif, entries, wipe, toast } = useApp()
  const { offlineReady } = usePwaStatus()
  const [perm, setPerm] = useState(permission())
  const [ask, setAsk] = useState(false)
  const [canInstall, setCanInstall] = useState(!!deferred)
  const [isIos] = useState(() => {
    const platform = navigator as Navigator & { standalone?: boolean }
    return (/iPad|iPhone|iPod/.test(navigator.userAgent) || (platform.platform === 'MacIntel' && platform.maxTouchPoints > 1)) && !platform.standalone
  })
  useEffect(() => {
    const installed = () => { deferred = null; setCanInstall(false) }
    const installAvailable = () => setCanInstall(true)
    window.addEventListener('pm:install-available', installAvailable)
    window.addEventListener('appinstalled', installed)
    return () => {
      window.removeEventListener('pm:install-available', installAvailable)
      window.removeEventListener('appinstalled', installed)
    }
  }, [])
  const slot = (k: 'morning' | 'day' | 'evening', label: string) => (
    <div className="slot" key={k}>
      <label className="check"><input type="checkbox" checked={notif[k].on} onChange={e => setNotif(n => ({ ...n, [k]: { ...n[k], on: e.target.checked } as ReminderSlot }))} /><span>{label}</span></label>
      <input type="time" aria-label={`${label} time`} value={notif[k].time} onChange={e => setNotif(n => ({ ...n, [k]: { ...n[k], time: e.target.value } }))} />
    </div>)
  return (
    <>
      <PageHead title="Settings" />
      <section className="block"><h2>Your preferences</h2>
        <div className="field"><span className="lbl">Focus areas</span><Chips label="Focus areas" options={GOALS} value={prefs.goals} onChange={g => setPrefs(p => ({ ...p, goals: g }))} multi /></div>
        <div className="field"><label htmlFor="rt">Daily routine</label><select id="rt" value={prefs.routine} onChange={e => setPrefs(p => ({ ...p, routine: e.target.value }))}>
          <option value="morning">Morning practice</option><option value="daytime">Daytime practice</option><option value="evening">Evening reflection</option><option value="combination">A combination</option></select></div>
        <TextArea id="idn" label="The person I am working towards becoming" value={prefs.identity} onChange={v => setPrefs(p => ({ ...p, identity: v }))} rows={3} />
      </section>
      <section className="block"><h2>Appearance and accessibility</h2>
        <div className="field"><label htmlFor="th">Theme</label><select id="th" value={prefs.theme} onChange={e => setPrefs(p => ({ ...p, theme: e.target.value as 'system' }))}><option value="system">Match my device</option><option value="light">Light</option><option value="dark">Dark</option></select></div>
        <label className="check"><input type="checkbox" checked={prefs.largeText} onChange={e => setPrefs(p => ({ ...p, largeText: e.target.checked }))} /><span>Larger text</span></label>
        <label className="check"><input type="checkbox" checked={prefs.reduceMotion} onChange={e => setPrefs(p => ({ ...p, reduceMotion: e.target.checked }))} /><span>Reduce motion</span></label>
      </section>
      <section className="block"><h2>Reminders</h2>
        <p className="muted">Reminders appear while Positive Mind is open. Background notifications when the app is closed are not available in this version.</p>
        <label className="check"><input type="checkbox" checked={notif.enabled} onChange={e => setNotif(n => ({ ...n, enabled: e.target.checked }))} /><span>Turn on reminders</span></label>
        {notif.enabled && <>{slot('morning', 'Morning reminder')}{slot('day', 'Daytime practice reminder')}{slot('evening', 'Evening reflection reminder')}
          {notificationsSupported() ? (perm === 'granted' ? <p className="muted">Device notifications are allowed.</p> : perm === 'denied' ? <p className="muted">Device notifications are blocked in your browser settings. In-app reminders still work.</p> :
            <button className="btn ghost small" onClick={async () => setPerm(await askPermission())}>Allow device notifications</button>) : <p className="muted">This browser does not support notifications. In-app reminders still work.</p>}</>}
      </section>
      <section className="block"><h2>Your data</h2>
        <p>Everything you write is stored only in this browser on this device, using IndexedDB. It is not sent anywhere and it is not encrypted by this app. Anyone who can unlock your device and browser could read it.</p>
        <div className="row wrap"><button className="btn ghost" onClick={() => { exportJournal(entries); toast('Export downloaded.') }}>Export my data (JSON)</button>
          {canInstall && <button className="btn ghost" onClick={async () => {
            try { await deferred?.prompt(); deferred = null; setCanInstall(false) } catch { toast('Could not open the install prompt. Please try again.', 'err') }
          }}>Install app</button>}
          <button className="btn danger" onClick={() => setAsk(true)}>Delete all my data</button></div>
        {offlineReady ? <p className="muted" role="status">Available offline</p> : <p className="muted" role="status">Preparing offline access…</p>}
        {isIos && <p className="muted">To install on iPhone or iPad, tap Share, then Add to Home Screen.</p>}
      </section>
      <section className="block"><h2>About</h2>
        <details><summary>Privacy</summary><p>No account, no analytics, no advertising trackers and no server. Your entries are private by default and cannot be shared from the app. Before any public release, the age range and applicable data-protection rules for your region should be reviewed.</p></details>
        <details><summary>Terms of use</summary><p>Positive Mind is a personal-development tool, not medical or psychological treatment. It cannot diagnose or treat any condition. If you are struggling, please speak to a trusted person or a qualified professional.</p></details>
        <p><a href="./privacy.html">Read the privacy page</a> · <a href="./terms.html">Read the terms of use</a></p>
        <details><summary>About Positive Mind</summary><p>Inspired by general personal-development ideas, with original exercises and writing. It is not an official companion to any book or author.</p></details>
        <p className="muted">Version 1.0.0</p>
      </section>
      {ask && <Confirm title="Delete everything?" text="This permanently deletes every entry, your preferences and your seven-day progress from this device. Export first if you want a copy." confirmLabel="Delete all data" onClose={() => setAsk(false)} onConfirm={() => void wipe()} />}
    </>
  )
}
