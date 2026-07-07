export type Role = 'owner' | 'admin' | 'staff'

export type Section =
  | 'mission' | 'tasks' | 'orders' | 'people' | 'person'
  | 'shifts' | 'projects' | 'suggs' | 'calendar' | 'admin'

export type Status = 'new' | 'in_progress' | 'returned' | 'not_done' | 'blocked' | 'done'

export interface OrderItem { name: string; qty: number; unit: string; link?: string }

export interface Task {
  id: number
  title: string
  type: string
  dir: string
  a: number            // assignee id, 0 = не назначен
  st: Status
  pr?: 'urgent' | 'normal'
  dl?: string | null   // ISO дедлайн
  check?: string[]
  done?: number
  order?: OrderItem[]
  recId?: number       // если экземпляр витамина
  aname?: string       // имя исполнителя из живого API (когда id не из моков)
}

export interface Vit {
  id: number
  title: string
  type: string
  dir: string
  a: number
  freq: 'daily' | 'every2' | 'weekly' | 'custom'
  time: string
  paused?: boolean
  dow?: number
  cmode?: 'days' | 'interval'
  dows?: number[]
  every?: number
}

export interface Sugg {
  id: number
  dir: string
  text: string
  author: string
  dt: string
  st: 'new' | 'later' | 'converted' | 'project' | 'rejected'
}

export interface Member {
  id: number
  name: string
  sysRole: Role
  job: string
  dept: string
  mono: string
  avaBg: string
  avaFg: string
  tel: string
  tg: string
  load: number
  ach: string[]
  ai?: string
}

export interface CalEvent { ds: string; label: string; type: string; c: string }

export interface DecisionSource { icon: string; label: string }
export interface DecisionRec { name: string; mono: string; avaBg: string; avaFg: string; meta: string; note: string }
export interface Decision {
  id: number
  tag: string
  tagColor: string
  sources: DecisionSource[]
  title: string
  sub: string
  reasons: string[]
  rec?: DecisionRec
  primaryLabel: string
  secondaryLabel: string
  open?: boolean
  confirmedText?: string
}

export interface FeedAction { label: string; kind: 'primary' | 'ghost' }
export interface FeedEvent {
  id: number
  group: string        // Сейчас / Утро / Вчера
  time: string
  tick: string         // цвет точки
  title: string
  done?: boolean
  reasons?: string[]
  sources?: DecisionSource[]
  actions?: FeedAction[]
  fresh?: boolean      // подсветка нового
}
