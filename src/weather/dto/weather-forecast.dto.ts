import { Expose, Type } from 'class-transformer';
import { IsString, IsNumber, IsNotEmpty, MaxLength } from 'class-validator';

class ForecastDto {
  @Expose()
  @IsString()
  date: string;

  @Expose()
  @IsNumber()
  temperatureCelsius: number;

  @Expose()
  @IsNumber()
  temperatureFahrenheit: number;

  @Expose()
  @IsNumber()
  humidity: number;

  @Expose()
  @IsNumber()
  windSpeed: number;
}

export class WeatherForecastCityDto {
  @Expose()
  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  @MaxLength(100, { message: 'City name is too long (max 255 characters)' })
  city: string;

  @Expose()
  @IsString()
  country: string;

  @Expose()
  @IsNumber()
  temperature: number;

  @Type(() => ForecastDto)
  @Expose()
  forecast: ForecastDto[];

  constructor(city: string, country: string, forecast: ForecastDto[]) {
    this.city = city;
    this.country = country;
    this.forecast = forecast;
  }
}
