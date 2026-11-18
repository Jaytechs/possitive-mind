import type { Entry } from '../../types'

export function exportJournal(entries: Entry[]) {
  const read = (k: string) => { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
  const payload = {
    app: 'Positive Mind', exportedAt: new Date().toISOString(),
    preferences: read('pm.prefs'), notificationPreferences: read('pm.notif'), challenge: read('pm.challenge'),
    entries,
  }
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `positive-mind-export-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
