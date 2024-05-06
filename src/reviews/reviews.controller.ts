import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/decorators/auth.decorator'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { ReviewDto } from './review.dto'
import { ReviewsService } from './reviews.service'

@Controller('reviews')
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	@Auth('admin')
	async getAllReviews() {
		return this.reviewsService.getAll()
	}

	@Get('avarage-by-product/:productId')
	async getAvarage(@Param('productId') productId: string) {
		return this.reviewsService.getAverageValueByProductId(+productId)
	}

	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post('/leave/:productId')
	@Auth()
	async leaveReview(
		@CurrentUser('id') id: number,
		@Body() dto: ReviewDto,
		@Param('productId') productId: string
	) {
		return this.reviewsService.leaveReview(id, dto, +productId)
	}
}
