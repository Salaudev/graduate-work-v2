import { Controller, Get } from '@nestjs/common'
import { Auth } from 'src/decorators/auth.decorator'
import { StatisticsService } from './statistics.service'

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Get('main')
	@Auth('admin')
	async getMain() {
		return this.statisticsService.getMain()
	}
}
