import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { HIDDEN_KEYS, KEY_LABEL, TYPE_LABEL } from '../../data/content'
import { useApp } from '../../hooks/useApp'
import { Confirm, Empty, Modal, PageHead, TextArea } from '../../components/common/ui'
import { EntryBody, entryRows, summary } from '../../components/journal/EntryCard'
import { exportJournal } from '../../services/export/export'
import { fmtDate } from '../../utils/date'
import type { Entry, EntryType } from '../../types'

export function Journal() {
  const { entries, update, remove, toast } = useApp()
  const [q, setQ] = useState(''); const [type, setType] = useState<'all' | EntryType>('all')
  const [from, setFrom] = useState(''); const [to, setTo] = useState('')
  const [edit, setEdit] = useState<Entry | null>(null); const [del, setDel] = useState<Entry | null>(null)
  const [draft, setDraft] = useState<Record<string, string>>({})
  const list = useMemo(() => entries.filter(e => (type === 'all' || e.type === type) && (!from || e.date >= from) && (!to || e.date <= to)
    && (!q.trim() || entryRows(e).some(([, v]) => v.toLowerCase().includes(q.trim().toLowerCase()))))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [entries, q, type, from, to])
  const startEdit = (e: Entry) => {
    const d: Record<string, string> = {}
    Object.entries(e.data).forEach(([k, v]) => { if (typeof v === 'string' && !HIDDEN_KEYS.includes(k) && k !== 'status') d[k] = v })
    setDraft(d); setEdit(e)
  }
  const groups = list.reduce<Record<string, Entry[]>>((m, e) => { (m[e.date] ||= []).push(e); return m }, {})
  return (
    <>
      <PageHead title="Journal" sub="Everything you have written, kept on this device." />
      {!entries.length ? <Empty title="Your journal is empty" action={{ href: '/practise', label: 'Start a practice' }}>Entries from your practices, reflections and Perspective Shift sessions appear here.</Empty> : (
        <>
          <div className="filters">
            <div className="field"><label htmlFor="jq">Search your entries</label><input id="jq" type="search" value={q} onChange={e => setQ(e.target.value)} /></div>
            <div className="field"><label htmlFor="jt">Type</label>
              <select id="jt" value={type} onChange={e => setType(e.target.value as 'all')}><option value="all">All entries</option>
                {(Object.keys(TYPE_LABEL) as EntryType[]).map(t => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}</select></div>
            <div className="field"><label htmlFor="jf">From</label><input id="jf" type="date" value={from} onChange={e => setFrom(e.target.value)} /></div>
            <div className="field"><label htmlFor="jto">To</label><input id="jto" type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
          </div>
          <p className="muted">{list.length} of {entries.length} entries. <button className="linkbtn" onClick={() => { exportJournal(entries); toast('Export downloaded.') }}><Download size={14} aria-hidden="true" /> Export as JSON</button></p>
          {!list.length && <p className="note">Nothing matches those filters.</p>}
          {Object.entries(groups).map(([date, es]) => (
            <section key={date} className="day"><h2>{fmtDate(date)}</h2>
              {es.map(e => (
                <article key={e.id} className="entry">
                  <p className="small-label">{TYPE_LABEL[e.type]}</p>
                  <details><summary>{summary(e).slice(0, 110)}</summary><EntryBody e={e} />
                    <div className="row"><button className="btn ghost small" onClick={() => startEdit(e)}>Edit</button><button className="btn ghost small" onClick={() => setDel(e)}>Delete</button></div>
                  </details>
                </article>))}
            </section>))}
        </>)}
      {edit && (
        <Modal title="Edit entry" onClose={() => setEdit(null)}>
          <form className="stack" onSubmit={async ev => { ev.preventDefault(); if (await update(edit.id, draft)) { toast('Changes saved.'); setEdit(null) } }}>
            {Object.keys(draft).map(k => <TextArea key={k} id={`ed-${k}`} label={KEY_LABEL[k] ?? k} value={draft[k]} onChange={v => setDraft(p => ({ ...p, [k]: v }))} rows={2} />)}
            {!Object.keys(draft).length && <p className="muted">This entry has nothing to edit. Checklist items change from the Practise page.</p>}
            <div className="row end"><button type="button" className="btn ghost" onClick={() => setEdit(null)}>Cancel</button><button className="btn" type="submit">Save changes</button></div>
          </form>
        </Modal>)}
      {del && <Confirm title="Delete this entry?" text="This permanently removes it from your device. It cannot be undone." confirmLabel="Delete entry" onClose={() => setDel(null)} onConfirm={async () => { if (await remove(del.id)) toast('Entry deleted.'); setDel(null) }} />}
    </>
  )
}
