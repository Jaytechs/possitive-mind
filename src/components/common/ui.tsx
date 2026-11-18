import { useEffect, useRef, type ReactNode } from 'react'
import { RISK } from '../../data/content'

export function PageHead({ title, sub, back }: { title: string; sub?: string; back?: { href: string; label: string } }) {
  return (
    <header className="pagehead">
      {back && <a className="back" href={`#${back.href}`}>&larr; {back.label}</a>}
      <h1>{title}</h1>
      {sub && <p className="sub">{sub}</p>}
    </header>
  )
}

interface FieldProps { label: string; hint?: string; value: string; onChange: (v: string) => void; rows?: number; error?: string; id: string }
export function TextArea({ label, hint, value, onChange, rows = 3, error, id }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {hint && <span className="hint" id={`${id}-h`}>{hint}</span>}
      <textarea id={id} rows={rows} value={value} onChange={e => onChange(e.target.value)}
        aria-describedby={hint ? `${id}-h` : undefined} aria-invalid={!!error} />
      {error && <span className="err" role="alert">{error}</span>}
    </div>
  )
}
export function TextInput({ label, hint, value, onChange, error, id }: Omit<FieldProps, 'rows'>) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {hint && <span className="hint">{hint}</span>}
      <input id={id} type="text" value={value} onChange={e => onChange(e.target.value)} aria-invalid={!!error} />
      {error && <span className="err" role="alert">{error}</span>}
    </div>
  )
}

export function Chips({ options, value, onChange, multi, label }: { options: string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean; label: string }) {
  const toggle = (o: string) => onChange(multi ? (value.includes(o) ? value.filter(x => x !== o) : [...value, o]) : [o])
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map(o => (
        <button type="button" key={o} className="chip" aria-pressed={value.includes(o)} onClick={() => toggle(o)}>{o}</button>
      ))}
    </div>
  )
}

export function Empty({ title, children, action }: { title: string; children?: ReactNode; action?: { href: string; label: string } }) {
  return (
    <div className="empty">
      <p className="empty-t">{title}</p>
      {children && <p>{children}</p>}
      {action && <a className="btn" href={`#${action.href}`}>{action.label}</a>}
    </div>
  )
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    ref.current?.focus()
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', k)
    return () => { document.removeEventListener('keydown', k); prev?.focus() }
  }, [onClose])
  return (
    <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  )
}

export function Confirm({ title, text, confirmLabel, onConfirm, onClose }: { title: string; text: string; confirmLabel: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal title={title} onClose={onClose}>
      <p>{text}</p>
      <div className="row end">
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        <button className="btn danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  )
}

export function Safety({ texts }: { texts: string[] }) {
  if (!texts.some(t => RISK.test(t))) return null
  return (
    <div className="safety" role="alert">
      <strong>Your safety comes first.</strong>
      <p>If you might hurt yourself or someone else, please stop here and contact your local emergency number or a person you trust right now. Tell them what you wrote to me. This app is a journal, not a crisis service, and it cannot respond in an emergency.</p>
    </div>
  )
}
