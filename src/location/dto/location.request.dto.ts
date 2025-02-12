import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class LocationRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  @MaxLength(100, { message: 'City name is too long (max 255 characters)' })
  city: string;
}
