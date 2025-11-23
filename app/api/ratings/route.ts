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
    const { lifehackId, value } = body

    if (!lifehackId || !value) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    // Value should be between 1 and 5
    if (value < 1 || value > 5) {
      return new NextResponse("Rating value must be between 1 and 5", { status: 400 })
    }

    // Check if user already rated this lifehack
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_lifehackId: {
          userId: session.user.id,
          lifehackId,
        }
      }
    })

    let rating

    if (existingRating) {
      // Update existing rating
      rating = await prisma.rating.update({
        where: {
          id: existingRating.id
        },
        data: {
          value
        }
      })
    } else {
      // Create new rating
      rating = await prisma.rating.create({
        data: {
          value,
          userId: session.user.id,
          lifehackId,
        }
      })
    }

    return NextResponse.json(rating)
  } catch (error) {
    console.error('[ RATING_POST]', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
