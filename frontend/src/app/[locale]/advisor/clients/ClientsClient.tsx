'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { advisorService, LoanDTO, ClientInfoDTO } from '@/infrastructure/web/services/advisorService';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};

interface ClientWithLoans {
  clientId: string;
  loans: LoanDTO[];
  info?: ClientInfoDTO;
}

export default function ClientsClient() {
  const [clients, setClients] = useState<ClientWithLoans[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  useEffect(() => {
    fetchClients();
  }, [lastRefresh]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const loans = await advisorService.getMyClients();
      
      // Grouper les prêts par client
      const clientsMap = new Map<string, LoanDTO[]>();
      loans.forEach(loan => {
        const existing = clientsMap.get(loan.clientId) || [];
        clientsMap.set(loan.clientId, [...existing, loan]);
      });

      const clientsData: ClientWithLoans[] = await Promise.all(
        Array.from(clientsMap.entries()).map(async ([clientId, loans]) => {
          try {
            const info = await advisorService.getClientInfo(clientId);
            return {
              clientId,
              loans: loans.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              ),
              info,
            };
          } catch (error) {
            console.error(`Erreur lors de la récupération des infos du client ${clientId}:`, error);
            return {
              clientId,
              loans: loans.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              ),
            };
          }
        })
      );

      setClients(clientsData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: LoanDTO['status']) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ACTIVE: 'bg-green-100 text-green-800',
      PAID_OFF: 'bg-blue-100 text-blue-800',
      REJECTED: 'bg-red-100 text-red-800',
    };

    const labels = {
      PENDING: 'En attente',
      ACTIVE: 'Actif',
      PAID_OFF: 'Remboursé',
      REJECTED: 'Rejeté',
    };

    return (
      <span className={`px-2 py-1 ${styles[status]} text-xs font-medium rounded`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Typography variant="body">Chargement...</Typography>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1" className="mb-2">
            Mes clients
          </Typography>
          <Typography variant="body" color="muted">
            {clients.length} client{clients.length > 1 ? 's' : ''} avec des prêts en cours ou passés
          </Typography>
        </div>
      </div>

      {clients.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Typography variant="h3" className="mb-2">
              Aucun client
            </Typography>
            <Typography variant="body" color="muted">
              Vous n&apos;avez pas encore de clients assignés
            </Typography>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {clients.map((client) => {
            const activeLoans = client.loans.filter(l => l.status === 'ACTIVE');
            const totalRemaining = activeLoans.reduce(
              (sum, loan) => sum + loan.remainingAmountToPay,
              0
            );

            return (
              <Card key={client.clientId}>
                <div className="mb-4">
                  {client.info ? (
                    <>
                      <Typography variant="h3" className="mb-1">
                        {client.info.firstName} {client.info.lastName}
                      </Typography>
                      <Typography variant="body" color="muted" className="mb-3">
                        {client.info.email}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="h3" className="mb-3">
                      Client {client.clientId.substring(0, 8)}
                    </Typography>
                  )}
                  <div className="flex gap-6 flex-wrap">
                    <div>
                      <Typography variant="caption" color="muted" className="block">
                        Prêts actifs
                      </Typography>
                      <Typography variant="body" className="font-semibold">
                        {activeLoans.length}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption" color="muted" className="block">
                        Montant restant total
                      </Typography>
                      <Typography variant="body" className="font-semibold">
                        {formatCurrency(totalRemaining / 100)}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption" color="muted" className="block">
                        Total prêts
                      </Typography>
                      <Typography variant="body" className="font-semibold">
                        {client.loans.length}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Typography variant="h4" className="mb-3">
                    Historique des prêts
                  </Typography>
                  {client.loans.map((loan) => (
                    <div
                      key={loan.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Typography variant="body" className="font-medium">
                            {formatCurrency(loan.loanAmount / 100)}
                          </Typography>
                          {getStatusBadge(loan.status)}
                        </div>
                        <Typography variant="caption" color="muted">
                          {new Date(loan.createdAt).toLocaleDateString('fr-FR')}
                        </Typography>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <Typography variant="caption" color="muted" className="block">
                            Durée
                          </Typography>
                          <Typography variant="caption">
                            {loan.durationInMonth} mois
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="caption" color="muted" className="block">
                            Mensualités
                          </Typography>
                          <Typography variant="caption">
                            {formatCurrency(loan.mensualities / 100)}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="caption" color="muted" className="block">
                            Restant à payer
                          </Typography>
                          <Typography variant="caption">
                            {formatCurrency(loan.remainingAmountToPay / 100)}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="caption" color="muted" className="block">
                            Taux
                          </Typography>
                          <Typography variant="caption">
                            {(loan.annualInterestRate / 100).toFixed(2)}%
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
