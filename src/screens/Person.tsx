import { T, SERIF, loadColor, typeColor, typeChipBg, STATUS } from '../theme/tokens'
import { Icon, Avatar } from '../components/Icon'
import { M, tasks, shifts } from '../data/mock'
import { dueLabel } from '../lib/format'
import { useApp } from '../state/app'
import type { Status } from '../types'

const ACTIVE: Status[] = ['new', 'in_progress', 'returned', 'not_done', 'blocked']

export function Person({ mobile }: { mobile: boolean }) {
  const { personId, go, setTaskPerson } = useApp()
  const p = M.find((m) => m.id === personId)
  if (!p) return null

  const my = tasks.filter((t) => t.a === p.id)
  const active = my.filter((t) => ACTIVE.includes(t.st))
  const done = my.filter((t) => t.st === 'done')
  const myShifts = Object.entries(shifts).filter(([, ids]) => ids.includes(p.id)).map(([d]) => d).sort().slice(0, 3)

  const allTasks = () => { setTaskPerson(p.id); go('tasks') }

  return (
    <div style={{ maxWidth: 820, paddingTop: 18, animation: 'mcFade .2s ease' }}>
      <button onClick={() => go('people')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: T.muted, fontSize: 12.5, padding: '0 0 14px' }}>
        <Icon name="arrow-left" size={14} />Все люди
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', background: `linear-gradient(${T.raisedTop},${T.raisedBot})`, border: `1px solid ${T.bRaised}`, borderRadius: 16, padding: '18px 20px' }}>
        <Avatar mono={p.mono} bg={p.avaBg} fg={p.avaFg} size={52} font={17} />
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: T.text }}>{p.name}</div>
          <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{p.job} · {p.dept}</div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 9, fontSize: 12.5, color: T.text4 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="phone" size={13} color={T.faint} />{p.tel}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="brand-telegram" size={13} color={T.faint} />{p.tg}</span>
          </div>
        </div>
        <div style={{ flex: '0 0 auto', minWidth: 120 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: loadColor(p.load) }}>{p.load}%</span>
            <span style={{ fontSize: 11, color: T.faint }}>загрузка</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: T.b2, marginTop: 7, overflow: 'hidden', width: 120 }}><div style={{ height: '100%', background: loadColor(p.load), width: `${p.load}%` }} /></div>
        </div>
      </div>

      {p.ai && (
        <div style={{ display: 'flex', gap: 10, marginTop: 12, padding: '11px 14px', borderRadius: 12, background: 'rgba(217,148,90,.07)', border: '1px solid rgba(217,148,90,.2)' }}>
          <Icon name="sparkles" size={15} color={T.emberLight} style={{ flex: '0 0 auto', marginTop: 1 }} />
          <span style={{ fontSize: 12.5, lineHeight: 1.5, color: '#d9cdbb' }}>{p.ai}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 20, margin: '16px 2px 0', flexWrap: 'wrap', alignItems: 'center' }}>
        {[[active.length, 'активных'], [done.length, 'за неделю'], [my.length, 'всего']].map(([n, l], i) => (
          <div key={i}><span style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: T.text }}>{n}</span><span style={{ fontSize: 11.5, color: T.muted, marginLeft: 7 }}>{l}</span></div>
        ))}
        <button onClick={allTasks} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 7, background: 'none', border: `1px solid ${T.bRaised}`, color: T.gold, borderRadius: 10, padding: '8px 14px', fontSize: 12.5, whiteSpace: 'nowrap' }}>
          Все задачи <Icon name="arrow-right" size={13} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fit,minmax(280px,1fr))', gap: 14, marginTop: 16, alignItems: 'start' }}>
        <div>
          <Sub>Активные задачи</Sub>
          {active.length ? active.map((t) => {
            const st = STATUS[t.st]; const due = dueLabel(t.dl)
            return (
              <div key={t.id} style={{ background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 12, padding: '11px 13px', marginBottom: 7 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ flex: 1, fontSize: 13, color: T.text2, lineHeight: 1.4 }}>{t.title}</span>
                  <span style={{ flex: '0 0 auto', fontSize: 9.5, fontWeight: 700, padding: '3px 8px', borderRadius: 6, color: st.fg, background: st.bg, whiteSpace: 'nowrap' }}>{st.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 7 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 6, color: typeColor(t.type), background: typeChipBg(t.type) }}>{t.type}</span>
                  {due && <span style={{ marginLeft: 'auto', fontSize: 11.5, color: due.color }}><Icon name="clock" size={11} /> {due.text}</span>}
                </div>
              </div>
            )
          }) : <Empty>Нет активных задач</Empty>}
        </div>
        <div>
          <Sub>Ближайшие смены</Sub>
          <div style={{ background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 12, padding: '6px 13px', marginBottom: 14 }}>
            {myShifts.length ? myShifts.map((sd) => (
              <div key={sd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: `1px solid ${T.b2}`, fontSize: 13, color: T.text2 }}><Icon name="calendar" size={13} color={T.faint} />{fmtDate(sd)} · 13:00</div>
            )) : <div style={{ padding: '10px 0', fontSize: 12.5, color: T.faint }}>Смен пока нет</div>}
          </div>
          {p.ach.length > 0 && <><Sub>Достижения</Sub>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
              {p.ach.map((a, i) => <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.emberLight, border: '1px solid #3a3222', background: '#221d13', borderRadius: 16, padding: '5px 12px' }}><Icon name="trophy" size={13} />{a}</span>)}
            </div></>}
          {done.length > 0 && <><Sub>Недавно завершено</Sub>
            {done.slice(0, 3).map((h) => <div key={h.id} style={{ display: 'flex', gap: 8, fontSize: 12.5, color: T.muted, padding: '4px 2px' }}><Icon name="check" size={13} color={T.green} style={{ marginTop: 1 }} />{h.title}</div>)}</>}
        </div>
      </div>
    </div>
  )
}

const MN = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
function fmtDate(ds: string) { const [, m, d] = ds.split('-').map(Number); return `${d} ${MN[m - 1]}` }
function Sub({ children }: { children: React.ReactNode }) { return <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.muted, fontWeight: 600, margin: '0 2px 9px' }}>{children}</div> }
function Empty({ children }: { children: React.ReactNode }) { return <div style={{ fontSize: 12.5, color: T.faint, padding: '8px 2px' }}>{children}</div> }
