import { Expose, Type } from 'class-transformer';
import { LocationDto } from './location.dto';

export class WeatherCityResponseDto {
  @Expose()
  @Type(() => LocationDto)
  location: LocationDto;

  @Expose({ name: 'temp_c' })
  temperatureCelsius: number;

  @Expose({ name: 'temp_f' })
  temperatureFahrenheit: number;

  @Expose({ name: 'humidity_level' })
  humidity: number;

  @Expose({ name: 'wind_kph' })
  windSpeed: number;
}
