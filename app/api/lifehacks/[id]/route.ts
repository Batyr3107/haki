import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
        }
      }
    })

    if (!lifehack) {
      return new NextResponse("Not found", { status: 404 })
    }

    // Calculate average rating
    const totalRating = lifehack.ratings.reduce((sum, rating) => sum + rating.value, 0)
    const averageRating = lifehack.ratings.length > 0 ? totalRating / lifehack.ratings.length : 0

    return NextResponse.json({
      ...lifehack,
      averageRating,
      ratingsCount: lifehack.ratings.length,
      commentsCount: lifehack.comments.length,
    })
  } catch (error) {
    console.log(error, 'LIFEHACK_GET')
    return new NextResponse("Internal Error", { status: 500 })
  }
}
