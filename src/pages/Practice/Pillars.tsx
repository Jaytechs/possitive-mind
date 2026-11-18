import { useState } from 'react'
import { CONFIDENCE_ITEMS, GRATITUDE_PROMPTS, KINDNESS_ACTS, QUALITIES } from '../../data/content'
import { useApp } from '../../hooks/useApp'
import { Chips, Safety, TextArea } from '../../components/common/ui'
import { dateKey } from '../../utils/date'
import type { EntryData } from '../../types'

function useSaver() {
  const { save, toast } = useApp()
  return async (type: Parameters<typeof save>[0], data: EntryData, msg = 'Saved.') => {
    const e = await save(type, data)
    if (e) toast(msg)
    return !!e
  }
}

export function Clarity() {
  const save = useSaver()
  const blank = { troubling: '', why: '', feeling: '', control: '', accept: '', step: '' }
  const [f, setF] = useState(blank)
  const [err, setErr] = useState<Record<string, string>>({})
  const set = (k: keyof typeof blank) => (v: string) => setF(p => ({ ...p, [k]: v }))
  const submit = async () => {
    const e: Record<string, string> = {}
    if (!f.troubling.trim()) e.troubling = 'Write at least a few words about what is on your mind.'
    if (!f.step.trim()) e.step = 'Choose one small step, even a very small one.'
    setErr(e); if (Object.keys(e).length) return
    if (await save('clarity', f, 'Saved to your journal.')) setF(blank)
  }
  return (
    <form className="stack" onSubmit={ev => { ev.preventDefault(); void submit() }} noValidate>
      <p className="note">You are not trying to force a feeling away. You are putting it where you can see it.</p>
      <TextArea id="c1" label="What has been occupying your mind lately?" value={f.troubling} onChange={set('troubling')} rows={4} error={err.troubling} />
      <TextArea id="c2" label="Why is this bothering you?" value={f.why} onChange={set('why')} />
      <TextArea id="c3" label="What are you feeling?" value={f.feeling} onChange={set('feeling')} rows={2} />
      <TextArea id="c4" label="Is there anything you can do about it?" hint="Separate what is in your hands from what is not." value={f.control} onChange={set('control')} />
      <TextArea id="c5" label="What might you need to accept?" value={f.accept} onChange={set('accept')} rows={2} />
      <TextArea id="c6" label="What is one small step you can take?" value={f.step} onChange={set('step')} rows={2} error={err.step} />
      <Safety texts={Object.values(f)} />
      <button className="btn" type="submit">Save privately</button>
    </form>
  )
}

export function Gratitude() {
  const save = useSaver()
  const blank = { one: '', oneWhy: '', two: '', twoWhy: '', three: '', threeWhy: '' }
  const [f, setF] = useState(blank)
  const [p, setP] = useState(-1)
  const [err, setErr] = useState('')
  const set = (k: keyof typeof blank) => (v: string) => setF(s => ({ ...s, [k]: v }))
  const rows: [keyof typeof blank, keyof typeof blank, string][] = [['one', 'oneWhy', 'First'], ['two', 'twoWhy', 'Second'], ['three', 'threeWhy', 'Third']]
  const submit = async () => {
    if (!f.one.trim()) { setErr('Add at least one thing. Ordinary things count.'); return }
    setErr(''); if (await save('gratitude', f, 'Gratitude saved.')) { setF(blank); setP(-1) }
  }
  return (
    <form className="stack" onSubmit={ev => { ev.preventDefault(); void submit() }} noValidate>
      <p className="note">Gratitude does not mean your difficulties are small. It means noticing what is also true.</p>
      <div className="promptrow">
        <button type="button" className="btn ghost small" onClick={() => setP(x => (x + 1) % GRATITUDE_PROMPTS.length)}>{p < 0 ? 'Need a prompt?' : 'Another prompt'}</button>
        {p >= 0 && <p className="prompt" aria-live="polite">{GRATITUDE_PROMPTS[p]}</p>}
      </div>
      {rows.map(([a, b, n], i) => (
        <fieldset key={a}>
          <legend>{n} thing</legend>
          <TextArea id={`g${a}`} label="I am grateful for" value={f[a]} onChange={set(a)} rows={2} error={i === 0 ? err : undefined} />
          <TextArea id={`g${b}`} label="Why it matters to me" value={f[b]} onChange={set(b)} rows={2} />
        </fieldset>
      ))}
      <button className="btn" type="submit">Save</button>
    </form>
  )
}

export function Identity() {
  const { entries } = useApp()
  const save = useSaver()
  const [qs, setQs] = useState<string[]>([])
  const [action, setAction] = useState('')
  const [text, setText] = useState('')
  const [err, setErr] = useState('')
  const sel = QUALITIES.filter(q => qs.includes(q.name))
  const first = sel[0]
  const today = [...entries].filter(e => e.type === 'intention' && e.date === dateKey()).pop()
  const choose = (a: string) => {
    setAction(a)
    if (first) setText(`Today I will practise ${first.name.toLowerCase()} by ${a}.`)
  }
  const submit = async () => {
    if (!qs.length) { setErr('Choose at least one quality.'); return }
    if (!text.trim()) { setErr('Write your intention, or choose an action above.'); return }
    setErr('')
    if (await save('intention', { quality: qs.join(', '), action, text })) { setQs([]); setAction(''); setText('') }
  }
  return (
    <form className="stack" onSubmit={ev => { ev.preventDefault(); void submit() }} noValidate>
      {today && <p className="note">Today’s intention so far: {String((today.data as Record<string, string>).text)}</p>}
      <p className="note">This is not about repeating affirmations. It is about choosing who you want to practise being, then doing one thing that shows it.</p>
      <div className="field">
        <span className="lbl" id="ql">What quality would you like to practise today?</span>
        <Chips label="Qualities" options={QUALITIES.map(q => q.name)} value={qs} onChange={v => { setQs(v); setAction(''); setText('') }} multi />
      </div>
      {sel.length > 0 && (
        <ul className="blurbs">{sel.map(q => <li key={q.id}><strong>{q.name}.</strong> {q.blurb}</li>)}</ul>
      )}
      {first && (
        <fieldset>
          <legend>An action that shows {first.name.toLowerCase()}</legend>
          {first.actions.map(a => (
            <label key={a} className="radio"><input type="radio" name="act" checked={action === a} onChange={() => choose(a)} />{a}</label>
          ))}
        </fieldset>
      )}
      <TextArea id="intent" label="Your intention for today" hint="Edit it so it sounds like you." value={text} onChange={setText} rows={2} error={err} />
      <button className="btn" type="submit">Set my intention</button>
    </form>
  )
}

export function Confidence() {
  const { entries, save, update, toast } = useApp()
  const today = entries.find(e => e.type === 'practice' && e.date === dateKey())
  const checked = today ? ((today.data as { checked: string[] }).checked) : []
  const toggle = async (item: string) => {
    const next = checked.includes(item) ? checked.filter(c => c !== item) : [...checked, item]
    if (today) await update(today.id, { checked: next })
    else await save('practice', { pillar: 'confidence', checked: next })
    if (next.length === CONFIDENCE_ITEMS.length) toast('All done for today. Well looked after.')
  }
  return (
    <div className="stack">
      <p className="note">This is about self-respect, not perfection or looking a certain way. Do what is realistic today.</p>
      <ul className="checklist">
        {CONFIDENCE_ITEMS.map(i => (
          <li key={i}><label className="check"><input type="checkbox" checked={checked.includes(i)} onChange={() => void toggle(i)} /><span>{i}</span></label></li>
        ))}
      </ul>
      <p className="muted" aria-live="polite">{checked.length} of {CONFIDENCE_ITEMS.length} today. Your ticks save automatically.</p>
    </div>
  )
}

export function Kindness() {
  const save = useSaver()
  const [act, setAct] = useState<string[]>([])
  const [own, setOwn] = useState('')
  const [ref, setRef] = useState('')
  const [err, setErr] = useState('')
  const submit = async () => {
    const a = own.trim() || act[0]
    if (!a) { setErr('Choose an act or write your own.'); return }
    setErr(''); if (await save('kindness', { act: a, reflection: ref })) { setAct([]); setOwn(''); setRef('') }
  }
  return (
    <form className="stack" onSubmit={ev => { ev.preventDefault(); void submit() }} noValidate>
      <p className="note">Kindness does not mean allowing others to disrespect you. Respecting others and maintaining healthy boundaries belong together.</p>
      <div className="field">
        <span className="lbl">Which act did you do, or will you do?</span>
        <Chips label="Acts of kindness" options={KINDNESS_ACTS} value={act} onChange={v => { setAct(v); setOwn('') }} />
      </div>
      <div className="field">
        <label htmlFor="own">Or write your own</label>
        <input id="own" type="text" value={own} onChange={e => { setOwn(e.target.value); setAct([]) }} />
        {err && <span className="err" role="alert">{err}</span>}
      </div>
      <TextArea id="kref" label="How did it go?" hint="What did you notice, in them or in yourself?" value={ref} onChange={setRef} />
      <button className="btn" type="submit">Record this</button>
    </form>
  )
}
