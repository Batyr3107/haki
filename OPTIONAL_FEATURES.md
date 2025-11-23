# Опциональные улучшения

Этот документ описывает опциональные функции, которые были добавлены в проект. Все эти функции **необязательны** и могут быть настроены по необходимости.

## 🚀 Быстрый старт

Все опциональные функции настраиваются через переменные окружения в файле `.env`. Если переменная не настроена, функция будет **автоматически отключена**.

## Средний приоритет

### ⚡ Rate Limiting (Upstash)

**Что это?** Ограничение частоты запросов к API для защиты от злоупотреблений.

**Статус:** ✅ Реализовано с graceful degradation

**Настройка:**

1. Зарегистрируйтесь на [Upstash](https://upstash.com/)
2. Создайте Redis database
3. Скопируйте `REST URL` и `REST TOKEN`
4. Добавьте в `.env`:

```env
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token-here"
```

**Как работает:**
- Ограничение: 10 запросов на 10 секунд на IP-адрес
- Применяется только к `/api/*` routes
- Если не настроено, все запросы разрешены
- Headers с информацией о лимитах добавляются автоматически

**Файлы:**
- `lib/ratelimit.ts` - Конфигурация rate limiting
- `middleware.ts` - Middleware для проверки лимитов

---

### 🖼️ Next.js Image для Avatars

**Что это?** Оптимизированные изображения с автоматической конвертацией в WebP/AVIF.

**Статус:** ✅ Реализовано

**Настройка:** Не требуется, работает из коробки!

**Как использовать:**

```tsx
import Avatar from '@/components/Avatar'

<Avatar
  name="Иван Иванов"
  alt="Avatar"
  size="xl"
  src="/path/to/image.jpg" // опционально
/>
```

**Размеры:**
- `sm` - 32px
- `md` - 48px (по умолчанию)
- `lg` - 64px
- `xl` - 96px

**Файлы:**
- `components/Avatar.tsx` - Компонент аватара
- `next.config.ts` - Конфигурация Next.js Image

---

### 🔄 Suspense Boundaries

**Что это?** React Suspense для улучшенной загрузки компонентов.

**Статус:** ✅ Реализовано

**Настройка:** Не требуется, работает из коробки!

**Что изменилось:**
- Глобальный `<Suspense>` wrapper в `app/layout.tsx`
- Автоматический fallback на компонент Loading
- Улучшенная производительность при навигации

**Файлы:**
- `app/layout.tsx` - Suspense wrapper
- `app/loading.tsx` - Loading fallback

---

## Низкий приоритет

### 📊 Analytics

**Что это?** Отслеживание посещаемости и поведения пользователей.

**Статус:** ✅ Реализовано (Google Analytics + Plausible)

#### Google Analytics

1. Создайте аккаунт на [Google Analytics](https://analytics.google.com/)
2. Получите Measurement ID (формат: G-XXXXXXXXXX)
3. Добавьте в `.env`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

#### Plausible Analytics (Privacy-focused альтернатива)

1. Зарегистрируйтесь на [Plausible](https://plausible.io/)
2. Добавьте ваш домен
3. Добавьте в `.env`:

```env
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="yourdomain.com"
```

**Можно использовать обе системы одновременно!**

**Файлы:**
- `components/Analytics.tsx` - Компоненты аналитики
- `app/layout.tsx` - Подключение аналитики

---

### 🐛 Error Tracking (Sentry)

**Что это?** Автоматическое отслеживание и отчеты об ошибках.

**Статус:** ✅ Реализовано

**Настройка:**

1. Зарегистрируйтесь на [Sentry](https://sentry.io/)
2. Создайте новый проект (Next.js)
3. Получите DSN
4. Добавьте в `.env`:

```env
SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
NEXT_PUBLIC_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
```

**Что отслеживается:**
- Client-side ошибки
- Server-side ошибки
- API route ошибки
- Необработанные исключения
- Session Replay (до 10% сессий)

**Файлы:**
- `sentry.client.config.ts` - Client-side конфигурация
- `sentry.server.config.ts` - Server-side конфигурация
- `sentry.edge.config.ts` - Edge runtime конфигурация
- `instrumentation.ts` - Инициализация Sentry
- `app/error.tsx` - Error boundary с Sentry
- `app/global-error.tsx` - Global error handler

---

### 📈 Monitoring (Datadog)

**Что это?** Мониторинг производительности и RUM (Real User Monitoring).

**Статус:** ✅ Реализовано

**Настройка:**

1. Зарегистрируйтесь на [Datadog](https://www.datadoghq.com/)
2. Создайте RUM Application
3. Получите Application ID и Client Token
4. Добавьте в `.env`:

```env
NEXT_PUBLIC_DATADOG_APPLICATION_ID="your-app-id"
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN="your-client-token"
NEXT_PUBLIC_DATADOG_SITE="datadoghq.com"
```

**Что отслеживается:**
- User interactions
- Resources (API calls, images, etc.)
- Long tasks
- Session replays (20% sample rate)
- Performance metrics

**Примечание:** Требуется установка `@datadog/browser-rum`:

```bash
npm install @datadog/browser-rum
```

**Файлы:**
- `lib/datadog.ts` - Конфигурация Datadog
- `components/DatadogRUM.tsx` - Инициализация RUM
- `app/layout.tsx` - Подключение Datadog

---

## 🔧 Установка зависимостей

Все необходимые пакеты уже установлены:

```bash
npm install
```

Установленные пакеты:
- `@upstash/ratelimit` - Rate limiting
- `@upstash/redis` - Redis client
- `@sentry/nextjs` - Error tracking
- `react-ga4` - Google Analytics

Опциональные (для Datadog):
```bash
npm install @datadog/browser-rum
```

---

## 📝 Проверка настройки

### Проверить что работает:

1. **Rate Limiting**: Сделайте 15+ запросов к API за 10 секунд - должна вернуться ошибка 429
2. **Analytics**: Проверьте консоль браузера на наличие gtag/plausible скриптов
3. **Sentry**: Вызовите ошибку и проверьте dashboard Sentry
4. **Datadog**: Проверьте RUM sessions в Datadog dashboard

### Консоль при старте:

Если функция не настроена, вы увидите:
```
Rate limiting not configured
Datadog RUM not configured - skipping initialization
```

Это **нормально** - функции просто отключены.

---

## 🎯 Рекомендации по приоритету

### Для Production (Обязательно):
1. ✅ **Sentry** - Критично для отслеживания ошибок
2. ✅ **Rate Limiting** - Защита от злоупотреблений

### Для Production (Рекомендуется):
3. ✅ **Analytics** - Понимание пользователей
4. ✅ **Suspense** - Уже включено, улучшает UX

### Опционально:
5. ⚪ **Datadog** - Если нужен детальный мониторинг
6. ⚪ **Next.js Image** - Используйте Avatar компонент

---

## 🚨 Важные заметки

1. **Никогда не коммитьте `.env`** - используйте только `.env.example`
2. **Проверяйте квоты** - некоторые сервисы имеют лимиты на бесплатном плане
3. **Тестируйте локально** - используйте тестовые credentials для разработки
4. **Мониторьте стоимость** - особенно для Datadog в production

---

## 💡 Поддержка

Все функции реализованы с **graceful degradation** - если что-то не настроено, приложение продолжит работать нормально.

Проблемы? Проверьте:
1. Правильность переменных окружения
2. Консоль браузера на ошибки
3. Логи сервера
4. Документацию соответствующего сервиса
