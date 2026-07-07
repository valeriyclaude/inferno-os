import type { Role, Section } from './types'

export interface NavItem { key: Section; label: string; icon: string; badge?: number }

const ALL: Record<string, NavItem> = {
  mission: { key: 'mission', label: 'Mission Control', icon: 'gauge' },
  tasks: { key: 'tasks', label: 'Задачи', icon: 'checklist' },
  orders: { key: 'orders', label: 'Заказы', icon: 'shopping-cart' },
  people: { key: 'people', label: 'Люди', icon: 'users' },
  shifts: { key: 'shifts', label: 'Графики', icon: 'calendar' },
  projects: { key: 'projects', label: 'Проекты', icon: 'folders' },
  suggs: { key: 'suggs', label: 'Предложения', icon: 'bulb' },
  calendar: { key: 'calendar', label: 'Календарь', icon: 'calendar-event' },
  admin: { key: 'admin', label: 'Админка', icon: 'adjustments' },
}

export const NAVSETS: Record<Role, NavItem[]> = {
  owner: ['mission', 'tasks', 'orders', 'people', 'shifts', 'projects', 'suggs', 'calendar', 'admin'].map((k) => ALL[k]),
  admin: ['tasks', 'orders', 'people', 'shifts', 'projects', 'suggs', 'calendar'].map((k) => ALL[k]),
  staff: [
    { ...ALL.tasks, label: 'Мои задачи' }, ALL.orders, ALL.shifts, ALL.calendar, ALL.suggs,
  ],
}

export const SECTION_TITLE: Record<Section, string> = {
  mission: 'Mission Control', tasks: 'Задачи', orders: 'Заказы', people: 'Люди', person: 'Люди',
  shifts: 'Графики смен', projects: 'Проекты', suggs: 'Предложения', calendar: 'Календарь', admin: 'Админка',
}

export const ROLE_LABEL: Record<Role, string> = { owner: 'Руководитель', admin: 'Администратор', staff: 'Сотрудник' }
export const ROLE_SHORT: Record<Role, string> = { owner: 'Рук.', admin: 'Админ', staff: 'Сотр.' }
