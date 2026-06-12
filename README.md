# Director Portfolio

Персональный сайт-портфолио театрального режиссёра. Next.js (App Router) +
TypeScript + Tailwind CSS, i18n (RU основной, EN с fallback на RU),
Sanity.io как headless CMS.

## Запуск

```bash
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000).

До подключения Sanity сайт работает на **placeholder-контенте** (RU/EN) — ничего
настраивать не нужно, чтобы посмотреть вёрстку.

## Структура

```
src/
  app/[locale]/        # страницы (ru/en): /, /about, /works, /works/[slug],
                       # /playbill, /press, /contacts
  app/studio/          # встроенная Sanity Studio (/studio)
  components/          # Navigation, Lightbox, LazyImage, CursorPreview, useReveal
  i18n/                # next-intl: routing, request, navigation
  sanity/
    env.ts             # чтение переменных окружения
    schemaTypes/       # схемы: performance, playbillEntry, pressItem, bio, contacts
    structure.ts       # singleton-структура для Bio и Contacts
    lib/               # client, image, localize, queries, data (+ fallback)
design-system/MASTER.md  # бриф и зафиксированная цветовая система
messages/{ru,en}.json    # переводы UI
```

---

## Подключение Sanity — пошагово

### 1. Создать проект Sanity

1. Зарегистрируйтесь на [sanity.io](https://www.sanity.io/) (можно через GitHub/Google).
2. Откройте [sanity.io/manage](https://www.sanity.io/manage) → **Create new project**.
3. Назовите проект (напр. «Director Portfolio»), dataset оставьте **production**,
   видимость — **Public** (для публичного сайта).

### 2. Получить Project ID

- В [sanity.io/manage](https://www.sanity.io/manage) откройте проект.
- **Project ID** — на главной странице проекта (вкладка **Settings → API** или
  прямо в URL: `/manage/project/<PROJECT_ID>`). Это короткая строка вида `abc12xyz`.

### 3. Прописать переменные окружения

Откройте файл `.env.local` в корне проекта и заполните:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=<ваш Project ID>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
SANITY_API_READ_TOKEN=
```

> `NEXT_PUBLIC_SANITY_PROJECT_ID` — единственное, что обязательно. Как только он
> задан, фронтенд и Studio переключаются с placeholder-контента на реальные данные.

### 4. Токен (только если нужен)

Токен **не требуется** для чтения опубликованного контента из **public** dataset.

Токен нужен, только если вы хотите:
- читать **черновики** (preview), или
- сделать dataset **private**.

Как получить:
1. [sanity.io/manage](https://www.sanity.io/manage) → проект → **API → Tokens → Add API token**.
2. Имя — напр. «Frontend read», права — **Viewer** (только чтение).
3. Скопируйте токен **сразу** (показывается один раз) и вставьте в
   `SANITY_API_READ_TOKEN` в `.env.local`.

⚠️ Токен — секрет. Он используется только на сервере (без префикса `NEXT_PUBLIC_`),
в браузер не попадает. `.env.local` не коммитится (см. `.gitignore`).

### 5. Разрешить домен для Studio (CORS)

Чтобы встроенная Studio (`/studio`) могла обращаться к API:

1. [sanity.io/manage](https://www.sanity.io/manage) → проект → **API → CORS origins → Add CORS origin**.
2. Добавьте `http://localhost:3000` (✓ Allow credentials).
3. После деплоя добавьте боевой домен, напр. `https://your-site.vercel.app`.

### 6. Открыть Studio и наполнить контентом

1. Перезапустите dev-сервер: `npm run dev`.
2. Откройте [http://localhost:3000/studio](http://localhost:3000/studio), войдите тем же
   аккаунтом Sanity.
3. Заполните разделы:
   - **Биография** (singleton) — имя, фото, текст RU/EN, хронология, CV (PDF RU/EN);
   - **Контакты** (singleton) — email, соцсети;
   - **Спектакли** — для каждого: название RU/EN, slug, театр, год, жанр/теги,
     статус (текущий/архив), «На главной» (featured), описания, обложка, галерея,
     видео (YouTube/Vimeo);
   - **Афиша** — ссылка на спектакль + дата/время + площадка/город;
   - **Пресса/Награды** — тип, заголовок RU/EN, источник, дата, цитата, ссылка.

Главная страница показывает спектакли с галочкой **«На главной»** (до 3 шт.) и
ближайший показ из афиши.

### Модель данных RU/EN

Двуязычные поля хранятся как отдельные ключи `*_ru` / `*_en`. Если EN-поле пустое,
сайт показывает RU (fallback — см. `src/sanity/lib/localize.ts`).

---

## Деплой

См. Шаг 5 — деплой на Vercel через GitHub. Переменные окружения из `.env.local`
нужно будет добавить в настройках проекта Vercel (Project → Settings → Environment
Variables) и добавить боевой домен в CORS Sanity (шаг 5 выше).
