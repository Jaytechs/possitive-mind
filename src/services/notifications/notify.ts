export const notificationsSupported = () => typeof Notification !== 'undefined'
export const permission = () => (notificationsSupported() ? Notification.permission : 'unsupported')
export async function askPermission() {
  if (!notificationsSupported()) return 'unsupported'
  return Notification.requestPermission()
}
/** Shown only while the app is open. Background push is not implemented. */
export function showLocal(title: string, body: string) {
  if (notificationsSupported() && Notification.permission === 'granted') {
    try { new Notification(title, { body, icon: 'icons/icon-192.png' }) } catch { /* some mobile browsers need a service worker */ }
  }
}
