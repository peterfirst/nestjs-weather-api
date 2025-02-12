import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiParam, ApiResponse } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { WeatherCityDto } from './dto/weather-city.dto';
import { WeatherForecastCityDto } from './dto/weather-forecast.dto';
import { PublicRoute } from '../decorator/public-route.decorator';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @PublicRoute()
  @Get(':city')
  @ApiParam({
    name: 'city',
    description: 'City name to fetch weather data for',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the current weather for the specified city',
    type: WeatherCityDto,
  })
  @ApiResponse({
    status: 404,
    description: 'City not found',
  })
  async getWeather(@Param('city') city: string): Promise<WeatherCityDto> {
    return this.weatherService.getWeather(city);
  }

  @PublicRoute()
  @Get('forecast/:city')
  @ApiParam({
    name: 'city',
    description: 'City name to fetch weather forecast data for',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the weather forecast for the specified city',
    type: WeatherForecastCityDto,
  })
  @ApiResponse({
    status: 404,
    description: 'City not found',
  })
  async getForecast(
    @Param('city') city: string,
  ): Promise<WeatherForecastCityDto> {
    return this.weatherService.getForecast(city);
  }
}
