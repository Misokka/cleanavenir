import { err, ok, Result } from "../../../../shared/Result";
import { UserRepository } from "../../../ports/repositories/UserRepository";
import { ProfileManager } from "../../../ports/services/ProfileFetcher";
import { User } from "../../../../domain/entities/User";
import { Client } from "../../../../domain/entities/Client";
import { Director } from "../../../../domain/entities/Director";
import { Advisor } from "../../../../domain/entities/Advisor";

type RefreshTokenResult = {
  user: User;
  profile: Client | Director | Advisor;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileManager: ProfileManager,
  ) {}

  async execute(userId: string): Promise<Result<RefreshTokenResult, Error>> {
    if (!userId || userId.length < 1) {
      return err(new Error("User ID is required"));
    }

    const userResult = await this.userRepository.findById(userId);

    if (!userResult.ok) {
      return err(new Error("User not found"));
    }

    const user = userResult.value;

    const profileResult = await this.profileManager.fetch(user.userIdentifier, user.role);

    if (!profileResult.ok) {
      return err(profileResult.error);
    }

    return ok({
      user: user,
      profile: profileResult.value
    });
  }
}
