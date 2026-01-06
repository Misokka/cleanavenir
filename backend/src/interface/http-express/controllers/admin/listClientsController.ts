import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { toUserDTO } from '../../mappers/dtoMappers';
import { ClientWithUserProfileDTO } from '../../../../application/dtos/ClientWithUserProfileDTO';
import { User } from '../../../../domain/entities/User';

export const listClientsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const container = getContainer();
    const clientRepository = container.repositories.client;
    const userRepository = container.repositories.user;

    // Récupérer tous les clients
    const clientResult = await clientRepository.all();

    if (!clientResult.ok) {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: clientResult.error.message,
      });
      return;
    }

    const clients = clientResult.value;

    const userResult = await userRepository.listByRole("CLIENT");

    if(!userResult.ok){
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: userResult.error.message,
      });
      return
    }

    const users = userResult.value

    // Filtrer le compte SYSTEM
    const filteredUsers = users.filter(user => 
      !(user.firstname === 'SYSTEM' && user.lastname === 'SYSTEM')
    );

    const clientsWithUserArr: ClientWithUserProfileDTO[] = clients
      .filter(client => {
        const clientUser = filteredUsers.find((user) => client.userIdentifier === user.userIdentifier);
        return clientUser !== undefined; // Exclure les clients sans utilisateur (SYSTEM)
      })
      .map((client) => {
        const clientUser = filteredUsers.find((user) => client.userIdentifier === user.userIdentifier) as User;
        return {
          id: client.clientIdentifier,
          userId: client.userIdentifier,
          user: toUserDTO(clientUser)
        }
      });

    res.json({
      clients: clientsWithUserArr
    });
  }
);
