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
import { CurrentUser } from '../decorators/current-user.decorator'
import { Auth } from '../decorators/auth.decorator'
import { CategoryService } from './category.service'
import { CategoryDto } from './category.dto'

@Controller('categories')
export class CategoryController {

	constructor(private readonly categoryService: CategoryService) {
	}

	@Get()
	@Auth()
	async getAllCategories() {
		return this.categoryService.getAllCtg()
	}

	@Get(':id')
	@Auth()
	async getById(@Param('id') id: string) {
		return this.categoryService.getCategoryById(+id)
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.categoryService.getCategoryBySlug(slug)
	}


	@Put(':id')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	async updateCategory(@Param('id') id: string, @Body() dto: CategoryDto) {
		return this.categoryService.updateCategory(+id, dto)
	}


	@Post()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	async createCategory(@Body() dto: CategoryDto) {
		return this.categoryService.createCategory()
	}


	@Delete(':id')
	@HttpCode(200)
	@Auth()
	async deleteCategory(@Param('id') id: string) {
		return this.categoryService.removeCategory(+id)
	}

}
