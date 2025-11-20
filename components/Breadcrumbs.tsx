'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Если items переданы явно, используем их
  if (items && items.length > 0) {
    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <Link href="/" className="hover:text-blue-600 transition">
          Главная
        </Link>
        {items.map((item, index) => (
          <Fragment key={index}>
            <span className="text-gray-400">/</span>
            {index === items.length - 1 ? (
              <span className="text-gray-900 font-medium">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-blue-600 transition">
                {item.label}
              </Link>
            )}
          </Fragment>
        ))}
      </nav>
    )
  }

  // Автоматическое построение breadcrumbs из URL
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  const breadcrumbItems: BreadcrumbItem[] = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label = decodeURIComponent(segment)
      .replace(/-/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase())

    return { label, href }
  })

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Link href="/" className="hover:text-blue-600 transition">
        Главная
      </Link>
      {breadcrumbItems.map((item, index) => (
        <Fragment key={index}>
          <span className="text-gray-400">/</span>
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-blue-600 transition">
              {item.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
