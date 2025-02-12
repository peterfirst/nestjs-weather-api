import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Location } from './location.entity';
import { LocationRepository } from './location.repository';
import { UserRepository } from '../user/user.repository';
import { WeatherService } from '../weather/weather.service';
import { LocationResponseDto } from './dto/location.response.dto';
import { WeatherCityDto } from '../weather/dto/weather-city.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LocationService {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly userRepository: UserRepository,
    private readonly weatherService: WeatherService,
  ) {}

  async createLocation(city: string, userId: string): Promise<Location> {
    const weather = await this.weatherService.getWeather(city);

    if (!weather) {
      throw new NotFoundException(`Weather not found`);
    }

    const locationData: Location = {
      city,
      country: weather.country,
      temperatureCelsius: weather.temperatureCelsius,
      temperatureFahrenheit: weather.temperatureFahrenheit,
      windSpeed: weather.windSpeed,
      humidity: weather.humidity,
    };
    const locationCreated =
      await this.locationRepository.createLocation(locationData);
    if (!locationCreated) {
      throw new InternalServerErrorException('Location creation failed');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User: ${userId} not found`);
    }
    locationCreated.users = [user];

    try {
      await this.locationRepository.saveLocation(locationCreated);
    } catch (error: any) {
      if (error.code === '23505') {
        return plainToInstance(LocationResponseDto, locationData);
      }

      throw new InternalServerErrorException('Location save failed');
    }

    return plainToInstance(LocationResponseDto, locationCreated);
  }

  async getLocations(userId: string): Promise<Location[]> {
    return this.locationRepository.getLocationByUserId(userId);
  }

  async removeLocation(id: string): Promise<Location> {
    const location = await this.locationRepository.deleteLocation(id);
    if (!location) {
      throw new NotFoundException(`Location: ${id} not found`);
    }
    return location;
  }

  async updateWeatherForFavorites() {
    const locations = await this.locationRepository.getAllLocation();
    for (const location of locations) {
      try {
        const weatherData: WeatherCityDto =
          await this.weatherService.getWeather(location.city);

        await this.locationRepository.updateLocation(weatherData);
      } catch (error) {
        throw new InternalServerErrorException(
          `Failed to update weather for ${location.city}`,
          {
            cause: error,
          },
        );
      }
    }
  }
}
