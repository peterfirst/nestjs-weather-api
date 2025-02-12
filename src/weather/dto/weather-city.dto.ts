import { Expose } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';

export class WeatherCityDto {
  @Expose()
  @IsString()
  city: string;

  @Expose()
  @IsString()
  country: string;

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

  constructor(
    city: string,
    country: string,
    temperatureCelsius: number,
    temperatureFahrenheit: number,
    humidity: number,
    windSpeed: number,
  ) {
    this.city = city;
    this.country = country;
    this.temperatureCelsius = temperatureCelsius;
    this.temperatureFahrenheit = temperatureFahrenheit;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}
