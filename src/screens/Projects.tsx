import { useState } from 'react'
import { T, SERIF, typeColor } from '../theme/tokens'
import { Icon } from '../components/Icon'
import { DIRS, tasks, suggs } from '../data/mock'
import { useApp } from '../state/app'

type Stage = { t: string; s: 'done' | 'now' | 'plan' }
const PROJ: Record<string, { goal: string; stages: Stage[] }> = {
  'Бар': { goal: 'Барная карта уровня города — авторские коктейли и сезонное меню', stages: [{ t: 'Базовая карта коктейлей', s: 'done' }, { t: 'Сезонное меню (осень)', s: 'now' }, { t: 'Барное шоу по пятницам', s: 'plan' }] },
  'Кухня': { goal: 'Кухня, ради которой возвращаются', stages: [{ t: 'Стабильные заготовки', s: 'done' }, { t: 'Обновить хиты меню', s: 'now' }, { t: 'Винная пара к блюдам', s: 'plan' }] },
  'Интерьер': { goal: 'Атмосфера «тёмный уют» во всех залах', stages: [{ t: 'Освещение и свечи', s: 'done' }, { t: 'Настенные бра', s: 'now' }, { t: 'Зона у окна', s: 'plan' }] },
  'Маркетинг': { goal: 'Стабильный поток гостей из соцсетей', stages: [{ t: 'Регулярный контент', s: 'now' }, { t: 'Рилс-рубрика', s: 'plan' }, { t: 'Коллабы с блогерами', s: 'plan' }] },
  'Летняя площадка': { goal: 'Лучшая летняя веранда района', stages: [{ t: 'Мебель и зелень', s: 'done' }, { t: 'Мангал-зона', s: 'now' }] },
  'Лояльность': { goal: 'Гость возвращается по программе, а не случайно', stages: [{ t: 'Накопления по чекам', s: 'now' }, { t: 'Статусы и бонусы', s: 'plan' }] },
}
const SDOT = { done: '#8fb673', now: '#d9945a', plan: '#5c574e' }

export function Projects({ mobile }: { mobile: boolean }) {
  const { go, showToast } = useApp()
  const [sel, setSel] = useState<string | null>(null)

  if (sel) {
    const p = PROJ[sel] ?? { goal: 'Развитие направления', stages: [] }
    const total = p.stages.length || 1
    const doneN = p.stages.filter((s) => s.s === 'done').length
    const ideas = suggs.filter((s) => s.st === 'project' && s.dir === sel)
    const projTasks = tasks.filter((t) => t.dir === sel && t.st !== 'done')
    return (
      <div style={{ maxWidth: 720, paddingTop: 18, animation: 'mcFade .2s ease' }}>
        <button onClick={() => setSel(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: T.muted, fontSize: 12.5, padding: '0 0 14px' }}><Icon name="arrow-left" size={14} />Проекты</button>
        <div style={{ background: `linear-gradient(${T.raisedTop},${T.raisedBot})`, border: `1px solid ${T.bRaised}`, borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600 }}>{sel}</div>
          <div style={{ fontSize: 11, letterSpacing: '.8px', textTransform: 'uppercase', color: T.muted, margin: '12px 0 5px' }}>Куда идём</div>
          <div style={{ fontSize: 14, color: T.text2, lineHeight: 1.5 }}>{p.goal}</div>
          <div style={{ height: 4, borderRadius: 2, background: T.b2, marginTop: 14, overflow: 'hidden' }}><div style={{ height: '100%', background: T.ember, width: `${Math.round(doneN / total * 100)}%` }} /></div>
          <div style={{ fontSize: 11.5, color: T.faint, marginTop: 6 }}>{doneN} из {p.stages.length} этапов</div>
        </div>

        <Sub>Роадмап</Sub>
        <div style={{ marginBottom: 18 }}>
          {p.stages.map((st, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, position: 'relative', paddingBottom: 14 }}>
              <div style={{ position: 'relative', width: 12, display: 'flex', justifyContent: 'center' }}>
                {i < p.stages.length - 1 && <div style={{ position: 'absolute', top: 12, bottom: -2, width: 1, background: T.b2 }} />}
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: st.s === 'plan' ? 'transparent' : SDOT[st.s], border: `1.5px solid ${SDOT[st.s]}`, marginTop: 3 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, color: st.s === 'plan' ? T.muted : T.text2 }}>{st.t}</div>
                <div style={{ fontSize: 11, color: SDOT[st.s], marginTop: 1 }}>{st.s === 'done' ? '✓ готово' : st.s === 'now' ? '● сейчас' : '○ план'}</div>
              </div>
            </div>
          ))}
          {p.stages.length === 0 && <div style={{ fontSize: 12.5, color: T.faint }}>Этапы ещё не заданы</div>}
        </div>

        {ideas.length > 0 && <><Sub>Идеи · из «Предложений»</Sub>
          {ideas.map((s) => (
            <div key={s.id} style={{ background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 12, padding: '11px 14px', marginBottom: 7, display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ flex: 1, fontSize: 13, color: T.text2 }}>{s.text}</span>
              <button onClick={() => { showToast('Открываю создание задачи…'); go('tasks') }} style={{ fontSize: 12, borderRadius: 9, padding: '6px 11px', border: `1px solid ${T.bRaised}`, background: 'transparent', color: T.gold, whiteSpace: 'nowrap' }}>В задачу</button>
            </div>
          ))}</>}
        {projTasks.length > 0 && <><Sub>Задачи проекта</Sub>
          {projTasks.map((t) => <div key={t.id} style={{ display: 'flex', gap: 8, fontSize: 13, color: T.text3, padding: '5px 2px' }}><Icon name="point-filled" size={9} color={typeColor(t.type)} style={{ marginTop: 5 }} />{t.title}</div>)}</>}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900, paddingTop: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
        {DIRS.map((d) => {
          const p = PROJ[d]; const total = p?.stages.length ?? 0
          const doneN = p?.stages.filter((s) => s.s === 'done').length ?? 0
          const pct = total ? Math.round(doneN / total * 100) : 0
          return (
            <div key={d} onClick={() => setSel(d)} style={{ background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 14, padding: '13px 14px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="folder" size={16} color={T.gold} />
                <span style={{ flex: 1, fontSize: 13.5, color: T.text }}>{d}</span>
                <Icon name="chevron-right" size={13} color={T.faint3} />
              </div>
              <div style={{ height: 3, borderRadius: 2, background: T.b2, marginTop: 12, overflow: 'hidden' }}><div style={{ height: '100%', background: p ? T.ember : T.faint3, width: `${pct}%` }} /></div>
              <div style={{ fontSize: 11, color: T.faint, marginTop: 6 }}>{total ? `${doneN}/${total} этапов` : 'план'}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Sub({ children }: { children: React.ReactNode }) { return <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.muted, fontWeight: 600, margin: '18px 2px 11px' }}>{children}</div> }
