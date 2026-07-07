import { useState } from 'react'
import { T, SERIF } from '../theme/tokens'
import { Icon } from '../components/Icon'
import { events as EV } from '../data/mock'
import { useApp } from '../state/app'

const MN = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const MNs = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
const WD = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const pad = (n: number) => String(n).padStart(2, '0')

export function Calendar({ mobile }: { mobile: boolean }) {
  const { role, go, showToast } = useApp()
  const [view, setView] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const y = view.getFullYear(), m = view.getMonth()
  const first = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate()
  const byDay: Record<string, typeof EV> = {}
  EV.forEach((e) => { (byDay[e.ds] = byDay[e.ds] || []).push(e) })
  const today = new Date()
  const upcoming = [...EV].filter((e) => new Date(e.ds + 'T23:59') >= today).sort((a, b) => a.ds.localeCompare(b.ds)).slice(0, 5)
  const sport = upcoming.find((e) => e.type === 'Спорт')
  const daysTo = sport ? Math.ceil((+new Date(sport.ds) - +today) / 864e5) : 0

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: mobile ? 4 : 24, alignItems: 'flex-start', paddingTop: 18 }}>
      <div style={{ flex: mobile ? '1 1 100%' : '999 1 420px', minWidth: 0, maxWidth: 620 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <button onClick={() => setView(new Date(y, m - 1, 1))} style={navBtn}>‹</button>
          <span style={{ fontFamily: SERIF, fontSize: 18 }}>{MN[m]} {y}</span>
          <button onClick={() => setView(new Date(y, m + 1, 1))} style={navBtn}>›</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
          {WD.map((w) => <div key={w} style={{ textAlign: 'center', fontSize: 11, color: T.faint, paddingBottom: 3 }}>{w}</div>)}
          {Array.from({ length: first }).map((_, i) => <div key={`b${i}`} />)}
          {Array.from({ length: days }).map((_, i) => {
            const d = i + 1, ds = `${y}-${pad(m + 1)}-${pad(d)}`, evs = byDay[ds] ?? []
            const isToday = ds === `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
            return (
              <div key={ds} style={{ minHeight: mobile ? 48 : 60, borderRadius: 11, padding: 6, background: T.card, border: `1px solid ${isToday ? T.ember : T.bCard}`, position: 'relative', overflow: 'hidden' }}>
                <span style={{ fontSize: 13, color: isToday ? T.emberLight : T.text3, fontWeight: isToday ? 700 : 400 }}>{d}</span>
                {evs.slice(0, 2).map((e, j) => (
                  <div key={j} style={{ marginTop: 3, fontSize: 9, color: e.c, background: e.c + '1f', borderRadius: 4, padding: '1px 4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{e.label}</div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ flex: mobile ? '1 1 100%' : '1 1 240px', width: mobile ? '100%' : 280 }}>
        {role !== 'staff' && sport && (
          <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 12, background: 'rgba(217,148,90,.07)', border: '1px solid rgba(217,148,90,.2)', marginBottom: 16 }}>
            <Icon name="sparkles" size={15} color={T.emberLight} style={{ flex: '0 0 auto', marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 12.5, lineHeight: 1.5, color: '#d9cdbb' }}>Через {daysTo} дн. — {sport.label}. Стоит создать задачу на закупку напитков заранее.</div>
              <button onClick={() => { showToast('Открываю создание задачи…'); go('tasks') }} style={{ marginTop: 9, fontSize: 12, borderRadius: 9, padding: '6px 12px', border: '1px solid #4a3a26', background: '#241c12', color: T.emberLight }}>Создать задачу</button>
            </div>
          </div>
        )}
        <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.muted, fontWeight: 600, margin: '0 2px 11px' }}>Ближайшее</div>
        {upcoming.map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1px solid ${T.b2}` }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: e.c, flex: '0 0 auto' }} />
            <span style={{ flex: 1, fontSize: 13, color: T.text2 }}>{e.label}</span>
            <span style={{ fontSize: 11.5, color: T.faint, whiteSpace: 'nowrap' }}>{fmt(e.ds)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const navBtn: React.CSSProperties = { width: 38, height: 34, borderRadius: 10, border: `1px solid #282018`, background: '#1c1a15', color: '#e6ddce', fontSize: 17 }
function fmt(ds: string) { const [, m, d] = ds.split('-').map(Number); return `${d} ${MNs[m - 1]}` }
