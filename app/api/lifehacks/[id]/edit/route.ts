import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// DELETE lifehack
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const params = await context.params

    // Check if lifehack exists and user is the author
    const lifehack = await prisma.lifehack.findUnique({
      where: { id: params.id },
      select: { authorId: true }
    })

    if (!lifehack) {
      return new NextResponse("Not found", { status: 404 })
    }

    if (lifehack.authorId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    await prisma.lifehack.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Deleted successfully" })
  } catch (error) {
    console.error('[LIFEHACK_DELETE]', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// PATCH lifehack (update)
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const params = await context.params
    const body = await request.json()
    const { title, description, content, category } = body

    if (!title || !description || !content || !category) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    // Check if lifehack exists and user is the author
    const existingLifehack = await prisma.lifehack.findUnique({
      where: { id: params.id },
      select: { authorId: true }
    })

    if (!existingLifehack) {
      return new NextResponse("Not found", { status: 404 })
    }

    if (existingLifehack.authorId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const lifehack = await prisma.lifehack.update({
      where: { id: params.id },
      data: {
        title,
        description,
        content,
        category,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          }
        }
      }
    })

    return NextResponse.json(lifehack)
  } catch (error) {
    console.error('[LIFEHACK_PATCH]', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
