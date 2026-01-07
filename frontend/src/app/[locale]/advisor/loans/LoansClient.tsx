'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { advisorService, LoanDTO } from '@/infrastructure/web/services/advisorService';
import { ApprovalModal } from '@/components/molecules/ApprovalModal';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};

export default function LoansClient() {
  const [loans, setLoans] = useState<LoanDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingLoanId, setProcessingLoanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmReject, setShowConfirmReject] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState<LoanDTO | null>(null);

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchPendingLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await advisorService.getPendingLoans();
      setLoans(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (loanId: string) => {
    try {
      setProcessingLoanId(loanId);
      setError(null);
      await advisorService.approveLoan(loanId);
      setSuccess('Prêt approuvé avec succès ! Le client a été crédité et apparaît maintenant dans vos clients.');
      setShowApprovalModal(null);
      await fetchPendingLoans();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'approbation du prêt');
    } finally {
      setProcessingLoanId(null);
    }
  };

  const handleReject = async (loanId: string) => {
    try {
      setProcessingLoanId(loanId);
      setError(null);
      await advisorService.rejectLoan(loanId);
      setSuccess('Prêt rejeté avec succès');
      setShowConfirmReject(null);
      await fetchPendingLoans();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du rejet du prêt');
    } finally {
      setProcessingLoanId(null);
    }
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
      {success && (
        <Card className="bg-green-50 border-green-200">
          <Typography variant="body" className="text-green-800">
            ✓ {success}
          </Typography>
        </Card>
      )}

      {error && (
        <Card className="bg-red-50 border-red-200">
          <Typography variant="body" className="text-red-800">
            {error}
          </Typography>
        </Card>
      )}

      <div>
        <Typography variant="h1" className="mb-2">
          Demandes de prêts en attente
        </Typography>
        <Typography variant="body" color="muted">
          {loans.length} demande{loans.length > 1 ? 's' : ''} en attente de traitement
        </Typography>
      </div>

      {loans.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Typography variant="h3" className="mb-2">
              Aucune demande en attente
            </Typography>
            <Typography variant="body" color="muted">
              Toutes les demandes de prêts ont été traitées
            </Typography>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <Card key={loan.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Typography variant="h3">
                      Demande de prêt
                    </Typography>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                      EN ATTENTE
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Typography variant="caption" color="muted" className="block mb-1">
                        Montant demandé
                      </Typography>
                      <Typography variant="body" className="font-semibold">
                        {formatCurrency(loan.loanAmount / 100)}
                      </Typography>
                    </div>

                    <div>
                      <Typography variant="caption" color="muted" className="block mb-1">
                        Durée
                      </Typography>
                      <Typography variant="body" className="font-semibold">
                        {loan.durationInMonth} mois
                      </Typography>
                    </div>

                    <div>
                      <Typography variant="caption" color="muted" className="block mb-1">
                        Mensualités
                      </Typography>
                      <Typography variant="body" className="font-semibold">
                        {formatCurrency(loan.mensualities / 100)}
                      </Typography>
                    </div>

                    <div>
                      <Typography variant="caption" color="muted" className="block mb-1">
                        Taux d&apos;intérêt
                      </Typography>
                      <Typography variant="body" className="font-semibold">
                        {(loan.annualInterestRate / 100).toFixed(2)}%
                      </Typography>
                    </div>

                    <div>
                      <Typography variant="caption" color="muted" className="block mb-1">
                        Assurance mensuelle
                      </Typography>
                      <Typography variant="body" className="font-semibold">
                        {formatCurrency(loan.insuranceMensualities / 100)}
                      </Typography>
                    </div>

                    <div>
                      <Typography variant="caption" color="muted" className="block mb-1">
                        Date de demande
                      </Typography>
                      <Typography variant="body" className="font-semibold">
                        {new Date(loan.createdAt).toLocaleDateString('fr-FR')}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      onClick={() => setShowApprovalModal(loan)}
                      disabled={processingLoanId === loan.id}
                    >
                      Approuver
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowConfirmReject(loan.id)}
                      disabled={processingLoanId === loan.id}
                    >
                      Rejeter
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showConfirmReject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <Typography variant="h3" className="mb-4">
              Confirmer le rejet
            </Typography>
            <Typography variant="body" color="muted" className="mb-6">
              Êtes-vous sûr de vouloir rejeter cette demande de prêt ? Cette action est irréversible.
            </Typography>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmReject(null)}
                disabled={processingLoanId === showConfirmReject}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                onClick={() => handleReject(showConfirmReject)}
                disabled={processingLoanId === showConfirmReject}
                className="bg-red-600 hover:bg-red-700"
              >
                {processingLoanId === showConfirmReject ? 'Rejet...' : 'Confirmer le rejet'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showApprovalModal && (
        <ApprovalModal
          loanId={showApprovalModal.id}
          clientId={showApprovalModal.clientId}
          loanAmount={showApprovalModal.loanAmount}
          onConfirm={() => handleApprove(showApprovalModal.id)}
          onCancel={() => setShowApprovalModal(null)}
          isProcessing={processingLoanId === showApprovalModal.id}
        />
      )}
    </div>
  );
}
