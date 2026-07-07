import { useEffect, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { MobileShell } from './components/MobileShell'
import { MissionControl } from './screens/MissionControl'
import { Tasks } from './screens/Tasks'
import { People } from './screens/People'
import { Person } from './screens/Person'
import { Orders } from './screens/Orders'
import { Shifts } from './screens/Shifts'
import { Projects } from './screens/Projects'
import { Suggestions } from './screens/Suggestions'
import { Calendar } from './screens/Calendar'
import { Admin } from './screens/Admin'
import { Placeholder } from './screens/Placeholder'
import { SECTION_TITLE } from './nav'
import { T } from './theme/tokens'
import { AppProvider, useApp } from './state/app'

const MOBILE = 700
const COLLAPSE = 1080

function Screen({ mobile }: { mobile: boolean }) {
  const { section } = useApp()
  switch (section) {
    case 'mission': return <MissionControl mobile={mobile} />
    case 'tasks': return <Tasks mobile={mobile} />
    case 'people': return <People mobile={mobile} />
    case 'person': return <Person mobile={mobile} />
    case 'orders': return <Orders mobile={mobile} />
    case 'shifts': return <Shifts mobile={mobile} />
    case 'projects': return <Projects mobile={mobile} />
    case 'suggs': return <Suggestions mobile={mobile} />
    case 'calendar': return <Calendar mobile={mobile} />
    case 'admin': return <Admin mobile={mobile} />
    default: return <Placeholder section={section} />
  }
}

function Shell() {
  const { role, section, setRole, go } = useApp()
  const [vw, setVw] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1280)
  useEffect(() => {
    const on = () => setVw(window.innerWidth)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  const mobile = vw < MOBILE
  const collapsed = vw < COLLAPSE

  if (mobile) {
    return (
      <MobileShell role={role} section={section} onNav={go} onRole={setRole}>
        <Screen mobile />
      </MobileShell>
    )
  }
  return (
    <div style={{ height: '100dvh', minHeight: 600, display: 'flex', background: T.bg, color: T.text, fontSize: 14, lineHeight: 1.45, overflow: 'hidden', position: 'relative' }}>
      <Sidebar role={role} section={section} collapsed={collapsed} onNav={go} onRole={setRole} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header title={SECTION_TITLE[section]} onPalette={() => {}} />
        <main style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 clamp(16px,3vw,30px) 44px' }}>
          <Screen mobile={false} />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
