import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth.dto';
import { PublicRoute } from '../decorator/public-route.decorator';
import { AccessTokenResponseDto } from './dto/access-token.response.dto';
import { AuthCredentialResponseDto } from './dto/auth-crential.response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @Post('/signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiBody({ type: AuthCredentialsDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: AuthCredentialResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to create the account',
  })
  async signUp(@Body() createUserDto: AuthCredentialsDto) {
    const user = await this.authService.register(createUserDto);
    if (!user) {
      throw new InternalServerErrorException('Failed to create the account');
    }
    return plainToInstance(AuthCredentialResponseDto, user);
  }

  @PublicRoute()
  @Post('/signin')
  @ApiOperation({
    summary: 'Sign in with user credentials and receive an access token',
  })
  @ApiBody({ type: AuthCredentialsDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully signed in',
    type: AccessTokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<AccessTokenResponseDto> {
    const accessToken = await this.authService.login(authCredentialsDto);
    return plainToInstance(AccessTokenResponseDto, accessToken);
  }
}
