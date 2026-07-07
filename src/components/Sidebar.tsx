import { T, SERIF } from '../theme/tokens'
import { Icon, Avatar } from './Icon'
import { NAVSETS, ROLE_LABEL, ROLE_SHORT } from '../nav'
import { M, ME_ID } from '../data/mock'
import type { Role, Section } from '../types'

const ROLES: Role[] = ['owner', 'admin', 'staff']

export function Sidebar({ role, section, collapsed, onNav, onRole }: {
  role: Role; section: Section; collapsed: boolean
  onNav: (s: Section) => void; onRole: (r: Role) => void
}) {
  const me = M.find((m) => m.id === ME_ID)!
  const items = NAVSETS[role]
  const w = collapsed ? 62 : 216
  const justify = collapsed ? 'center' : 'flex-start'

  return (
    <aside style={{
      width: w, flex: '0 0 auto', background: T.sidebar, borderRight: `1px solid ${T.b2}`,
      display: 'flex', flexDirection: 'column', padding: '18px 10px 14px', transition: 'width .2s ease', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: justify, gap: 10, padding: '0 6px 18px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 30%,#2c1e11,#171009)', boxShadow: 'inset 0 0 0 1px rgba(217,148,90,.35)', flex: '0 0 auto',
        }}><Icon name="flame" size={17} color={T.ember3} /></div>
        {!collapsed && (
          <div style={{ whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600 }}>Inferno</span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.8px', color: T.muted, border: `1px solid ${T.bRaised}`, borderRadius: 5, padding: '2px 5px', marginLeft: 7, verticalAlign: 2 }}>OS</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((n) => {
          const active = section === n.key || (section === 'person' && n.key === 'people')
          return (
            <button key={n.key} onClick={() => onNav(n.key)} title={n.label} data-hover
              style={{
                display: 'flex', alignItems: 'center', justifyContent: justify, gap: 11, width: '100%',
                padding: collapsed ? '10px 0' : '9px 11px', borderRadius: 10, border: 'none',
                background: active ? '#1b1916' : 'transparent', color: active ? T.text : T.text4,
                fontSize: 13.5, textAlign: 'left', transition: 'background .15s ease', position: 'relative',
              }}>
              <Icon name={n.icon} size={17} color={active ? T.ember : T.faint} style={{ width: 20, textAlign: 'center', flex: '0 0 auto' }} />
              {!collapsed && <span style={{ whiteSpace: 'nowrap', flex: 1 }}>{n.label}</span>}
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ padding: '10px 4px 12px', borderTop: `1px solid ${T.bDiv}` }}>
        {!collapsed && <div style={{ fontSize: 10, letterSpacing: '1.2px', textTransform: 'uppercase', color: T.faint2, fontWeight: 600, margin: '0 4px 7px' }}>Демо · роль</div>}
        <div style={{ display: 'flex', flexDirection: collapsed ? 'column' : 'row', gap: 4 }}>
          {ROLES.map((r) => {
            const on = role === r
            return (
              <button key={r} onClick={() => onRole(r)} title={ROLE_LABEL[r]}
                style={{
                  flex: 1, padding: '6px 2px', borderRadius: 8,
                  border: `1px solid ${on ? '#4a3a26' : T.bRaised}`, background: on ? '#241c12' : 'transparent',
                  color: on ? T.emberLight : T.muted, fontSize: 10.5, whiteSpace: 'nowrap',
                }}>{ROLE_SHORT[r]}</button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: justify, gap: 10, padding: '12px 6px 2px', borderTop: `1px solid ${T.bDiv}` }}>
        <Avatar mono={me.mono} bg={me.avaBg} fg={me.avaFg} font={10.5} />
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, color: T.text, whiteSpace: 'nowrap' }}>{me.name}</div>
            <div style={{ fontSize: 11, color: T.faint, whiteSpace: 'nowrap' }}>{ROLE_LABEL[role]}</div>
          </div>
        )}
      </div>
    </aside>
  )
}
