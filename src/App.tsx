import { useEffect, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { MissionControl } from './screens/MissionControl'
import { Placeholder } from './screens/Placeholder'
import { NAVSETS, SECTION_TITLE } from './nav'
import { T } from './theme/tokens'
import type { Role, Section } from './types'

export default function App() {
  const [role, setRole] = useState<Role>('owner')
  const [section, setSection] = useState<Section>('mission')
  const [vw, setVw] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1280)

  useEffect(() => {
    const on = () => setVw(window.innerWidth)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  const collapsed = vw < 1080

  function changeRole(r: Role) {
    setRole(r)
    const keys = NAVSETS[r].map((n) => n.key)
    const norm = section === 'person' ? 'people' : section
    if (!keys.includes(norm as Section)) setSection(NAVSETS[r][0].key)
  }

  const mainPad = section === 'mission' ? '0 30px 44px' : '0 30px 44px'

  return (
    <div style={{ height: '100vh', minHeight: 720, display: 'flex', background: T.bg, color: T.text, fontSize: 14, lineHeight: 1.45, overflow: 'hidden', position: 'relative' }}>
      <Sidebar role={role} section={section} collapsed={collapsed} onNav={setSection} onRole={changeRole} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header title={SECTION_TITLE[section]} onPalette={() => {}} />
        <main style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: mainPad }}>
          {section === 'mission'
            ? <MissionControl onNav={setSection} />
            : <Placeholder section={section} />}
        </main>
      </div>
    </div>
  )
}
