// Инициализация Telegram Mini App (безопасна вне Telegram — просто ничего не делает).
interface TgWebApp {
  ready: () => void
  expand: () => void
  setHeaderColor?: (c: string) => void
  setBackgroundColor?: (c: string) => void
  initData?: string
}

export function tg(): TgWebApp | undefined {
  return (window as unknown as { Telegram?: { WebApp?: TgWebApp } }).Telegram?.WebApp
}

export function initTelegram() {
  const w = tg()
  if (!w) return
  try {
    w.ready()
    w.expand()
    w.setHeaderColor?.('#131210')
    w.setBackgroundColor?.('#131210')
  } catch {
    /* вне Telegram — игнор */
  }
}
