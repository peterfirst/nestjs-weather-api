import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAllById(id: string): Promise<User[]> {
    return await this.userRepository.findAllbyId(id);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const existUser = userData.username
      ? await this.userRepository.findByUsername(userData.username)
      : null;

    if (existUser) {
      return existUser;
    }

    const newUser = await this.userRepository.createUser(userData);

    if (!newUser) {
      throw new InternalServerErrorException('User creation failed');
    }

    return newUser;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const updatedUser = await this.userRepository.updateUser(id, userData);
    if (!updatedUser) {
      throw new InternalServerErrorException('User update failed');
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<User> {
    const deletedUser = await this.userRepository.deleteUser(id);
    if (!deletedUser) {
      throw new InternalServerErrorException('User deletion failed');
    }
    return deletedUser;
  }
}
