import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { returnedCtgFields } from '../constants'
import { hash } from 'argon2'
import { CategoryDto } from './category.dto'
import { generateSlug } from '../utils/generate-slug'

@Injectable()
export class CategoryService {

	constructor(private readonly prisma: PrismaService) {
	}

	async getCategoryById(id: number) {
		const category = await this.prisma.category.findUnique({
			where: { id }, select: returnedCtgFields
		})
		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async getCategoryBySlug(slug: string) {
		const category = await this.prisma.category.findUnique({
			where: { slug }, select: returnedCtgFields
		})
		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async updateCategory(id: number, dto: CategoryDto) {
		return this.prisma.category.update({
			where: {
				id
			},
			data: {
				name: dto.name,
				slug: generateSlug(dto.name)
			}
		})
	}

	async createCategory() {
		return this.prisma.category.create({
			data: {
				name: '',
				slug: ''
			}
		})
	}

	async removeCategory(id: number) {
		return this.prisma.category.delete({
			where: { id }
		})
	}
	async getAllCtg() {
		return await this.prisma.category.findMany({
			select: returnedCtgFields
		})
	}

}
