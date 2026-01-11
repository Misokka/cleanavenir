import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ){}

  @Get('/role/:role')
  async getUsersByRole(@Param(':role') role: "CLIENT" | "ADVISOR" | "DIRECTOR"){
    const users = await this.usersService.getUsersByRole(role);
    return users
  }
}