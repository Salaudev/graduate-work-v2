import { Module } from '@nestjs/common'
import { UsersModule } from 'src/users/users.module'
import { UsersService } from 'src/users/users.service'
import { PrismaService } from '../prisma.service'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
	controllers: [StatisticsController],
	providers: [StatisticsService, PrismaService, UsersService],
	imports: [UsersModule]
})
export class StatisticsModule {}
