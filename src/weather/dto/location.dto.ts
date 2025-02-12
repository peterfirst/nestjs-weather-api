import { Expose } from 'class-transformer';

export class LocationDto {
  @Expose({ name: 'name' })
  city: string;

  @Expose({ name: 'country' })
  country: string;
}
