import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET all tags
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { lifehacks: true }
        }
      },
      orderBy: {
        lifehacks: {
          _count: 'desc'
        }
      }
    })

    return NextResponse.json(tags)
  } catch (error) {
    console.log(error, 'TAGS_GET')
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// POST create tag
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return new NextResponse("Missing name", { status: 400 })
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-zа-я0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug }
    })

    return NextResponse.json(tag)
  } catch (error) {
    console.log(error, 'TAG_POST')
    return new NextResponse("Internal Error", { status: 500 })
  }
}
