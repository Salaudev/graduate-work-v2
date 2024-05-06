import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class StatisticsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UsersService
	) {}

	async getMain() {
		// const user = await this.userService.getUserById(userId, {
		// 	orders: { select: { items: true } },
		// 	favorites: true,
		// 	reviews: true
		// })
		const orderCount = await this.prisma.order.count()
		const reviewCount = await this.prisma.review.count()
		const usersCount = await this.prisma.user.count()

		const totalAmount = await this.prisma.order.aggregate({
			_sum: {
				total: true
			}
		})

		return [
			{
				name: 'Orders',
				value: orderCount
			},
			{
				name: 'Reviews',
				value: reviewCount
			},
			{
				name: 'Favorites',
				value: usersCount
			},
			{
				name: 'Total',
				value: totalAmount._sum.total
			}
		]
	}
}
