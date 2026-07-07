import { useState } from 'react'
import { T } from '../theme/tokens'
import { Icon, Avatar } from '../components/Icon'
import { tasks as MOCK, UNITS, M } from '../data/mock'
import { assignee } from '../lib/format'
import { useApp } from '../state/app'

const ORDER_DIRS = ['Бар', 'Кухня', 'Зал', 'Летняя площадка']
interface CatItem { name: string; dir: string; unit: string; link?: string }
const CATALOG: CatItem[] = [
  { name: 'Уголь кокосовый', dir: 'Бар', unit: 'упак', link: 'https://ex.com/coal' },
  { name: 'Фольга', dir: 'Бар', unit: 'шт' }, { name: 'Табак', dir: 'Бар', unit: 'упак' },
  { name: 'Лёд', dir: 'Бар', unit: 'кг' }, { name: 'Лимоны', dir: 'Бар', unit: 'кг' },
  { name: 'Курица', dir: 'Кухня', unit: 'кг' }, { name: 'Соусы', dir: 'Кухня', unit: 'шт' },
  { name: 'Сыр', dir: 'Кухня', unit: 'кг' }, { name: 'Масло', dir: 'Кухня', unit: 'л' },
  { name: 'Свечи', dir: 'Зал', unit: 'упак' }, { name: 'Салфетки', dir: 'Зал', unit: 'упак' },
  { name: 'Уголь для мангала', dir: 'Летняя площадка', unit: 'кг' }, { name: 'Пледы', dir: 'Летняя площадка', unit: 'шт' },
]
interface CartItem { name: string; unit: string; qty: number; link?: string }

export function Orders({ mobile }: { mobile: boolean }) {
  const { showToast } = useApp()
  const [dir, setDir] = useState('Бар')
  const [cart, setCart] = useState<CartItem[]>([])
  const [who, setWho] = useState(0)
  const [nm, setNm] = useState(''); const [unit, setUnit] = useState('шт')

  const add = (c: CatItem) => setCart((cs) => {
    const i = cs.findIndex((x) => x.name === c.name)
    if (i >= 0) return cs.map((x, j) => (j === i ? { ...x, qty: x.qty + 1 } : x))
    return [...cs, { name: c.name, unit: c.unit, qty: 1, link: c.link }]
  })
  const step = (name: string, d: number) => setCart((cs) => cs.flatMap((x) => x.name === name ? (x.qty + d <= 0 ? [] : [{ ...x, qty: x.qty + d }]) : [x]))
  const addNew = () => { if (!nm.trim()) return; add({ name: nm.trim(), dir, unit }); setNm('') }
  const submit = () => { if (!cart.length) return; showToast(`Заказ оформлен · ${cart.length} поз.`); setCart([]); setWho(0) }

  const cat = CATALOG.filter((c) => c.dir === dir)
  const chip = (on: boolean) => ({ fontSize: 12.5, padding: '7px 13px', borderRadius: 16, whiteSpace: 'nowrap' as const, border: `1px solid ${on ? '#4a3a26' : T.bCard}`, background: on ? '#241c12' : T.card, color: on ? T.emberLight : T.text4 })
  const openOrders = MOCK.filter((t) => t.order && t.st !== 'done')

  return (
    <div style={{ maxWidth: 760, paddingTop: 18 }}>
      <div style={{ background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 14, padding: '14px 16px', marginBottom: 18 }}>
        <div style={{ fontSize: 10.5, letterSpacing: '.8px', textTransform: 'uppercase', color: T.ember, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 11 }}><Icon name="shopping-cart" size={14} />Новый заказ</div>

        <Lbl>Цех</Lbl>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
          {ORDER_DIRS.map((d) => <button key={d} onClick={() => setDir(d)} style={chip(dir === d)}>{d}</button>)}
        </div>

        <Lbl>Позиции · {dir}</Lbl>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 12 }}>
          {cat.map((c) => (
            <button key={c.name} onClick={() => add(c)} style={{ ...chip(false), display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon name="plus" size={12} color={T.ember} />{c.name} · {c.unit}{c.link && <Icon name="paperclip" size={11} color={T.faint} />}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 7, marginBottom: 16, flexWrap: 'wrap' }}>
          <input value={nm} onChange={(e) => setNm(e.target.value)} placeholder="＋ новая позиция" style={{ ...inputSt, flex: 1, minWidth: 120 }} />
          <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ ...inputSt, width: 90 }}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select>
          <button onClick={addNew} style={{ ...chip(false), padding: '9px 14px' }}>Добавить</button>
        </div>

        {cart.length > 0 && <>
          <Lbl>Корзина</Lbl>
          <div style={{ marginBottom: 14 }}>
            {cart.map((x) => (
              <div key={x.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${T.b2}` }}>
                <span style={{ flex: 1, fontSize: 13.5, color: T.text2 }}>{x.name}{x.link && <Icon name="paperclip" size={12} color={T.faint} style={{ marginLeft: 6 }} />}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.input, border: `1px solid ${T.bRaised}`, borderRadius: 9, padding: '4px 8px' }}>
                  <button onClick={() => step(x.name, -1)} style={stepBtn}>−</button>
                  <span style={{ fontSize: 13, minWidth: 44, textAlign: 'center' }}>{x.qty} {x.unit}</span>
                  <button onClick={() => step(x.name, +1)} style={stepBtn}>+</button>
                </div>
              </div>
            ))}
          </div>
          <Lbl>Кому поручить</Lbl>
          <select value={who} onChange={(e) => setWho(+e.target.value)} style={{ ...inputSt, marginBottom: 14 }}>
            <option value={0}>На усмотрение рук.</option>
            {M.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <button onClick={submit} style={{ width: '100%', background: T.ember, color: T.inset2, border: 'none', borderRadius: 11, padding: '12px 0', fontSize: 14, fontWeight: 600 }}>Оформить заказ</button>
        </>}
      </div>

      <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.muted, fontWeight: 600, margin: '0 2px 11px' }}>Открытые заказы</div>
      {openOrders.map((t) => {
        const a = assignee(t.a)
        return (
          <div key={t.id} style={{ background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 14, padding: '13px 16px', marginBottom: 9 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: T.muted }}><Icon name="folder" size={13} color={T.faint} />{t.dir}</span>
              <span style={{ flex: 1 }} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Avatar mono={a.mono} bg={a.avaBg} fg={a.avaFg} size={20} font={8.5} /><span style={{ fontSize: 12, color: t.a ? '#9e9585' : T.ember }}>{a.name}</span></span>
            </div>
            {t.order!.map((o, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: T.text3, padding: '3px 0' }}>
                <Icon name="point-filled" size={9} color={T.faint} />{o.name} — {o.qty} {o.unit}{o.link && <Icon name="paperclip" size={11} color={T.faint} />}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

const inputSt: React.CSSProperties = { background: T.input, border: `1px solid ${T.bRaised}`, borderRadius: 10, color: T.text, padding: '9px 12px', fontSize: 13.5, outline: 'none' }
const stepBtn: React.CSSProperties = { background: 'none', border: 'none', color: T.emberLight, fontSize: 17, width: 20, lineHeight: 1 }
function Lbl({ children }: { children: React.ReactNode }) { return <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: T.muted, marginBottom: 8 }}>{children}</div> }
