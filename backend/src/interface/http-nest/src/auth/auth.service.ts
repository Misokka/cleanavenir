import { Inject, Injectable } from "@nestjs/common";
import { DI_CONTAINER } from "../../../../shared/constants/di_container";
import type { PrismaContainer } from "../../../../infrastructure/prismaBootstrap/prismaContainer";

@Injectable()
export class AuthService {
  constructor(
    @Inject(DI_CONTAINER) private readonly prismaContainer: PrismaContainer
  ){}

  async register(userIdentifier: string){
    
  }

  async create(){

  }
}