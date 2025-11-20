import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">💡 LifeHacks</h3>
            <p className="text-sm text-gray-400">
              Платформа для обмена полезными советами и лайфхаками. Делитесь опытом и учитесь у других!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-white transition">
                  Создать лайфхак
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-white transition">
                  Избранное
                </Link>
              </li>
              <li>
                <Link href="/top" className="hover:text-white transition">
                  Топ лайфхаков
                </Link>
              </li>
              <li>
                <Link href="/tags" className="hover:text-white transition">
                  Поиск по тегам
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Категории</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/?category=технологии" className="hover:text-white transition">
                  Технологии
                </Link>
              </li>
              <li>
                <Link href="/?category=кухня" className="hover:text-white transition">
                  Кухня
                </Link>
              </li>
              <li>
                <Link href="/?category=здоровье" className="hover:text-white transition">
                  Здоровье
                </Link>
              </li>
              <li>
                <Link href="/?category=финансы" className="hover:text-white transition">
                  Финансы
                </Link>
              </li>
              <li>
                <Link href="/?category=дом" className="hover:text-white transition">
                  Дом
                </Link>
              </li>
              <li>
                <Link href="/?category=автомобиль" className="hover:text-white transition">
                  Автомобиль
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  О проекте
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-white transition">
                  Правила
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Конфиденциальность
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/anthropics/claude-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-500">
          <p>
            © {currentYear} LifeHacks. Все права защищены. Создано с помощью{' '}
            <a
              href="https://www.anthropic.com/claude"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              Claude Code
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
