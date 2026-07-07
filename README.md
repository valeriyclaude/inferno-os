# Inferno OS

Операционная система ресторана «Inferno» — React + TypeScript + Vite. Работает как **сайт для команды**
и как **Telegram Mini App** (публичный https + TG WebApp SDK).

- **Живой сайт:** https://valeriyclaude.github.io/inferno-os/
- **Дизайн-референс:** хендоф Inferno OS v2 (десктоп) + мобильный прототип.

## Разработка
```
npm install
npm run dev        # http://127.0.0.1:5199/ (host 0.0.0.0 — доступно и по LAN)
npm run build      # typecheck + сборка в dist/
./deploy.sh        # сборка + деплой на GitHub Pages (ветка gh-pages)
```

## Статус
- ✅ Дизайн-система (токены ember, Spectral, Tabler), оболочка (сайдбар по ролям owner/admin/staff, хедер).
- ✅ **Mission Control** — главный экран (решения, лента компании, живая симуляция, «Сегодня»/«Команда»).
- ⏳ Разделы Задачи / Заказы / Люди / Графики / Проекты / Предложения / Календарь / Админка — заглушки.

## Структура
`src/theme` токены · `src/data/mock.ts` демо-данные · `src/types.ts` сущности ·
`src/components` оболочка · `src/screens` экраны · `src/lib/telegram.ts` инициализация Mini App.
