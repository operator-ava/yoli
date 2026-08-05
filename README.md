# live-guide

PWA — живой гид-сопровождающий по маршрутам. Ведёт пользователя от точки к точке (POI),
ставится на домашний экран, работает офлайн. Целевые устройства: iPad и iPhone.

## Стек

Vite + Vue 3 + TypeScript, vue-router (history mode), pinia, vite-plugin-pwa.

## Команды

```bash
npm install
npm run dev              # локальная разработка
npm run build            # сборка в dist/
npm run preview          # предпросмотр сборки (здесь работает service worker)
npm run generate:icons   # перегенерировать иконки-заглушки
```

## Структура

```
src/data         весь контент и типы предметной области (в компонентах контента нет)
src/components   переиспользуемые компоненты
src/views        экраны вкладок
src/stores       pinia-хранилища
src/composables  переиспользуемая логика
src/styles       глобальные стили
scripts          вспомогательные скрипты (генерация иконок)
```

## Доступ к контенту

У `Poi` и у блоков контента есть поле `access: 'free' | 'paid'`. Механика оплаты
не реализована — признак заложен в модель данных заранее. Проверка живёт
в `src/composables/useAccess.ts` и сейчас считает всё платное закрытым.

## Иконки

Иконки в `public/` — временные заглушки, сгенерированы `scripts/generate-icons.mjs`.
`apple-touch-icon.png` намеренно без альфа-канала: iOS не поддерживает прозрачный фон иконки.
