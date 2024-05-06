import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'argon2'
import { returnedUserFields } from '../constants'
import { PrismaService } from '../prisma.service'
import { UserDto } from './dto/create-user.dto'

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async getUserById(id: number, selectObj: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				...returnedUserFields,
				favorites: {
					select: {
						id: true,
						name: true,
						price: true,
						images: true,
						slug: true,
						category: {
							select: {
								slug: true
							}
						},
						reviews: true
					}
				},
				...selectObj
			}
		})
		if (!user) throw new Error('User not found')

		return user
	}

	async updateProfile(id: number, dto: UserDto) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				...returnedUserFields
			}
		})
		if (!user) throw new Error('User not found')

		return this.prisma.user.update({
			where: {
				id
			},
			data: {
				email: dto.email,
				firstName: dto.firstName,
				avatarPath: dto.avatarPath,
				phone: dto.phone,
				password: dto.password ? await hash(dto.password) : user.password
			}
		})
	}

	async getUserByEmail(email: string) {
		const user = await this.prisma.user.findUnique({ where: { email } })

		console.log(user)

		if (!user) throw new NotFoundException('User not found')

		return user
	}

	async toogleFavoriteProduct(id: number, productId: number) {
		const user = await this.getUserById(id)

		if (!user) throw new NotFoundException('User not found')

		const isInFavorites = user.favorites.some(
			product => product.id === productId
		)

		await this.prisma.user.update({
			where: { id: user.id },
			data: {
				favorites: {
					[isInFavorites ? 'disconnect' : 'connect']: { id: productId }
				}
			}
		})

		return {
			message: 'Success'
		}
	}
}
