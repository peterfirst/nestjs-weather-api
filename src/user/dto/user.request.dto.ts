import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class UserRequestDto {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message:
      'The value should contain only alphabets, numbers, underscore or hypen',
  })
  username: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
