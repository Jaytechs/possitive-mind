import { useState } from 'react'
import { CHALLENGE_DAYS } from '../../data/content'
import { useApp } from '../../hooks/useApp'
import { PageHead, TextArea } from '../../components/common/ui'

export function Challenge() {
  const { challenge, setChallenge, save, toast, entries } = useApp()
  const [text, setText] = useState('')
  const handled = CHALLENGE_DAYS.filter(d => challenge.done[d.day] || challenge.skipped.includes(d.day)).length
  const saved = entries.some(e => e.type === 'weekly' && (e.data as Record<string, string>).question === 'Which practices do I want to keep?')
  const mark = (day: number, kind: 'done' | 'skip' | 'reset') => setChallenge(c => {
    const done = { ...c.done }; let skipped = c.skipped.filter(x => x !== day); delete done[day]
    if (kind === 'done') done[day] = new Date().toISOString()
    if (kind === 'skip') skipped = [...skipped, day]
    return { ...c, started: true, startedAt: c.startedAt || new Date().toISOString(), done, skipped }
  })
  return (
    <>
      <PageHead title="Your First 7 Days" sub="One practice a day, at your own pace. Skip, repeat or come back later. Nothing is lost if you miss a day." />
      {!challenge.started && <button className="btn" onClick={() => setChallenge(c => ({ ...c, started: true, startedAt: new Date().toISOString() }))}>Start the week</button>}
      <ol className="days">
        {CHALLENGE_DAYS.map(d => {
          const done = !!challenge.done[d.day], skip = challenge.skipped.includes(d.day)
          return (
            <li key={d.day} className={done ? 'done' : skip ? 'skip' : ''}>
              <div className="dayn" aria-hidden="true">{d.day}</div>
              <div>
                <h2>Day {d.day}: {d.title}</h2>
                <p>{d.activity}</p>
                <div className="row wrap">
                  <a className="btn small" href={`#${d.link}`}>{done ? 'Revisit' : 'Open'}</a>
                  {!done && <button className="btn ghost small" onClick={() => mark(d.day, 'done')}>Mark done</button>}
                  {!done && !skip && <button className="btn ghost small" onClick={() => mark(d.day, 'skip')}>Skip for now</button>}
                  {(done || skip) && <button className="btn ghost small" onClick={() => mark(d.day, 'reset')}>Undo</button>}
                  <span className="muted">{done ? 'Completed' : skip ? 'Skipped' : 'Waiting'}</span>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
      {handled === CHALLENGE_DAYS.length && (
        <section className="block">
          <h2>Looking back</h2>
          <p>You completed {Object.keys(challenge.done).length} of 7 days. That is a real start, however it went.</p>
          {saved ? <p className="muted">Your reflection is saved in your journal.</p> : (
            <form className="stack" onSubmit={async e => { e.preventDefault(); if (!text.trim()) return; if (await save('weekly', { question: 'Which practices do I want to keep?', reflection: text })) toast('Reflection saved.') }}>
              <TextArea id="wk" label="Which practices do you want to keep, and what did you notice about yourself?" value={text} onChange={setText} rows={4} />
              <button className="btn" type="submit">Save reflection</button>
            </form>)}
        </section>
      )}
    </>
  )
}
