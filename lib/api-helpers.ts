import { NextResponse } from 'next/server'
import { HTTP_STATUS, ERROR_MESSAGES } from './constants'

/**
 * Centralized API error responses
 */
export const ApiError = {
  unauthorized: () =>
    new NextResponse(ERROR_MESSAGES.UNAUTHORIZED, {
      status: HTTP_STATUS.UNAUTHORIZED,
    }),

  forbidden: () =>
    new NextResponse(ERROR_MESSAGES.FORBIDDEN, {
      status: HTTP_STATUS.FORBIDDEN,
    }),

  notFound: (resource?: string) =>
    new NextResponse(resource ? `${resource} ${ERROR_MESSAGES.NOT_FOUND.toLowerCase()}` : ERROR_MESSAGES.NOT_FOUND, {
      status: HTTP_STATUS.NOT_FOUND,
    }),

  badRequest: (message: string = ERROR_MESSAGES.MISSING_FIELDS) =>
    new NextResponse(message, {
      status: HTTP_STATUS.BAD_REQUEST,
    }),

  conflict: (message: string) =>
    new NextResponse(message, {
      status: HTTP_STATUS.CONFLICT,
    }),

  internal: (context?: string) => {
    const message = context
      ? `${ERROR_MESSAGES.INTERNAL_ERROR}: ${context}`
      : ERROR_MESSAGES.INTERNAL_ERROR

    return new NextResponse(message, {
      status: HTTP_STATUS.INTERNAL_ERROR,
    })
  },

  tooManyRequests: () =>
    new NextResponse('Слишком много запросов. Попробуйте позже', {
      status: HTTP_STATUS.TOO_MANY_REQUESTS,
    }),
}

/**
 * Centralized API success responses
 */
export const ApiSuccess = {
  ok: <T>(data: T) => NextResponse.json(data),

  created: <T>(data: T) =>
    NextResponse.json(data, { status: HTTP_STATUS.CREATED }),

  noContent: () =>
    new NextResponse(null, { status: 204 }),
}

/**
 * Type guard for checking if error is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error
}

/**
 * Safe error message extraction
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message
  }
  return String(error)
}

/**
 * Log API error with context
 */
export function logApiError(context: string, error: unknown): void {
  console.error(`[${context}]`, error)
}
