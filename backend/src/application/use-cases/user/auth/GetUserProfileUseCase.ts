import { Result } from '../../../../shared/Result';
import { UserRepository } from '../../../ports/repositories/UserRepository';
import { UserNotFoundError } from '../../../../domain/errors/UserNotFoundError';

export class GetUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<Result<any, UserNotFoundError>> {
    return this.userRepository.findById(userId);
  }
}
