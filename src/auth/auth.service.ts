import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AppConstants } from '../app/app.constants';
import { User } from '../user/user.entity';
import { UserRequestDto } from '../user/dto/user.request.dto';
import { AccessToken } from './interfaces/access-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && user.username === username) {
      return user;
    }
    return null;
  }

  async login(user: {
    username: string;
    password: string;
  }): Promise<AccessToken> {
    const foundUser = await this.userService.findByUsername(user.username);

    if (!foundUser) {
      throw new UnauthorizedException('Access deined', {
        cause: new Error(),
        description: 'Access denied',
      });
    }

    const payload: JwtPayload = {
      username: foundUser.username,
      userId: foundUser.id,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken, expiresIn: AppConstants.ONE_HOUR };
  }

  async register(user: UserRequestDto): Promise<User> {
    return this.userService.createUser(user);
  }
}
