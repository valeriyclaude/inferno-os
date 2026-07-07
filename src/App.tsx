import { useEffect, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { MobileShell } from './components/MobileShell'
import { MissionControl } from './screens/MissionControl'
import { Placeholder } from './screens/Placeholder'
import { NAVSETS, SECTION_TITLE } from './nav'
import { T } from './theme/tokens'
import type { Role, Section } from './types'

const MOBILE = 700   // ниже — мобильная оболочка (нижняя навигация); выше — боковой рельс
const COLLAPSE = 1080

export default function App() {
  const [role, setRole] = useState<Role>('owner')
  const [section, setSection] = useState<Section>('mission')
  const [vw, setVw] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1280)

  useEffect(() => {
    const on = () => setVw(window.innerWidth)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  const mobile = vw < MOBILE
  const collapsed = vw < COLLAPSE

  function changeRole(r: Role) {
    setRole(r)
    const keys = NAVSETS[r].map((n) => n.key)
    const norm = section === 'person' ? 'people' : section
    if (!keys.includes(norm as Section)) setSection(NAVSETS[r][0].key)
  }

  const screen = section === 'mission'
    ? <MissionControl onNav={setSection} mobile={mobile} />
    : <Placeholder section={section} />

  if (mobile) {
    return <MobileShell role={role} section={section} onNav={setSection} onRole={changeRole}>{screen}</MobileShell>
  }

  return (
    <div style={{ height: '100dvh', minHeight: 600, display: 'flex', background: T.bg, color: T.text, fontSize: 14, lineHeight: 1.45, overflow: 'hidden', position: 'relative' }}>
      <Sidebar role={role} section={section} collapsed={collapsed} onNav={setSection} onRole={changeRole} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header title={SECTION_TITLE[section]} onPalette={() => {}} />
        <main style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 clamp(16px,3vw,30px) 44px' }}>
          {screen}
        </main>
      </div>
    </div>
  )
}
