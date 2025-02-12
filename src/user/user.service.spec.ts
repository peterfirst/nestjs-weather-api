import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { InternalServerErrorException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const userId = '1';
      const username = 'jonny';
      const expectedUser = new User(userId, username);
      jest.spyOn(repository, 'findById').mockResolvedValue(expectedUser);

      const result = await service.findById(userId);
      expect(result).toEqual(expectedUser);
      expect(repository.findById).toHaveBeenCalledWith(userId);
    });

    it('should return null if user not found', async () => {
      const userId = '1';
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      const result = await service.findById(userId);
      expect(result).toBeNull();
      expect(repository.findById).toHaveBeenCalledWith(userId);
    });

    describe('UserService', () => {
      let service: UserService;
      let repository: UserRepository;

      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            UserService,
            {
              provide: UserRepository,
              useValue: {
                findAllbyId: jest.fn(),
                findById: jest.fn(),
                findByUsername: jest.fn(),
                createUser: jest.fn(),
                updateUser: jest.fn(),
                deleteUser: jest.fn(),
              },
            },
          ],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get<UserRepository>(UserRepository);
      });

      describe('findById', () => {
        it('should return a user if found', async () => {
          const userId = '1';
          const username = 'jonny';
          const expectedUser = new User(userId, username);
          jest.spyOn(repository, 'findById').mockResolvedValue(expectedUser);

          const result = await service.findById(userId);
          expect(result).toEqual(expectedUser);
          expect(repository.findById).toHaveBeenCalledWith(userId);
        });

        it('should return null if user not found', async () => {
          const userId = '1';
          jest.spyOn(repository, 'findById').mockResolvedValue(null);

          const result = await service.findById(userId);
          expect(result).toBeNull();
          expect(repository.findById).toHaveBeenCalledWith(userId);
        });
      });

      describe('findAllById', () => {
        it('should return an array of users', async () => {
          const userId = '1';
          const users = [new User(userId, 'jonny')];
          jest.spyOn(repository, 'findAllbyId').mockResolvedValue(users);

          const result = await service.findAllById(userId);
          expect(result).toEqual(users);
          expect(repository.findAllbyId).toHaveBeenCalledWith(userId);
        });
      });

      describe('findByUsername', () => {
        it('should return a user if found', async () => {
          const username = 'jonny';
          const expectedUser = new User('1', username);
          jest.spyOn(repository, 'findByUsername').mockResolvedValue(expectedUser);

          const result = await service.findByUsername(username);
          expect(result).toEqual(expectedUser);
          expect(repository.findByUsername).toHaveBeenCalledWith(username);
        });

        it('should return null if user not found', async () => {
          const username = 'jonny';
          jest.spyOn(repository, 'findByUsername').mockResolvedValue(null);

          const result = await service.findByUsername(username);
          expect(result).toBeNull();
          expect(repository.findByUsername).toHaveBeenCalledWith(username);
        });
      });

      describe('createUser', () => {
        it('should return the existing user if username already exists', async () => {
          const userData = { username: 'jonny' };
          const existingUser = new User('1', 'jonny');
          jest.spyOn(repository, 'findByUsername').mockResolvedValue(existingUser);

          const result = await service.createUser(userData);
          expect(result).toEqual(existingUser);
          expect(repository.findByUsername).toHaveBeenCalledWith(userData.username);
        });

        it('should create and return a new user if username does not exist', async () => {
          const userData = { username: 'jonny' };
          const newUser = new User('1', 'jonny');
          jest.spyOn(repository, 'findByUsername').mockResolvedValue(null);
          jest.spyOn(repository, 'createUser').mockResolvedValue(newUser);

          const result = await service.createUser(userData);
          expect(result).toEqual(newUser);
          expect(repository.createUser).toHaveBeenCalledWith(userData);
        });

        it('should throw an error if user creation fails', async () => {
          const userData = { username: 'jonny' };
          jest.spyOn(repository, 'findByUsername').mockResolvedValue(null);
          jest.spyOn(repository, 'createUser').mockResolvedValue(null);

          await expect(service.createUser(userData)).rejects.toThrow(InternalServerErrorException);
        });
      });

      describe('updateUser', () => {
        it('should update and return the user', async () => {
          const userId = '1';
          const userData = { username: 'jonny' };
          const updatedUser = new User(userId, 'jonny');
          jest.spyOn(repository, 'updateUser').mockResolvedValue(updatedUser);

          const result = await service.updateUser(userId, userData);
          expect(result).toEqual(updatedUser);
          expect(repository.updateUser).toHaveBeenCalledWith(userId, userData);
        });

        it('should throw an error if user update fails', async () => {
          const userId = '1';
          const userData = { username: 'jonny' };
          jest.spyOn(repository, 'updateUser').mockResolvedValue(null);

          await expect(service.updateUser(userId, userData)).rejects.toThrow(InternalServerErrorException);
        });
      });

      describe('deleteUser', () => {
        it('should delete and return the user', async () => {
          const userId = '1';
          const deletedUser = new User(userId, 'jonny');
          jest.spyOn(repository, 'deleteUser').mockResolvedValue(deletedUser);

          const result = await service.deleteUser(userId);
          expect(result).toEqual(deletedUser);
          expect(repository.deleteUser).toHaveBeenCalledWith(userId);
        });

        it('should throw an error if user deletion fails', async () => {
          const userId = '1';
          jest.spyOn(repository, 'deleteUser').mockResolvedValue(null);

          await expect(service.deleteUser(userId)).rejects.toThrow(InternalServerErrorException);
        });
      });
    });
  });
});
