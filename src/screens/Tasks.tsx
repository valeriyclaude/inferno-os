import { useEffect, useMemo, useState, useCallback } from 'react'
import { T } from '../theme/tokens'
import { typeColor, typeChipBg, STATUS } from '../theme/tokens'
import { Icon, Avatar } from '../components/Icon'
import { tasks as MOCK, vits as VITS, TYPES, DIRS, TYPE2DIR, M } from '../data/mock'
import { resolveAssignee, dueLabel } from '../lib/format'
import { apiGet, apiPost, isLive, resolveApi } from '../lib/api'
import { useApp } from '../state/app'
import type { Task, Status } from '../types'

type SFilter = 'active' | 'attention' | 'done' | 'vits'
type Member = { id: number; name: string }
const ACTIVE: Status[] = ['new', 'in_progress', 'returned']
const WD = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

// живой API-таск → форма экрана
function normLive(t: any): Task {
  return {
    id: t.id, title: t.text, type: t.domain || 'Другое',   // домен PLAUD = тип/цех напрямую
    dir: t.domain || '', a: t.assignee_id || 0, st: t.status, pr: t.priority,
    dl: t.deadline || null, aname: t.assignee_name, origin: t.origin,
  }
}

export function Tasks({ mobile }: { mobile: boolean }) {
  const { role, taskPerson, setTaskPerson, openPerson, showToast } = useApp()
  const canCreate = role === 'owner' || role === 'admin'
  const [list, setList] = useState<Task[]>(() => MOCK.map((t) => ({ ...t })))
  const [vits, setVits] = useState(() => VITS.map((v) => ({ ...v })))
  const [q, setQ] = useState('')
  const [type, setType] = useState<string | null>(null)
  const [sf, setSf] = useState<SFilter>('active')
  const [create, setCreate] = useState(false)
  const [members, setMembers] = useState<Member[]>(() => M.map((m) => ({ id: m.id, name: m.name })))
  const [live, setLive] = useState(false)

  const load = useCallback(async () => { const d = await apiGet('/api/tasks'); setList(d.tasks.map(normLive)) }, [])
  useEffect(() => {
    if (!isLive()) return
    ;(async () => {
      try {
        await resolveApi(); await load(); setLive(true)
        try { const mm = await apiGet('/api/members'); if (mm.members?.length) setMembers(mm.members.map((m: any) => ({ id: m.id, name: m.name }))) } catch { /* ignore */ }
      } catch { /* нет связи — остаёмся на демо-данных */ }
    })()
  }, [load])

  const overdue = (t: Task) => !!t.dl && new Date(t.dl) < new Date() && t.st !== 'done'
  const counts = useMemo(() => ({
    active: list.filter((t) => ACTIVE.includes(t.st)).length,
    attention: list.filter((t) => t.st === 'not_done' || t.st === 'blocked' || overdue(t)).length,
    done: list.filter((t) => t.st === 'done').length,
    vits: vits.length,
  }), [list, vits])

  const rows = useMemo(() => list.filter((t) => {
    if (sf === 'active' && !ACTIVE.includes(t.st)) return false
    if (sf === 'attention' && !(t.st === 'not_done' || t.st === 'blocked' || overdue(t))) return false
    if (sf === 'done' && t.st !== 'done') return false
    if (type && t.type !== type) return false
    if (taskPerson && t.a !== taskPerson) return false
    if (q && !t.title.toLowerCase().includes(q.toLowerCase())) return false
    return true
  }), [list, sf, type, taskPerson, q])

  function done(t: Task) {
    if (live) {
      apiPost(`/api/tasks/${t.id}/done`, {}).then(load).then(() => showToast('Готово ✓')).catch((e) => showToast('Не вышло: ' + e.message))
      return
    }
    const snap = list
    setList((l) => l.map((x) => (x.id === t.id ? { ...x, st: 'done' } : x)))
    showToast('Готово ✓', () => setList(snap))
  }
  function addTask(t: Task) {
    if (live) {
      apiPost('/api/tasks', { text: t.title, assignee_id: t.a, priority: t.pr, deadline: t.dl }).then(load).then(() => showToast('Задача создана')).catch((e) => showToast('Не вышло: ' + e.message))
      return
    }
    setList((l) => [t, ...l]); showToast('Задача создана')
  }
  const [sheetTask, setSheetTask] = useState<Task | null>(null)
  const manage = live && canCreate
  function reassign(id: number, a: number) {
    apiPost(`/api/tasks/${id}/reassign`, { assignee_id: a }).then(load).then(() => showToast(a ? 'Назначено' : 'Снято назначение')).catch((e) => showToast('Не вышло: ' + e.message))
    setSheetTask(null)
  }
  function cancelTask(id: number) {
    apiPost(`/api/tasks/${id}/cancel`).then(load).then(() => showToast('Задача удалена')).catch((e) => showToast('Не вышло: ' + e.message))
    setSheetTask(null)
  }
  function toggleVit(id: number) {
    setVits((vs) => vs.map((v) => (v.id === id ? { ...v, paused: !v.paused } : v)))
  }

  const chip = (active: boolean) => ({
    fontSize: 12, padding: '6px 12px', borderRadius: 16, whiteSpace: 'nowrap' as const,
    border: `1px solid ${active ? '#4a3a26' : T.bCard}`, background: active ? '#241c12' : T.card, color: active ? T.emberLight : T.text4,
  })

  return (
    <div style={{ maxWidth: 900, paddingTop: 18 }}>
      {/* поиск + создать */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1, minWidth: 180, background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 11, padding: '9px 13px' }}>
          <Icon name="search" size={15} color={T.faint} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по задачам…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: T.text, fontSize: 13.5, minWidth: 60 }} />
        </div>
        {canCreate && (
          <button onClick={() => setCreate(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 7, background: T.ember, color: T.inset2, border: 'none', borderRadius: 11, padding: '10px 16px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
            <Icon name="plus" size={15} />Создать задачу
          </button>
        )}
      </div>

      {taskPerson && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 12.5, color: T.muted }}>Задачи сотрудника:</span>
          <button onClick={() => setTaskPerson(null)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#201e19', border: `1px solid ${T.bRaised}`, color: T.emberLight, borderRadius: 8, padding: '5px 10px', fontSize: 12 }}>
            {M.find((m) => m.id === taskPerson)?.name}<Icon name="x" size={12} />
          </button>
        </div>
      )}

      {sf !== 'vits' && (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
          <button onClick={() => setType(null)} style={chip(!type)}>Все типы</button>
          {TYPES.slice(0, mobile ? 6 : 10).map((t) => (
            <button key={t} onClick={() => setType(type === t ? null : t)}
              style={{ ...chip(type === t), color: type === t ? typeColor(t) : T.text4, borderColor: type === t ? typeColor(t) : T.bCard, background: type === t ? typeChipBg(t) : T.card }}>{t}</button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 18 }}>
        {([['active', 'Активные'], ['attention', 'Требуют внимания'], ['done', 'Сделанные'], ['vits', '🔁 Витамины']] as [SFilter, string][]).map(([k, label]) => (
          <button key={k} onClick={() => setSf(k)} style={chip(sf === k)}>
            {label}<span style={{ marginLeft: 6, fontSize: 11, color: sf === k ? T.emberLight : T.faint }}>{counts[k]}</span>
          </button>
        ))}
      </div>

      {sf === 'vits' ? (
        <VitList vits={vits} onToggle={toggleVit} canEdit={canCreate} />
      ) : rows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: T.faint }}>
          <Icon name="checks" size={32} color="#3f382c" style={{ display: 'block', margin: '0 auto 10px' }} />Здесь пусто
        </div>
      ) : rows.map((t) => (
        <TaskCard key={t.id} t={t} onDone={() => done(t)} onPerson={() => t.a && openPerson(t.a)} manage={manage} onMenu={() => setSheetTask(t)} />
      ))}

      {create && <CreateDrawer mobile={mobile} members={members} onClose={() => setCreate(false)} onCreate={(t) => { addTask(t); setCreate(false) }} />}

      {sheetTask && (
        <div onClick={() => setSheetTask(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(8,6,4,.6)', zIndex: 45, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 460, maxHeight: '80%', overflowY: 'auto', background: '#181613', borderTop: `1px solid ${T.bRaised}`, borderRadius: '18px 18px 0 0', padding: '14px 16px calc(20px + env(safe-area-inset-bottom))', animation: 'mcSheet .2s ease' }}>
            <div style={{ fontSize: 14, color: T.text2, marginBottom: 14, lineHeight: 1.4 }}>{sheetTask.title}</div>
            <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: T.muted, marginBottom: 8 }}>Назначить исполнителя</div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
              {members.map((m) => <button key={m.id} onClick={() => reassign(sheetTask.id, m.id)} style={chip(sheetTask.a === m.id)}>{m.name}</button>)}
              {sheetTask.a > 0 && <button onClick={() => reassign(sheetTask.id, 0)} style={chip(false)}>Снять</button>}
            </div>
            <button onClick={() => cancelTask(sheetTask.id)} style={{ width: '100%', background: '#2b1810', border: '1px solid #3a241c', color: '#e0937a', borderRadius: 11, padding: '11px 0', fontSize: 13.5 }}>Удалить задачу</button>
          </div>
        </div>
      )}
    </div>
  )
}

function TaskCard({ t, onDone, onPerson, manage, onMenu }: { t: Task; onDone: () => void; onPerson: () => void; manage?: boolean; onMenu?: () => void }) {
  const st = STATUS[t.st]
  const a = resolveAssignee(t)
  const due = dueLabel(t.dl)
  const isOrder = !!t.order
  const canCheck = t.st !== 'done' && t.st !== 'blocked'
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 14, padding: '12px 15px', marginBottom: 8 }}>
      {canCheck ? (
        <button onClick={onDone} title="Готово"
          style={{ flex: '0 0 auto', width: 24, height: 24, borderRadius: '50%', border: '1.5px solid #4a4230', background: 'transparent', marginTop: 1 }} />
      ) : (
        <span style={{ flex: '0 0 auto', width: 24, height: 24, borderRadius: 8, background: isOrder ? '#1b2412' : st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
          <Icon name={isOrder ? 'shopping-cart' : t.st === 'done' ? 'check' : 'lock'} size={13} color={isOrder ? T.green : st.fg} />
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, flexWrap: 'wrap' }}>
          <span style={{ flex: 1, minWidth: 140, fontSize: 14, color: T.text, lineHeight: 1.4, overflowWrap: 'break-word' }}>
            {t.origin === 'plaud' && <Icon name="sparkles" size={12} color={T.emberLight} style={{ marginRight: 5 }} />}
            {t.pr === 'urgent' && <Icon name="flame" size={13} color={T.ember} style={{ marginRight: 5 }} />}
            {t.recId && <Icon name="repeat" size={12} color={T.green} style={{ marginRight: 5 }} />}
            {t.title}
          </span>
          <span style={{ flex: '0 0 auto', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 7, whiteSpace: 'nowrap', color: st.fg, background: st.bg }}>{st.label}</span>
          {manage && <button onClick={onMenu} aria-label="Действия" style={{ flex: '0 0 auto', background: 'none', border: 'none', color: T.faint, padding: '0 0 0 2px', marginTop: 1 }}><Icon name="dots" size={16} /></button>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 7, color: typeColor(t.type), background: typeChipBg(t.type), whiteSpace: 'nowrap' }}>{t.type}</span>
          {t.dir && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: T.muted, whiteSpace: 'nowrap' }}><Icon name="folder" size={12} color={T.faint} />{t.dir}</span>}
          <span onClick={onPerson} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: t.a ? 'pointer' : 'default' }}>
            <Avatar mono={a.mono} bg={a.avaBg} fg={a.avaFg} size={20} font={8.5} />
            <span style={{ fontSize: 12.5, color: '#9e9585' }}>{a.name}</span>
          </span>
          {due && <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, whiteSpace: 'nowrap', color: due.color }}><Icon name="clock" size={12} />{due.text}</span>}
        </div>
        {t.check && !isOrder && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11.5, color: T.muted }}><Icon name="list-check" size={13} />Чек-лист {t.done ?? 0}/{t.check.length}</div>}
        {isOrder && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11.5, color: T.green }}><Icon name="shopping-cart" size={13} />Заказ · {t.order!.length} поз.</div>}
      </div>
    </div>
  )
}

function VitList({ vits, onToggle, canEdit }: { vits: typeof VITS; onToggle: (id: number) => void; canEdit: boolean }) {
  const sched = (v: typeof VITS[number]) => {
    const fr = v.freq === 'daily' ? 'Каждый день' : v.freq === 'every2' ? 'Через день'
      : v.freq === 'weekly' ? `Раз в неделю · ${WD[(v.dow ?? 1) - 1] ?? 'Пн'}`
      : v.cmode === 'interval' ? `Каждые ${v.every ?? 2} дн.` : (v.dows ?? []).map((d) => WD[d - 1]).join(', ')
    return `${fr} · ${v.time}`
  }
  return (
    <div style={{ animation: 'mcFade .2s ease' }}>
      <div style={{ display: 'flex', gap: 8, margin: '2px 2px 14px', fontSize: 12.5, lineHeight: 1.5, color: T.muted }}>
        <Icon name="repeat" size={14} color={T.green} style={{ marginTop: 2, flex: '0 0 auto' }} />
        <span>Витамины — задачи, которые система ставит сама с нужной периодичностью. Сегодняшние появляются в «Активных» с меткой 🔁.</span>
      </div>
      {vits.map((v) => (
        <div key={v.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 14, padding: '12px 15px', marginBottom: 8, opacity: v.paused ? 0.55 : 1 }}>
          <span style={{ flex: '0 0 auto', width: 24, height: 24, borderRadius: 8, background: '#1b2412', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}><Icon name="repeat" size={13} color={T.green} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, flexWrap: 'wrap' }}>
              <span style={{ flex: 1, minWidth: 140, fontSize: 14, color: T.text }}>{v.title}</span>
              <span style={{ flex: '0 0 auto', fontSize: 11, color: v.paused ? T.faint : T.green }}>{v.paused ? 'на паузе' : 'активен'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: T.gold }}><Icon name="clock" size={12} />{sched(v)}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 7, color: typeColor(v.type), background: typeChipBg(v.type) }}>{v.type}</span>
            </div>
          </div>
          {canEdit && (
            <button onClick={() => onToggle(v.id)} title={v.paused ? 'Возобновить' : 'Пауза'}
              style={{ flex: '0 0 auto', width: 32, height: 32, borderRadius: 10, border: `1px solid ${T.bRaised}`, background: 'transparent', color: T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={v.paused ? 'player-play' : 'player-pause'} size={15} />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

function CreateDrawer({ mobile, members, onClose, onCreate }: { mobile: boolean; members: Member[]; onClose: () => void; onCreate: (t: Task) => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [type, setType] = useState<string>('')
  const [dir, setDir] = useState<string>('')
  const [title, setTitle] = useState('')
  const [a, setA] = useState(0)
  const [pr, setPr] = useState<'normal' | 'urgent'>('normal')
  const [freq, setFreq] = useState<'once' | 'daily' | 'every2' | 'weekly'>('once')
  const [dl, setDl] = useState<string>('')

  function pickType(t: string) { setType(t); setDir(TYPE2DIR[t] || ''); setStep(2) }
  function submit() {
    if (!title.trim()) return
    const t: Task = {
      id: Date.now(), title: title.trim(), type, dir: dir || TYPE2DIR[type] || 'Другое', a,
      st: 'new', pr, dl: freq === 'once' ? (dl || null) : null, recId: freq !== 'once' ? Date.now() : undefined,
    }
    onCreate(t)
  }

  const now = new Date()
  const mk = (d: number, h: number) => { const x = new Date(now); x.setDate(x.getDate() + d); x.setHours(h, 0, 0, 0); return x }
  const presets = ([[0, 18, 'Сегодня 18:00'], [0, 22, 'Сегодня 22:00'], [1, 12, 'Завтра 12:00'], [1, 18, 'Завтра 18:00']] as [number, number, string][])
    .map(([d, h, l]) => ({ v: mk(d, h), l })).filter((p) => p.v > now)

  const seg = (on: boolean) => ({ borderRadius: 9, padding: '8px 13px', fontSize: 13, border: `1px solid ${on ? T.ember : T.bRaised}`, background: on ? '#241c12' : T.raisedBot, color: on ? T.emberLight : T.muted })

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(8,6,4,.6)', zIndex: 50, display: 'flex', justifyContent: mobile ? 'stretch' : 'flex-end', alignItems: mobile ? 'flex-end' : 'stretch' }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: mobile ? '100%' : 440, maxHeight: mobile ? '90%' : '100%', overflowY: 'auto', background: '#181613',
        borderLeft: mobile ? 'none' : `1px solid ${T.bRaised}`, borderRadius: mobile ? '18px 18px 0 0' : 0,
        boxShadow: '-30px 0 70px -30px rgba(0,0,0,.7)', padding: '18px 18px calc(22px + env(safe-area-inset-bottom))', animation: mobile ? 'mcSheet .2s ease' : 'mcSheet .2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          {step === 2 && <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: T.muted, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13 }}><Icon name="arrow-left" size={15} />Тип</button>}
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.faint }}><Icon name="x" size={20} /></button>
        </div>

        {step === 1 ? (
          <>
            <Lbl>Тип работы</Lbl>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 8 }}>
              {TYPES.map((t) => (
                <button key={t} onClick={() => pickType(t)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 12px', borderRadius: 11, border: `1px solid ${T.bCard}`, background: T.card, color: T.text2, fontSize: 13, textAlign: 'left' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: typeColor(t), flex: '0 0 auto' }} />{t}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <Fld><Lbl>Цех / проект</Lbl>
              <select value={dir} onChange={(e) => setDir(e.target.value)} style={inputSt}>
                <option value="">— выбрать —</option>
                {DIRS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <Hint>{TYPE2DIR[type] ? `Авто по типу «${type}». Задача попадёт в проект этого цеха.` : 'Для этого типа цех выбирается вручную.'}</Hint>
            </Fld>
            <Fld><Lbl>Что сделать</Lbl>
              <textarea value={title} onChange={(e) => setTitle(e.target.value)} placeholder="напр.: помыть колбы перед открытием" style={{ ...inputSt, minHeight: 64, resize: 'vertical' }} />
            </Fld>
            <Fld><Lbl>Исполнитель</Lbl>
              <select value={a} onChange={(e) => setA(+e.target.value)} style={inputSt}>
                <option value={0}>На усмотрение рук.</option>
                {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </Fld>
            <Fld><Lbl>Приоритет</Lbl>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setPr('normal')} style={seg(pr === 'normal')}>Обычная</button>
                <button onClick={() => setPr('urgent')} style={seg(pr === 'urgent')}>🔥 Срочно</button>
              </div>
            </Fld>
            <Fld><Lbl>Повторение</Lbl>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {([['once', 'Разовая'], ['daily', 'Каждый день'], ['every2', 'Через день'], ['weekly', 'Раз в неделю']] as [typeof freq, string][]).map(([k, l]) => (
                  <button key={k} onClick={() => setFreq(k)} style={seg(freq === k)}>{l}</button>
                ))}
              </div>
            </Fld>
            {freq === 'once' && (
              <Fld><Lbl>Срок</Lbl>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button onClick={() => setDl('')} style={seg(!dl)}>Без</button>
                  {presets.map((p) => <button key={p.l} onClick={() => setDl(p.v.toISOString())} style={seg(dl === p.v.toISOString())}>{p.l}</button>)}
                </div>
              </Fld>
            )}
            <button onClick={submit} disabled={!title.trim()}
              style={{ width: '100%', background: title.trim() ? T.ember : T.b3, color: T.inset2, border: 'none', borderRadius: 11, padding: '13px 0', fontSize: 15, fontWeight: 600, marginTop: 6 }}>
              {freq === 'once' ? 'Создать задачу' : 'Создать витамин'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const inputSt: React.CSSProperties = { width: '100%', background: T.input, border: `1px solid ${T.bRaised}`, borderRadius: 10, color: T.text, padding: '10px 12px', fontSize: 14, outline: 'none' }
function Lbl({ children }: { children: React.ReactNode }) { return <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: T.muted, marginBottom: 7 }}>{children}</div> }
function Fld({ children }: { children: React.ReactNode }) { return <div style={{ marginBottom: 14 }}>{children}</div> }
function Hint({ children }: { children: React.ReactNode }) { return <div style={{ fontSize: 11.5, color: T.faint, marginTop: 6, lineHeight: 1.4 }}>{children}</div> }
