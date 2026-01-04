import { UserRepository } from "../../../ports/repositories/UserRepository";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";
import { err, ok, Result } from "../../../../shared/Result";


export class DeleteClientByDirectorUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  public async execute(userId: string): Promise<Result<boolean, Error>> {
    
    const userResult = await this.userRepository.findById(userId);
    if (!userResult.ok) {
      return err(new Error("Utilisateur introuvable"));
    }

    const user = userResult.value;

    if (user.role !== "CLIENT") {
      return err(new Error("Seuls les comptes clients peuvent être supprimés via cette interface"));
    }

    const clientResult = await this.clientRepository.findByUserId(userId);
    if (!clientResult.ok) {
      return err(new Error("Profile client introuvable"));
    }

    const deleteClientResult = await this.clientRepository.delete(clientResult.value.clientIdentifier);
    if (!deleteClientResult.ok) {
      return err(new Error("Erreur lors de la suppression du profil client"));
    }

    const deleteResult = await this.userRepository.delete(user.userIdentifier);
    if (!deleteResult.ok) {
      return err(new Error("Erreur lors de la suppression de l'utilisateur"));
    }

    return ok(true);
  }
}
