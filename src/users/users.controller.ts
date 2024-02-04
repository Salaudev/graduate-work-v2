import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Put,
	HttpCode,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { CurrentUser } from '../decorators/current-user.decorator'
import { Auth } from '../decorators/auth.decorator'

@Controller('users')
export class UsersController {

	constructor(private readonly usersService: UsersService) {
	}


	// @Post()
	// create(@Body() createUserDto: UserDto) {
	// 	return this.usersService.create(createUserDto)
	// }
	//
	// @Get()
	// findAll() {
	// 	return this.usersService.findAll()
	// }

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: number) {
		return this.usersService.getUserById(id)
	}

	@Put('profile')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	async updateProfile(@CurrentUser('id') id: number, @Body() dto: UserDto) {
		return this.usersService.updateProfile(+id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Patch('/profile/products/:productId')
	toggleFavorite(@Param('productId') productId: string, @CurrentUser('id') id: number) {
		return this.usersService.toogleFavoriteProduct(id, +productId)
	}

}
