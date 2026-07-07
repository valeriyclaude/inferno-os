import { createContext, useContext, useState, useCallback, useRef } from 'react'
import type { ReactNode } from 'react'
import { T } from '../theme/tokens'
import { NAVSETS } from '../nav'
import type { Role, Section } from '../types'

interface Toast { text: string; undo?: () => void }
interface AppState {
  role: Role
  section: Section
  personId: number | null
  taskPerson: number | null
  setRole: (r: Role) => void
  go: (s: Section) => void
  openPerson: (id: number) => void
  setTaskPerson: (id: number | null) => void
  showToast: (text: string, undo?: () => void) => void
}

const Ctx = createContext<AppState | null>(null)
export const useApp = () => {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp outside provider')
  return v
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleS] = useState<Role>('owner')
  const [section, setSection] = useState<Section>('mission')
  const [personId, setPersonId] = useState<number | null>(null)
  const [taskPerson, setTaskPerson] = useState<number | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const showToast = useCallback((text: string, undo?: () => void) => {
    setToast({ text, undo })
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(null), 4500)
  }, [])

  const setRole = useCallback((r: Role) => {
    setRoleS(r)
    const keys = NAVSETS[r].map((n) => n.key)
    const norm = section === 'person' ? 'people' : section
    if (!keys.includes(norm as Section)) setSection(NAVSETS[r][0].key)
  }, [section])

  const go = useCallback((s: Section) => setSection(s), [])
  const openPerson = useCallback((id: number) => { setPersonId(id); setSection('person') }, [])

  return (
    <Ctx.Provider value={{ role, section, personId, taskPerson, setRole, go, openPerson, setTaskPerson, showToast }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed', left: '50%', bottom: 84, transform: 'translateX(-50%)', zIndex: 60,
          display: 'flex', alignItems: 'center', gap: 14, maxWidth: 'calc(100vw - 28px)',
          background: '#221d16', border: `1px solid ${T.bRaised}`, color: T.text, padding: '11px 16px',
          borderRadius: 12, fontSize: 13, boxShadow: '0 16px 40px -12px rgba(0,0,0,.7)', animation: 'mcToast .25s ease',
        }}>
          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{toast.text}</span>
          {toast.undo && (
            <button onClick={() => { toast.undo?.(); setToast(null) }}
              style={{ background: 'none', border: 'none', color: T.emberLight, fontSize: 13, fontWeight: 600, flex: '0 0 auto' }}>
              Отменить
            </button>
          )}
        </div>
      )}
    </Ctx.Provider>
  )
}
