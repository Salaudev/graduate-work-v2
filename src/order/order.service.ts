import { Injectable } from '@nestjs/common'
import { returnedProductFields } from 'src/constants'
import { PrismaService } from 'src/prisma.service'
import { OrderDto } from './order.dto'

@Injectable()
export class OrderService {
	constructor(private readonly prisma: PrismaService) {}
	async getByUserId(userId: number) {
		return this.prisma.order.findMany({
			where: {
				userId
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: {
					include: {
						product: {
							select: returnedProductFields
						}
					}
				}
			}
		})
	}

	async getAll() {
		return this.prisma.order.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: {
					include: {
						product: {
							select: returnedProductFields
						}
					}
				}
			}
		})
	}

	async placeOrder(dto: OrderDto, userId: number) {
		const total = dto.items.reduce(
			(acc, item) => acc + item.price * item.quantity,
			0
		)

		const order = await this.prisma.order.create({
			data: {
				status: dto.status,
				total,
				items: {
					create: dto.items
				},
				user: {
					connect: { id: userId }
				}
			}
		})

		return order
	}
}
