import prisma from "@/lib/prisma";

export interface CreateCategoryInput {
  name: string;
}

export interface UpdateCategoryInput {
  name: string;
}

export class DashboardCategoryService {
  // Get all categories
  static async getAllCategories() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return categories;
  }

  // Get category by ID
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

  // Create new category
  static async createCategory(data: CreateCategoryInput) {
    // Check if category name already exists
    const existing = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new Error("Category already exists");
    }

    const category = await prisma.category.create({
      data,
    });

    return category;
  }

  // Update category
  static async updateCategory(id: number, data: UpdateCategoryInput) {
    // Check if new name already exists (excluding current category)
    const existing = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existing && existing.id !== id) {
      throw new Error("Category name already exists");
    }

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    return category;
  }

  // Delete category
  static async deleteCategory(id: number) {
    // Check if category has posts
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (category && category._count.posts > 0) {
      throw new Error("Cannot delete category with existing posts");
    }

    await prisma.category.delete({
      where: { id },
    });

    return { success: true };
  }
}
