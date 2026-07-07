import { useState } from 'react'
import { T, STATUS, typeColor, typeChipBg } from '../theme/tokens'
import { Icon } from '../components/Icon'
import { tasks as MOCK, vits as VITS, M } from '../data/mock'
import { useApp } from '../state/app'
import type { Task, Vit } from '../types'

export function Admin({ mobile }: { mobile: boolean }) {
  const { showToast } = useApp()
  const [tab, setTab] = useState<'tasks' | 'vits'>('tasks')
  const [list, setList] = useState<Task[]>(() => MOCK.map((t) => ({ ...t })))
  const [vits, setVits] = useState<Vit[]>(() => VITS.map((v) => ({ ...v })))

  const setStatus = (id: number, st: Task['st']) => setList((l) => l.map((t) => (t.id === id ? { ...t, st } : t)))
  const reassign = (id: number, a: number) => { setList((l) => l.map((t) => (t.id === id ? { ...t, a } : t))); showToast(a ? `Назначено: ${M.find((m) => m.id === a)?.name}` : 'Назначение снято') }
  const del = (id: number) => { const snap = list; setList((l) => l.filter((t) => t.id !== id)); showToast('Задача удалена', () => setList(snap)) }
  const delVit = (id: number) => { const snap = vits; setVits((v) => v.filter((x) => x.id !== id)); showToast('Витамин удалён', () => setVits(snap)) }
  const toggleVit = (id: number) => setVits((v) => v.map((x) => (x.id === id ? { ...x, paused: !x.paused } : x)))

  const tabBtn = (on: boolean) => ({ fontSize: 13, padding: '8px 14px', borderRadius: 10, border: `1px solid ${on ? '#4a3a26' : T.bCard}`, background: on ? '#241c12' : T.card, color: on ? T.emberLight : T.text4 })
  const sel: React.CSSProperties = { background: T.input, border: `1px solid ${T.bRaised}`, borderRadius: 8, color: T.text3, padding: '5px 8px', fontSize: 12, outline: 'none', maxWidth: 130 }

  return (
    <div style={{ maxWidth: 820, paddingTop: 18 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab('tasks')} style={tabBtn(tab === 'tasks')}>Задачи · {list.length}</button>
        <button onClick={() => setTab('vits')} style={tabBtn(tab === 'vits')}>Витамины · {vits.length}</button>
      </div>

      {tab === 'tasks' ? list.map((t) => {
        const st = STATUS[t.st]
        return (
          <div key={t.id} style={{ background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 12, padding: '11px 14px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, flexWrap: 'wrap' }}>
              <span style={{ flex: 1, minWidth: 140, fontSize: 13.5, color: T.text }}>{t.title}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 7, color: st.fg, background: st.bg, whiteSpace: 'nowrap' }}>{st.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 6, color: typeColor(t.type), background: typeChipBg(t.type) }}>{t.type}</span>
              <select value={t.a} onChange={(e) => reassign(t.id, +e.target.value)} style={sel}>
                <option value={0}>Снять назначение</option>
                {M.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <span style={{ flex: 1 }} />
              {t.st === 'done'
                ? <IconBtn icon="rotate-2" title="Вернуть" onClick={() => setStatus(t.id, 'returned')} />
                : <IconBtn icon="circle-check" title="Сделано" onClick={() => setStatus(t.id, 'done')} c={T.green} />}
              <IconBtn icon="trash" title="Удалить" onClick={() => del(t.id)} c={T.red} />
            </div>
          </div>
        )
      }) : vits.map((v) => (
        <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 12, padding: '11px 14px', marginBottom: 8, opacity: v.paused ? 0.6 : 1 }}>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 13.5, color: T.text }}>{v.title}</span>
            <span style={{ fontSize: 11.5, color: T.gold, marginLeft: 8 }}>{v.time}</span>
          </span>
          <IconBtn icon={v.paused ? 'player-play' : 'player-pause'} title={v.paused ? 'Запустить' : 'Пауза'} onClick={() => toggleVit(v.id)} />
          <IconBtn icon="trash" title="Удалить" onClick={() => delVit(v.id)} c={T.red} />
        </div>
      ))}
    </div>
  )
}

function IconBtn({ icon, title, onClick, c = '#8f897d' }: { icon: string; title: string; onClick: () => void; c?: string }) {
  return <button onClick={onClick} title={title} style={{ width: 32, height: 32, borderRadius: 9, border: `1px solid ${T.bRaised}`, background: 'transparent', color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Icon name={icon} size={15} /></button>
}
