import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { lifehackId, content } = body

    if (!lifehackId || !content) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        lifehackId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          }
        }
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.log(error, 'COMMENT_POST')
    return new NextResponse("Internal Error", { status: 500 })
  }
}
