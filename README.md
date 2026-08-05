# uka.co.ua — сайт Української Кальянної Асоціації

## Стек

Чистий фронтенд, без фреймворків і без збірки:

- **HTML** — 8 сторінок (`index`, `about`, `partners`, `members`, `become-member`, `donate`, `brands`, `contact`), верстка вручну, без шаблонізатора
- **CSS** — один файл `assets/css/style.css`, на CSS-змінних (кольори, шрифт, контейнер)
- **JS** — один файл `assets/js/main.js` (vanilla, без бібліотек): мобільне меню, акордеон, маска телефону, пошук у таблиці брендів, відправка форми контактів
- Шрифт **Montserrat** підключений з Google Fonts (CDN)

## Backend (тільки для форми контактів)

- `src/worker.js` — Cloudflare Worker: приймає `POST /api/contact`, формує лист і надсилає через Cloudflare Email Routing (`env.SEND_EMAIL.send()`), решту запитів віддає статикою (`env.ASSETS.fetch()`)
- Якщо API з якоїсь причини недоступне — форма на клієнті автоматично падає назад на `mailto:` (спрацьовує, наприклад, при локальному перегляді без Worker'а)
- Пошта отримувача: `uka.org.ua@gmail.com` (verified destination address в Cloudflare Email Routing)

## Хостинг і деплой

- **Cloudflare Workers (Static Assets)** — сайт роздається як Worker з прив'язаною статикою, конфіг у `wrangler.toml`
- **Домен:** `uka.co.ua`, DNS/NS на Cloudflare, кореневий запис — Worker route
- **Репозиторій:** [github.com/xeeua/uka.co.ua_site](https://github.com/xeeua/uka.co.ua_site), гілка `main`
- **Автодеплой:** репозиторій підключено до проєкту через Cloudflare "Connect to Git" — кожен `git push` у `main` тригерить білд (`npx wrangler deploy`) на боці Cloudflare, окремо нічого встановлювати не треба
- Службові файли (`wrangler.toml`, `src/`, `.git/`, `README.md`) виключені з публічної роздачі через `.assetsignore`

## Структура

```
uka-site/
├── index.html, about.html, partners.html, members.html,
│   become-member.html, donate.html, brands.html, contact.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js, brands-data.js
│   └── img/
│       ├── favicon.svg
│       ├── partners/   — логотипи партнерів (22 шт.)
│       └── members/    — логотипи виробників і закладів-учасників (52 шт.)
├── src/worker.js        — Cloudflare Worker (API форми контактів)
├── wrangler.toml         — конфіг Worker'а, домену, email-біндингу
└── .assetsignore         — файли, які не публікуються як статика
```

## Локальний перегляд

Будь-який статичний сервер, наприклад:

```bash
python3 -m http.server 4174
```

API `/api/contact` локально не працює (це вже логіка Worker'а на Cloudflare) — форма в такому разі просто відкриє `mailto:`.
