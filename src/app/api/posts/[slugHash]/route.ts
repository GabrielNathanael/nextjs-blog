// src/app/api/posts/[slugHash]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Detail post
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slugHash: string }> }
) {
  try {
    const { slugHash } = await params;
    const [slug, hashId] = slugHash.split("-");
    const post = await prisma.post.findFirst({
      where: { slug, hashId },
      select: {
        id: true,
        title: true,
        slug: true,
        hashId: true,
        shortDesc: true,
        content: true,
        thumbnail: true,
        createdAt: true,
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengambil detail post" },
      { status: 500 }
    );
  }
}

// PUT: Update post
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slugHash: string }> }
) {
  try {
    const body = await req.json();
    const { slugHash } = await params;
    const [slug, hashId] = slugHash.split("-");

    const post = await prisma.post.findFirst({ where: { slug, hashId } });
    if (!post) {
      return NextResponse.json(
        { error: "Post tidak ditemukan" },
        { status: 404 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: {
        title: body.title || post.title,
        shortDesc: body.shortDesc || post.shortDesc,
        content: body.content || post.content,
        thumbnail: body.thumbnail || post.thumbnail,
        categoryId: body.categoryId || post.categoryId,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengupdate post" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus post
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slugHash: string }> }
) {
  try {
    const { slugHash } = await params;
    const [slug, hashId] = slugHash.split("-");

    const post = await prisma.post.findFirst({ where: { slug, hashId } });
    if (!post) {
      return NextResponse.json(
        { error: "Post tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.post.delete({ where: { id: post.id } });
    return NextResponse.json({ message: "Post berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal menghapus post" },
      { status: 500 }
    );
  }
}
