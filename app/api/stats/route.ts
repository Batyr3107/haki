import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET platform statistics
export async function GET() {
  try {
    const [
      totalLifehacks,
      totalUsers,
      totalComments,
      totalRatings,
      totalViews
    ] = await Promise.all([
      prisma.lifehack.count(),
      prisma.user.count(),
      prisma.comment.count(),
      prisma.rating.count(),
      prisma.lifehack.aggregate({
        _sum: {
          views: true
        }
      })
    ])

    return NextResponse.json({
      totalLifehacks,
      totalUsers,
      totalComments,
      totalRatings,
      totalViews: totalViews._sum.views || 0
    })
  } catch (error) {
    console.error('[ STATS_GET]', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
