import { Request, Response } from 'express';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';


export const getClientAccountsController = async (req: Request, res: Response) => {
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

    const result = await container.repositories.bankAccount.findByOwner(clientId);
    
    if (!result.ok) {
      return res.status(404).json({
        message: 'Client ou comptes non trouvés',
        error: result.error.message,
      });
    }

    const accounts = result.value.map(account => ({
      id: account.accountIdentifier,
      name: account.label,
      iban: account.iban.value,
      balance: account.balance,
    }));

    return res.status(200).json({
      clientId,
      accounts,
      totalBalance: accounts.reduce((sum, acc) => sum + acc.balance, 0),
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des comptes du client:', error);
    return res.status(500).json({
      message: 'Erreur serveur',
      error: error.message,
    });
  }
};
