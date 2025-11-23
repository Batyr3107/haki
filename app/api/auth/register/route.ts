import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, username, password, name } = body

    // Validate required fields
    if (!email || !username || !password) {
      return new NextResponse("Все обязательные поля должны быть заполнены", { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new NextResponse("Неверный формат email", { status: 400 })
    }

    // Validate password length
    if (password.length < 6) {
      return new NextResponse("Пароль должен содержать минимум 6 символов", { status: 400 })
    }

    // Validate username format
    if (username.length < 3) {
      return new NextResponse("Имя пользователя должно содержать минимум 3 символа", { status: 400 })
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return new NextResponse("Пользователь с таким email уже существует", { status: 400 })
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUsername) {
      return new NextResponse("Это имя пользователя уже занято", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      }
    })
  } catch (error) {
    console.error('[REGISTRATION_ERROR]', error)
    return new NextResponse("Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.", { status: 500 })
  }
}
