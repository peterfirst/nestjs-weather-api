import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { PublicRoute } from 'src/decorator/public-route.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'The health check was successful.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  health(): string {
    return this.appService.health();
  }
}
