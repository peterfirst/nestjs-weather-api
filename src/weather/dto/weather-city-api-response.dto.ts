import { Expose, Type } from 'class-transformer';
import { LocationDto } from './location.dto';

export class WeatherCityApiResponseDto {
  @Expose()
  @Type(() => LocationDto)
  location: LocationDto;

  @Expose()
  @Type(() => CurrentWeatherDto)
  current: CurrentWeatherDto;
}

export class CurrentWeatherDto {
  @Expose({ name: 'temp_celsius' })
  temp_c: number;

  @Expose({ name: 'temp_fahrenheit' })
  temp_f: number;

  @Expose({ name: 'humidity' })
  humidity: number;

  @Expose({ name: 'windspeed' })
  wind_kph: number;
}
