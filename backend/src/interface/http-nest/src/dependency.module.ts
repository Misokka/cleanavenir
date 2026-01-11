import { Global, Module } from "@nestjs/common";
import { DI_CONTAINER } from "../../../shared/constants/di_container";
import { getPrismaContainer } from "../../../infrastructure/prismaBootstrap/instance";

@Global()
@Module({
  providers: [
    {
      provide: DI_CONTAINER, 
      useFactory: () => {
        return getPrismaContainer();
      },
    },
  ],
  exports: [DI_CONTAINER], // On exporte le token
})
export class DependencyModule {}