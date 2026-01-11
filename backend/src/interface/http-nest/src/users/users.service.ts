import { Inject, Injectable } from "@nestjs/common";
import { DI_CONTAINER } from "../../../../shared/constants/di_container";
import type { PrismaContainer } from "../../../../infrastructure/prismaBootstrap/prismaContainer";
import { UserRole } from "../../../../domain/entities/User";

@Injectable()
export class UsersService{
  constructor(
    @Inject(DI_CONTAINER) private readonly prismaContainer: PrismaContainer
  ){}

  async getUsersByRole(role: UserRole){
    const usersResult = await this.prismaContainer.repositories.user.listByRole(role);
    if(!usersResult.ok) return usersResult.error
    return usersResult.value
  }
}