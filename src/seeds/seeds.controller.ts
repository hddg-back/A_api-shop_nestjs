import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeedsService } from './seeds.service';
// import { Auth, ValidRoles } from '../auth/decorators';

@ApiTags('Seeders')
@Controller('seeds')
export class SeedsController {
  constructor(private readonly seedsService: SeedsService) {}

  @Get()
  // @Auth(ValidRoles.admin)
  seedExecute() {
    return this.seedsService.executeSeed();
  }
}
