import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST - toggle follow/unfollow
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return new NextResponse("Missing userId", { status: 400 })
    }

    if (userId === session.user.id) {
      return new NextResponse("Cannot follow yourself", { status: 400 })
    }

    // Check if already following
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userId,
        },
      },
    })

    if (existing) {
      // Unfollow
      await prisma.follow.delete({
        where: { id: existing.id },
      })
      return NextResponse.json({ following: false })
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: session.user.id,
          followingId: userId,
        },
      })
      return NextResponse.json({ following: true })
    }
  } catch (error) {
    console.log(error, 'FOLLOW_POST')
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// GET - check if following a user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return new NextResponse("Missing userId", { status: 400 })
    }

    if (!session?.user?.id) {
      return NextResponse.json({ following: false })
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userId,
        },
      },
    })

    return NextResponse.json({ following: !!follow })
  } catch (error) {
    console.log(error, 'FOLLOW_GET')
    return new NextResponse("Internal Error", { status: 500 })
  }
}
