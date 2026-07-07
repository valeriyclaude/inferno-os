import { M } from '../data/mock'
import type { Member } from '../types'
import { T } from '../theme/tokens'

export const memberById = (id: number): Member | undefined => M.find((m) => m.id === id)

export const UNASSIGNED = { name: 'Не назначен', mono: '—', avaBg: '#201e19', avaFg: '#6e695f' }

export function assignee(id: number) {
  if (!id) return UNASSIGNED
  const m = memberById(id)
  return m ? { name: m.name, mono: m.mono, avaBg: m.avaBg, avaFg: m.avaFg } : UNASSIGNED
}

// Живой API: id может быть не из моков — тогда берём имя из aname.
export function resolveAssignee(t: { a: number; aname?: string }) {
  if (t.a) { const m = memberById(t.a); if (m) return { name: m.name, mono: m.mono, avaBg: m.avaBg, avaFg: m.avaFg } }
  if (t.aname) {
    const mono = t.aname.split(/\s+/).map((s) => s[0]).join('').slice(0, 2).toUpperCase() || '?'
    return { name: t.aname, mono, avaBg: '#2b1d10', avaFg: '#d9945a' }
  }
  return UNASSIGNED
}

const MN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const WD = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']

export function todayLabel(): string {
  const x = new Date()
  return `${WD[x.getDay()][0].toUpperCase()}${WD[x.getDay()].slice(1)}, ${x.getDate()} ${MN[x.getMonth()]}`
}

export function dueLabel(iso?: string | null): { text: string; color: string } | null {
  if (!iso) return null
  const dt = new Date(iso)
  if (isNaN(+dt)) return null
  const now = new Date()
  const over = dt < now
  const same = dt.toDateString() === now.toDateString()
  const hm = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
  const dd = `${String(dt.getDate()).padStart(2, '0')}.${String(dt.getMonth() + 1).padStart(2, '0')}`
  return { text: (same ? 'сегодня ' : dd + ' ') + hm, color: over ? T.red : T.muted }
}
