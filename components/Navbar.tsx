'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold">
            💡 LifeHacks
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-blue-200 transition">
              Все лайфхаки
            </Link>
            <Link href="/top" className="hover:text-blue-200 transition">
              🏆 Топ
            </Link>

            {session ? (
              <>
                <Link href="/create" className="hover:text-blue-200 transition">
                  Создать лайфхак
                </Link>
                <Link href="/favorites" className="hover:text-blue-200 transition">
                  ⭐ Избранное
                </Link>
                <Link href={`/profile/${session.user.username}`} className="hover:text-blue-200 transition">
                  Мой профиль
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-semibold"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-blue-200 transition"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-semibold"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
