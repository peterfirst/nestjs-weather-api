import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { UserRequestDto } from '../user/dto/user.request.dto';
import { AppConstants } from '../app/app.constants';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByUsername: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return the user if found', async () => {
      const user = { username: 'testuser' };
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(user as User);

      expect(await authService.validateUser('testuser')).toBe(user);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(null);

      expect(await authService.validateUser('testuser')).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token if user is found', async () => {
      const user: User = {
        id: '007',
        username: 'jonny',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        locations: [],
        hashPassword: jest.fn(),
      };
      const accessToken = 'accessToken';
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(user);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(accessToken);

      expect(
        await authService.login({ username: 'testuser', password: 'password' }),
      ).toEqual({
        accessToken,
        expiresIn: AppConstants.ONE_HOUR,
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(null);

      await expect(
        authService.login({ username: 'testuser', password: 'password' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create and return the user', async () => {
      const userDto: UserRequestDto = {
        username: 'testuser',
        password: 'password',
      };
      const user: User = {
        id: '1',
        username: 'testuser',
        password: 'password',
      } as User;
      jest.spyOn(userService, 'createUser').mockResolvedValue(user);

      expect(await authService.register(userDto)).toBe(user);
    });
  });
});
