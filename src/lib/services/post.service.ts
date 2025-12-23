import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface CreatePostInput {
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  shortDesc: string;
  authorId: number;
  categoryId: number;
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

export interface PostFilters {
  categoryId?: number;
  published?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export class PostService {
  // Get all posts with filters & pagination
  static async getPosts(filters: PostFilters = {}) {
    const {
      categoryId,
      published = true,
      search,
      page = 1,
      limit = 9,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = { published };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true },
          },
          category: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single post by slug
  static async getPostBySlug(slug: string) {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return post;
  }

  // Get single post by ID
  static async getPostById(id: number) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return post;
  }

  // Create new post
  static async createPost(data: CreatePostInput) {
    const post = await prisma.post.create({
      data: {
        ...data,
        hashId: this.generateHashId(),
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return post;
  }

  // Update post
  static async updatePost(id: number, data: UpdatePostInput) {
    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: { id: true, name: true },
        },
        category: {
          select: { id: true, name: true },
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

  // Get related posts (same category, exclude current)
  static async getRelatedPosts(postId: number, categoryId: number, limit = 3) {
    const posts = await prisma.post.findMany({
      where: {
        categoryId,
        published: true,
        id: { not: postId },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return posts;
  }

  // Search posts (for global search)
  static async searchPosts(query: string, limit = 10) {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        category: {
          select: { name: true },
        },
      },
    });

    return posts;
  }

  // Get homepage data
  static async getHomepageData() {
    const [featured, highlights, grid, categories] = await Promise.all([
      // Featured: latest post
      prisma.post.findFirst({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true } },
          category: { select: { name: true } },
        },
      }),

      // Highlights: next 3 posts
      prisma.post.findMany({
        where: { published: true },
        skip: 1,
        take: 3,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true } },
          category: { select: { name: true } },
        },
      }),

      // Grid: next 6 posts for category section
      prisma.post.findMany({
        where: { published: true },
        skip: 4,
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true } },
          category: { select: { name: true } },
        },
      }),

      // Categories for filtering
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    return { featured, highlights, grid, categories };
  }

  // Helper: Generate unique hash ID
  private static generateHashId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
