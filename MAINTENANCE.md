# Поддержка сайта — runbook

Краткая инструкция по эксплуатации сайта Варвары Поповой.

## Где что находится

| Что | Где |
|---|---|
| Код | GitHub: `slavvvawwwa-gif/popova` (ветка `main`) |
| Хостинг фронтенда | Vercel (проект `popova`) → деплоится автоматически при `git push` в `main` |
| Контент (CMS) | Sanity, project ID `utjxd808`, dataset `production` (публичный) |
| Админка | `https://<домен>/studio` (встроена в сайт) |
| Локально | `~/Desktop/portfolio` |

## Как менять контент
1. Открыть `https://<домен>/studio`, войти аккаунтом Sanity.
2. Разделы: **Главная**, **Биография** (+ галерея, 3 блока с диапазонами дат),
   **Контакты**, **Спектакли / Проекты / Лаборатории**, **Пресса/Награды**.
3. Сохранить (Publish). Изменения появятся на сайте автоматически:
   - мгновенно, если настроен webhook ревалидации;
   - иначе — в течение ~1 минуты.
4. **Выпуски проекта/лаборатории:** создать сущность → «Раздел: Проект/Лаборатория»
   → указать «Родительский проект». Появится списком внутри родителя.
5. **Доп. блоки** (проекты/лаборатории): кнопки «+ Текстовый блок / + Галерея».
6. **Удаление:** меню «⋮» у документа → «Удалить со всем содержимым» (каскадно).
7. **Избранное на главной:** галочка «На главной» у любой сущности.
8. **Качество фото:** загружайте оригиналы высокого разрешения; кадрирование
   обложки задаётся точкой фокуса (hotspot).

## Как вносить изменения в код
```bash
cd ~/Desktop/portfolio
npm install          # один раз / после обновлений
npm run dev          # локальная разработка → http://localhost:3000
npm run build        # проверка сборки перед пушем
git add -A && git commit -m "..." && git push   # → Vercel задеплоит сам
```
Перед пушем всегда прогоняйте `npm run build` — если зелёный, деплой не упадёт.

## Переменные окружения (Vercel → Settings → Environment Variables)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` = `utjxd808`
- `NEXT_PUBLIC_SANITY_DATASET` = `production`
- `NEXT_PUBLIC_SANITY_API_VERSION` = `2024-10-01`
- `NEXT_PUBLIC_SITE_URL` = боевой домен (для SEO/sitemap/canonical)
- `SANITY_REVALIDATE_SECRET` = секрет вебхука (тот же в Sanity → API → Webhooks)
- `SANITY_API_READ_TOKEN` = пусто (датасет публичный)

После изменения переменных — **Redeploy** (особенно для `NEXT_PUBLIC_*`).

## Обновление контента без редеплоя (ревалидация)
Вебхук Sanity → `https://<домен>/api/revalidate` (POST, секрет
`SANITY_REVALIDATE_SECRET`, projection `{ "_type": _type }`). Правка в Studio →
сайт обновляется. Без вебхука — фоллбэк ~60с.

## Безопасность (раз в 1–2 месяца)
- `npm audit fix` (без `--force`).
- `npm outdated` → точечно обновлять Next/Sanity.
- Ротация секрета вебхука при подозрении: сгенерировать
  `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`,
  обновить в Sanity Webhook и в Vercel env, Redeploy.
- 2FA на GitHub и Vercel. Write-токены Sanity на фронтенд не класть.
- Security-заголовки уже настроены в `next.config.ts`.

## SEO
- `robots.txt` и `sitemap.xml` генерируются автоматически.
- Подтверждение: Google Search Console + Яндекс.Вебмастер (мета-теги и файл уже
  на месте). Добавить sitemap: `https://<домен>/sitemap.xml`.
- **Важно:** на бесплатном `*.vercel.app` Vercel может включать авто-защиту
  (challenge), которая блокирует ботов поисковиков. Решение — подключить
  **собственный домен** (Vercel → Settings → Domains) и прописать его в
  `NEXT_PUBLIC_SITE_URL`. На своём домене проблемы нет, и это лучше для SEO.

## Деплой Studio как отдельной ссылки (опционально)
```bash
cd ~/Desktop/portfolio
npx sanity login
npx sanity deploy     # хостинг админки на *.sanity.studio
```
Перезапускать после изменения схем.

## Бэкап контента (рекомендуется периодически)
```bash
cd ~/Desktop/portfolio
npx sanity dataset export production backup.tar.gz
```

## Типичные проблемы
- **Контент не виден в Studio / «Unknown field»** → старый кэш схемы:
  дождаться редеплоя Vercel и хард-рефреш `/studio` (Cmd+Shift+R).
- **Изменения не появляются на сайте** → проверить webhook/CORS в Sanity manage;
  без вебхука подождать ~минуту.
- **Деплой упал на Vercel** → открыть лог сборки; локально `npm run build`
  покажет ту же ошибку.
- **Картинки «маленькие/мутные»** → загрузить оригиналы высокого разрешения.
- **403 / «Security Checkpoint»** → авто-защита Vercel на `*.vercel.app`;
  снимается сама или решается подключением своего домена.

## Контакты сервисов
- Vercel: vercel.com · Sanity: sanity.io/manage (project `utjxd808`)
- GitHub: github.com/slavvvawwwa-gif/popova
