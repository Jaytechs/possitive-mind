import { CHALLENGE_DAYS, PILLARS, REFLECTIONS } from '../../data/content'
import { useApp } from '../../hooks/useApp'
import { dateKey, dayOfYear, greeting } from '../../utils/date'
import { Check, Circle } from 'lucide-react'

export function Home() {
  const { entries, prefs, challenge, notif } = useApp()
  const today = dateKey()
  const mine = entries.filter(e => e.date === today)
  const has = (t: string) => mine.some(e => e.type === t)
  const intent = [...mine].filter(e => e.type === 'intention').pop()?.data as Record<string, string> | undefined
  const daily = PILLARS[1 + (dayOfYear() % 4) + (dayOfYear() % 4 === 0 ? 0 : 0)]
  const practice = daily.id === 'gratitude' ? PILLARS[3 + (dayOfYear() % 2)] : daily
  const acts = [
    { label: 'Set your intention for today', href: '/practise/identity', done: has('intention') },
    { label: 'Note three things you appreciate', href: '/practise/gratitude', done: has('gratitude') },
    { label: practice.activity, href: `/practise/${practice.id}`, done: has(practice.type) },
    { label: 'Reflect on your day', href: '/evening', done: has('evening') },
  ]
  const hour = new Date().getHours()
  const doneDays = Object.keys(challenge.done).length
  const first = entries.length === 0
  return (
    <>
      <header className="pagehead">
        <p className="sub">{greeting()}{prefs.identity ? '' : ''}</p>
        <h1>Make today count.</h1>
        <p className="sub">Small actions, practised consistently, can change the way you approach life.</p>
      </header>
      <section className="intent" aria-label="Today's intention">
        {intent ? (<><p className="small-label">Today I am practising {intent.quality.toLowerCase()}</p><p className="serif">{intent.text}</p></>)
          : (<><p className="serif">{REFLECTIONS[dayOfYear() % REFLECTIONS.length]}</p><a className="textlink" href="#/practise/identity">Choose a quality for today</a></>)}
      </section>
      {first && <p className="note">Welcome. There is nothing to catch up on. Start with the first item below, or take your time with <a href="#/challenge">Your First 7 Days</a>.</p>}
      <section className="block" aria-label="Today's activities">
        <h2>Today</h2>
        <ul className="todo">
          {acts.map(a => (
            <li key={a.label}><a href={`#${a.href}`} className={a.done ? 'done' : ''}>
              {a.done ? <Check size={18} aria-hidden="true" /> : <Circle size={18} aria-hidden="true" />}
              <span>{a.label}</span><span className="vh">{a.done ? ', done' : ''}</span></a></li>
          ))}
        </ul>
        {hour >= 18 && !has('evening') && notif.evening.on && <p className="muted">It is evening. A short reflection is waiting whenever you are ready.</p>}
      </section>
      <section className="block shiftcta">
        <h2>Something on your mind?</h2>
        <p>When a situation feels heavy, work through it step by step instead of carrying it around.</p>
        <a className="btn" href="#/shift">Open Perspective Shift</a>
      </section>
      <section className="block">
        <h2>Your First 7 Days</h2>
        <p>{challenge.started ? `${doneDays} of ${CHALLENGE_DAYS.length} days completed. Go at your own pace.` : 'A guided week that introduces the five practices, one at a time.'}</p>
        <a className="textlink" href="#/challenge">{challenge.started ? 'Continue the week' : 'See the 7 days'}</a>
      </section>
    </>
  )
}
