import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherCityDto } from './dto/weather-city.dto';
import { WeatherForecastCityDto } from './dto/weather-forecast.dto';

describe('WeatherController', () => {
  let weatherController: WeatherController;
  let weatherService: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: {
            getWeather: jest.fn(),
            getForecast: jest.fn(),
          },
        },
      ],
    }).compile();

    weatherController = module.get<WeatherController>(WeatherController);
    weatherService = module.get<WeatherService>(WeatherService);
  });

  describe('getWeather', () => {
    it('should return weather data for a city', async () => {
      const city = 'Dubai';
      const result: WeatherCityDto = {
        city,
        country: 'uae',
        temperatureCelsius: 30.2,
        temperatureFahrenheit: 90.1,
        humidity: 70.5,
        windSpeed: 60,
      };
      jest.spyOn(weatherService, 'getWeather').mockResolvedValue(result);

      expect(await weatherController.getWeather(city)).toBe(result);
      expect(weatherService.getWeather).toHaveBeenCalledWith(city);
    });
  });

  describe('getForecast', () => {
    it('should return weather forecast data for a city', async () => {
      const city = 'Dubai';
      const result: WeatherForecastCityDto = {
        city,
        country: 'uae',
        temperature: 35.4,
        forecast: [
          {
            date: '2023-10-01',

            temperatureCelsius: 30.2,
            temperatureFahrenheit: 90.1,
            humidity: 70.5,
            windSpeed: 60,
          },
          {
            date: '2023-10-01',

            temperatureCelsius: 30.2,
            temperatureFahrenheit: 90.1,
            humidity: 70.5,
            windSpeed: 60,
          },
        ],
      };
      jest.spyOn(weatherService, 'getForecast').mockResolvedValue(result);

      expect(await weatherController.getForecast(city)).toBe(result);
      expect(weatherService.getForecast).toHaveBeenCalledWith(city);
    });
  });
});
