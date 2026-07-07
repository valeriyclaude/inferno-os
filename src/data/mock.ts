import type { Member, Task, Vit, Sugg, CalEvent, Decision, FeedEvent } from '../types'

export const TYPES = [
  'Бар', 'Кухня', 'Закупка', 'Посуда', 'Электрика',
  'Маркетинг', 'Интерьер', 'Ремонт', 'Административная', 'Другое',
]

export const DIRS = [
  'Бар', 'Кухня', 'Зал', 'Интерьер', 'Летняя площадка', 'Электрика',
  'Стройка', 'Маркетинг', 'Лояльность', 'CRM', 'IT', 'Документация',
]

export const TYPE2DIR: Record<string, string> = {
  'Бар': 'Бар', 'Кухня': 'Кухня', 'Посуда': 'Кухня', 'Электрика': 'Электрика',
  'Маркетинг': 'Маркетинг', 'Интерьер': 'Интерьер', 'Ремонт': 'Стройка',
  'Административная': 'Документация', 'Закупка': '', 'Другое': '',
}

export const UNITS = ['шт', 'кг', 'г', 'л', 'мл', 'бут', 'упак', 'ящик']

export const M: Member[] = [
  { id: 1, name: 'Кирилл В.', sysRole: 'owner', job: 'Соучредитель', dept: 'Управление',
    mono: 'КВ', avaBg: '#2c1e11', avaFg: '#e0954e', tel: '+380 67 000-00-01', tg: '@valeriy10',
    load: 42, ach: ['Открыл заведение'], ai: 'Держит стратегию. Разгрузить от операционки — делегировать закупки Марку.' },
  { id: 2, name: 'Марк С.', sysRole: 'admin', job: 'Управляющий', dept: 'Управление',
    mono: 'МС', avaBg: '#1e2620', avaFg: '#9aa58f', tel: '+380 67 000-00-02', tg: '@mark_s',
    load: 63, ach: ['Наставник месяца'], ai: 'Сильный в организации смен. Можно доверить распределение заказов.' },
  { id: 3, name: 'Данил Р.', sysRole: 'staff', job: 'Бармен', dept: 'Бар',
    mono: 'ДР', avaBg: '#2b1d10', avaFg: '#d9945a', tel: '+380 67 000-00-03', tg: '@danil',
    load: 78, ach: ['Лучший коктейль сезона'], ai: 'Загружен на 78% — не давать новые срочные до пятницы.' },
  { id: 4, name: 'Яна К.', sysRole: 'staff', job: 'Кальянный мастер', dept: 'Бар',
    mono: 'ЯК', avaBg: '#26202c', avaFg: '#b79ad4', tel: '+380 67 000-00-04', tg: '@yana',
    load: 51, ach: ['5 задач за неделю'], ai: 'Стабильно закрывает витамины вовремя. Хороша в медиа-задачах.' },
  { id: 5, name: 'Илья П.', sysRole: 'staff', job: 'Повар', dept: 'Кухня',
    mono: 'ИП', avaBg: '#2a2113', avaFg: '#d4b46a', tel: '+380 67 000-00-05', tg: '@ilya',
    load: 34, ach: [], ai: 'Свободен — хороший кандидат на закупку по кухне.' },
  { id: 6, name: 'Соня М.', sysRole: 'staff', job: 'Официант', dept: 'Зал',
    mono: 'СМ', avaBg: '#241c1c', avaFg: '#cf8a8a', tel: '+380 67 000-00-06', tg: '@sonya',
    load: 88, ach: [], ai: '3 задачи просрочены. Перегружена — снять часть на Илью.' },
]
export const ME_ID = 1

export const tasks: Task[] = [
  { id: 101, title: 'Помыть колбы и шахты перед открытием', type: 'Бар', dir: 'Бар', a: 3, st: 'new', pr: 'urgent', dl: iso(0, 18), recId: 9 },
  { id: 102, title: 'Заказать уголь — заканчивается', type: 'Закупка', dir: 'Бар', a: 0, st: 'new', dl: iso(0, 20),
    order: [{ name: 'Уголь кокосовый', qty: 2, unit: 'упак', link: 'https://ex.com/coal' }, { name: 'Фольга', qty: 3, unit: 'шт' }] },
  { id: 103, title: 'Протереть витрину и барную стойку', type: 'Бар', dir: 'Бар', a: 4, st: 'returned', dl: null },
  { id: 104, title: 'Снять сторис вечера для инсты', type: 'Маркетинг', dir: 'Маркетинг', a: 4, st: 'in_progress', dl: iso(1, 22) },
  { id: 105, title: 'Заготовки для кухни на вечер', type: 'Кухня', dir: 'Кухня', a: 5, st: 'new', dl: iso(0, 16),
    check: ['Нарезать лимоны', 'Замариновать курицу', 'Проверить соусы'], done: 1 },
  { id: 106, title: 'Разобраться с розеткой у входа', type: 'Электрика', dir: 'Электрика', a: 2, st: 'blocked', dl: iso(-1, 12) },
  { id: 107, title: 'Обновить меню на планшетах', type: 'Административная', dir: 'Документация', a: 6, st: 'not_done', dl: iso(-1, 20) },
  { id: 108, title: 'Полить цветы на летней площадке', type: 'Интерьер', dir: 'Летняя площадка', a: 6, st: 'new', dl: iso(1, 14) },
]

export const vits: Vit[] = [
  { id: 9, title: 'Помыть колбы и шахты', type: 'Бар', dir: 'Бар', a: 3, freq: 'daily', time: '18:00' },
  { id: 10, title: 'Проверить остатки бара', type: 'Бар', dir: 'Бар', a: 3, freq: 'every2', time: '20:00' },
  { id: 11, title: 'Генеральная кухни', type: 'Кухня', dir: 'Кухня', a: 5, freq: 'weekly', dow: 1, time: '11:00' },
  { id: 12, title: 'Выложить пост в соцсети', type: 'Маркетинг', dir: 'Маркетинг', a: 4, freq: 'custom', cmode: 'days', dows: [1, 3, 5], time: '19:00', paused: true },
]

export const suggs: Sugg[] = [
  { id: 1, dir: 'Бар', text: 'Ввести облепиховый чай в осеннее меню — гости часто спрашивают тёплое', author: 'Данил Р.', dt: '12 окт', st: 'new' },
  { id: 2, dir: 'Маркетинг', text: 'Снимать короткие рилс с процессом забивки кальяна', author: 'Яна К.', dt: '11 окт', st: 'new' },
  { id: 3, dir: 'Интерьер', text: 'Поменять свечи на настенные бра — уютнее и безопаснее', author: 'Соня М.', dt: '10 окт', st: 'later' },
  { id: 4, dir: 'Кухня', text: 'Добавить сырную тарелку к вину', author: 'Илья П.', dt: '9 окт', st: 'project' },
]

export const shifts: Record<string, number[]> = {
  [dstr(0)]: [3, 5], [dstr(1)]: [4, 6], [dstr(2)]: [3, 5], [dstr(4)]: [4, 5], [dstr(5)]: [3, 6], [dstr(6)]: [4, 5],
}

export const events: CalEvent[] = [
  { ds: dstr(2), label: 'Поставка бара', type: 'Поставка', c: '#8fb673' },
  { ds: dstr(6), label: 'Аванс', type: 'Финансы', c: '#c9a56a' },
  { ds: dstr(13), label: 'Финал ЧМ-2026', type: 'Спорт', c: '#d9945a' },
  { ds: dstr(20), label: 'День рождения Данила', type: 'Люди', c: '#cf8a8a' },
]

export const decisions: Decision[] = [
  {
    id: 1, tag: 'ПРЕДЛОЖЕНИЕ · БАР', tagColor: '#d9945a',
    sources: [{ icon: 'ti-microphone', label: 'PLAUD · планёрка' }],
    title: 'Ввести облепиховый чай в осеннее меню',
    sub: 'Данил, из планёрки 12 окт · 3 упоминания за неделю',
    reasons: ['Гости 3 раза за неделю спрашивали тёплые напитки', 'Себестоимость низкая, маржа высокая', 'Сезонность — октябрь-декабрь'],
    rec: { name: 'Данил Р.', mono: 'ДР', avaBg: '#2b1d10', avaFg: '#d9945a', meta: 'Бармен · автор идеи · знает рецептуру', note: 'Свободен после 18:00 сегодня' },
    primaryLabel: 'В задачу', secondaryLabel: 'В проект', open: true,
  },
  {
    id: 2, tag: 'ЗАКУПКА', tagColor: '#8fb673',
    sources: [{ icon: 'ti-brand-telegram', label: 'Бот заявок' }],
    title: 'Заканчивается уголь — осталось на 1 вечер',
    sub: 'Заявка от Данила · 20 мин назад',
    reasons: ['По остаткам хватит на сегодня', 'Поставщик привозит на след. день', 'Пятница — высокая нагрузка'],
    primaryLabel: 'Оформить закупку', secondaryLabel: 'Изменить', open: true,
  },
]

export const feed: FeedEvent[] = [
  { id: 1, group: 'Сейчас', time: '14:20', tick: '#8fb673', title: 'Илья закрыл смену — касса сошлась, чек-лист 6/7', done: true,
    sources: [{ icon: 'ti-checklist', label: 'Смена' }] },
  { id: 2, group: 'Сейчас', time: '14:02', tick: '#d67d5f', title: 'У Сони 3 задачи просрочены — стоит перераспределить',
    reasons: ['Загрузка 88%', 'Илья свободен (34%)'], actions: [{ label: 'Посмотреть', kind: 'ghost' }, { label: 'Перераспределить', kind: 'primary' }] },
  { id: 3, group: 'Утро', time: '13:02', tick: '#d9945a', title: 'Смена открыта — Данил, +2 мин к плану' },
  { id: 4, group: 'Утро', time: '11:30', tick: '#8fb673', title: 'Витамин «Помыть колбы» выполнен вовремя', done: true },
  { id: 5, group: 'Вчера', time: '23:40', tick: '#8fb673', title: 'Яна завершила 5 задач за смену', done: true },
  { id: 6, group: 'Вчера', time: '21:10', tick: '#c9a56a', title: 'Новое предложение по интерьеру от Сони',
    sources: [{ icon: 'ti-bulb', label: 'Предложения' }], actions: [{ label: 'Открыть', kind: 'ghost' }] },
]

// ---- дата-хелперы для демо ----
function d(offset: number) { const x = new Date(); x.setDate(x.getDate() + offset); return x }
function dstr(offset: number) { const x = d(offset); return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}` }
function iso(offset: number, hour: number) { const x = d(offset); x.setHours(hour, 0, 0, 0); return x.toISOString() }
function p(n: number) { return String(n).padStart(2, '0') }
