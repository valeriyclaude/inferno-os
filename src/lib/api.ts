import { tg } from './telegram'

// Адрес туннеля берём из api.txt командного репо (GitHub Pages отдаёт его с CORS:*).
const POINTER = 'https://valeriyclaude.github.io/inferno-mini-app/api.txt'
let BASE = ''
const clean = (u: string) => u.replace(/\/+$/, '')

export const initData = () => tg()?.initData || ''
export const isLive = () => !!initData()

export async function resolveApi(): Promise<string> {
  try {
    const r = await fetch(POINTER + '?t=' + Date.now(), { cache: 'no-store' })
    if (r.ok) {
      const u = clean((await r.text()).trim())
      if (/^https:\/\//.test(u)) { BASE = u; localStorage.setItem('inferno_api', u); return u }
    }
  } catch { /* оффлайн — падаем на localStorage */ }
  BASE = clean(localStorage.getItem('inferno_api') || '')
  return BASE
}

async function call(method: string, path: string, body?: unknown): Promise<any> {
  if (!BASE) await resolveApi()
  const c = new AbortController(); const id = setTimeout(() => c.abort(), 12000)
  try {
    const r = await fetch(BASE + path, {
      method, signal: c.signal,
      headers: { 'X-Init-Data': initData(), 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!r.ok) { const e = new Error('HTTP ' + r.status) as Error & { status?: number }; e.status = r.status; throw e }
    return r.json()
  } finally { clearTimeout(id) }
}

export const apiGet = (path: string) => call('GET', path)
export const apiPost = (path: string, body?: unknown) => call('POST', path, body)
