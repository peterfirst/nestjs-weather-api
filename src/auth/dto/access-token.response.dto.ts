import { Expose } from 'class-transformer';

export class AccessTokenResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  expiresIn: string;

  // constructor(accessToken: string, expiresIn: string) {
  //   this.accessToken = accessToken;
  //   this.expiresIn = expiresIn;
  // }
}
