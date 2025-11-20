import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    // Increment views count
    await prisma.lifehack.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    })

    const lifehack = await prisma.lifehack.findUnique({
      where: {
        id: params.id
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            bio: true,
          }
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        favorites: session?.user?.id ? {
          where: {
            userId: session.user.id
          }
        } : false
      }
    })

    if (!lifehack) {
      return new NextResponse("Not found", { status: 404 })
    }

    // Calculate average rating and favorite status
    const totalRating = lifehack.ratings.reduce((sum: number, rating: { value: number }) => sum + rating.value, 0)
    const averageRating = lifehack.ratings.length > 0 ? totalRating / lifehack.ratings.length : 0
    const isFavorited = session?.user?.id ? (lifehack as any).favorites.length > 0 : false

    return NextResponse.json({
      ...lifehack,
      averageRating,
      ratingsCount: lifehack.ratings.length,
      commentsCount: lifehack.comments.length,
      isFavorited,
    })
  } catch (error) {
    console.log(error, 'LIFEHACK_GET')
    return new NextResponse("Internal Error", { status: 500 })
  }
}
