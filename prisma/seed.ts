import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const user1 = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      email: 'alex@example.com',
      username: 'alex',
      password: hashedPassword,
      name: 'Александр',
      bio: 'Любитель технологий и полезных советов',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'dmitry@example.com' },
    update: {},
    create: {
      email: 'dmitry@example.com',
      username: 'dmitry',
      password: hashedPassword,
      name: 'Дмитрий',
      bio: 'Кулинар-любитель и мастер на все руки',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'ivan@example.com' },
    update: {},
    create: {
      email: 'ivan@example.com',
      username: 'ivan',
      password: hashedPassword,
      name: 'Иван',
      bio: 'Автолюбитель и DIY энтузиаст',
    },
  })

  console.log('Users created:', { user1, user2, user3 })

  // Create test lifehacks
  const lifehack1 = await prisma.lifehack.create({
    data: {
      title: 'Быстрая очистка клавиатуры',
      description: 'Простой способ очистить клавиатуру от пыли и крошек за 2 минуты',
      content: `## Используйте Post-it стикер для очистки клавиатуры

### Что понадобится:
- Обычный **Post-it** стикер
- 2 минуты времени

### Инструкция:

1. Возьмите обычный Post-it стикер
2. Проведите клейкой стороной между клавишами
3. Пыль и мелкие частицы прилипнут к стикеру
4. Повторите для всей клавиатуры

> **Совет:** Это быстрее и эффективнее баллончика со сжатым воздухом!

*Периодичность:* рекомендуется делать 1-2 раза в месяц.`,
      category: 'технологии',
      authorId: user1.id,
    },
  })

  const lifehack2 = await prisma.lifehack.create({
    data: {
      title: 'Идеальная яичница каждый раз',
      description: 'Секрет приготовления яичницы как в ресторане',
      content: `Профессиональный метод приготовления яичницы:

1. Разогрейте сковороду на среднем огне
2. Добавьте немного масла
3. Разбейте яйца в отдельную миску (чтобы проверить свежесть)
4. Вылейте на сковороду
5. Сразу убавьте огонь до минимума
6. Накройте крышкой на 2-3 минуты

Получится идеальная яичница с жидким желтком и не пересушенным белком!`,
      category: 'кухня',
      authorId: user2.id,
    },
  })

  const lifehack3 = await prisma.lifehack.create({
    data: {
      title: 'Снять статическое электричество с одежды',
      description: 'Убираем статику за секунды без специальных средств',
      content: `Простой способ избавиться от статического электричества:

1. Возьмите металлическую вешалку
2. Проведите ею по внутренней стороне одежды
3. Металл снимет статический заряд

Альтернатива: протрите одежду влажными руками или используйте английскую булавку, прикрепленную к внутренней стороне.`,
      category: 'дом',
      authorId: user1.id,
    },
  })

  const lifehack4 = await prisma.lifehack.create({
    data: {
      title: 'Запотевшие фары? Зубная паста спасет!',
      description: 'Восстановление прозрачности фар автомобиля за 10 минут',
      content: `Как очистить запотевшие фары:

1. Помойте фары водой
2. Нанесите обычную зубную пасту (не гелевую)
3. Круговыми движениями растирайте мягкой тряпкой
4. Продолжайте 5-7 минут
5. Смойте водой
6. Протрите насухо

Результат как после полировки! Зубная паста содержит мягкий абразив, который убирает налет.`,
      category: 'автомобиль',
      authorId: user3.id,
    },
  })

  const lifehack5 = await prisma.lifehack.create({
    data: {
      title: 'Экономия на кофе: термос вместо кофейни',
      description: 'Как сэкономить 30000 рублей в год на кофе',
      content: `## Простая математика экономии

### Сравнение расходов:

**Кофе в кофейне:**
- 200₽ × 5 дней × 4 недели = **4000₽/месяц**

**Кофе дома в термосе:**
- 30₽ × 5 дней × 4 недели = **600₽/месяц**

### Результат:
- Экономия: \`3400₽ в месяц\` или \`40800₽ в год!\`
- Инвестиция: хороший термос ~2000₽
- Окупаемость: **меньше месяца**

> Купите хороший термос и варите кофе дома. Качество будет не хуже, вкус даже лучше (вы же знаете, что любите), а экономия существенная!

### Дополнительные плюсы:
- Контроль качества кофе
- Экономия времени (не нужно стоять в очереди)
- Экологичность (меньше одноразовых стаканчиков)`,
      category: 'финансы',
      authorId: user2.id,
    },
  })

  const lifehack6 = await prisma.lifehack.create({
    data: {
      title: 'Контрастный душ для бодрости',
      description: 'Энергия на весь день без кофеина',
      content: `Техника контрастного душа:

1. Начните с теплой воды (2 минуты)
2. Переключите на холодную (30 секунд)
3. Снова теплая (1 минута)
4. Холодная (30 секунд)
5. Повторите 3-4 раза
6. Закончите холодной водой

Эффект: бодрость, укрепление иммунитета, улучшение кровообращения. Первые дни будет сложно, но потом войдет в привычку!`,
      category: 'здоровье',
      authorId: user1.id,
    },
  })

  console.log('Lifehacks created')

  // Create ratings
  await prisma.rating.create({
    data: { value: 5, userId: user2.id, lifehackId: lifehack1.id },
  })
  await prisma.rating.create({
    data: { value: 5, userId: user3.id, lifehackId: lifehack1.id },
  })
  await prisma.rating.create({
    data: { value: 4, userId: user1.id, lifehackId: lifehack2.id },
  })
  await prisma.rating.create({
    data: { value: 5, userId: user3.id, lifehackId: lifehack2.id },
  })
  await prisma.rating.create({
    data: { value: 4, userId: user2.id, lifehackId: lifehack3.id },
  })
  await prisma.rating.create({
    data: { value: 5, userId: user1.id, lifehackId: lifehack4.id },
  })
  await prisma.rating.create({
    data: { value: 5, userId: user2.id, lifehackId: lifehack4.id },
  })
  await prisma.rating.create({
    data: { value: 3, userId: user3.id, lifehackId: lifehack5.id },
  })
  await prisma.rating.create({
    data: { value: 4, userId: user2.id, lifehackId: lifehack6.id },
  })

  console.log('Ratings created')

  // Create comments
  await prisma.comment.create({
    data: {
      content: 'Отличный совет! Попробовал - реально работает!',
      userId: user2.id,
      lifehackId: lifehack1.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: 'Спасибо, теперь всегда так делаю яичницу 👍',
      userId: user1.id,
      lifehackId: lifehack2.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: 'Попробовал на фарах - эффект потрясающий! Не ожидал такого результата от зубной пасты',
      userId: user2.id,
      lifehackId: lifehack4.id,
    },
  })

  console.log('Comments created')

  // Create favorites
  await prisma.favorite.create({
    data: { userId: user1.id, lifehackId: lifehack2.id },
  })
  await prisma.favorite.create({
    data: { userId: user1.id, lifehackId: lifehack4.id },
  })
  await prisma.favorite.create({
    data: { userId: user2.id, lifehackId: lifehack1.id },
  })
  await prisma.favorite.create({
    data: { userId: user2.id, lifehackId: lifehack4.id },
  })
  await prisma.favorite.create({
    data: { userId: user2.id, lifehackId: lifehack6.id },
  })
  await prisma.favorite.create({
    data: { userId: user3.id, lifehackId: lifehack1.id },
  })
  await prisma.favorite.create({
    data: { userId: user3.id, lifehackId: lifehack2.id },
  })

  console.log('Favorites created')

  // Create tags
  const tag1 = await prisma.tag.create({
    data: { name: 'технологии', slug: 'tehnologii' },
  })
  const tag2 = await prisma.tag.create({
    data: { name: 'лайфхак', slug: 'laifhak' },
  })
  const tag3 = await prisma.tag.create({
    data: { name: 'кухня', slug: 'kuhnya' },
  })
  const tag4 = await prisma.tag.create({
    data: { name: 'автомобиль', slug: 'avtomobil' },
  })
  const tag5 = await prisma.tag.create({
    data: { name: 'экономия', slug: 'ekonomiya' },
  })
  const tag6 = await prisma.tag.create({
    data: { name: 'здоровье', slug: 'zdorove' },
  })
  const tag7 = await prisma.tag.create({
    data: { name: 'DIY', slug: 'diy' },
  })
  const tag8 = await prisma.tag.create({
    data: { name: 'быстро', slug: 'bystro' },
  })

  console.log('Tags created')

  // Link tags to lifehacks
  await prisma.lifehackTag.create({
    data: { lifehackId: lifehack1.id, tagId: tag1.id },
  })
  await prisma.lifehackTag.create({
    data: { lifehackId: lifehack1.id, tagId: tag2.id },
  })
  await prisma.lifehackTag.create({
    data: { lifehackId: lifehack1.id, tagId: tag8.id },
  })

  await prisma.lifehackTag.create({
    data: { lifehackId: lifehack2.id, tagId: tag3.id },
  })
  await prisma.lifehackTag.create({
    data: { lifehackId: lifehack2.id, tagId: tag2.id },
  })

  await prisma.lifehackTag.create({
    data: { lifehackId: lifehack3.id, tagId: tag7.id },
  })
  await prisma.lifehackTag.create({
    data: { lifehackId: lifehack3.id, tagId: tag2.id },
  })

  await prisma.lifehackTag.create({
    data: { lifehackId: lifehack4.id, tagId: tag4.id },
  })
  await prisma.lifehackTag.create({
    data: { lifehackId: lifehack4.id, tagId: tag7.id },
  })
  await prisma.lifehackTag.create({
    data: { lifehackId: lifehack4.id, tagId: tag8.id },
  })

  await prisma.lifehackTag.create({
    data: { lifehackId: lifehack5.id, tagId: tag5.id },
  })
  await prisma.lifehackTag.create({
    data: { lifehackId: lifehack5.id, tagId: tag2.id },
  })

  await prisma.lifehackTag.create({
    data: { lifehackId: lifehack6.id, tagId: tag6.id },
  })
  await prisma.lifehackTag.create({
    data: { lifehackId: lifehack6.id, tagId: tag2.id },
  })

  console.log('Lifehack tags linked')

  // Create follow relationships
  await prisma.follow.create({
    data: { followerId: user1.id, followingId: user2.id },
  })
  await prisma.follow.create({
    data: { followerId: user1.id, followingId: user3.id },
  })
  await prisma.follow.create({
    data: { followerId: user2.id, followingId: user1.id },
  })
  await prisma.follow.create({
    data: { followerId: user2.id, followingId: user3.id },
  })
  await prisma.follow.create({
    data: { followerId: user3.id, followingId: user1.id },
  })

  console.log('Follow relationships created')
  console.log('Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
