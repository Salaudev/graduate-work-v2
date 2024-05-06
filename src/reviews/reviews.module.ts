import { Module } from '@nestjs/common'
import { CategoryModule } from 'src/category/category.module'
import { PaginationModule } from 'src/pagination/pagination.module'
import { ProductModule } from 'src/product/product.module'
import { PrismaService } from '../prisma.service'
import { ReviewsController } from './reviews.controller'
import { ReviewsService } from './reviews.service'

@Module({
	controllers: [ReviewsController],
	providers: [ReviewsService, PrismaService],
	imports: [ProductModule, PaginationModule, CategoryModule]
})
export class ReviewsModule {}
