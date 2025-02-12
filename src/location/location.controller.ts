import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { LocationService } from './location.service';
import { LocationRequestDto } from './dto/location.request.dto';
import { LocationResponseDto } from './dto/location.response.dto';
import { AuthenticatedUser } from '../decorator/authenticated-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiBody({ type: LocationRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Location successfully created',
    type: LocationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createLocation(
    @Body() locationRequestDto: LocationRequestDto,
    @AuthenticatedUser() authenticatedUser: JwtPayload,
  ): Promise<LocationResponseDto> {
    const locationCreated = await this.locationService.createLocation(
      locationRequestDto.city,
      authenticatedUser.userId,
    );

    return plainToInstance(LocationResponseDto, locationCreated);
  }

  @Get()
  @ApiOperation({ summary: 'Get all locations for authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of locations retrieved successfully',
    type: LocationResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'No locations found' })
  async getLocations(
    @AuthenticatedUser() authenticatedUser: JwtPayload,
  ): Promise<LocationRequestDto[]> {
    const locations = await this.locationService.getLocations(
      authenticatedUser.userId,
    );
    return plainToInstance(LocationResponseDto, locations);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a location by ID' })
  @ApiParam({ name: 'id', description: 'Location ID' })
  @ApiResponse({
    status: 200,
    description: 'Location successfully removed',
    type: LocationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Location not found with the given ID',
  })
  async removeLocation(@Param('id') id: string): Promise<LocationResponseDto> {
    const location = await this.locationService.removeLocation(id);
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return plainToInstance(LocationResponseDto, location);
  }

  @Get('update-all')
  @ApiOperation({
    summary: 'Update weather information for all favorite locations',
  })
  @ApiResponse({
    status: 200,
    description: 'Weather data successfully updated for all favorite locations',
  })
  async updateAll() {
    return this.locationService.updateWeatherForFavorites();
  }
}
