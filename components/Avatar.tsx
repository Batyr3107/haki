'use client'

import { useState, memo } from 'react'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  alt: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-lg',
  lg: 'w-16 h-16 text-2xl',
  xl: 'w-24 h-24 text-4xl',
}

function Avatar({ src, alt, name, size = 'md', className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  const sizeClass = sizeClasses[size]
  const initial = name?.[0]?.toUpperCase() || '?'

  // Show fallback if no src, or if image failed to load
  if (!src || imageError) {
    return (
      <div
        className={`${sizeClass} bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold ${className}`}
      >
        {initial}
      </div>
    )
  }

  return (
    <div className={`${sizeClass} rounded-full overflow-hidden relative bg-gray-200 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={size === 'xl' ? '96px' : size === 'lg' ? '64px' : size === 'md' ? '48px' : '32px'}
        priority={false}
        onError={() => setImageError(true)}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
      />
    </div>
  )
}

export default memo(Avatar)
