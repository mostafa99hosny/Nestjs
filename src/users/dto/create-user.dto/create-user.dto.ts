import { IsEmail, IsString, MinLength, Matches, Min, Max, Length } from 'class-validator';
import { UserRole } from '../../schemas/user/user';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, { message: 'Password must be alphanumeric' })
  password: string;

  @IsString()
  fullName: string;

  @Min(16)
  @Max(60)
  age: number;

  @Length(11)
  @Matches(/^01/, { message: 'Mobile number must start with 01' })
  mobileNumber: string;

  role?: UserRole;
}