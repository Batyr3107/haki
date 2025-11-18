# 💡 LifeHacks - Платформа для обмена лайфхаками

Современная веб-платформа для обмена полезными советами и лайфхаками между парнями. Делитесь своими идеями, оценивайте лучшие лайфхаки и общайтесь с единомышленниками!

## 🚀 Особенности

- ✅ Регистрация и аутентификация пользователей
- 📝 Создание и публикация лайфхаков
- ⭐ Система оценок (1-5 звезд)
- 💬 Комментарии к лайфхакам
- 🏷️ Категории (технологии, кухня, здоровье, финансы, дом, автомобиль)
- 👤 Профили пользователей со статистикой
- 📊 Рейтинг лучших лайфхаков и авторов
- 📱 Адаптивный дизайн для мобильных устройств

## 🛠 Технологии

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite с Prisma ORM
- **Authentication**: NextAuth.js
- **Date formatting**: date-fns

## 📦 Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd haki
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте переменные окружения:
Файл `.env` уже создан со следующими переменными:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

**ВАЖНО**: Измените `NEXTAUTH_SECRET` на случайную строку в продакшене!

4. Инициализируйте базу данных:
```bash
# Если есть проблемы с Prisma, используйте:
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate

# Создайте базу данных:
npx prisma db push
```

5. (Опционально) Заполните базу тестовыми данными:
```bash
npx prisma studio
```

## 🚀 Запуск

### Режим разработки:
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Продакшн сборка:
```bash
npm run build
npm start
```

## 📁 Структура проекта

```
haki/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # Аутентификация
│   │   ├── lifehacks/       # CRUD лайфхаков
│   │   ├── ratings/         # Оценки
│   │   ├── comments/        # Комментарии
│   │   └── users/           # Профили пользователей
│   ├── create/              # Страница создания лайфхака
│   ├── lifehack/[id]/       # Страница просмотра лайфхака
│   ├── login/               # Страница входа
│   ├── register/            # Страница регистрации
│   ├── profile/[username]/  # Профиль пользователя
│   ├── layout.tsx           # Главный layout
│   └── page.tsx             # Главная страница
├── components/              # React компоненты
│   ├── Providers.tsx        # NextAuth провайдер
│   ├── Navbar.tsx           # Навигационная панель
│   ├── LifehackCard.tsx     # Карточка лайфхака
│   └── RatingStars.tsx      # Компонент звезд рейтинга
├── lib/                     # Утилиты
│   ├── prisma.ts           # Prisma клиент
│   └── auth.ts             # NextAuth конфигурация
├── prisma/                 # Database schema
│   └── schema.prisma       # Prisma schema
└── types/                  # TypeScript типы
    └── next-auth.d.ts      # Расширенные типы NextAuth
```

## 🎯 Использование

### Для новых пользователей:

1. **Регистрация**: Перейдите на страницу регистрации и создайте аккаунт
2. **Вход**: Войдите используя свой email и пароль
3. **Просмотр**: Просматривайте лайфхаки на главной странице
4. **Фильтрация**: Используйте фильтры по категориям
5. **Создание**: Нажмите "Создать лайфхак" чтобы поделиться своими идеями
6. **Оценка**: Оценивайте лайфхаки от 1 до 5 звезд
7. **Комментарии**: Оставляйте комментарии и обсуждайте лайфхаки
8. **Профиль**: Просматривайте свой профиль и статистику

### API Endpoints:

- `POST /api/auth/register` - Регистрация нового пользователя
- `POST /api/auth/[...nextauth]` - Аутентификация
- `GET /api/lifehacks` - Получить все лайфхаки (с фильтрацией)
- `POST /api/lifehacks` - Создать новый лайфхак
- `GET /api/lifehacks/[id]` - Получить конкретный лайфхак
- `POST /api/ratings` - Оценить лайфхак
- `POST /api/comments` - Добавить комментарий
- `GET /api/users/[username]` - Получить профиль пользователя

## 🔐 Безопасность

- Пароли хэшируются с помощью bcrypt
- JWT токены для сессий
- Защита API endpoints с NextAuth
- Валидация данных на сервере
- XSS защита через React

## 🎨 Категории лайфхаков

- 🖥️ Технологии
- 🍳 Кухня
- 💪 Здоровье
- 💰 Финансы
- 🏠 Дом
- 🚗 Автомобиль
- 🔧 Другое

## 📝 Модели данных

### User (Пользователь)
- username, email, password
- name, bio, avatar
- Связи: lifehacks, ratings, comments

### Lifehack (Лайфхак)
- title, description, content
- category
- Связи: author, ratings, comments

### Rating (Оценка)
- value (1-5)
- Связи: user, lifehack

### Comment (Комментарий)
- content
- Связи: user, lifehack

## 🐛 Troubleshooting

### Проблемы с Prisma:
Если возникают проблемы с загрузкой Prisma engines:
```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

### Сброс базы данных:
```bash
rm -rf prisma/dev.db
npx prisma db push
```

### Проблемы с портом:
Если порт 3000 занят, измените порт:
```bash
PORT=3001 npm run dev
```

## 🚀 Деплой

### Vercel (рекомендуется):
1. Подключите репозиторий к Vercel
2. Настройте переменные окружения
3. Деплой произойдет автоматически

### Другие платформы:
Приложение совместимо с любыми платформами поддерживающими Next.js

## 📄 Лицензия

MIT

## 👨‍💻 Автор

Создано с помощью Claude Code

---

Наслаждайтесь обменом лайфхаками! 💡
