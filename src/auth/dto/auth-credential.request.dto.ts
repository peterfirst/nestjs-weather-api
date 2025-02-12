import { IsString, IsNotEmpty } from 'class-validator';

export class AuthCredentialRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
