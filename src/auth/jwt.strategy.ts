import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import * as dotenv from 'dotenv'


dotenv.config()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService,
							private readonly prisma: PrismaService
	) {

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken
			(),
			ignoreExpiration: true,
			secretOrKey: configService.get('SECRET_KEY') || 'SECRET_1234'
		})
	}

	async validate({ id }: Pick<User, 'id'>) {
		return await this.prisma.user.findUnique({ where: { id: +id } })
	}
}