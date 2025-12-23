import prisma from "@/lib/prisma";

export interface CreateCategoryInput {
  name: string;
}

export class CategoryService {
  // Get all categories
  static async getCategories() {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return categories;
  }

  // Get single category by ID
  static async getCategoryById(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return category;
  }

  // Get category by name
  static async getCategoryByName(name: string) {
    const category = await prisma.category.findUnique({
      where: { name },
    });

    return category;
  }

  // Create new category
  static async createCategory(data: CreateCategoryInput) {
    const category = await prisma.category.create({
      data,
    });

    return category;
  }

  // Update category
  static async updateCategory(id: number, data: CreateCategoryInput) {
    const category = await prisma.category.update({
      where: { id },
      data,
    });

    return category;
  }

  // Delete category
  static async deleteCategory(id: number) {
    // Check if category has posts
    const postsCount = await prisma.post.count({
      where: { categoryId: id },
    });

    if (postsCount > 0) {
      throw new Error(
        `Cannot delete category with ${postsCount} posts. Reassign posts first.`
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return { success: true };
  }
}
