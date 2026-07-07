import { T } from '../theme/tokens'
import { Icon } from './Icon'
import { todayLabel } from '../lib/format'

export function Header({ title, onPalette }: { title: string; onPalette: () => void }) {
  return (
    <header style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 14, padding: '13px 22px', borderBottom: `1px solid ${T.bDiv}` }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: T.text, whiteSpace: 'nowrap' }}>{title}</div>
      <div style={{ fontSize: 12.5, color: T.faint, whiteSpace: 'nowrap' }}>{todayLabel()}</div>
      <div style={{ flex: 1 }} />
      <button onClick={onPalette}
        style={{
          display: 'flex', alignItems: 'center', gap: 9, width: 'clamp(150px,24vw,280px)', padding: '8px 12px',
          borderRadius: 10, border: `1px solid ${T.b3}`, background: T.raisedBot, color: T.faint, fontSize: 13,
        }}>
        <Icon name="search" size={15} />
        <span style={{ flex: 1, textAlign: 'left' }}>Поиск и действия</span>
        <span style={{ fontSize: 11, border: `1px solid ${T.bRaised}`, borderRadius: 5, padding: '2px 6px', color: T.faint }}>⌘K</span>
      </button>
    </header>
  )
}
