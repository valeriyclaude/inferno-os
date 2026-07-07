import { useEffect, useMemo, useState } from 'react'
import { T, SERIF, loadColor } from '../theme/tokens'
import { Icon, Avatar } from '../components/Icon'
import { decisions as DEC, feed as FEED, M, tasks, suggs, shifts } from '../data/mock'
import type { Decision, FeedEvent, Section } from '../types'

const GROUPS = ['Сейчас', 'Утро', 'Вчера']

export function MissionControl({ onNav, mobile = false }: { onNav: (s: Section) => void; mobile?: boolean }) {
  const [decs, setDecs] = useState<Decision[]>(() => DEC.map((d) => ({ ...d })))
  const [why, setWhy] = useState<Record<number, boolean>>({})
  const [feedWhy, setFeedWhy] = useState<Record<number, boolean>>({})
  const [feed, setFeed] = useState<FeedEvent[]>(() => FEED.map((f) => ({ ...f })))

  // Симуляция живой ленты: через ~9с «прилетает» AI-событие (в проде — стрим из бэка)
  useEffect(() => {
    const t = setTimeout(() => {
      setFeed((f) => [{
        id: 999, group: 'Сейчас', time: 'сейчас', tick: T.ember, fresh: true,
        title: 'AI: спрос на тёплые напитки растёт — 3-е упоминание облепихи за неделю',
        sources: [{ icon: 'ti-sparkles', label: 'AI-анализ' }],
        actions: [{ label: 'В решения', kind: 'primary' }],
      }, ...f])
    }, 9000)
    return () => clearTimeout(t)
  }, [])

  const openN = decs.filter((d) => d.open).length
  const allDecided = decs.length > 0 && openN === 0

  function confirm(id: number, text: string) {
    setDecs((ds) => ds.map((d) => (d.id === id ? { ...d, open: false, confirmedText: text } : d)))
  }

  const grouped = useMemo(() => GROUPS.map((g) => ({ label: g, events: feed.filter((e) => e.group === g) })).filter((g) => g.events.length), [feed])

  const today = new Date(); const ds = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
  const active = tasks.filter((t) => t.st !== 'done').length
  const attention = tasks.filter((t) => t.st === 'not_done' || t.st === 'blocked' || (t.dl && new Date(t.dl) < today && t.st !== 'done')).length
  const onShift = (shifts[ds] ?? []).length
  const openOrders = tasks.filter((t) => t.order && t.st !== 'done').length
  const newSuggs = suggs.filter((s) => s.st === 'new').length

  const digest = [
    { n: active, label: 'активных задач', color: T.text, to: 'tasks' as Section },
    { n: attention, label: 'требуют внимания', color: attention ? T.red : T.text, to: 'tasks' as Section },
    { n: onShift, label: 'на смене сегодня', color: T.text, to: 'shifts' as Section },
    { n: openOrders, label: 'открытых заказов', color: T.text, to: 'orders' as Section },
    { n: newSuggs, label: 'новых предложений', color: newSuggs ? T.ember : T.text, to: 'suggs' as Section },
    { n: 4, label: 'событий в календаре', color: T.text, to: 'calendar' as Section },
  ]
  const team = [...M].filter((m) => m.sysRole !== 'owner').sort((a, b) => b.load - a.load).slice(0, 4)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: mobile ? 4 : 26, alignItems: 'flex-start' }}>
      {/* центральная лента */}
      <div style={{ flex: mobile ? '1 1 100%' : '999 1 460px', minWidth: 0, maxWidth: 760 }}>
        <div style={{ margin: '20px 0 22px' }}>
          <div style={{ fontFamily: SERIF, fontSize: 'clamp(24px,2.6vw,31px)', fontWeight: 600, color: T.text }}>Доброе утро.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 9 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.ember, flex: '0 0 auto', animation: 'mcPulse 2.6s ease infinite' }} />
            <span style={{ fontSize: 13.5, color: T.text4 }}>
              {openN ? `${openN} решения ждут вас · ${attention} задач требуют внимания · выручка вчера +12%` : 'Всё под контролем. Хорошего дня.'}
            </span>
          </div>
        </div>

        {openN > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 10px' }}>
            <span style={{ fontSize: 11, letterSpacing: '1.7px', textTransform: 'uppercase', color: T.muted, fontWeight: 600 }}>Требуют решения</span>
            <Badge n={openN} />
          </div>
        )}
        {allDecided && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 18px', fontSize: 13, color: T.green }}>
            <Icon name="check" size={15} />Все решения на сегодня приняты
          </div>
        )}

        {decs.map((d) => (
          <div key={d.id}>
            {d.open && (
              <div style={{ background: `linear-gradient(${T.raisedTop},${T.raisedBot})`, border: `1px solid ${T.bRaised}`, borderRadius: 16, padding: '17px 20px', marginBottom: 12, boxShadow: '0 18px 40px -26px rgba(0,0,0,.65)' }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px 10px', marginBottom: 9 }}>
                  <span style={{ fontSize: 10, letterSpacing: '.9px', textTransform: 'uppercase', fontWeight: 700, color: d.tagColor, whiteSpace: 'nowrap' }}>{d.tag}</span>
                  <span style={{ flex: 1 }} />
                  {d.sources.map((s, i) => <SourceChip key={i} icon={s.icon} label={s.label} />)}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: T.text, lineHeight: 1.35, overflowWrap: 'break-word' }}>{d.title}</div>
                <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{d.sub}</div>
                <button onClick={() => setWhy((w) => ({ ...w, [d.id]: !w[d.id] }))}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: T.gold, fontSize: 12.5, padding: 0, marginTop: 11 }}>
                  {why[d.id] ? 'Скрыть' : 'Почему'}<Icon name={why[d.id] ? 'chevron-up' : 'chevron-down'} size={13} />
                </button>
                {why[d.id] && (
                  <div style={{ marginTop: 9, display: 'flex', flexDirection: 'column', gap: 6, animation: 'mcFade .2s ease' }}>
                    {d.reasons.map((r, i) => (
                      <div key={i} style={{ display: 'flex', gap: 9, fontSize: 13, color: T.text3 }}><span style={{ color: T.faint }}>·</span>{r}</div>
                    ))}
                  </div>
                )}
                {d.rec && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginTop: 13, padding: '11px 12px', borderRadius: 12, background: T.inset, border: `1px solid ${T.b3}` }}>
                    <Avatar mono={d.rec.mono} bg={d.rec.avaBg} fg={d.rec.avaFg} font={10.5} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 13.5, color: T.text }}>{d.rec.name}<span style={{ fontSize: 11, color: T.faint, marginLeft: 8 }}>лучший исполнитель</span></div>
                      <div style={{ fontSize: 12, color: T.muted, marginTop: 2, lineHeight: 1.45 }}>{d.rec.meta}</div>
                      <div style={{ fontSize: 11.5, color: T.green, marginTop: 3 }}>{d.rec.note}</div>
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 9, marginTop: 15 }}>
                  <button onClick={() => confirm(d.id, `${d.title} — принято`)}
                    style={{ background: T.ember, color: T.inset2, border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 600 }}>{d.primaryLabel}</button>
                  <button onClick={() => confirm(d.id, `${d.title} — ${d.secondaryLabel.toLowerCase()}`)}
                    style={{ background: 'none', border: `1px solid ${T.bRaised}`, color: T.text3, borderRadius: 10, padding: '9px 15px', fontSize: 13 }}>{d.secondaryLabel}</button>
                  <button onClick={() => confirm(d.id, `${d.title} — отложено`)}
                    style={{ background: 'none', border: 'none', color: T.faint, fontSize: 13, padding: '9px 8px' }}>Позже</button>
                </div>
              </div>
            )}
            {!d.open && d.confirmedText && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderRadius: 12, background: '#171613', border: `1px solid ${T.b2}`, marginBottom: 12, fontSize: 13, color: T.muted, animation: 'mcFade .25s ease' }}>
                <Icon name="check" size={15} color={T.green} />{d.confirmedText}
              </div>
            )}
          </div>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '24px 0 4px' }}>
          <span style={{ fontSize: 11, letterSpacing: '1.7px', textTransform: 'uppercase', color: T.muted, fontWeight: 600 }}>Лента компании</span>
        </div>
        {grouped.map((g) => (
          <div key={g.label}>
            <div style={{ fontSize: 11.5, color: T.faint, margin: `16px 0 8px ${mobile ? 50 : 78}px` }}>{g.label}</div>
            {g.events.map((e) => (
              <div key={e.id} style={{ display: 'flex', position: 'relative' }}>
                <div style={{ width: mobile ? 44 : 64, flex: '0 0 auto', textAlign: 'right', fontSize: 11.5, color: T.faint, fontVariantNumeric: 'tabular-nums', paddingTop: 14 }}>{e.time}</div>
                <div style={{ position: 'relative', flex: '0 0 auto', width: 28, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ position: 'absolute', top: 0, bottom: 0, width: 1, background: T.b2 }} />
                  <div style={{ position: 'relative', width: 7, height: 7, borderRadius: '50%', background: e.tick, marginTop: 17, boxShadow: `0 0 0 4px ${T.bg}` }} />
                </div>
                <div style={{ flex: 1, minWidth: 0, background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 14, padding: '12px 16px', marginBottom: 10, animation: e.fresh ? 'mcNew 3.2s ease' : undefined }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    {e.done && <Icon name="check" size={15} color={T.green} style={{ marginTop: 2, flex: '0 0 auto' }} />}
                    <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: T.text2, lineHeight: 1.45, overflowWrap: 'break-word' }}>{e.title}</span>
                    {e.reasons && (
                      <button onClick={() => setFeedWhy((w) => ({ ...w, [e.id]: !w[e.id] }))}
                        style={{ background: 'none', border: 'none', color: T.faint, fontSize: 11.5, padding: '2px 0 0', flex: '0 0 auto' }}>почему</button>
                    )}
                  </div>
                  {e.reasons && feedWhy[e.id] && (
                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5, animation: 'mcFade .2s ease' }}>
                      {e.reasons.map((r, i) => <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12.5, color: T.text4 }}><span style={{ color: T.faint }}>·</span>{r}</div>)}
                    </div>
                  )}
                  {(e.sources || e.actions) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                      {e.sources?.map((s, i) => <SourceChip key={i} icon={s.icon} label={s.label} />)}
                      <span style={{ flex: 1 }} />
                      {e.actions?.map((a, i) => (
                        <button key={i} onClick={() => a.kind === 'primary' && onNav('suggs')}
                          style={{
                            borderRadius: 9, padding: '6px 12px', fontSize: 12,
                            border: `1px solid ${a.kind === 'primary' ? '#4a3a26' : T.bRaised}`,
                            background: a.kind === 'primary' ? '#241c12' : 'transparent',
                            color: a.kind === 'primary' ? T.emberLight : T.text3,
                          }}>{a.label}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* правая колонка (на телефоне — во всю ширину под лентой) */}
      <div style={{ width: mobile ? '100%' : 288, flex: mobile ? '1 1 100%' : '1 1 260px' }}>
        <div style={{ fontSize: 11, letterSpacing: '1.7px', textTransform: 'uppercase', color: T.muted, fontWeight: 600, margin: '22px 6px 10px' }}>Сегодня</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 24 }}>
          {digest.map((dr, i) => (
            <button key={i} onClick={() => onNav(dr.to)} data-hover
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '9px 10px', borderRadius: 11, border: 'none', background: 'transparent', textAlign: 'left' }}>
              <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, width: 28, textAlign: 'center', color: dr.color, flex: '0 0 auto' }}>{dr.n}</span>
              <span style={{ flex: 1, fontSize: 12.5, color: T.text3, lineHeight: 1.3 }}>{dr.label}</span>
              <Icon name="chevron-right" size={13} color={T.faint3} style={{ flex: '0 0 auto' }} />
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, letterSpacing: '1.7px', textTransform: 'uppercase', color: T.muted, fontWeight: 600, margin: '0 6px 12px' }}>Команда сейчас</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, padding: '0 6px' }}>
          {team.map((p) => (
            <div key={p.id} onClick={() => onNav('people')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar mono={p.mono} bg={p.avaBg} fg={p.avaFg} font={10} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: T.text }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: T.faint }}>{p.job}</div>
                </div>
                <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', color: loadColor(p.load) }}>{p.load}%</span>
              </div>
              <div style={{ height: 3, borderRadius: 2, background: T.b2, margin: '8px 0 0 38px', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, background: loadColor(p.load), width: `${p.load}%` }} />
              </div>
              {p.ai && (
                <div style={{ display: 'flex', gap: 6, margin: '7px 0 0 38px', fontSize: 11.5, lineHeight: 1.4, color: p.load >= 80 ? '#d9a08a' : T.muted }}>
                  <Icon name="sparkles" size={12} style={{ marginTop: 1, flex: '0 0 auto' }} />{p.ai}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Badge({ n }: { n: number }) {
  return <span style={{ fontSize: 11, fontWeight: 700, color: T.inset2, background: T.ember, borderRadius: 8, minWidth: 17, height: 17, lineHeight: '17px', textAlign: 'center', padding: '0 4px' }}>{n}</span>
}
function SourceChip({ icon, label }: { icon: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: T.faint, border: `1px solid ${T.b3}`, borderRadius: 6, padding: '3px 7px', whiteSpace: 'nowrap' }}>
      <Icon name={icon.replace('ti-', '')} size={11} />{label}
    </span>
  )
}
function pad(n: number) { return String(n).padStart(2, '0') }
