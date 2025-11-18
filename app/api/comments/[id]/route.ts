import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// DELETE comment
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if comment exists and user is the author
    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
      select: { userId: true }
    })

    if (!comment) {
      return new NextResponse("Not found", { status: 404 })
    }

    if (comment.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    await prisma.comment.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Deleted successfully" })
  } catch (error) {
    console.log(error, 'COMMENT_DELETE')
    return new NextResponse("Internal Error", { status: 500 })
  }
}
