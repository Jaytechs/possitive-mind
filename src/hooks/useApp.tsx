import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { ChallengeProgress, Entry, EntryData, EntryType, NotificationPreferences, UserPreferences } from '../types'
import { clearEntries, getAllEntries, putEntry, removeEntry } from '../services/database/db'
import { dateKey, uid } from '../utils/date'

function useLocal<T extends object>(key: string, init: T) {
  const [v, setV] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? { ...init, ...JSON.parse(s) } : init } catch { return init }
  })
  const set = useCallback((f: T | ((p: T) => T)) => {
    setV(prev => {
      const n = typeof f === 'function' ? (f as (p: T) => T)(prev) : f
      try { localStorage.setItem(key, JSON.stringify(n)) } catch { /* storage unavailable */ }
      return n
    })
  }, [key])
  return [v, set] as const
}

export const defaultPrefs: UserPreferences = { onboarded: false, goals: [], routine: 'combination', identity: '', theme: 'system', reduceMotion: false, largeText: false }
const defaultNotif: NotificationPreferences = {
  enabled: false,
  morning: { on: true, time: '07:30' }, day: { on: false, time: '13:00' }, evening: { on: true, time: '20:30' },
}
const defaultChallenge: ChallengeProgress = { started: false, startedAt: '', done: {}, skipped: [] }

interface Ctx {
  entries: Entry[]; ready: boolean; loadError: boolean
  prefs: UserPreferences; setPrefs: (f: UserPreferences | ((p: UserPreferences) => UserPreferences)) => void
  notif: NotificationPreferences; setNotif: (f: NotificationPreferences | ((p: NotificationPreferences) => NotificationPreferences)) => void
  challenge: ChallengeProgress; setChallenge: (f: ChallengeProgress | ((p: ChallengeProgress) => ChallengeProgress)) => void
  save: (type: EntryType, data: EntryData) => Promise<Entry | null>
  update: (id: string, data: EntryData) => Promise<boolean>
  remove: (id: string) => Promise<boolean>
  wipe: () => Promise<void>
  toast: (m: string, kind?: 'ok' | 'err') => void
  toastMsg: { m: string; kind: 'ok' | 'err' } | null
}
const AppCtx = createContext<Ctx | null>(null)
// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => { const c = useContext(AppCtx); if (!c) throw new Error('AppProvider missing'); return c }

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [ready, setReady] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [prefs, setPrefs] = useLocal('pm.prefs', defaultPrefs)
  const [notif, setNotif] = useLocal('pm.notif', defaultNotif)
  const [challenge, setChallenge] = useLocal('pm.challenge', defaultChallenge)
  const [toastMsg, setToastMsg] = useState<Ctx['toastMsg']>(null)
  const timer = useRef<number>(0)

  useEffect(() => {
    getAllEntries().then(setEntries).catch(() => setLoadError(true)).finally(() => setReady(true))
  }, [])

  const toast = useCallback((m: string, kind: 'ok' | 'err' = 'ok') => {
    setToastMsg({ m, kind }); window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToastMsg(null), 3200)
  }, [])

  const save = useCallback(async (type: EntryType, data: EntryData) => {
    const now = new Date().toISOString()
    const e = { id: uid(), type, date: dateKey(), createdAt: now, updatedAt: now, data } as Entry
    try { await putEntry(e); setEntries(p => [...p, e]); return e }
    catch { toast('Could not save. Your browser may be blocking storage.', 'err'); return null }
  }, [toast])

  const update = useCallback(async (id: string, data: EntryData) => {
    const cur = entries.find(x => x.id === id); if (!cur) return false
    const e = { ...cur, data: { ...cur.data, ...data }, updatedAt: new Date().toISOString() } as Entry
    try { await putEntry(e); setEntries(p => p.map(x => (x.id === id ? e : x))); return true }
    catch { toast('Could not save changes.', 'err'); return false }
  }, [entries, toast])

  const remove = useCallback(async (id: string) => {
    try { await removeEntry(id); setEntries(p => p.filter(x => x.id !== id)); return true }
    catch { toast('Could not delete that entry.', 'err'); return false }
  }, [toast])

  const wipe = useCallback(async () => {
    await clearEntries()
    Object.keys(localStorage).filter(k => k.startsWith('pm.')).forEach(k => localStorage.removeItem(k))
    location.hash = '/'; location.reload()
  }, [])

  const value = useMemo(() => ({
    entries, ready, loadError, prefs, setPrefs, notif, setNotif, challenge, setChallenge, save, update, remove, wipe, toast, toastMsg,
  }), [entries, ready, loadError, prefs, setPrefs, notif, setNotif, challenge, setChallenge, save, update, remove, wipe, toast, toastMsg])
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
