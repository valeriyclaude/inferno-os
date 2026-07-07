// Дизайн-токены Inferno OS — тёмная ember-эстетика (из хендофа §Design Tokens).
export const T = {
  // фон / поверхности
  bg: '#131210',
  sidebar: '#100f0d',
  card: '#1a1815',
  input: '#1b1916',
  raisedTop: '#1d1b17',
  raisedBot: '#181613',
  inset: '#17150f',
  inset2: '#17120d',
  // бордеры
  bCard: '#26231d',
  b2: '#221f1a',
  bRaised: '#2c2922',
  bDiv: '#1e1c17',
  b3: '#24211b',
  // текст
  text: '#ece8e1',
  text2: '#ded8cd',
  text3: '#b5aea2',
  text4: '#a29c92',
  muted: '#8f897d',
  faint: '#6e695f',
  faint2: '#5c574e',
  faint3: '#4a463e',
  // акцент ember
  ember: '#d9945a',
  emberHover: '#e0a068',
  emberLight: '#e6c187',
  gold: '#c9a56a',
  ember2: '#cf7440',
  ember3: '#e0954e',
  // семантика
  green: '#8fb673',
  red: '#d67d5f',
  amber: '#c9a56a',
} as const

// Цвета типов работ (акцент по цеху/типу)
export const TYPE_COLORS: Record<string, string> = {
  'Бар': '#d9945a', 'Кухня': '#c97a4a', 'Закупка': '#8fb673', 'Посуда': '#b3a68d',
  'Электрика': '#d4b46a', 'Маркетинг': '#cf8a8a', 'Интерьер': '#a89e8d', 'Ремонт': '#c9a56a',
  'Административная': '#9aa58f', 'Другое': '#8f897d',
}
export const typeColor = (t: string) => TYPE_COLORS[t] ?? T.muted
export const typeChipBg = (t: string) => (TYPE_COLORS[t] ?? T.muted) + '1f'

// Статусы задач (метка + fg/bg)
export const STATUS: Record<string, { label: string; fg: string; bg: string }> = {
  new: { label: 'Новая', fg: '#8fb673', bg: '#1b2412' },
  in_progress: { label: 'В работе', fg: '#d9945a', bg: '#281f12' },
  returned: { label: 'Возвращена', fg: '#c9a56a', bg: '#262011' },
  not_done: { label: 'Не сделано', fg: '#d67d5f', bg: '#2b1810' },
  blocked: { label: 'Ждёт закупку', fg: '#b3a68d', bg: '#241f16' },
  done: { label: 'Сделано', fg: '#8f897d', bg: '#201d18' },
}

export const SERIF = "'Spectral', Georgia, serif"
export const loadColor = (load: number) => (load >= 80 ? T.red : load >= 55 ? T.ember : T.green)
