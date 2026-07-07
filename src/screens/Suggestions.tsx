import { useState } from 'react'
import { T } from '../theme/tokens'
import { Icon } from '../components/Icon'
import { suggs as MOCK, DIRS } from '../data/mock'
import { useApp } from '../state/app'
import type { Sugg } from '../types'

const ST: Record<Sugg['st'], { l: string; c: string }> = {
  new: { l: 'новое', c: '#8fb673' }, later: { l: 'потом', c: '#c9a56a' },
  converted: { l: 'в задаче', c: '#d9945a' }, project: { l: 'в проекте', c: '#b79ad4' }, rejected: { l: 'отклонено', c: '#8f897d' },
}
const SDIRS = ['Бар', 'Кухня', 'Зал', 'Интерьер', 'Маркетинг', 'Другое']

export function Suggestions({ mobile }: { mobile: boolean }) {
  const { role, go, showToast } = useApp()
  const [list, setList] = useState<Sugg[]>(() => MOCK.map((s) => ({ ...s })))
  const [filter, setFilter] = useState<string | null>(null)
  const [sendDir, setSendDir] = useState('Бар'); const [text, setText] = useState('')

  const act = (id: number, st: Sugg['st'], msg: string, nav?: () => void) => {
    setList((l) => l.map((s) => (s.id === id ? { ...s, st } : s)))
    showToast(msg); nav?.()
  }
  const send = () => {
    if (!text.trim()) return
    setList((l) => [{ id: Date.now(), dir: sendDir, text: text.trim(), author: 'Вы', dt: 'сейчас', st: 'new' }, ...l])
    setText(''); showToast('Отправлено на рассмотрение 🙌')
  }
  const rows = list.filter((s) => !filter || s.dir === filter)
  const chip = (on: boolean) => ({ fontSize: 12, padding: '6px 12px', borderRadius: 16, whiteSpace: 'nowrap' as const, border: `1px solid ${on ? '#4a3a26' : T.bCard}`, background: on ? '#241c12' : T.card, color: on ? T.emberLight : T.text4 })
  const canManage = role === 'owner' || role === 'admin'

  return (
    <div style={{ maxWidth: 760, paddingTop: 18 }}>
      {role === 'staff' && (
        <div style={{ background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 10.5, letterSpacing: '.8px', textTransform: 'uppercase', color: T.ember, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="bulb" size={14} />Моё предложение</div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 11 }}>
            {SDIRS.map((d) => <button key={d} onClick={() => setSendDir(d)} style={{ ...chip(sendDir === d), borderRadius: 10 }}>{d}</button>)}
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="что улучшить — по бару, кухне, залу…"
            style={{ width: '100%', background: T.input, border: `1px solid ${T.bRaised}`, borderRadius: 11, color: T.text, padding: '10px 13px', fontSize: 13.5, outline: 'none', minHeight: 60, resize: 'vertical', marginTop: 10 }} />
          <button onClick={send} style={{ width: '100%', background: T.ember, color: T.inset2, border: 'none', borderRadius: 11, padding: '11px 0', fontSize: 13.5, fontWeight: 600, marginTop: 10 }}>Отправить на рассмотрение</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
        <button onClick={() => setFilter(null)} style={chip(!filter)}>Все цеха</button>
        {Array.from(new Set(list.map((s) => s.dir))).map((d) => <button key={d} onClick={() => setFilter(filter === d ? null : d)} style={chip(filter === d)}>{d}</button>)}
      </div>

      {rows.map((s) => (
        <div key={s.id} style={{ background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 14, padding: '13px 16px', marginBottom: 9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontSize: 10, letterSpacing: '.8px', textTransform: 'uppercase', fontWeight: 700, color: T.ember }}>{s.dir}</span>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 11, color: ST[s.st].c }}>{ST[s.st].l}</span>
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.45, marginTop: 7, color: T.text }}>{s.text}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11.5, color: T.faint }}>{s.author} · {s.dt}</span>
            {canManage && s.st === 'new' && <>
              <span style={{ flex: 1 }} />
              <Act onClick={() => act(s.id, 'converted', 'Открываю создание задачи…', () => go('tasks'))} c={T.green}>В задачу</Act>
              <Act onClick={() => act(s.id, 'project', 'В бэклог проекта', () => go('projects'))} c="#b79ad4">В проект</Act>
              <Act onClick={() => act(s.id, 'later', 'Отложено')}>Потом</Act>
              <Act onClick={() => act(s.id, 'rejected', 'Отклонено')} c={T.red}>Отклонить</Act>
            </>}
          </div>
        </div>
      ))}
    </div>
  )
}

function Act({ children, onClick, c = '#b5aea2' }: { children: React.ReactNode; onClick: () => void; c?: string }) {
  return <button onClick={onClick} style={{ fontSize: 12, borderRadius: 9, padding: '6px 11px', border: `1px solid ${T.bRaised}`, background: 'transparent', color: c }}>{children}</button>
}
