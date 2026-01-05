import { Request, Response } from 'express';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';


export const getClientAccountsController = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;

    const container = getContainer();

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
