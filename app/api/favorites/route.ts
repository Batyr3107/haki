import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST add to favorites
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { lifehackId } = body

    if (!lifehackId) {
      return new NextResponse("Missing lifehackId", { status: 400 })
    }

    // Check if already in favorites
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_lifehackId: {
          userId: session.user.id,
          lifehackId,
        }
      }
    })

    if (existing) {
      // Remove from favorites
      await prisma.favorite.delete({
        where: {
          id: existing.id
        }
      })
      return NextResponse.json({ favorited: false })
    } else {
      // Add to favorites
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          lifehackId,
        }
      })
      return NextResponse.json({ favorited: true })
    }
  } catch (error) {
    console.log(error, 'FAVORITE_POST')
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// GET user's favorites
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        lifehack: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              }
            },
            ratings: true,
            comments: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform to include calculated fields
    const transformedFavorites = favorites.map((fav: any) => {
      const totalRating = fav.lifehack.ratings.reduce((sum: number, rating: { value: number }) => sum + rating.value, 0)
      const averageRating = fav.lifehack.ratings.length > 0 ? totalRating / fav.lifehack.ratings.length : 0

      return {
        ...fav.lifehack,
        averageRating,
        ratingsCount: fav.lifehack.ratings.length,
        commentsCount: fav.lifehack.comments.length,
      }
    })

    return NextResponse.json(transformedFavorites)
  } catch (error) {
    console.log(error, 'FAVORITES_GET')
    return new NextResponse("Internal Error", { status: 500 })
  }
}
