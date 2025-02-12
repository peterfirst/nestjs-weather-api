import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { WeatherService } from './weather.service';
import { WeatherApiService } from './weather-api.service';
import { WeatherCityDto } from './dto/weather-city.dto';
import { WeatherForecastCityDto } from './dto/weather-forecast.dto';
import { WeatherCityApiResponseDto } from './dto/weather-city-api-response.dto';
import { WeatherCityForecastApiResponseDto } from './dto/weather-city-forecast-api-response.dto';
import { AxiosError } from 'axios';

describe('WeatherService', () => {
  let service: WeatherService;
  let weatherApiService: WeatherApiService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'WEATHER_API_KEY') return 'test-api-key';
      if (key === 'WEATHER_API_URL') return 'http://test-api-url';
      return null;
    }),
  };

  const mockWeatherApiService = {
    fetchWeatherCity: jest.fn(),
    fetchForecastCity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: WeatherApiService, useValue: mockWeatherApiService },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    weatherApiService = module.get<WeatherApiService>(WeatherApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return weather data for a city', async () => {
      const city = 'Dubai';
      const weatherApiResponse: WeatherCityApiResponseDto = {
        location: { city: 'Dubai', country: 'UAE' },
        current: {
          temp_c: 30,
          temp_f: 86,
          humidity: 50,
          wind_kph: 10,
        },
      };

      mockWeatherApiService.fetchWeatherCity.mockResolvedValue(
        weatherApiResponse,
      );

      const result = await service.getWeather(city);

      expect(result).toEqual(new WeatherCityDto(city, 'UAE', 30, 86, 50, 10));
      expect(mockWeatherApiService.fetchWeatherCity).toHaveBeenCalledWith(city);
    });

    it('should throw an error if fetching weather data fails', async () => {
      const city = 'Dubai';
      mockWeatherApiService.fetchWeatherCity.mockRejectedValue(
        new Error('API Error'),
      );

      await expect(service.getWeather(city)).rejects.toThrow(AxiosError);
      expect(mockWeatherApiService.fetchWeatherCity).toHaveBeenCalledWith(city);
    });
  });

  describe('getForecast', () => {
    it('should return forecast data for a city', async () => {
      const city = 'Dubai';
      const forecastApiResponse: WeatherCityForecastApiResponseDto = {
        location: { city: 'Dubai', country: 'UAE' },
        forecast: {
          forecastday: [
            {
              date: '2023-10-01',
              day: {
                avgtemp_c: 30,
                avgtemp_f: 86,
                avghumidity: 50,
                maxwind_kph: 10,
              },
            },
          ],
        },
      };

      mockWeatherApiService.fetchForecastCity.mockResolvedValue(
        forecastApiResponse,
      );

      const result = await service.getForecast(city);

      expect(result).toEqual(
        new WeatherForecastCityDto(city, 'UAE', [
          {
            date: '2023-10-01',
            temperatureCelsius: 30,
            temperatureFahrenheit: 86,
            humidity: 50,
            windSpeed: 10,
          },
        ]),
      );
      expect(mockWeatherApiService.fetchForecastCity).toHaveBeenCalledWith(
        city,
      );
    });

    it('should throw an error if fetching forecast data fails', async () => {
      const city = 'Dubai';
      mockWeatherApiService.fetchForecastCity.mockRejectedValue(
        new Error('API Error'),
      );

      await expect(service.getForecast(city)).rejects.toThrow(AxiosError);
      expect(mockWeatherApiService.fetchForecastCity).toHaveBeenCalledWith(
        city,
      );
    });
  });
});
