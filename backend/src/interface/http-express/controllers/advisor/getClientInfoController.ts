import { Request, Response } from 'express';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const getClientInfoController = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    const userId = req.userId!;

    const container = getContainer();
    
    const advisorResult = await container.repositories.advisor.findByUserId(userId);
    if (!advisorResult.ok) {
      return res.status(403).json({
        message: 'Accès non autorisé: conseiller introuvable',
      });
    }
    const advisorId = advisorResult.value.advisorIdentifier;

    const clientResult = await container.repositories.client.findById(clientId);
    
    if (!clientResult.ok) {
      return res.status(404).json({
        message: 'Client non trouvé',
        error: clientResult.error.message,
      });
    }

    const client = clientResult.value;

    const isClientAssignedToAdvisor = client.advisorIdentifier === advisorId;
    
    if (!isClientAssignedToAdvisor) {
      const loansResult = await container.repositories.loan.findByStatus('PENDING');
      const hasPendingLoan = loansResult.ok && 
        loansResult.value.some(loan => loan.clientIdentifier === clientId);
      
      if (!hasPendingLoan) {
        return res.status(403).json({
          message: 'Accès non autorisé: ce client ne vous est pas attribué et n\'a pas de prêt en attente',
        });
      }
    }

    const userResult = await container.repositories.user.findById(client.userIdentifier);
    
    if (!userResult.ok) {
      return res.status(404).json({
        message: 'Utilisateur du client non trouvé',
      });
    }

    const user = userResult.value;

    return res.status(200).json({
      clientId: client.clientIdentifier,
      userId: user.userIdentifier,
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des infos du client:', error);
    return res.status(500).json({
      message: 'Erreur serveur',
      error: error.message,
    });
  }
};
