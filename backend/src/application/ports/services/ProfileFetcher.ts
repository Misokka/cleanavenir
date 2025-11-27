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
  ): Promise<Result<Profile, UserNotFoundError>> {
    let profileResult: Result<Profile, Error>;

    switch (role) {
      case 'CLIENT':
        profileResult = await this.clientRepository.findById(userIdentifier);
        break;
      case 'DIRECTOR':
        profileResult = await this.directorRepository.findById(userIdentifier);
        break;
      case 'ADVISOR':
        profileResult = await this.advisorRepository.findById(userIdentifier);
        break;
      default:
        // Gérer le cas où le rôle n'a pas de profil associé
        return err(new UserNotFoundError(userIdentifier));
    }

    if (!profileResult.ok) {
      return err(new UserNotFoundError(userIdentifier));
    }

    return ok(profileResult.value);
  }

  public async create(
    userIdentifier: string,
    firstname: string,
    lastname: string,
    email: string,
    role: UserRole
  ): Promise<Result<Profile, Error>>{

    let newProfile;

    switch(role){
      case "CLIENT":
        const newClient = new Client(userIdentifier, firstname, lastname, email);
        newProfile = await this.clientRepository.save(newClient);
        break;
      
      case "ADVISOR":
        const newAdvisor = new Advisor(userIdentifier);
        newProfile = await this.advisorRepository.save(newAdvisor);
        break;
      
      case "DIRECTOR":
        const newDirector = new Director(userIdentifier);
        newProfile = await this.directorRepository.save(newDirector);
        break;
      
      default:
        return err(new InvalidRoleError(userIdentifier));
    }

    if(!newProfile.ok){
      return err(newProfile.error);
    }

    return ok(newProfile.value);
  }
}