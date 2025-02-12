import { Expose } from 'class-transformer';

export class AuthCredentialResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  password: string;
}
