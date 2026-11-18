import { useState } from 'react'
import { GOALS, TAGLINE } from '../../data/content'
import { useApp } from '../../hooks/useApp'
import { Chips, TextArea } from '../../components/common/ui'

export function Onboarding() {
  const { setPrefs } = useApp()
  const [s, setS] = useState(0)
  const [goals, setGoals] = useState<string[]>([])
  const [routine, setRoutine] = useState('combination')
  const [identity, setIdentity] = useState('')
  const finish = () => { setPrefs(p => ({ ...p, onboarded: true, goals, routine, identity })); location.hash = '/' }
  const R: Record<string, string> = { Morning: 'morning', Daytime: 'daytime', Evening: 'evening', 'A combination': 'combination' }
  const rl = Object.keys(R).find(k => R[k] === routine) as string
  const skip = s > 0 && s < 4
  return (
    <main className="onboard" id="main">
      <p className="step" aria-live="polite">{s + 1} of 5</p>
      {s === 0 && <><h1>Positive Mind</h1><p className="serif big">{TAGLINE}</p><p>A private space for daily personal development. Positive thinking is not about expecting everything to go right. It is about learning how to respond when things go wrong.</p></>}
      {s === 1 && <><h1>What would you like to work on?</h1><Chips label="Goals" options={GOALS} value={goals} onChange={setGoals} multi /></>}
      {s === 2 && <><h1>How would you like your day to run?</h1><Chips label="Routine" options={Object.keys(R)} value={[rl]} onChange={v => setRoutine(R[v[0]])} /><p className="muted">You can change this later. Nothing here is compulsory.</p></>}
      {s === 3 && <><h1>What kind of person are you working towards becoming?</h1><TextArea id="idn" label="In your own words" hint="A sentence is enough." value={identity} onChange={setIdentity} rows={4} /></>}
      {s === 4 && <><h1>Ready when you are</h1><p>Your home screen shows a few things to do each day. Everything you write stays on this device. There is no account to create.</p></>}
      <div className="row wrap">
        {s > 0 && <button className="btn ghost" onClick={() => setS(s - 1)}>Back</button>}
        {s < 4 ? <button className="btn" onClick={() => setS(s + 1)}>{s === 0 ? 'Get started' : 'Continue'}</button> : <button className="btn" onClick={finish}>Begin my journey</button>}
        {skip && <button className="linkbtn" onClick={() => setS(s + 1)}>Skip this</button>}
      </div>
    </main>
  )
}
