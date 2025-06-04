import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, { message: 'Password must be alphanumeric' })
  password: string;
}