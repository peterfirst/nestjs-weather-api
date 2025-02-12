import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Location } from './location.entity';

@Injectable()
export class LocationRepository {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async createLocation(locationData: Location): Promise<Location | null> {
    await this.locationRepository
      .createQueryBuilder()
      .insert()
      .into(Location)
      .values(locationData)
      .orIgnore()
      .execute();
    return this.locationRepository.findOne({
      where: { city: locationData.city, country: locationData.country },
    });
  }

  async saveLocation(location: Location): Promise<Location | null> {
    return this.locationRepository.save(location);
  }

  async updateLocation(location: Location): Promise<UpdateResult> {
    return this.locationRepository.update(
      { city: location.city, country: location.country },
      location,
    );
  }

  async getLocationByUserId(userId: string): Promise<Location[]> {
    return await this.locationRepository
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async deleteLocation(id: string): Promise<Location | null> {
    const location: Location | null = await this.locationRepository.findOne({
      where: { id },
    });
    if (!location) {
      return null;
    }
    await this.locationRepository.delete(id);
    return location;
  }

  async getAllLocation(): Promise<Location[]> {
    return this.locationRepository.find();
  }
}
