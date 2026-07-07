import { useState } from 'react'
import { T, SERIF } from '../theme/tokens'
import { Icon } from '../components/Icon'
import { shifts as MOCK, M } from '../data/mock'
import { useApp } from '../state/app'

const MN = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const WD = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const pad = (n: number) => String(n).padStart(2, '0')
const name = (id: number) => M.find((m) => m.id === id)?.name ?? '?'

export function Shifts({ mobile }: { mobile: boolean }) {
  const { role, showToast } = useApp()
  const canEdit = role === 'owner' || role === 'admin'
  const [sh, setSh] = useState<Record<string, number[]>>(() => ({ ...MOCK }))
  const [person, setPerson] = useState<number | null>(null)
  const [view, setView] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const [day, setDay] = useState<string | null>(null)

  const y = view.getFullYear(), m = view.getMonth()
  const first = (new Date(y, m, 1).getDay() + 6) % 7
  const days = new Date(y, m + 1, 0).getDate()
  const todayStr = (() => { const t = new Date(); return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}` })()

  const toggle = (ds: string, id: number) => setSh((s) => {
    const cur = s[ds] ?? []
    return { ...s, [ds]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] }
  })
  const clickDay = (ds: string) => {
    if (canEdit && person != null) toggle(ds, person)
    else setDay(ds)
  }
  const copyWeek = () => { showToast('Прошлая неделя скопирована'); }

  const staff = M.filter((mm) => mm.sysRole !== 'owner')
  const chip = (on: boolean) => ({ fontSize: 12, padding: '6px 12px', borderRadius: 16, whiteSpace: 'nowrap' as const, border: `1px solid ${on ? '#4a3a26' : T.bCard}`, background: on ? '#241c12' : T.card, color: on ? T.emberLight : T.text4 })

  return (
    <div style={{ maxWidth: 720, paddingTop: 18 }}>
      {canEdit && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 13 }}>
          {staff.map((sp) => <button key={sp.id} onClick={() => setPerson(person === sp.id ? null : sp.id)} style={chip(person === sp.id)}>{sp.name}</button>)}
          <span style={{ flex: 1 }} />
          <button onClick={copyWeek} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: `1px solid ${T.bRaised}`, color: T.text3, borderRadius: 10, padding: '7px 12px', fontSize: 12, whiteSpace: 'nowrap' }}><Icon name="copy" size={13} />Копировать неделю</button>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={() => setView(new Date(y, m - 1, 1))} style={navBtn}>‹</button>
        <span style={{ fontFamily: SERIF, fontSize: 18, color: T.text }}>{MN[m]} {y}</span>
        <button onClick={() => setView(new Date(y, m + 1, 1))} style={navBtn}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
        {WD.map((w) => <div key={w} style={{ textAlign: 'center', fontSize: 11, color: T.faint, paddingBottom: 3 }}>{w}</div>)}
        {Array.from({ length: first }).map((_, i) => <div key={`b${i}`} />)}
        {Array.from({ length: days }).map((_, i) => {
          const d = i + 1; const ds = `${y}-${pad(m + 1)}-${pad(d)}`
          const ppl = sh[ds] ?? []; const isToday = ds === todayStr; const mine = person != null && ppl.includes(person)
          return (
            <div key={ds} onClick={() => clickDay(ds)}
              style={{ position: 'relative', minHeight: mobile ? 50 : 60, borderRadius: 11, padding: 6, fontSize: 13, cursor: 'pointer', background: mine ? '#2a2014' : T.card, border: `1px solid ${isToday ? T.ember : mine ? '#5a4226' : T.bCard}` }}>
              <span style={{ color: isToday ? T.emberLight : T.text3, fontWeight: isToday ? 700 : 400 }}>{d}</span>
              {ppl.length > 0 && <>
                <span style={{ position: 'absolute', top: 5, right: 5, fontSize: 9, color: T.inset2, background: T.ember, minWidth: 15, height: 15, lineHeight: '15px', borderRadius: 8, textAlign: 'center', fontWeight: 700 }}>{ppl.length}</span>
                <span style={{ position: 'absolute', left: 6, right: 6, bottom: 5, fontSize: 9.5, color: T.gold, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{ppl.map(name).join(', ')}</span>
              </>}
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 13, fontSize: 11.5, color: T.faint }}>
        <Icon name="brush" size={13} color={T.muted} />{canEdit ? (person != null ? `Кисть: клик по дню ставит/снимает смену для «${name(person)}»` : 'Выбери сотрудника и рисуй смены кликом по дням') : 'Клик по дню — состав смены'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7, fontSize: 11.5, color: T.faint }}>
        <Icon name="bell" size={13} color={T.muted} />Напоминания: за день и за 3 часа до смены — автоматически.
      </div>

      {day && (
        <div onClick={() => setDay(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(8,6,4,.6)', zIndex: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 460, background: '#181613', borderTop: `1px solid ${T.bRaised}`, borderRadius: '18px 18px 0 0', padding: '14px 16px calc(20px + env(safe-area-inset-bottom))', animation: 'mcSheet .2s ease' }}>
            <div style={{ fontFamily: SERIF, fontSize: 17, marginBottom: 12 }}>Смена {fmtDay(day)}</div>
            {(sh[day] ?? []).map((id) => (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 2px', borderBottom: `1px solid ${T.b2}` }}>
                <span style={{ flex: 1, fontSize: 14 }}>{name(id)}</span>
                {canEdit && <button onClick={() => toggle(day, id)} style={{ background: 'none', border: `1px solid #3a241c`, color: '#e0937a', borderRadius: 8, padding: '5px 10px', fontSize: 12 }}>снять</button>}
              </div>
            ))}
            {(sh[day] ?? []).length === 0 && <div style={{ fontSize: 12.5, color: T.faint, padding: '8px 2px' }}>Пока никого</div>}
            {canEdit && (() => {
              const free = staff.filter((mm) => !(sh[day!] ?? []).includes(mm.id))
              return free.length > 0 && <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: T.muted, marginBottom: 8 }}>Поставить на смену</div>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {free.map((mm) => <button key={mm.id} onClick={() => toggle(day, mm.id)} style={chip(false)}>{mm.name}</button>)}
                </div>
              </div>
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

const navBtn: React.CSSProperties = { width: 38, height: 34, borderRadius: 10, border: `1px solid #282018`, background: '#1c1a15', color: '#e6ddce', fontSize: 17 }
function fmtDay(ds: string) { const [, m, d] = ds.split('-').map(Number); return `${d} ${['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'][m - 1]}` }
