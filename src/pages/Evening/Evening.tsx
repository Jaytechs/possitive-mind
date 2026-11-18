import { useState } from 'react'
import { useApp } from '../../hooks/useApp'
import { Chips, PageHead, Safety, TextArea } from '../../components/common/ui'
import { dateKey } from '../../utils/date'
import { go } from '../../hooks/useRoute'

export function Evening() {
  const { entries, save, toast } = useApp()
  const q = [...entries].filter(e => e.type === 'intention' && e.date === dateKey()).pop()
  const quality = q ? String((q.data as Record<string, string>).quality) : ''
  const blank = { well: '', challenged: '', response: '', practised: '', learned: '', improve: '' }
  const [f, setF] = useState(blank)
  const [err, setErr] = useState('')
  const set = (k: keyof typeof blank) => (v: string) => setF(p => ({ ...p, [k]: v }))
  const submit = async () => {
    if (!Object.values(f).some(v => v.trim())) { setErr('Answer at least one question. Short answers are fine.'); return }
    if (await save('evening', f)) { toast('Reflection saved. Rest well.'); go('/') }
  }
  return (
    <>
      <PageHead title="Evening reflection" sub="A few minutes to look back. Skip anything that does not fit." back={{ href: '/', label: 'Home' }} />
      <form className="stack" onSubmit={e => { e.preventDefault(); void submit() }} noValidate>
        <TextArea id="e1" label="What went well today?" value={f.well} onChange={set('well')} rows={2} />
        <TextArea id="e2" label="What challenged you?" value={f.challenged} onChange={set('challenged')} rows={2} />
        <TextArea id="e3" label="How did you respond?" value={f.response} onChange={set('response')} rows={2} />
        <div className="field">
          <span className="lbl">{quality ? `Did you practise ${quality.toLowerCase()} today?` : 'Did you practise the quality you chose this morning?'}</span>
          <Chips label="Practised" options={['Yes', 'In part', 'Not today']} value={f.practised ? [f.practised] : []} onChange={v => set('practised')(v[0])} />
        </div>
        <TextArea id="e5" label="What did you learn about yourself?" value={f.learned} onChange={set('learned')} rows={2} />
        <TextArea id="e6" label="What is one thing you want to improve tomorrow?" value={f.improve} onChange={set('improve')} rows={2} error={err} />
        <Safety texts={Object.values(f)} />
        <button className="btn" type="submit">Save reflection</button>
      </form>
    </>
  )
}
