import { useEffect, useState } from 'react'
import { AppProvider, useApp } from './hooks/useApp'
import { useRoute } from './hooks/useRoute'
import { Nav } from './components/navigation/Nav'
import { Home } from './pages/Home/Home'
import { Practice, PillarPage } from './pages/Practice/Practice'
import { PerspectiveShift } from './pages/PerspectiveShift/PerspectiveShift'
import { Journal } from './pages/Journal/Journal'
import { Growth } from './pages/Growth/Growth'
import { Settings } from './pages/Settings/Settings'
import { Onboarding } from './pages/Onboarding/Onboarding'
import { Challenge } from './pages/Challenge/Challenge'
import { Evening } from './pages/Evening/Evening'
import { showLocal } from './services/notifications/notify'
import { applyPwaUpdate, usePwaStatus } from './services/pwa'
import { dateKey, pad } from './utils/date'

const MSG = {
  morning: ['Good morning', 'Take a moment for yourself. How would you like to approach the day?', '/practise/identity'],
  day: ['A moment to practise', 'Remember to practise the quality you selected for today.', '/practise'],
  evening: ['Evening reflection', 'Before you sleep, reflect on one thing you learned today.', '/evening'],
} as const

function Shell() {
  const { ready, loadError, prefs, notif, toast, toastMsg } = useApp()
  const { updateReady } = usePwaStatus()
  const route = useRoute()
  const [banner, setBanner] = useState<keyof typeof MSG | null>(null)

  const refreshForUpdate = async () => {
    try { await applyPwaUpdate() } catch { toast('Could not refresh the app. Please try again.', 'err') }
  }

  useEffect(() => {
    const r = document.documentElement
    r.dataset.theme = prefs.theme; r.dataset.motion = prefs.reduceMotion ? 'reduce' : ''; r.dataset.text = prefs.largeText ? 'large' : ''
  }, [prefs])

  useEffect(() => {
    if (!notif.enabled) return
    const tick = () => {
      const n = new Date(), hm = `${pad(n.getHours())}:${pad(n.getMinutes())}`
      ;(['morning', 'day', 'evening'] as const).forEach(k => {
        const key = `pm.fired.${k}.${dateKey()}`
        if (notif[k].on && notif[k].time === hm && !sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1'); setBanner(k); showLocal(MSG[k][0], MSG[k][1])
        }
      })
    }
    tick(); const id = window.setInterval(tick, 20000); return () => window.clearInterval(id)
  }, [notif])

  if (!ready) return <p className="loading" role="status">Loading your journal…</p>
  if (!prefs.onboarded) return <Onboarding />
  const [p0, p1] = route.split('/').filter(Boolean)
  const page = !p0 ? <Home /> : p0 === 'practise' ? (p1 ? <PillarPage id={p1} /> : <Practice />) : p0 === 'shift' ? <PerspectiveShift />
    : p0 === 'journal' ? <Journal /> : p0 === 'growth' ? <Growth /> : p0 === 'settings' ? <Settings /> : p0 === 'challenge' ? <Challenge /> : p0 === 'evening' ? <Evening /> : <Home />
  return (
    <div className="shell">
      <a className="skip" href="#main">Skip to content</a>
      <Nav route={route} />
      {updateReady && <div className="banner update-banner" role="status"><strong>A new version is ready.</strong><button className="btn ghost small" onClick={() => void refreshForUpdate()}>Refresh</button></div>}
      <main id="main" tabIndex={-1}>
        {loadError && <p className="safety" role="alert">Your saved entries could not be loaded. Your browser may be blocking storage, so new entries may not be saved.</p>}
        {banner && <div className="banner" role="status"><div><strong>{MSG[banner][0]}</strong><p>{MSG[banner][1]}</p></div><div className="row"><a className="btn small" href={`#${MSG[banner][2]}`} onClick={() => setBanner(null)}>Open</a><button className="btn ghost small" onClick={() => setBanner(null)}>Dismiss</button></div></div>}
        {page}
      </main>
      <div className="toast" role="status" aria-live="polite">{toastMsg && <span className={toastMsg.kind}>{toastMsg.m}</span>}</div>
    </div>
  )
}
export default function App() { return <AppProvider><Shell /></AppProvider> }
