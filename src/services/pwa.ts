import { useSyncExternalStore } from 'react'
import { registerSW } from 'virtual:pwa-register'

interface PwaStatus {
  offlineReady: boolean
  updateReady: boolean
}

const readOfflineReady = () => {
  try { return localStorage.getItem('positive-mind.offlineReady') === 'true' } catch { return false }
}

let status: PwaStatus = { offlineReady: readOfflineReady(), updateReady: false }
let updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined
const listeners = new Set<() => void>()

const publish = (next: Partial<PwaStatus>) => {
  status = { ...status, ...next }
  listeners.forEach(listener => listener())
}

export function subscribePwa(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const getPwaStatus = () => status

export function usePwaStatus() {
  return useSyncExternalStore(subscribePwa, getPwaStatus, getPwaStatus)
}

export function registerServiceWorker() {
  updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      publish({ updateReady: true })
    },
    onOfflineReady() {
      try { localStorage.setItem('positive-mind.offlineReady', 'true') } catch { /* storage unavailable */ }
      publish({ offlineReady: true })
    },
  })
}

export async function applyPwaUpdate() {
  if (!updateSW) throw new Error('The service worker has not been registered.')
  await updateSW(true)
}
