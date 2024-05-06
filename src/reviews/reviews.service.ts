import { Injectable } from '@nestjs/common'
import { ProductService } from 'src/product/product.service'
import { returnedReviewFields } from '../constants'
import { PrismaService } from '../prisma.service'
import { ReviewDto } from './review.dto'

@Injectable()
export class ReviewsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly productService: ProductService
	) {}

	async getAll() {
		return this.prisma.review.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			select: returnedReviewFields
		})
	}

	async leaveReview(userId: number, dto: ReviewDto, productId: number) {
		const product = await this.productService.getProductById(productId)

		return this.prisma.review.create({
			data: {
				...dto,
				product: {
					connect: {
						id: product.id
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	async getAverageValueByProductId(productId: number) {
		return this.prisma.review
			.aggregate({
				where: { productId },
				_avg: { rating: true }
			})
			.then(data => data._avg)
	}
}
