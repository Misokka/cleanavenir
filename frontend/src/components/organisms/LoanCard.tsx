'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import type { LoanDTO } from '@/infrastructure/web/services/loanService';

interface LoanCardProps {
  loan: LoanDTO;
  onClick?: () => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan, onClick }) => {
  const locale = useLocale();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(value / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Actif';
      case 'PENDING':
        return 'En attente';
      case 'CLOSED':
        return 'Clôturé';
      case 'REJECTED':
        return 'Refusé';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '✓';
      case 'PENDING':
        return '⏳';
      case 'CLOSED':
        return '🔒';
      case 'REJECTED':
        return '✗';
      default:
        return '•';
    }
  };

  return (
    <Card 
      className={`${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div>
            <Typography variant="h4" className="mb-1">
              Prêt n°{loan.id.slice(0, 8)}
            </Typography>
            <Typography variant="caption" color="muted">
              Créé le {formatDate(loan.createdAt)}
            </Typography>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(loan.status)}`}>
          {getStatusIcon(loan.status)} {getStatusLabel(loan.status)}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Typography variant="caption" color="muted" className="mb-1">
            Montant emprunté
          </Typography>
          <Typography variant="h4" className="text-blue-600 font-bold">
            {formatCurrency(loan.loanAmount)}
          </Typography>
        </div>

        <div>
          <Typography variant="caption" color="muted" className="mb-1">
            Restant à payer
          </Typography>
          <Typography variant="h4" className="text-orange-600 font-bold">
            {formatCurrency(loan.remainingAmountToPay)}
          </Typography>
        </div>
      </div>

      {loan.status === 'ACTIVE' && (
        <>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <Typography variant="caption" color="muted">
                Mensualité
              </Typography>
              <Typography variant="body" className="font-semibold">
                {formatCurrency(loan.monthlyPayment)}
              </Typography>
            </div>
            <div className="flex justify-between items-center">
              <Typography variant="caption" color="muted">
                Durée
              </Typography>
              <Typography variant="body" className="font-semibold">
                {loan.durationInMonth} mois
              </Typography>
            </div>
          </div>

          {loan.nextPaymentDate && (
            <div className="bg-blue-50 rounded-lg p-3 mt-4">
              <Typography variant="caption" className="text-blue-800">
                Prochain paiement : {formatDate(loan.nextPaymentDate)}
              </Typography>
            </div>
          )}
        </>
      )}

      {loan.status === 'PENDING' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
          <Typography variant="caption" className="text-yellow-800">
            Votre demande est en cours d'examen par nos conseillers
          </Typography>
        </div>
      )}

      {loan.status === 'CLOSED' && loan.closedAt && (
        <div className="bg-gray-50 rounded-lg p-3 mt-4">
          <Typography variant="caption" className="text-gray-700">
            Prêt remboursé le {formatDate(loan.closedAt)}
          </Typography>
        </div>
      )}
    </Card>
  );
};

export default LoanCard;
