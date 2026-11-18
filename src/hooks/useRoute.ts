import { useEffect, useState } from 'react'
export function useRoute() {
  const read = () => location.hash.slice(1) || '/'
  const [r, setR] = useState(read)
  useEffect(() => {
    const f = () => { setR(read()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return r
}
export const go = (p: string) => { location.hash = p }
