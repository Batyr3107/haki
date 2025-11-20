import Breadcrumbs from '@/components/Breadcrumbs'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Конфиденциальность', href: '/privacy' }]} />

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Политика конфиденциальности</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Какие данные мы собираем</h2>
            <p className="text-gray-700 mb-2">
              При регистрации мы собираем следующую информацию:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Имя пользователя (username)</li>
              <li>Электронная почта</li>
              <li>Имя (опционально)</li>
              <li>Биография (опционально)</li>
              <li>Аватар (опционально)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Как мы используем данные</h2>
            <p className="text-gray-700 mb-2">Ваши данные используются для:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Создания и управления вашим аккаунтом</li>
              <li>Отображения вашего профиля другим пользователям</li>
              <li>Связи с вами по важным вопросам</li>
              <li>Улучшения работы платформы</li>
              <li>Предотвращения мошенничества и злоупотреблений</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Безопасность данных</h2>
            <p className="text-gray-700">
              Мы используем современные методы шифрования и защиты данных:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Пароли хешируются с помощью bcrypt</li>
              <li>Безопасная передача данных по HTTPS</li>
              <li>Защита от SQL-инъекций и XSS атак</li>
              <li>Регулярное обновление систем безопасности</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Cookies и отслеживание</h2>
            <p className="text-gray-700">
              Мы используем cookies для поддержания сессий пользователей и улучшения опыта
              использования платформы. Эти файлы не содержат личной информации и используются
              только для технических целей.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Публичная информация</h2>
            <p className="text-gray-700">
              Следующая информация видна всем пользователям:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Имя пользователя и имя</li>
              <li>Аватар и биография</li>
              <li>Ваши лайфхаки, комментарии и оценки</li>
              <li>Количество подписчиков и подписок</li>
              <li>Статистика активности</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Ваши права</h2>
            <p className="text-gray-700 mb-2">Вы имеете право:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Просматривать свои данные</li>
              <li>Редактировать информацию профиля</li>
              <li>Удалить свой аккаунт в любое время</li>
              <li>Запросить копию своих данных</li>
              <li>Отозвать согласие на обработку данных</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Передача данных третьим лицам</h2>
            <p className="text-gray-700">
              Мы не продаем и не передаем ваши личные данные третьим лицам без вашего согласия,
              за исключением случаев, предусмотренных законом.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Изменения в политике</h2>
            <p className="text-gray-700">
              Мы можем обновлять эту политику конфиденциальности. О существенных изменениях
              мы уведомим вас по электронной почте или через уведомления на сайте.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Контакты</h2>
            <p className="text-gray-700">
              По вопросам конфиденциальности обращайтесь по адресу: privacy@lifehacks.com
            </p>
          </section>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
