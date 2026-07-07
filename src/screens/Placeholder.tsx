import { T, SERIF } from '../theme/tokens'
import { Icon } from '../components/Icon'
import type { Section } from '../types'

const INFO: Partial<Record<Section, { icon: string; title: string; desc: string; points: string[] }>> = {
  tasks: { icon: 'checklist', title: 'Задачи', desc: 'Поиск, фильтры по типам и статусу, витамины, создание задач.',
    points: ['Карточки задач с чек-боксом «Готово» и Undo', 'Фильтры: Активные / Требуют внимания / Сделанные / 🔁 Витамины', 'Drawer создания: тип → детали → повторение'] },
  orders: { icon: 'shopping-cart', title: 'Заказы', desc: 'Закупки по цехам: композер заявки + открытые заказы.',
    points: ['Каталог позиций цеха с единицами', 'Корзина со степпером количества', 'Оформить → задача типа «Закупка»'] },
  people: { icon: 'users', title: 'Люди', desc: 'Сетка сотрудников с загрузкой; карточка с AI-заметкой.',
    points: ['Загрузка-бар и число активных задач', 'Контакты, статистика, смены, достижения', '«Все задачи →» фильтрует раздел Задачи'] },
  shifts: { icon: 'calendar', title: 'Графики смен', desc: 'Месячный календарь + режим кисти.',
    points: ['Выбрал сотрудника → клик по дню ставит смену', 'Копировать прошлую неделю', 'Авто-напоминания за день и за 3 часа'] },
  projects: { icon: 'folders', title: 'Проекты', desc: 'Цеха как точки развития с роадмапом.',
    points: ['Цель и прогресс этапов', 'Роадмап-таймлайн (✓ / ● / ○)', 'Идеи из «Предложений» → в задачу'] },
  suggs: { icon: 'bulb', title: 'Предложения', desc: 'Конвейер идей сотрудников (не задачи).',
    points: ['Фильтры по цеху', 'Действия: В задачу / В проект / Потом / Отклонить', 'У сотрудника — форма подачи'] },
  calendar: { icon: 'calendar-event', title: 'Календарь компании', desc: 'Все события + AI-инсайт.',
    points: ['Корпоративы, ДР, зарплата, поставки, спорт', '«Ближайшее» в правой колонке', 'AI: «через 13 дней финал ЧМ → закупка напитков»'] },
  admin: { icon: 'adjustments', title: 'Админка', desc: 'Управление задачами и витаминами (owner).',
    points: ['Сменить статус / переназначить / удалить (Undo)', 'Распределение неназначенных заказов', 'Пауза/запуск и удаление витаминов'] },
}

export function Placeholder({ section }: { section: Section }) {
  const info = INFO[section] ?? { icon: 'circle', title: 'Раздел', desc: '', points: [] }
  return (
    <div style={{ maxWidth: 620, paddingTop: 40, animation: 'mcFade .2s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: `linear-gradient(${T.raisedTop},${T.raisedBot})`, border: `1px solid ${T.bRaised}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={info.icon} size={22} color={T.ember} />
        </div>
        <div>
          <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600 }}>{info.title}</div>
          <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{info.desc}</div>
        </div>
      </div>
      <div style={{ background: T.card, border: `1px solid ${T.bCard}`, borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ fontSize: 10.5, letterSpacing: '1.3px', textTransform: 'uppercase', color: T.muted, fontWeight: 700, marginBottom: 11 }}>
          Что будет в разделе
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {info.points.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: T.text3, lineHeight: 1.45 }}>
              <Icon name="point-filled" size={11} color={T.ember} style={{ marginTop: 4, flex: '0 0 auto' }} />{p}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 15, paddingTop: 13, borderTop: `1px solid ${T.b2}`, fontSize: 12, color: T.faint, display: 'flex', alignItems: 'center', gap: 7 }}>
          <Icon name="tool" size={13} />Экран проектируется — Mission Control уже готов как главный.
        </div>
      </div>
    </div>
  )
}
