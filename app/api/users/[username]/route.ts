import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: params.username
      },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatar: true,
        createdAt: true,
        lifehacks: {
          include: {
            ratings: true,
            comments: true,
            tags: {
              include: {
                tag: true
              }
            },
            author: {
              select: {
                username: true,
                name: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        ratings: true,
        _count: {
          select: {
            followers: true,
            following: true
          }
        }
      }
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Calculate statistics
    const totalLifehacks = user.lifehacks.length
    const totalRatingsGiven = user.ratings.length

    // Calculate average rating received on user's lifehacks
    let totalRatingPoints = 0
    let totalRatingsReceived = 0

    user.lifehacks.forEach((lifehack: any) => {
      lifehack.ratings.forEach((rating: { value: number }) => {
        totalRatingPoints += rating.value
        totalRatingsReceived++
      })
    })

    const averageRatingReceived = totalRatingsReceived > 0
      ? totalRatingPoints / totalRatingsReceived
      : 0

    // Add rating statistics to lifehacks
    const lifehacksWithStats = user.lifehacks.map((lifehack: any) => {
      const totalRating = lifehack.ratings.reduce((sum: number, rating: { value: number }) => sum + rating.value, 0)
      const averageRating = lifehack.ratings.length > 0 ? totalRating / lifehack.ratings.length : 0

      return {
        ...lifehack,
        averageRating,
        ratingsCount: lifehack.ratings.length,
        commentsCount: lifehack.comments.length,
        views: lifehack.views || 0,
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      stats: {
        totalLifehacks,
        totalRatingsGiven,
        totalRatingsReceived,
        averageRatingReceived,
        followersCount: user._count.followers,
        followingCount: user._count.following,
      },
      lifehacks: lifehacksWithStats,
    })
  } catch (error) {
    console.log(error, 'USER_GET')
    return new NextResponse("Internal Error", { status: 500 })
  }
}
