import { Expose } from 'class-transformer';

export class LocationResponseDto {
  @Expose()
  id: string;

  @Expose()
  city: string;

  @Expose()
  country: string;

  @Expose()
  temperatureCelsius: number;

  @Expose()
  temperatureFahrenheit: number;

  @Expose()
  windSpeed: number;

  @Expose()
  humidity: number;
}
