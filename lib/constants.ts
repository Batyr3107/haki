// Time constants (in milliseconds)
export const TIMEOUTS = {
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  SESSION_MAX_AGE: 7 * 24 * 60 * 60, // 7 days in seconds
} as const

// Validation limits
export const LIMITS = {
  // Tags
  MAX_TAGS: 5,
  TAG_MIN_LENGTH: 2,
  TAG_MAX_LENGTH: 30,

  // Lifehack
  TITLE_MIN_LENGTH: 5,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 500,
  CONTENT_MIN_LENGTH: 20,

  // User
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  PASSWORD_MIN_LENGTH: 6,
  BIO_MAX_LENGTH: 500,

  // Pagination
  ITEMS_PER_PAGE: 12,
  MAX_ITEMS_PER_PAGE: 50,
} as const

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
} as const

// Error messages
export const ERROR_MESSAGES = {
  // Auth
  UNAUTHORIZED: 'Необходима авторизация',
  FORBIDDEN: 'Нет прав доступа',
  INVALID_CREDENTIALS: 'Неверный email или пароль',

  // Validation
  MISSING_FIELDS: 'Все обязательные поля должны быть заполнены',
  INVALID_EMAIL: 'Неверный формат email',
  PASSWORD_TOO_SHORT: `Пароль должен содержать минимум ${LIMITS.PASSWORD_MIN_LENGTH} символов`,
  USERNAME_TOO_SHORT: `Имя пользователя должно содержать минимум ${LIMITS.USERNAME_MIN_LENGTH} символа`,
  TITLE_INVALID: `Заголовок должен содержать от ${LIMITS.TITLE_MIN_LENGTH} до ${LIMITS.TITLE_MAX_LENGTH} символов`,
  DESCRIPTION_INVALID: `Описание должно содержать от ${LIMITS.DESCRIPTION_MIN_LENGTH} до ${LIMITS.DESCRIPTION_MAX_LENGTH} символов`,
  CONTENT_TOO_SHORT: `Содержание должно содержать минимум ${LIMITS.CONTENT_MIN_LENGTH} символов`,
  TOO_MANY_TAGS: `Максимум ${LIMITS.MAX_TAGS} тегов разрешено`,

  // Existence
  NOT_FOUND: 'Не найдено',
  USER_EXISTS: 'Пользователь с таким email уже существует',
  USERNAME_TAKEN: 'Это имя пользователя уже занято',
  LIFEHACK_NOT_FOUND: 'Лайфхак не найден',
  USER_NOT_FOUND: 'Пользователь не найден',
  COMMENT_NOT_FOUND: 'Комментарий не найден',

  // Generic
  INTERNAL_ERROR: 'Произошла ошибка сервера',
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Успешно создано',
  UPDATED: 'Успешно обновлено',
  DELETED: 'Успешно удалено',
  REGISTERED: 'Регистрация успешна',
  LOGIN_SUCCESS: 'Вход выполнен успешно',
} as const

// Categories
export const CATEGORIES = [
  'технологии',
  'кухня',
  'здоровье',
  'финансы',
  'дом',
  'автомобиль',
  'другое',
] as const

// Rating values
export const RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 0,
} as const

// Bcrypt
export const BCRYPT_ROUNDS = 12

// Cache duration (in seconds)
export const CACHE_DURATION = {
  LIFEHACKS: 60, // 1 minute
  USER_PROFILE: 300, // 5 minutes
  TAGS: 3600, // 1 hour
  STATS: 60, // 1 minute
} as const
