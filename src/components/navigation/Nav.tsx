import { BookOpen, Compass, Home, Leaf, Settings, Sprout } from 'lucide-react'

const items = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/practise', label: 'Practise', Icon: Sprout },
  { href: '/shift', label: 'Shift', Icon: Compass },
  { href: '/journal', label: 'Journal', Icon: BookOpen },
  { href: '/growth', label: 'Growth', Icon: Leaf },
]

export function Nav({ route }: { route: string }) {
  const active = (h: string) => (h === '/' ? route === '/' || route === '' : route.startsWith(h))
  return (
    <>
      <nav className="nav" aria-label="Main">
        <a className="brand" href="#/"><span className="mark" aria-hidden="true" />Positive Mind</a>
        <ul>
          {items.map(({ href, label, Icon }) => (
            <li key={href}>
              <a href={`#${href}`} aria-current={active(href) ? 'page' : undefined}>
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" /><span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
        <a className="navsettings" href="#/settings" aria-current={route.startsWith('/settings') ? 'page' : undefined}>
          <Settings size={18} strokeWidth={1.75} aria-hidden="true" /><span>Settings</span>
        </a>
      </nav>
      <a className="topsettings" href="#/settings" aria-label="Settings"><Settings size={20} strokeWidth={1.75} /></a>
    </>
  )
}
