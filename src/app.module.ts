import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getJwtConfig } from './config/jwt.config'
import { PrismaService } from './prisma.service'
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { StaticticsModule } from './statictics/statictics.module';
import { PaginationModule } from './pagination/pagination.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UsersModule,
		ProductModule,
		ReviewsModule,
		CategoryModule,
		OrderModule,
		StaticticsModule,
		PaginationModule],
	controllers: [AppController],
	providers: [AppService, PrismaService]
})
export class AppModule {
}
