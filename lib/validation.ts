// Form validation utilities

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email обязателен'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Некорректный email адрес'
  return null
}

export const validateUsername = (username: string): string | null => {
  if (!username) return 'Имя пользователя обязательно'
  if (username.length < 3) return 'Имя пользователя должно быть не менее 3 символов'
  if (username.length > 20) return 'Имя пользователя должно быть не более 20 символов'
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Имя пользователя может содержать только буквы, цифры и подчеркивание'
  }
  return null
}

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Пароль обязателен'
  if (password.length < 6) return 'Пароль должен быть не менее 6 символов'
  if (password.length > 50) return 'Пароль должен быть не более 50 символов'
  return null
}

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || !value.trim()) return `${fieldName} обязательно`
  return null
}

export const validateLength = (
  value: string,
  min: number,
  max: number,
  fieldName: string
): string | null => {
  if (value.length < min) return `${fieldName} должно быть не менее ${min} символов`
  if (value.length > max) return `${fieldName} должно быть не более ${max} символов`
  return null
}
