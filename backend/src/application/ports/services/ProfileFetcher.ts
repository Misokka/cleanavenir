import { randomUUID } from "node:crypto";
import { Advisor } from "../../../domain/entities/Advisor";
import { Client } from "../../../domain/entities/Client";
import { Director } from "../../../domain/entities/Director";
import { InvalidRoleError } from "../../../domain/errors/InvalidRoleError";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import { err, ok, Result } from "../../../shared/Result";
import { UserRole } from "../../dtos/UserDTO";
import { AdvisorRepository } from "../repositories/AdvisorRepository";
import { ClientRepository } from "../repositories/ClientRepository";
import { DirectorRepository } from "../repositories/DirectorRepository";


type Profile = Client | Director | Advisor;

export class ProfileManager {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly directorRepository: DirectorRepository,
    private readonly advisorRepository: AdvisorRepository
  ) {}

  public async fetch(
    userIdentifier: string,
    role: UserRole
  ): Promise<Result<Profile, Error>> {
    let profileResult: Result<Profile, Error>;

    switch (role) {
      case 'CLIENT':
        profileResult = await this.clientRepository.findByUserId(userIdentifier);
        break;
      case 'DIRECTOR':
        profileResult = await this.directorRepository.findByUserId(userIdentifier);
        break;
      case 'ADVISOR':
        profileResult = await this.advisorRepository.findByUserId(userIdentifier);
        break;
      default:
        // Gérer le cas où le rôle n'a pas de profil associé
        return err(new UserNotFoundError(userIdentifier));
        
    }

    if (!profileResult.ok) {
      return err(profileResult.error);
    }

    return ok(profileResult.value);
  }

  public async create(
    userIdentifier: string,
    role: UserRole,
    advisorIdentifier?: string
  ): Promise<Result<Profile, Error>>{

    let newProfile;

    switch(role){
      case "CLIENT":
        const newClient = Client.create({clientIdentifier: randomUUID(), userIdentifier, advisorIdentifier: advisorIdentifier as string});
        newProfile = await this.clientRepository.save(newClient);
        break;
      
      case "ADVISOR":
        const newAdvisor = Advisor.create({advisorIdentifier: randomUUID(), userIdentifier});
        newProfile = await this.advisorRepository.save(newAdvisor);
        break;
      
      case "DIRECTOR":
        const newDirector = Director.create({directorIdentifier: randomUUID(), userIdentifier});
        newProfile = await this.directorRepository.save(newDirector);
        break;
      
      default:
        return err(new InvalidRoleError(role));
    }

    if(!newProfile.ok){
      return err(newProfile.error);
    }

    return ok(newProfile.value);
  }
}