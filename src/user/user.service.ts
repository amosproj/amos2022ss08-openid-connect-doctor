import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './Dto/LoginUser.dto';

@Injectable()
export class UserService {
  login(loginUserDto: LoginUserDto): string {
    return 'Login Successful';
  }
}
