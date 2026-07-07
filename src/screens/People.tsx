import { T, loadColor } from '../theme/tokens'
import { Icon, Avatar } from '../components/Icon'
import { M, tasks } from '../data/mock'
import { useApp } from '../state/app'
import type { Status } from '../types'

const ACTIVE: Status[] = ['new', 'in_progress', 'returned', 'not_done', 'blocked']
const activeCount = (id: number) => tasks.filter((t) => t.a === id && ACTIVE.includes(t.st)).length

export function People({ mobile }: { mobile: boolean }) {
  const { openPerson } = useApp()
  return (
    <div style={{ maxWidth: 900, paddingTop: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fill,minmax(250px,1fr))', gap: 10 }}>
        {M.map((p) => {
          const n = activeCount(p.id)
          return (
            <div key={p.id} onClick={() => openPerson(p.id)}
              style={{ background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 14, padding: '14px 15px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <Avatar mono={p.mono} bg={p.avaBg} fg={p.avaFg} size={36} font={12} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: T.text }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: T.muted }}>{p.job} · {p.dept}</div>
                </div>
                <Icon name="chevron-right" size={14} color={T.faint3} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 12 }}>
                <div style={{ flex: 1, height: 3, borderRadius: 2, background: T.b2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: loadColor(p.load), width: `${p.load}%` }} />
                </div>
                <span style={{ fontSize: 11.5, fontVariantNumeric: 'tabular-nums', color: loadColor(p.load) }}>{p.load}%</span>
                <span style={{ fontSize: 11.5, color: T.faint, whiteSpace: 'nowrap' }}>{n} задач</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
