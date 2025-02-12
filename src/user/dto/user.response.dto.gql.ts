import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class UserReponseDtoGql {
  @Expose()
  @Field(() => ID)
  id: string;

  @Expose()
  @Field()
  username: string;
}
