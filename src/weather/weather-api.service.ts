import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { firstValueFrom } from 'rxjs';
import { AppConstants } from '../app/app.constants';
import { WeatherCityApiResponseDto } from './dto/weather-city-api-response.dto';
import { WeatherCityForecastApiResponseDto } from './dto/weather-city-forecast-api-response.dto';

@Injectable()
export class WeatherApiService {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.apiKey = this.configService.get<string>('WEATHER_API_KEY', '');
    this.apiUrl = this.configService.get<string>('WEATHER_API_URL', '');
  }

  private async fetchCacheApi<T>(
    endpointWithParams: string,
    city: string,
  ): Promise<T> {
    try {
      const url = `${this.apiUrl}/${endpointWithParams}&key=${this.apiKey}&q=${city}`;

      const cachedData = await this.cacheManager.get(url);
      if (cachedData) {
        this.logger.info('WeatherApiService: cache hit');
        return cachedData as T;
      }

      const response = await firstValueFrom(this.httpService.get<T>(url));

      const data = response.data;

      await this.cacheManager.set(
        url,
        data,
        AppConstants.ONE_HOUR_IN_MILLISECONDS,
      );

      return data;
    } catch {
      throw new AxiosError('Error fetching data from external API');
    }
  }

  async fetchWeatherCity(city: string): Promise<WeatherCityApiResponseDto> {
    try {
      return this.fetchCacheApi<WeatherCityApiResponseDto>(
        'current.json?lang=en',
        city,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching city weather data',
        {
          cause: error,
          description:
            'This error happened while fetching city weather form the external API',
        },
      );
    }
  }

  async fetchForecastCity(
    city: string,
  ): Promise<WeatherCityForecastApiResponseDto> {
    try {
      return this.fetchCacheApi<WeatherCityForecastApiResponseDto>(
        'forecast.json?lang=en&days=5',
        city,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching city forcast data',
        {
          cause: error,
          description:
            'This error happened while fetching city forecast form the external API',
        },
      );
    }
  }
}
