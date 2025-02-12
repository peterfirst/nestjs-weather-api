import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { UserService } from './user.service';
import { UserRequestDtoGql } from './dto/user.request.dto.gql';
import { UserReponseDtoGql } from './dto/user.response.dto.gql';
import { JwtPayload } from '..//auth/interfaces/jwt-payload.interface';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserReponseDtoGql)
  async createUser(
    @Args('userData') userData: UserRequestDtoGql,
  ): Promise<UserReponseDtoGql> {
    const user = await this.userService.createUser(userData);
    return plainToInstance(UserReponseDtoGql, user);
  }

  @Query(() => [UserReponseDtoGql], { name: 'me' })
  async me(
    @Context() context: { req: { user: JwtPayload } },
  ): Promise<UserReponseDtoGql[]> {
    const user = await this.userService.findAllById(context.req.user.userId);
    return plainToInstance(UserReponseDtoGql, user);
  }

  @Query(() => UserReponseDtoGql)
  async user(@Args('id') id: string): Promise<UserReponseDtoGql> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new Error(`User with id: ${id} not found`);
    }
    return plainToInstance(UserReponseDtoGql, user);
  }
}
