import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserRequestDtoGql } from './dto/user.request.dto.gql';
import { UserReponseDtoGql } from './dto/user.response.dto.gql';
import { plainToInstance } from 'class-transformer';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should create a user and return the user response', async () => {
      const userData: UserRequestDtoGql = {
        username: 'jonny',
        password: 'jonny007',
      };
      const createdUser = {
        id: '007',
        username: 'jonny',
        password: 'jonny007',
        createdAt: new Date(),
        updatedAt: new Date(),
        locations: [],
        hashPassword: jest.fn(),
      };
      const expectedResponse = plainToInstance(UserReponseDtoGql, createdUser);

      jest.spyOn(userService, 'createUser').mockResolvedValue(createdUser);

      const result = await resolver.createUser(userData);

      expect(userService.createUser).toHaveBeenCalledWith(userData);
      expect(result).toEqual(expectedResponse);
    });
  });
});
