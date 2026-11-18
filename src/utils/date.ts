export const pad = (n: number) => String(n).padStart(2, '0')
export const dateKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
export const greeting = (d = new Date()) => {
  const h = d.getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}
export const fmtDate = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
export const lastDays = (n: number) => {
  const out: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i); out.push(dateKey(d))
  }
  return out
}
export const dayOfYear = () => {
  const n = new Date()
  return Math.floor((Number(new Date(n.getFullYear(), n.getMonth(), n.getDate())) - Number(new Date(n.getFullYear(), 0, 0))) / 864e5)
}
