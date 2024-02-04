import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AuthDto } from './dto/auth.dto'
import { faker } from '@faker-js/faker'
import { hash, verify } from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import * as process from 'process'
import { RefreshTokenDto } from './dto/get-new-tokens.dto'

@Injectable()
export class AuthService {

	constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {
	}

	async login(dto: AuthDto) {

		const user = await this.validateUser(dto)

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async register(dto: AuthDto) {
		const [existUser] = await Promise.all([this.prisma.user.findUnique({ where: { email: dto.email } })])

		console.log(existUser)

		if (existUser) {
			throw new BadRequestException('User already exist')
		}

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				firstName: faker.name.firstName(),
				secondName: faker.name.lastName('male'),
				phone: faker.phone.number('+998 ## ### ## ##'),
				avatarPath: faker.image.avatar(),
				username: faker.internet.userName(),
				password: await hash(dto.password)
			}
		})

		const tokens = await this.issueTokens(user.id)


		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}


	async getNewTokens(dto: RefreshTokenDto) {
		const result = await this.jwt.verifyAsync(dto.refreshToken)

		if (!result) throw new UnauthorizedException()

		const user = await this.prisma.user.findUnique({ where: { id: result.id } })

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	private issueTokens(userId: number) {
		const data = { id: userId }


		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email
		}
	}


	private async validateUser(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({ where: { email: dto.email } })

		if (!user) throw new NotFoundException('User not found')

		const isValidPwd = await verify(user.password, dto.password)

		if (!isValidPwd) throw new UnauthorizedException('Invalid password')

		return user

	}
}
