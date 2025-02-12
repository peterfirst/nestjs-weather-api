import { IsObject, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CurrentWeatherApiDto {
  @IsNumber()
  temp_c: number;

  @IsNumber()
  temp_f: number;

  @IsNumber()
  humidity: number;

  @IsNumber()
  wind_kph: number;
}

export class WeatherApiDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CurrentWeatherApiDto)
  current: CurrentWeatherApiDto;
}
