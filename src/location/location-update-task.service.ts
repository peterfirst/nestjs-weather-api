import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LocationService } from './location.service';

@Injectable()
export class LocationUpdateTaskService {
  constructor(private readonly locationService: LocationService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateWeatherForFavorites() {
    try {
      await this.locationService.updateWeatherForFavorites();
    } catch (error) {
      throw new InternalServerErrorException(
        'LocationUpdateTaskService failed',
        {
          cause: error,
        },
      );
    }
  }
}
