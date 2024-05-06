import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from '../decorators/auth.decorator'
import { CategoryDto } from './category.dto'
import { CategoryService } from './category.service'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	// @Auth()
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
	@Auth('admin')
	async updateCategory(@Param('id') id: string, @Body() dto: CategoryDto) {
		return this.categoryService.updateCategory(+id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Post()
	async createCategory(@Body() dto: CategoryDto) {
		return this.categoryService.createCategory()
	}

	@Auth('admin')
	@HttpCode(200)
	@Delete(':id')
	async deleteCategory(@Param('id') id: string) {
		return this.categoryService.removeCategory(+id)
	}
}
