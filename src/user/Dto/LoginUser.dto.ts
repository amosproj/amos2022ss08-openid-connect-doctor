import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  user_email: string;

  @IsNotEmpty()
  user_password: string;
}
