import { Module } from '@nestjs/common'
import { StaticticsService } from './statictics.service'
import { StaticticsController } from './statictics.controller'
import { PrismaService } from '../prisma.service'

@Module({
	controllers: [StaticticsController],
	providers: [StaticticsService, PrismaService]
})
export class StaticticsModule {
}
