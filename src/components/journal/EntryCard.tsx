import type { Entry } from '../../types'
import { HIDDEN_KEYS, KEY_LABEL, TYPE_LABEL } from '../../data/content'
import { fmtDate } from '../../utils/date'

export function entryRows(e: Entry): [string, string][] {
  const rows: [string, string][] = []
  for (const [k, v] of Object.entries(e.data)) {
    if (HIDDEN_KEYS.includes(k)) continue
    const s = Array.isArray(v) ? v.join(', ') : String(v ?? '')
    if (s.trim()) rows.push([KEY_LABEL[k] ?? k, s])
  }
  return rows
}

export function summary(e: Entry): string {
  const d = e.data as Record<string, string | string[]>
  const pick = d.troubling || d.one || d.text || d.act || d.situation || d.well || d.reflection
  if (pick) return String(pick)
  if (e.type === 'practice') return `${(d.checked as string[]).length} self-respect items`
  return TYPE_LABEL[e.type]
}

export function EntryBody({ e }: { e: Entry }) {
  return (
    <dl className="rows">
      {entryRows(e).map(([k, v], i) => (<div key={i}><dt>{k}</dt><dd>{v}</dd></div>))}
    </dl>
  )
}

export function History({ entries, empty }: { entries: Entry[]; empty: string }) {
  const sorted = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  if (!sorted.length) return <p className="muted">{empty}</p>
  return (
    <ul className="history">
      {sorted.map(e => (
        <li key={e.id}>
          <details>
            <summary><span className="hdate">{fmtDate(e.date)}</span><span className="hsum">{summary(e)}</span></summary>
            <EntryBody e={e} />
          </details>
        </li>
      ))}
    </ul>
  )
}
