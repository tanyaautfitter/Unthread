# BrandPulse — тональність згадок бренду в Threads

Вебсайт: вводите назву бренду → система шукає публічні пости в Threads → AI розкладає згадки на три колонки:

| 🔴 Негативні | 🟢 Позитивні | ⚪ Нейтральні |
|---|---|---|
| X відгуків | X відгуків | X відгуків |

Під кожною цифрою видно самі пости з посиланнями, тож класифікацію можна перевірити.

**Стек:** Next.js 16 (фронт + бекенд в одному), TypeScript, офіційний Threads API, Claude API для аналізу тональності.

---

## 1. Швидкий старт (демо, без ключів)

```bash
npm install
npm run dev
```

Відкрийте http://localhost:3000. Без ключів сайт працює в **демо-режимі**: вигадані пости + словниковий аналіз. Цього досить, щоб побачити інтерфейс.

## 2. Підключення справжніх даних

```bash
cp .env.example .env.local
```

і заповніть `.env.local`.

### 2.1. Токен Threads

1. Зайдіть на https://developers.facebook.com → **My Apps → Create App** → тип використання **«Access the Threads API»**.
2. У налаштуваннях застосунку додайте дозволи **`threads_basic`** і **`threads_keyword_search`**.
3. **App Roles → Roles → Add People → Threads Tester** — додайте свій Threads-акаунт, потім прийміть запрошення в застосунку Threads (Налаштування → Акаунт → Вебсайти).
4. Отримайте токен через **Graph API Explorer** (виберіть `threads.net`) або через OAuth-флоу, потім обміняйте на довготривалий (60 днів):
   ```
   GET https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=<APP_SECRET>&access_token=<SHORT_TOKEN>
   ```
   Оновлення до закінчення терміну:
   ```
   GET https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=<LONG_TOKEN>
   ```
5. Вставте його в `THREADS_ACCESS_TOKEN`.

> ⚠️ **App Review.** Поки Meta не схвалила `threads_keyword_search`, пошук повертає лише пости власника токена. Щоб шукати по **всіх публічних постах**, подайте застосунок на App Review (опишіть сценарій «моніторинг згадок бренду», додайте скрінкаст роботи сайту). Зазвичай це займає кілька робочих днів.

> **Ліміти Threads:** до 2 200 пошукових запитів за 24 години на користувача (спільно для всіх застосунків). Один пошук на сайті ≈ 2–5 запитів до Threads. Кеш (`CACHE_TTL_SECONDS`) не дає витрачати ліміт на повторні пошуки того самого бренду.

### 2.2. Ключ Claude

Створіть ключ на https://console.anthropic.com → **API Keys** і вставте в `ANTHROPIC_API_KEY`. Модель за замовчуванням `claude-haiku-5-5` — швидка й дешева, розуміє українську, сленг і сарказм. Змінюється через `ANTHROPIC_MODEL`.

Модель оцінює тональність **саме щодо бренду**, а не загальний настрій поста, і відкидає збіги не в тому значенні (наприклад, «apple» як фрукт).

### 2.3. Перевірка

```bash
npm run dev
curl http://localhost:3000/api/health
# {"ok":true,"version":"1.0.0","threads":true,"claude":true}
```

## 3. Реліз / деплой

### Варіант А — Vercel (найпростіше)

1. Залийте проєкт у GitHub-репозиторій.
2. https://vercel.com/new → імпортуйте репозиторій (фреймворк визначиться сам).
3. **Settings → Environment Variables** — додайте змінні з `.env.example`.
4. **Deploy**. Сайт буде доступний на `https://<назва>.vercel.app`, далі можна підключити свій домен.

Або з CLI:
```bash
npm i -g vercel
vercel --prod
```

### Варіант Б — Docker (будь-який VPS)

```bash
docker build -t brandpulse:1.0.0 .
docker run -d -p 3000:3000 --env-file .env.local --name brandpulse brandpulse:1.0.0
```

Перед ним поставте Nginx/Caddy з HTTPS.

### Варіант В — Node напряму

```bash
npm ci && npm run build
node .next/standalone/server.js   # скопіюйте .next/static у .next/standalone/.next/static
```

## 4. Футер і юридичні сторінки

- `/privacy` — Політика конфіденційності, `/cookies` — Політика файлів cookie. Посилання на них є у футері кожної сторінки.
- **Перед публікацією** вкажіть власника й email у `lib/site.ts` або змінних `NEXT_PUBLIC_OPERATOR`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_OPERATOR_CITY`.
- Для App Review у Meta: **Privacy Policy URL** = `https://<домен>/privacy`, **Data Deletion Instructions URL** = `https://<домен>/privacy#deletion`.
- Якщо додасте аналітику (Google Analytics тощо), оновіть `/cookies` і додайте банер згоди.
- Тексти не є юридичною консультацією — перед запуском варто показати юристу.

## 5. API

`GET /api/analyze?q=<бренд>`

```json
{
  "brand": "Monobank",
  "totalFetched": 100,
  "irrelevant": 3,
  "counts": { "positive": 41, "negative": 22, "neutral": 34 },
  "posts": { "positive": [ { "id": "...", "text": "...", "username": "...", "permalink": "...", "timestamp": "...", "sentiment": "positive" } ], "negative": [], "neutral": [] },
  "source": "threads",
  "classifier": "claude",
  "cached": false,
  "notes": ["Проаналізовано 100 найновіших публічних постів (запитів до Threads: 4)."]
}
```

`GET /api/health` → стан і які ключі підключені.

## 6. Структура

```
app/
  page.tsx               — сторінка: пошук + 3 колонки
  globals.css            — стилі (світла/темна тема)
  api/analyze/route.ts   — бекенд: Threads → класифікація → JSON
  api/health/route.ts    — health-check
  privacy/page.tsx       — Політика конфіденційності
  cookies/page.tsx       — Політика файлів cookie
  components/Footer.tsx  — футер
lib/
  site.ts                — дані власника для футера й політик
  threads.ts             — клієнт Threads keyword_search з пагінацією
  sentiment.ts           — Claude-класифікатор + резервний словниковий
  cache.ts               — кеш з TTL і rate-limit на IP
  demo.ts                — демо-пости
```

## 7. Обмеження, які варто знати

- **Це вибірка, а не вся історія.** API віддає найновіші або топові пости, тому цифри варто читати як «з останніх N згадок».
- Пошук іде за точною назвою. Варіанти написання («Нова Пошта» / «Nova Poshta») — це окремі запити.
- Кеш і rate-limit зберігаються в пам'яті процесу. Для кількох інстансів замініть `lib/cache.ts` на Redis / Vercel KV.
- Токен Threads живе 60 днів — поставте нагадування на оновлення або автоматизуйте `refresh_access_token`.

## 8. Ідеї для v1.1

- Пошук кількох варіантів назви одночасно.
- Графік тональності по днях.
- Збереження історії пошуків у базу й щоденний моніторинг з алертами про сплеск негативу.
- Експорт у CSV.
