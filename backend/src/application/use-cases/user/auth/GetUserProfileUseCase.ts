import { Result } from '../../../../shared/Result';
import { UserRepository } from '../../../ports/repositories/UserRepository';
import { UserNotFoundError } from '../../../../domain/errors/UserNotFoundError';
import { User } from '../../../../domain/entities/User';

export class GetUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<Result<User, UserNotFoundError>> {
    return this.userRepository.findById(userId);
  }
}
