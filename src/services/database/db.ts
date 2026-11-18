import { openDB } from 'idb'
import type { Entry } from '../../types'

const dbPromise = openDB('positive-mind', 1, {
  upgrade(db) {
    const s = db.createObjectStore('entries', { keyPath: 'id' })
    s.createIndex('type', 'type')
    s.createIndex('date', 'date')
  },
})

export const getAllEntries = async (): Promise<Entry[]> => (await dbPromise).getAll('entries')
export const putEntry = async (e: Entry) => { await (await dbPromise).put('entries', e) }
export const removeEntry = async (id: string) => { await (await dbPromise).delete('entries', id) }
export const clearEntries = async () => { await (await dbPromise).clear('entries') }
