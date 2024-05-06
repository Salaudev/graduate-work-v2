import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CategoryService } from 'src/category/category.service'
import { returnedProductAllFields, returnedProductFields } from 'src/constants'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { convertToNumber } from 'src/utils/convert-to-number'
import { generateSlug } from 'src/utils/generate-slug'
import { EnumProductSort, GetAllProductDto } from './dto/get-all-product.dto'
import { ProductDto } from './dto/product.dto'

@Injectable()
export class ProductService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService,
		private readonly categoryService: CategoryService
	) {}

	async getAll(dto: GetAllProductDto = {}) {
		const filters = this.createFilter(dto)
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const products = await this.prisma.product.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: returnedProductFields
		})

		return {
			products,
			length: await this.prisma.product.count({ where: filters })
		}
	}

	async getProductById(id: number) {
		const product = await this.prisma.product.findUnique({
			where: { id },
			select: returnedProductAllFields
		})
		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async getProductBySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: { slug },
			select: returnedProductAllFields
		})
		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async getProductByCategory(categorySlug: string) {
		const category = await this.categoryService.getCategoryBySlug(categorySlug)

		const product = await this.prisma.product.findMany({
			where: {
				category: {
					id: category.id
				}
			},
			select: returnedProductAllFields
		})
		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async getSimilar(id: number) {
		const currenProduct = await this.getProductById(id)
		if (!currenProduct)
			throw new NotFoundException('Current prodcut is not found')

		const products = await this.prisma.product.findMany({
			where: {
				category: {
					name: currenProduct.category.name
				},
				NOT: {
					id: currenProduct.id
				}
			},
			select: returnedProductFields,
			orderBy: {
				createdAt: 'desc'
			}
		})
		return products
	}

	async updateProduct(id: number, dto: ProductDto) {
		const { name, price, description, categoryId, images } = dto

		const category = await this.categoryService.getCategoryById(categoryId)

		return this.prisma.product.update({
			where: {
				id
			},
			data: {
				name,
				price,
				description,
				images,
				slug: generateSlug(name),
				category: {
					connect: {
						id: category.id
					}
				}
			}
		})
	}

	async createProduct() {
		return this.prisma.product.create({
			data: {
				name: '',
				slug: '',
				price: 0,
				description: ''
			}
		})
	}

	async removeProduct(id: number) {
		return this.prisma.product.delete({
			where: { id }
		})
	}

	private getCategoryFilter(categoryId: number): Prisma.ProductWhereInput {
		return { categoryId }
	}

	private getPriceFilter(
		minPrice?: number,
		maxPrice?: number
	): Prisma.ProductWhereInput {
		let priceFilter: Prisma.IntFilter = undefined

		if (minPrice) {
			priceFilter = {
				...priceFilter,
				gte: minPrice
			}
		}

		if (maxPrice) {
			priceFilter = {
				...priceFilter,
				lte: maxPrice
			}
		}

		return {
			price: priceFilter
		}
	}

	private getRatingFilter(ratings: number[]): Prisma.ProductWhereInput {
		return {
			reviews: {
				some: {
					rating: {
						in: ratings
					}
				}
			}
		}
	}

	private getSearchtermFilter(searchTerm: string): Prisma.ProductWhereInput {
		return {
			OR: [
				{
					category: {
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				},
				{
					name: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					description: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
			]
		}
	}

	private getSortOption(
		sort: EnumProductSort
	): Prisma.ProductOrderByWithRelationInput {
		switch (sort) {
			case EnumProductSort.LOW_PRICE:
				return {
					price: 'asc'
				}
			case EnumProductSort.HIGH_PRICE:
				return {
					price: 'desc'
				}
			case EnumProductSort.OLDEST:
				return {
					createdAt: 'asc'
				}
			default:
				return {
					createdAt: 'desc'
				}
		}
	}

	private createFilter(dto: GetAllProductDto): Prisma.ProductWhereInput {
		let filters: Prisma.ProductWhereInput[] = []

		if (dto.searchTerm) filters.push(this.getSearchtermFilter(dto.searchTerm))

		if (dto.ratings)
			filters.push(
				this.getRatingFilter(dto.ratings.split('|').map(rating => +rating))
			)

		if (dto.minPrice || dto.maxPrice)
			filters.push(
				this.getPriceFilter(
					convertToNumber(dto.minPrice),
					convertToNumber(dto.maxPrice)
				)
			)

		if (dto.categoryId) filters.push(this.getCategoryFilter(+dto.categoryId))

		return filters.length ? { AND: filters } : {}
	}
}
