import prisma from "@/lib/prisma";
import crypto from "crypto";

export interface CreatePostInput {
  title: string;
  content: string;
  thumbnail: string;
  shortDesc: string;
  categoryId: number;
  authorId: number;
  published?: boolean;
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  content?: string;
  thumbnail?: string;
  shortDesc?: string;
  categoryId?: number;
  published?: boolean;
}

export class DashboardPostService {
  // Generate slug from title
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Generate unique hashId
  static generateHashId(): string {
    return crypto.randomBytes(5).toString("hex");
  }

  // Get all posts (for dashboard) - filtered by author
  static async getAllPosts(authorId?: number) {
    const posts = await prisma.post.findMany({
      where: authorId ? { authorId } : undefined,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return posts;
  }

  // Get post by ID
  static async getPostById(id: number) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return post;
  }

  // Create new post
  static async createPost(data: CreatePostInput) {
    const slug = this.generateSlug(data.title);
    const hashId = this.generateHashId();

    // Check if slug already exists
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.post.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const post = await prisma.post.create({
      data: {
        ...data,
        slug: finalSlug,
        hashId,
        published: data.published ?? false,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return post;
  }

  // Update post
  static async updatePost(id: number, data: UpdatePostInput) {
    // If title changed, regenerate slug
    if (data.title) {
      const newSlug = this.generateSlug(data.title);
      let finalSlug = newSlug;
      let counter = 1;

      while (true) {
        const existing = await prisma.post.findUnique({
          where: { slug: finalSlug },
        });

        if (!existing || existing.id === id) break;

        finalSlug = `${newSlug}-${counter}`;
        counter++;
      }

      data.slug = finalSlug;
    }

    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return post;
  }

  // Delete post
  static async deletePost(id: number) {
    await prisma.post.delete({
      where: { id },
    });

    return { success: true };
  }
}
