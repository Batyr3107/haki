import Breadcrumbs from '@/components/Breadcrumbs'

export default function RulesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Правила', href: '/rules' }]} />

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Правила сообщества</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Будьте уважительны</h2>
            <p className="text-gray-700">
              Относитесь к другим участникам с уважением. Запрещены оскорбления, травля,
              дискриминация по любым признакам.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Публикуйте полезный контент</h2>
            <p className="text-gray-700">
              Лайфхаки должны быть практичными и полезными. Избегайте спама, рекламы и
              бессмысленных публикаций.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Соблюдайте авторские права</h2>
            <p className="text-gray-700">
              Не публикуйте чужой контент без разрешения. Указывайте источники, если используете
              информацию из других мест.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Используйте правильные категории</h2>
            <p className="text-gray-700">
              Выбирайте подходящую категорию для своих лайфхаков. Добавляйте релевантные теги
              для удобства поиска.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Безопасность прежде всего</h2>
            <p className="text-gray-700">
              Не публикуйте советы, которые могут быть опасны для здоровья или имущества.
              Предупреждайте о возможных рисках.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Качественное оформление</h2>
            <p className="text-gray-700">
              Используйте markdown для структурирования текста. Проверяйте орфографию и пунктуацию.
              Добавляйте описательные заголовки.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Конструктивная критика</h2>
            <p className="text-gray-700">
              В комментариях приветствуется конструктивная критика и дополнения. Объясняйте свою
              точку зрения аргументированно.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Последствия нарушений</h2>
            <p className="text-gray-700">
              За нарушение правил возможны предупреждения, временная блокировка или полное
              удаление аккаунта в зависимости от серьезности нарушения.
            </p>
          </section>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-semibold">
              Помните: мы все здесь, чтобы учиться и помогать друг другу. Давайте создадим
              дружелюбное и полезное сообщество! 💡
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
