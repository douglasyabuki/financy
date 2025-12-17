import { prismaClient } from '../../prisma/prisma'
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../dtos/input/category.input'

export class CategoryService {
  async createCategory(data: CreateCategoryInput, userId: string) {
    return prismaClient.category.create({
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        color: data.color,
        userId,
      },
    })
  }

  async deleteCategory(id: string, userId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id,
      },
    })

    if (!category) throw new Error('Category not found')
    if (category.userId !== userId) throw new Error('Unauthorized')

    return prismaClient.category.delete({
      where: {
        id,
      },
    })
  }

  async getCategory(id: string, userId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id,
      },
    })

    if (!category) throw new Error('Category not found')
    if (category.userId !== userId) throw new Error('Unauthorized')

    return category
  }

  async listCategories(userId: string) {
    return prismaClient.category.findMany({
      where: {
        userId,
      },
    })
  }

  async updateCategory(id: string, data: UpdateCategoryInput, userId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id,
      },
    })

    if (!category) throw new Error('Category not found')
    if (category.userId !== userId) throw new Error('Unauthorized')

    return prismaClient.category.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        color: data.color,
      },
    })
  }
}
