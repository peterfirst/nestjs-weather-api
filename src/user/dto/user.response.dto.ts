import { Expose } from 'class-transformer';

export class UserReponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;
}
