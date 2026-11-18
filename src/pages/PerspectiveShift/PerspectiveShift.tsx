import { useState } from 'react'
import { EMOTIONS, NEXT_TYPES, SITUATIONS } from '../../data/content'
import { useApp } from '../../hooks/useApp'
import { Chips, Confirm, PageHead, Safety, TextArea } from '../../components/common/ui'
import { fmtDate } from '../../utils/date'
import type { PerspectiveShiftSession } from '../../types'

interface Draft {
  active: boolean; step: number
  a: { situation: string; emotions: string[]; story: string; facts: string; assumption: string; alternative: string; factors: string; control: string; outside: string; balanced: string; nextType: string; nextStep: string; support: string; status: 'ongoing' | 'resolved' }
}
const blank: Draft = { active: false, step: 0, a: { situation: '', emotions: [], story: '', facts: '', assumption: '', alternative: '', factors: '', control: '', outside: '', balanced: '', nextType: NEXT_TYPES[0], nextStep: '', support: '', status: 'ongoing' } }
const KEY = 'pm.shiftDraft'
const load = (): Draft => { try { const d = JSON.parse(localStorage.getItem(KEY) || 'null'); return d ? { ...blank, ...d, a: { ...blank.a, ...d.a } } : blank } catch { return blank } }
const STEPS = ['What happened', 'Feelings', 'Your story', 'Examine', 'Balanced view', 'Next action', 'Save']

export function PerspectiveShift() {
  const { entries, save, update, toast } = useApp()
  const [d, setD] = useState<Draft>(load)
  const [err, setErr] = useState('')
  const [discard, setDiscard] = useState(false)
  const put = (n: Draft) => { setD(n); try { localStorage.setItem(KEY, JSON.stringify(n)) } catch { /* ignore */ } }
  const set = <K extends keyof Draft['a']>(k: K) => (v: Draft['a'][K]) => put({ ...d, a: { ...d.a, [k]: v } })
  const past = entries.filter((e): e is PerspectiveShiftSession => e.type === 'shift').sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const a = d.a

  const next = () => {
    if (d.step === 0 && !a.situation.trim()) { setErr('Describe what happened, in a sentence or two.'); return }
    if (d.step === 1 && !a.emotions.length) { setErr('Choose at least one feeling. “Other” is fine.'); return }
    if (d.step === 2 && !a.story.trim()) { setErr('Write what you are telling yourself, even if it sounds harsh.'); return }
    if (d.step === 4 && !a.balanced.trim()) { setErr('Write a balanced view in your own words. It does not need to be cheerful, just fair.'); return }
    if (d.step === 5 && !a.nextStep.trim()) { setErr('Write one thing you will do next. Resting or asking for help counts.'); return }
    setErr(''); put({ ...d, step: d.step + 1 })
  }
  const finish = async () => {
    const e = await save('shift', { ...a })
    if (e) { put(blank); toast('Session saved to your journal.') }
  }

  if (!d.active) {
    return (
      <>
        <PageHead title="Perspective Shift" sub="A different perspective can help you find a better way forward." />
        <section className="stack">
          <p>Use this when something is weighing on you. It takes about ten minutes, and you can stop and come back. Nothing here is a diagnosis; it is a guided way of thinking something through.</p>
          <div className="field">
            <span className="lbl">Start from a common situation, or begin with your own words</span>
            <div className="chips">
              {SITUATIONS.map(s => <button key={s.label} type="button" className="chip" onClick={() => put({ ...blank, active: true, a: { ...blank.a, situation: s.starter } })}>{s.label}</button>)}
            </div>
          </div>
          <button className="btn" onClick={() => put({ ...blank, active: true })}>Begin with my own words</button>
        </section>
        <section className="block">
          <h2>Previous sessions</h2>
          {!past.length && <p className="muted">Your saved sessions will appear here, and you can mark each as resolved or still ongoing.</p>}
          <ul className="history">
            {past.map(s => (
              <li key={s.id}>
                <details>
                  <summary><span className="hdate">{fmtDate(s.date)}</span><span className="hsum">{s.data.situation}</span><span className={`pill ${s.data.status}`}>{s.data.status === 'resolved' ? 'Resolved' : 'Ongoing'}</span></summary>
                  <dl className="rows">
                    <div><dt>Feelings</dt><dd>{s.data.emotions.join(', ')}</dd></div>
                    <div><dt>What I told myself</dt><dd>{s.data.story}</dd></div>
                    <div><dt>A balanced view</dt><dd>{s.data.balanced}</dd></div>
                    <div><dt>Next step</dt><dd>{s.data.nextType}: {s.data.nextStep}</dd></div>
                  </dl>
                  <button className="btn ghost small" onClick={() => void update(s.id, { status: s.data.status === 'resolved' ? 'ongoing' : 'resolved' }).then(ok => ok && toast('Updated.'))}>
                    {s.data.status === 'resolved' ? 'Mark as ongoing' : 'Mark as resolved'}
                  </button>
                </details>
              </li>
            ))}
          </ul>
        </section>
      </>
    )
  }

  const body = [
    <TextArea key="0" id="s0" label="What happened?" hint="Stick to what actually occurred." value={a.situation} onChange={set('situation')} rows={6} error={err} />,
    <div key="1" className="field">
      <span className="lbl">How does this situation make you feel?</span>
      <span className="hint">Choose all that apply.</span>
      <Chips label="Feelings" options={EMOTIONS} value={a.emotions} onChange={set('emotions')} multi />
      {err && <span className="err" role="alert">{err}</span>}
    </div>,
    <TextArea key="2" id="s2" label="What are you telling yourself about this?" hint="This stays on your device. Be honest, even if it is harsh." value={a.story} onChange={set('story')} rows={5} error={err} />,
    <div key="3" className="stack">
      <TextArea id="s3a" label="What facts do you know?" value={a.facts} onChange={set('facts')} rows={2} />
      <TextArea id="s3b" label="Are you making an assumption about yourself?" value={a.assumption} onChange={set('assumption')} rows={2} />
      <TextArea id="s3c" label="Is there another reasonable way to understand what happened?" value={a.alternative} onChange={set('alternative')} rows={2} />
      <TextArea id="s3d" label="What may have contributed to this?" value={a.factors} onChange={set('factors')} rows={2} />
      <TextArea id="s3e" label="What is within your control?" value={a.control} onChange={set('control')} rows={2} />
      <TextArea id="s3f" label="What is outside your control?" value={a.outside} onChange={set('outside')} rows={2} />
    </div>,
    <div key="4" className="stack">
      <details className="recap"><summary>Look back at what you wrote</summary><p><b>You told yourself:</b> {a.story}</p><p><b>Facts:</b> {a.facts || '—'}</p><p><b>Another view:</b> {a.alternative || '—'}</p></details>
      <TextArea id="s4" label="Write a more balanced view" hint="Realistic, not forced. For example: “One result does not define my ability. I may need a different way of preparing, and I can ask for help.” You do not have to find something good in what happened." value={a.balanced} onChange={set('balanced')} rows={5} error={err} />
    </div>,
    <div key="5" className="stack">
      <div className="field"><span className="lbl">What is one thing you can do next?</span>
        <Chips label="Approach" options={NEXT_TYPES} value={[a.nextType]} onChange={v => set('nextType')(v[0])} /></div>
      <TextArea id="s5" label="Describe it" value={a.nextStep} onChange={set('nextStep')} rows={3} error={err} />
      <TextArea id="s5b" label="Who could support you? (optional)" hint="A friend, family member, lecturer, counsellor or someone you trust." value={a.support} onChange={set('support')} rows={2} />
    </div>,
    <div key="6" className="stack">
      <p>Your session will be saved privately on this device. You can revisit it from this page or your journal.</p>
      <div className="field"><span className="lbl">Where does this stand right now?</span>
        <Chips label="Status" options={['Still ongoing', 'Resolved']} value={[a.status === 'resolved' ? 'Resolved' : 'Still ongoing']} onChange={v => set('status')(v[0] === 'Resolved' ? 'resolved' : 'ongoing')} /></div>
      <dl className="rows"><div><dt>Balanced view</dt><dd>{a.balanced}</dd></div><div><dt>Next step</dt><dd>{a.nextStep}</dd></div></dl>
    </div>,
  ]

  return (
    <>
      <PageHead title="Perspective Shift" sub={`Step ${d.step + 1} of 7: ${STEPS[d.step]}`} />
      <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={7} aria-valuenow={d.step + 1} aria-label="Progress"><span style={{ width: `${((d.step + 1) / 7) * 100}%` }} /></div>
      <section className="stack focus">
        {body[d.step]}
        <Safety texts={[a.situation, a.story, a.balanced, a.nextStep]} />
        <div className="row">
          {d.step > 0 && <button className="btn ghost" onClick={() => { setErr(''); put({ ...d, step: d.step - 1 }) }}>Back</button>}
          {d.step < 6 ? <button className="btn" onClick={next}>Continue</button> : <button className="btn" onClick={() => void finish()}>Save session</button>}
        </div>
        <p className="muted">Your progress is saved as you go. <button className="linkbtn" onClick={() => setDiscard(true)}>Discard this reflection</button></p>
      </section>
      {discard && <Confirm title="Discard this reflection?" text="Everything you have written in this unfinished session will be deleted." confirmLabel="Discard" onClose={() => setDiscard(false)} onConfirm={() => { put(blank); setDiscard(false) }} />}
    </>
  )
}
