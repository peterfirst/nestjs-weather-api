import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherApiService } from './weather-api.service';
import { WeatherCityDto } from './dto/weather-city.dto';
import { WeatherForecastCityDto } from './dto/weather-forecast.dto';
import { WeatherCityApiResponseDto } from './dto/weather-city-api-response.dto';
import { WeatherCityForecastApiResponseDto } from './dto/weather-city-forecast-api-response.dto';
import { AxiosError } from 'axios';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly weatherApiService: WeatherApiService,
  ) {
    this.apiKey = this.configService.get<string>('WEATHER_API_KEY') || '';
    this.apiUrl = this.configService.get<string>('WEATHER_API_URL') || '';
  }

  private mapCityWeatherResponse(
    data: WeatherCityApiResponseDto,
    city: string,
  ): WeatherCityDto {
    return new WeatherCityDto(
      city,
      data.location.country,
      data.current.temp_c,
      data.current.temp_f,
      data.current.humidity,
      data.current.wind_kph,
    );
  }

  private mapCityForecastResponse(
    data: WeatherCityForecastApiResponseDto,
    city: string,
  ): WeatherForecastCityDto {
    return new WeatherForecastCityDto(
      city,
      data.location.country,
      data.forecast.forecastday.map((day) => ({
        date: day.date,
        temperatureCelsius: day.day.avgtemp_c,
        temperatureFahrenheit: day.day.avgtemp_f,
        humidity: day.day.avghumidity,
        windSpeed: day.day.maxwind_kph,
      })),
    );
  }

  async getWeather(city: string): Promise<WeatherCityDto> {
    try {
      const data = await this.weatherApiService.fetchWeatherCity(city);
      return this.mapCityWeatherResponse(data, city);
    } catch (error) {
      this.logger.error(`Error fetching weather for ${city}`, error);
      throw new AxiosError('Error fetching weather data');
    }
  }

  async getForecast(city: string): Promise<WeatherForecastCityDto> {
    try {
      const data = await this.weatherApiService.fetchForecastCity(city);
      return this.mapCityForecastResponse(data, city);
    } catch (error) {
      this.logger.error(`Error fetching forecast for ${city}`, error);
      throw new AxiosError('Error fetching forecast data');
    }
  }
}
