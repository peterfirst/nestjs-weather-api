import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserRequestDtoGql {
  @Field()
  username: string;

  @Field()
  password: string;
}
