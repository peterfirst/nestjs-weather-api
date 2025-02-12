import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger'; // Import necessary decorators
import { plainToInstance } from 'class-transformer';
import { UserService } from './user.service';
import { UserRequestDto } from './dto/user.request.dto';
import { UserReponseDto } from './dto/user.response.dto';
import { AuthenticatedUser } from '../decorator/authenticated-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: UserRequestDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserReponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(
    @Body() UserRequestDto: UserRequestDto,
  ): Promise<UserReponseDto> {
    const user = await this.userService.createUser(UserRequestDto);
    return plainToInstance(UserReponseDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Find authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserReponseDto,
    isArray: true,
  })
  async findAUthenticatedUser(
    @AuthenticatedUser() authenticatedUser: JwtPayload,
  ): Promise<UserReponseDto[]> {
    const user = await this.userService.findAllById(authenticatedUser.userId);
    return plainToInstance(UserReponseDto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserReponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<UserReponseDto> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }
    return plainToInstance(UserReponseDto, user);
  }
}
