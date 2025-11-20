import Breadcrumbs from '@/components/Breadcrumbs'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'О проекте', href: '/about' }]} />

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">О проекте LifeHacks</h1>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mt-6 mb-4">Что такое LifeHacks?</h2>
          <p className="text-gray-700 mb-4">
            LifeHacks - это современная платформа для обмена полезными советами и лайфхаками.
            Мы создали место, где люди могут делиться своим опытом, находить решения повседневных
            задач и учиться друг у друга.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">Наша миссия</h2>
          <p className="text-gray-700 mb-4">
            Сделать полезные знания доступными для всех. Мы верим, что каждый человек обладает
            уникальным опытом, который может помочь другим упростить их жизнь.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">Возможности платформы</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
            <li>Создание и публикация собственных лайфхаков</li>
            <li>Оценка и комментирование чужих советов</li>
            <li>Подписки на интересных авторов</li>
            <li>Система тегов для быстрого поиска</li>
            <li>Избранное для сохранения полезных советов</li>
            <li>Поддержка Markdown для красивого оформления</li>
            <li>Социальный шеринг в популярные сети</li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-4">Технологии</h2>
          <p className="text-gray-700 mb-4">
            Платформа построена на современном стеке технологий: Next.js 15, React, TypeScript,
            Prisma ORM и Tailwind CSS. Это обеспечивает высокую производительность и отличный
            пользовательский опыт.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">Присоединяйтесь!</h2>
          <p className="text-gray-700 mb-4">
            Создавайте аккаунт, делитесь своими знаниями и помогайте сообществу расти!
          </p>
        </div>
      </div>
    </div>
  )
}
