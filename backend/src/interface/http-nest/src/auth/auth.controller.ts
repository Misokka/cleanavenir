import { Body, Controller, Get, Post } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ){}

  @Post('/register')
  async create(@Body() registerUserDto: RegisterUserDto) {
    return "you get all users"
  }
}