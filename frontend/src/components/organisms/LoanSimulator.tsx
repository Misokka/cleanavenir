'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Button} from '../atoms/Button';
import { useSimulateLoan } from '@/features/loans/useSimulateLoan';

interface LoanSimulatorProps {
  onSimulationComplete?: (simulation: any) => void;
}

export const LoanSimulator: React.FC<LoanSimulatorProps> = ({ onSimulationComplete }) => {
  const locale = useLocale();
  const { simulate, loading, error, simulation } = useSimulateLoan();
  
  const [amount, setAmount] = useState<number>(10000);
  const [durationInMonth, setDurationInMonth] = useState<number>(12);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(350); // 3.5% en basis points
  const [annualInsuranceRate, setAnnualInsuranceRate] = useState<number>(50); // 0.5% en basis points

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(value / 100); // Convertir centimes en euros
  };

  const formatPercentage = (basisPoints: number) => {
    return (basisPoints / 100).toFixed(2) + '%';
  };

  const handleSimulate = async () => {
    const result = await simulate({
      amount: amount * 100, // Convertir en centimes
      durationInMonth,
      annualInterestRate,
      annualInsuranceRate,
    });

    if (result && onSimulationComplete) {
      onSimulationComplete(result);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <Typography variant="h3" className="mb-6">
          Simulateur de Prêt
        </Typography>

        <div className="space-y-6">
          {/* Montant du prêt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant du prêt
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <Typography variant="body" className="font-bold text-blue-600 min-w-[120px]">
                {formatCurrency(amount * 100)}
              </Typography>
            </div>
          </div>

          {/* Durée */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée du prêt (mois)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="6"
                max="120"
                step="6"
                value={durationInMonth}
                onChange={(e) => setDurationInMonth(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <Typography variant="body" className="font-bold text-blue-600 min-w-[120px]">
                {durationInMonth} mois
              </Typography>
            </div>
          </div>

          {/* Taux d'intérêt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taux d'intérêt annuel
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="100"
                max="1000"
                step="10"
                value={annualInterestRate}
                onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <Typography variant="body" className="font-bold text-blue-600 min-w-[120px]">
                {formatPercentage(annualInterestRate)}
              </Typography>
            </div>
          </div>

          {/* Taux d'assurance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taux d'assurance annuel
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={annualInsuranceRate}
                onChange={(e) => setAnnualInsuranceRate(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <Typography variant="body" className="font-bold text-blue-600 min-w-[120px]">
                {formatPercentage(annualInsuranceRate)}
              </Typography>
            </div>
          </div>

          <Button 
            variant="primary" 
            onClick={handleSimulate} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Calcul en cours...' : 'Simuler le prêt'}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <Typography variant="caption" className="text-red-700">
                {error}
              </Typography>
            </div>
          )}
        </div>
      </Card>

      {simulation && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <Typography variant="h4" className="mb-6 text-blue-900">
            📊 Résultat de la simulation
          </Typography>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Typography variant="caption" color="muted" className="mb-1">
                Mensualité
              </Typography>
              <Typography variant="h3" className="text-blue-600 font-bold">
                {formatCurrency(simulation.monthlyPayment)}
              </Typography>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Typography variant="caption" color="muted" className="mb-1">
                Coût total
              </Typography>
              <Typography variant="h3" className="text-purple-600 font-bold">
                {formatCurrency(simulation.totalCost)}
              </Typography>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Typography variant="caption" color="muted" className="mb-1">
                Total des intérêts
              </Typography>
              <Typography variant="h4" className="text-orange-600 font-semibold">
                {formatCurrency(simulation.totalInterest)}
              </Typography>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Typography variant="caption" color="muted" className="mb-1">
                Total de l'assurance
              </Typography>
              <Typography variant="h4" className="text-green-600 font-semibold">
                {formatCurrency(simulation.totalInsurance)}
              </Typography>
            </div>
          </div>

          <div className="mt-6 bg-blue-100 rounded-lg p-4">
            <Typography variant="caption" className="text-blue-900">
              💡 <strong>Remarque :</strong> Cette simulation est indicative. 
              Le taux final peut varier selon votre profil et les conditions du marché.
            </Typography>
          </div>
        </Card>
      )}
    </div>
  );
};

export default LoanSimulator;
