import {Body, Controller, Get, Post, Render} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './Dto/LoginUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get('login')
  @Render('login')
  root() {
    return;
  }

}
