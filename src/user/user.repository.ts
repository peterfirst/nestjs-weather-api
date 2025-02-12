import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAllbyId(id: string): Promise<User[]> {
    return this.userRepository.find({ where: { id } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async createUser(user: Partial<User>): Promise<User | null> {
    const { username = '', password = '' } = user;
    const newUser = new User(username, password);

    await this.userRepository.upsert(newUser, ['username']);

    return this.findByUsername(username);
  }

  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, user);
    return this.findById(id);
  }

  async deleteUser(id: string): Promise<User | null> {
    const userDelete = this.findById(id);
    await this.userRepository.delete(id);
    return userDelete;
  }
}
