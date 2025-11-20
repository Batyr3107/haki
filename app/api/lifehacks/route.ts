import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all lifehacks
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const authorId = searchParams.get('authorId')
    const tag = searchParams.get('tag')

    const where: any = {}

    if (category) {
      where.category = category
    }

    if (authorId) {
      where.authorId = authorId
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag
          }
        }
      }
    }

    const lifehacks = await prisma.lifehack.findMany({
      where,
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
        } : false,
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate average rating and favorite status for each lifehack
    const lifehacksWithRatings = lifehacks.map((lifehack: any) => {
      const totalRating = lifehack.ratings.reduce((sum: number, rating: { value: number }) => sum + rating.value, 0)
      const averageRating = lifehack.ratings.length > 0 ? totalRating / lifehack.ratings.length : 0
      const isFavorited = session?.user?.id ? lifehack.favorites.length > 0 : false

      return {
        ...lifehack,
        averageRating,
        ratingsCount: lifehack.ratings.length,
        commentsCount: lifehack.comments.length,
        views: lifehack.views || 0,
        isFavorited,
      }
    })

    return NextResponse.json(lifehacksWithRatings)
  } catch (error) {
    console.log(error, 'LIFEHACKS_GET')
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// POST create new lifehack
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { title, description, content, category, tags = [] } = body

    if (!title || !description || !content || !category) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const lifehack = await prisma.lifehack.create({
      data: {
        title,
        description,
        content,
        category,
        authorId: session.user.id,
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

    // Create and link tags
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const slug = tagName
          .toLowerCase()
          .replace(/[^a-zа-я0-9]+/g, '-')
          .replace(/^-|-$/g, '')

        const tag = await prisma.tag.upsert({
          where: { slug },
          update: {},
          create: { name: tagName, slug }
        })

        await prisma.lifehackTag.create({
          data: {
            lifehackId: lifehack.id,
            tagId: tag.id
          }
        })
      }
    }

    return NextResponse.json(lifehack)
  } catch (error) {
    console.log(error, 'LIFEHACK_POST')
    return new NextResponse("Internal Error", { status: 500 })
  }
}
