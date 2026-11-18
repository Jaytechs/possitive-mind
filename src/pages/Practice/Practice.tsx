import { PILLARS, pillarForType } from '../../data/content'
import { useApp } from '../../hooks/useApp'
import { History } from '../../components/journal/EntryCard'
import { PageHead } from '../../components/common/ui'
import { Clarity, Confidence, Gratitude, Identity, Kindness } from './Pillars'
import { dateKey } from '../../utils/date'

export function Practice() {
  const { entries } = useApp()
  return (
    <>
      <PageHead title="Practise" sub="Five practices. Choose the one that fits today." />
      <ol className="pillars">
        {PILLARS.map(p => {
          const mine = entries.filter(e => e.type === p.type)
          const done = mine.some(e => e.date === dateKey())
          return (
            <li key={p.id}>
              <a href={`#/practise/${p.id}`}>
                <span className="pname">{p.name}</span>
                <span className="pblurb">{p.activity}</span>
                <span className="pmeta">{done ? 'Done today' : 'Not yet today'}{mine.length ? ` \u00b7 ${mine.length} saved` : ''}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </>
  )
}

export function PillarPage({ id }: { id: string }) {
  const { entries } = useApp()
  const p = PILLARS.find(x => x.id === id)
  if (!p) return <PageHead title="Not found" back={{ href: '/practise', label: 'Practise' }} />
  const mine = entries.filter(e => e.type === pillarForType(p.type)?.type)
  const Form = { clarity: Clarity, gratitude: Gratitude, identity: Identity, confidence: Confidence, kindness: Kindness }[p.id as 'clarity']
  return (
    <>
      <PageHead title={p.action} sub={p.blurb} back={{ href: '/practise', label: 'Practise' }} />
      <section aria-label="Exercise"><Form /></section>
      {p.id !== 'confidence' && (
        <section className="block">
          <h2>Previous entries</h2>
          <History entries={mine} empty="Nothing here yet. What you save will appear here, and in your journal." />
        </section>
      )}
    </>
  )
}
