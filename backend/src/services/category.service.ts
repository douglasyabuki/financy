import { prismaClient } from '../../prisma/prisma'
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../dtos/input/category.input'
import { CategoryColor } from '../models/category.model'

export class CategoryService {
  async createCategory(data: CreateCategoryInput, userId: string) {
    const category = await prismaClient.category.create({
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        color: data.color,
        userId,
      },
    })
    return { ...category, color: category.color as CategoryColor }
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

    return { ...category, color: category.color as CategoryColor }
  }

  async listCategories(userId: string) {
    const categories = await prismaClient.category.findMany({
      where: {
        userId,
      },
    })
    return categories.map(category => ({
      ...category,
      color: category.color as CategoryColor,
    }))
  }

  async updateCategory(id: string, data: UpdateCategoryInput, userId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id,
      },
    })

    if (!category) throw new Error('Category not found')
    if (category.userId !== userId) throw new Error('Unauthorized')

    const updatedCategory = await prismaClient.category.update({
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
    return { ...updatedCategory, color: updatedCategory.color as CategoryColor }
  }
}
