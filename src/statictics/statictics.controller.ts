import { Controller } from '@nestjs/common';
import { StaticticsService } from './statictics.service';

@Controller('statictics')
export class StaticticsController {
  constructor(private readonly staticticsService: StaticticsService) {}
}
