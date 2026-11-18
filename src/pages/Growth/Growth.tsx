import { useState } from 'react'
import { CHALLENGE_DAYS } from '../../data/content'
import { useApp } from '../../hooks/useApp'
import { Empty, PageHead, TextArea } from '../../components/common/ui'
import { fmtDate, lastDays } from '../../utils/date'

export function Growth() {
  const { entries, challenge, save, toast } = useApp()
  const [txt, setTxt] = useState('')
  const count = (t: string) => entries.filter(e => e.type === t).length
  const q = 'Have you responded to any situation differently this week?'
  const weekly = entries.filter(e => e.type === 'weekly').sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const qualities: Record<string, number> = {}
  entries.filter(e => e.type === 'intention').forEach(e => String((e.data as Record<string, string>).quality).split(', ').forEach(n => { if (n) qualities[n] = (qualities[n] || 0) + 1 }))
  const days = lastDays(14)
  const active = new Set(entries.map(e => e.date))
  const completed = ['clarity', 'gratitude', 'intention', 'practice', 'kindness'].reduce((n, t) => n + count(t), 0)
  const stats: [string, number][] = [['Practices completed', completed], ['Reflection sessions', count('shift') + count('evening')], ['Gratitude entries', count('gratitude')], ['Acts of kindness', count('kindness')], ['Weekly reflections', count('weekly')]]
  return (
    <>
      <PageHead title="Growth" sub="What you have actually done, counted from your own records." />
      {!entries.length ? <Empty title="Nothing to show yet" action={{ href: '/practise', label: 'Try a practice' }}>Once you save your first entry, a simple summary will appear here. There are no scores or rankings.</Empty> : (
        <>
          <dl className="stats">{stats.map(([l, n]) => <div key={l}><dd>{n}</dd><dt>{l}</dt></div>)}</dl>
          <section className="block"><h2>Last 14 days</h2>
            <ul className="strip" aria-label="Days with at least one entry">
              {days.map(d => <li key={d} className={active.has(d) ? 'on' : ''}><span className="vh">{fmtDate(d)}{active.has(d) ? ', active' : ', no entries'}</span></li>)}
            </ul>
            <p className="muted">Filled days had at least one entry. Gaps are normal and do not take anything away.</p></section>
          <section className="block"><h2>Qualities practised</h2>
            {!Object.keys(qualities).length ? <p className="muted">Choose a quality in Today I Am to see it here.</p> : (
              <ul className="bars">{Object.entries(qualities).sort((a, b) => b[1] - a[1]).map(([n, c]) => <li key={n}><span>{n}</span><span className="bar"><i style={{ width: `${(c / Math.max(...Object.values(qualities))) * 100}%` }} /></span><b>{c}</b></li>)}</ul>)}
          </section>
        </>)}
      <section className="block"><h2>First 7 Days</h2>
        <p>{challenge.started ? `${Object.keys(challenge.done).length} of ${CHALLENGE_DAYS.length} days completed.` : 'Not started.'} <a href="#/challenge">Open</a></p></section>
      <section className="block"><h2>Weekly reflection</h2>
        <form className="stack" onSubmit={async e => { e.preventDefault(); if (!txt.trim()) return; if (await save('weekly', { question: q, reflection: txt })) { setTxt(''); toast('Reflection saved.') } }}>
          <TextArea id="wr" label={q} value={txt} onChange={setTxt} rows={4} />
          <button className="btn" type="submit">Save reflection</button></form>
        {weekly.slice(0, 3).map(w => <p key={w.id} className="muted"><b>{fmtDate(w.date)}:</b> {(w.data as Record<string, string>).reflection}</p>)}
      </section>
    </>
  )
}
