import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { UsePipes, ValidationPipe } from '@nestjs/common'
import { RefreshTokenDto } from './dto/get-new-tokens.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}


	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('registration')
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto) {
		return this.authService.login(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login/access-token')
	async getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.authService.getNewTokens(dto)
	}

}
