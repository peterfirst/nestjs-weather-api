// forecast-response.dto.ts
import { LocationDto } from './location.dto';
import { ForecastDto } from './forecast.dto';

export class WeatherCityForecastApiResponseDto {
  location: LocationDto;
  forecast: ForecastDto;
}
