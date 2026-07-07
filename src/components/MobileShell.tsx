import { useState } from 'react'
import type { ReactNode } from 'react'
import { T, SERIF } from '../theme/tokens'
import { Icon, Avatar } from './Icon'
import { NAVSETS, ROLE_LABEL, ROLE_SHORT, SECTION_TITLE } from '../nav'
import { M, ME_ID } from '../data/mock'
import type { Role, Section } from '../types'

const ROLES: Role[] = ['owner', 'admin', 'staff']

export function MobileShell({ role, section, onNav, onRole, children }: {
  role: Role; section: Section; onNav: (s: Section) => void; onRole: (r: Role) => void; children: ReactNode
}) {
  const [menu, setMenu] = useState(false)
  const me = M.find((m) => m.id === ME_ID)!
  const items = NAVSETS[role]
  const norm = (s: Section) => (s === 'person' ? 'people' : s)

  // нижняя навигация: до 5 пунктов; если больше — 4 + «Ещё»
  const bottom = items.length <= 5 ? items : items.slice(0, 4)
  const hasMore = items.length > 5

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: T.bg, color: T.text, overflow: 'hidden' }}>
      {/* верхняя панель */}
      <header style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderBottom: `1px solid ${T.bDiv}` }}>
        <div style={{ width: 28, height: 28, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 30%,#2c1e11,#171009)', boxShadow: 'inset 0 0 0 1px rgba(217,148,90,.35)', flex: '0 0 auto' }}>
          <Icon name="flame" size={15} color={T.ember3} />
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {SECTION_TITLE[section]}
        </div>
        <button onClick={() => setMenu(true)} aria-label="Меню"
          style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${T.b3}`, background: 'transparent', color: T.text4, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <Icon name="menu-2" size={18} />
        </button>
      </header>

      {/* контент */}
      <main style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 14px', paddingBottom: 74 }}>
        {children}
      </main>

      {/* нижняя навигация */}
      <nav style={{ flex: '0 0 auto', display: 'flex', background: T.sidebar, borderTop: `1px solid ${T.bDiv}`, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {bottom.map((n) => {
          const active = norm(section) === n.key
          return (
            <button key={n.key} onClick={() => onNav(n.key)}
              style={{ flex: 1, minWidth: 0, background: 'none', border: 'none', color: active ? T.ember : T.faint, padding: '8px 2px 7px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <Icon name={n.icon} size={21} />
              <span style={{ fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{n.label}</span>
            </button>
          )
        })}
        {hasMore && (
          <button onClick={() => setMenu(true)}
            style={{ flex: 1, minWidth: 0, background: 'none', border: 'none', color: T.faint, padding: '8px 2px 7px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Icon name="dots" size={21} />
            <span style={{ fontSize: 10 }}>Ещё</span>
          </button>
        )}
      </nav>

      {/* меню-шит */}
      {menu && (
        <div onClick={() => setMenu(false)}
          style={{ position: 'absolute', inset: 0, background: 'rgba(8,6,4,.6)', zIndex: 30, display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxHeight: '82%', overflowY: 'auto', background: '#181613', borderTop: `1px solid ${T.bRaised}`, borderRadius: '18px 18px 0 0', padding: '10px 12px calc(18px + env(safe-area-inset-bottom))', animation: 'mcSheet .2s ease' }}>
            <div style={{ width: 38, height: 4, borderRadius: 2, background: T.bRaised, margin: '4px auto 12px' }} />
            <div style={{ fontSize: 10.5, letterSpacing: '1.3px', textTransform: 'uppercase', color: T.muted, fontWeight: 700, margin: '0 6px 8px' }}>Разделы</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 14 }}>
              {items.map((n) => {
                const active = norm(section) === n.key
                return (
                  <button key={n.key} onClick={() => { onNav(n.key); setMenu(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 12px', borderRadius: 11, border: 'none', background: active ? '#1b1916' : 'transparent', color: active ? T.text : T.text3, textAlign: 'left' }}>
                    <Icon name={n.icon} size={19} color={active ? T.ember : T.faint} style={{ width: 22, textAlign: 'center' }} />
                    <span style={{ fontSize: 14.5 }}>{n.label}</span>
                  </button>
                )
              })}
            </div>
            <div style={{ fontSize: 10.5, letterSpacing: '1.3px', textTransform: 'uppercase', color: T.muted, fontWeight: 700, margin: '0 6px 8px' }}>Демо · роль</div>
            <div style={{ display: 'flex', gap: 7, margin: '0 4px 14px' }}>
              {ROLES.map((r) => {
                const on = role === r
                return (
                  <button key={r} onClick={() => { onRole(r); setMenu(false) }}
                    style={{ flex: 1, padding: '10px 4px', borderRadius: 10, border: `1px solid ${on ? '#4a3a26' : T.bRaised}`, background: on ? '#241c12' : 'transparent', color: on ? T.emberLight : T.muted, fontSize: 12.5 }}>
                    {ROLE_SHORT[r]}
                  </button>
                )
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 6px 2px', borderTop: `1px solid ${T.bDiv}` }}>
              <Avatar mono={me.mono} bg={me.avaBg} fg={me.avaFg} size={32} />
              <div><div style={{ fontSize: 14, color: T.text }}>{me.name}</div><div style={{ fontSize: 12, color: T.faint }}>{ROLE_LABEL[role]}</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
