import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'
import * as dotenv from 'dotenv'


dotenv.config()

export const getJwtConfig = async (
	configService: ConfigService
): Promise<JwtModuleOptions> => ({
	secret: configService.get('SECRET_KEY') || 'SECRET_1234'
})