'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { loanService, type LoanDTO } from '@/infrastructure/web/services/loanService';

export default function LoanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const loanId = params.id as string;
  const locale = params.locale as string;

  const [loan, setLoan] = useState<LoanDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        setLoading(true);
        const data = await loanService.getLoanById(loanId);
        setLoan(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur lors du chargement du prêt');
      } finally {
        setLoading(false);
      }
    };

    if (loanId) {
      fetchLoan();
    }
  }, [loanId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'PENDING':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'PAID_OFF':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'REJECTED':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Actif';
      case 'PENDING':
        return 'En attente';
      case 'PAID_OFF':
        return 'Remboursé';
      case 'REJECTED':
        return 'Refusé';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !loan) {
    return (
      <DashboardLayout>
        <Card className="text-center py-12 border-red-200 bg-red-50 max-w-2xl mx-auto">
          <Typography variant="h4" className="mb-2 text-red-700">
            Erreur de chargement
          </Typography>
          <Typography color="muted" className="mb-4">
            {error || 'Prêt introuvable'}
          </Typography>
          <Button variant="primary" onClick={() => router.back()}>
            Retour
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  const paidAmount = loan.loanAmount - loan.remainingAmountToPay;
  const progress = (paidAmount / loan.loanAmount) * 100;
  const monthsElapsed = loan.status === 'ACTIVE' && loan.lastPaidAt
    ? Math.floor((new Date().getTime() - new Date(loan.lastPaidAt).getTime()) / (1000 * 60 * 60 * 24 * 30))
    : 0;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              ← Retour
            </Button>
            <Typography variant="h1" className="mt-4">
              Détails du prêt
            </Typography>
            <Typography variant="body" color="muted" className="mt-1">
              Demandé le {formatDate(loan.createdAt)}
            </Typography>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(loan.status)}`}>
            {getStatusLabel(loan.status)}
          </span>
        </div>

        {/* Informations principales */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <Typography variant="caption" color="muted" className="mb-2">
              Montant emprunté
            </Typography>
            <Typography variant="h2" className="text-blue-700 font-bold">
              {formatCurrency(loan.loanAmount)}
            </Typography>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <Typography variant="caption" color="muted" className="mb-2">
              Restant à payer
            </Typography>
            <Typography variant="h2" className="text-orange-700 font-bold">
              {formatCurrency(loan.remainingAmountToPay)}
            </Typography>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <Typography variant="caption" color="muted" className="mb-2">
              Déjà remboursé
            </Typography>
            <Typography variant="h2" className="text-green-700 font-bold">
              {formatCurrency(paidAmount)}
            </Typography>
          </Card>
        </div>

        {/* Progression du remboursement */}
        {loan.status === 'ACTIVE' && (
          <Card>
            <Typography variant="h3" className="mb-4">
              Progression du remboursement
            </Typography>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Typography variant="body" color="muted">
                  {progress.toFixed(1)}% remboursé
                </Typography>
                <Typography variant="body" className="font-semibold">
                  {formatCurrency(paidAmount)} / {formatCurrency(loan.loanAmount)}
                </Typography>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                >
                  {progress > 10 && (
                    <span className="text-white text-xs font-semibold">{progress.toFixed(0)}%</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Détails du prêt */}
        <Card>
          <Typography variant="h3" className="mb-6">
            Détails du prêt
          </Typography>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Typography variant="caption" color="muted" className="block mb-1">
                  Mensualité
                </Typography>
                <Typography variant="h4" className="font-semibold">
                  {formatCurrency(loan.mensualities || loan.monthlyPayment || 0)}
                </Typography>
              </div>

              <div>
                <Typography variant="caption" color="muted" className="block mb-1">
                  Durée totale
                </Typography>
                <Typography variant="h4" className="font-semibold">
                  {loan.durationInMonth} mois
                </Typography>
              </div>

              <div>
                <Typography variant="caption" color="muted" className="block mb-1">
                  Taux d'intérêt annuel
                </Typography>
                <Typography variant="h4" className="font-semibold">
                  {(loan.annualInterestRate / 100).toFixed(2)}%
                </Typography>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Typography variant="caption" color="muted" className="block mb-1">
                  Assurance mensuelle
                </Typography>
                <Typography variant="h4" className="font-semibold">
                  {formatCurrency(loan.insuranceMensualities || loan.monthlyInsurance || 0)}
                </Typography>
              </div>

              <div>
                <Typography variant="caption" color="muted" className="block mb-1">
                  Taux d'assurance annuel
                </Typography>
                <Typography variant="h4" className="font-semibold">
                  {(loan.annualInsuranceRate / 100).toFixed(2)}%
                </Typography>
              </div>

              {loan.status === 'ACTIVE' && loan.nextToPayAt && (
                <div>
                  <Typography variant="caption" color="muted" className="block mb-1">
                    Prochain paiement
                  </Typography>
                  <Typography variant="h4" className="font-semibold">
                    {formatDate(loan.nextToPayAt)}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Coût total */}
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="caption" color="muted" className="block mb-1">
                Coût total du crédit
              </Typography>
              <Typography variant="h3" className="font-bold text-slate-800">
                {formatCurrency((loan.mensualities || 0) * loan.durationInMonth)}
              </Typography>
              <Typography variant="caption" color="muted" className="mt-1">
                Dont {formatCurrency(((loan.mensualities || 0) * loan.durationInMonth) - loan.loanAmount)} d'intérêts et assurance
              </Typography>
            </div>
          </div>
        </Card>

        {/* Messages selon le statut */}
        {loan.status === 'PENDING' && (
          <Card className="bg-amber-50 border-amber-200">
            <div className="flex items-start space-x-3">
              <div>
                <Typography variant="h4" className="text-amber-800 mb-2">
                  Demande en cours d'examen
                </Typography>
                <Typography variant="body" color="muted">
                  Nos conseillers étudient actuellement votre demande. Vous recevrez une réponse sous 48 heures.
                </Typography>
              </div>
            </div>
          </Card>
        )}

        {loan.status === 'REJECTED' && (
          <Card className="bg-red-50 border-red-200">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">✕</div>
              <div>
                <Typography variant="h4" className="text-red-800 mb-2">
                  Demande refusée
                </Typography>
                <Typography variant="body" color="muted">
                  Malheureusement, votre demande de prêt n'a pas pu être acceptée. N'hésitez pas à contacter un conseiller pour plus d'informations.
                </Typography>
              </div>
            </div>
          </Card>
        )}

        {loan.status === 'PAID_OFF' && (
          <Card className="bg-green-50 border-green-200">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">✓</div>
              <div>
                <Typography variant="h4" className="text-green-800 mb-2">
                  Prêt intégralement remboursé
                </Typography>
                <Typography variant="body" color="muted">
                  Félicitations ! Vous avez remboursé l'intégralité de ce prêt.
                </Typography>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
