'use client';

import React, { useState } from 'react';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { useSetSavingRate } from '@/features/admin/useSetSavingRate';

export const SavingRateManager: React.FC = () => {
  const [baseRate, setBaseRate] = useState(2.5);
  const [premiumRate, setPremiumRate] = useState(3.5);
  const { setSavingRate, isLoading } = useSetSavingRate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await setSavingRate(baseRate, premiumRate);
  };

  return (
    <Card>
      <Typography variant="h4" className="mb-4">
        Gestion des taux d&apos;épargne
      </Typography>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">
              <Typography variant="body" className="font-medium">
                Taux de base (%)
              </Typography>
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={baseRate}
                onChange={(e) => setBaseRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between items-center">
                <Typography variant="caption" color="muted">
                  0%
                </Typography>
                <div className="bg-blue-50 border border-blue-200 rounded px-4 py-2">
                  <Typography variant="h4" className="text-blue-600 font-bold">
                    {baseRate.toFixed(1)}%
                  </Typography>
                </div>
                <Typography variant="caption" color="muted">
                  10%
                </Typography>
              </div>
              <Typography variant="caption" color="muted">
                Taux appliqué aux clients standards
              </Typography>
            </div>
          </div>

          <div>
            <label className="block mb-2">
              <Typography variant="body" className="font-medium">
                Taux premium (%)
              </Typography>
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={premiumRate}
                onChange={(e) => setPremiumRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between items-center">
                <Typography variant="caption" color="muted">
                  0%
                </Typography>
                <div className="bg-green-50 border border-green-200 rounded px-4 py-2">
                  <Typography variant="h4" className="text-green-600 font-bold">
                    {premiumRate.toFixed(1)}%
                  </Typography>
                </div>
                <Typography variant="caption" color="muted">
                  10%
                </Typography>
              </div>
              <Typography variant="caption" color="muted">
                Taux appliqué aux clients premium
              </Typography>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-gray-200 rounded-lg p-4">
          <Typography variant="caption" className="mb-2 block font-medium">
            Aperçu des gains annuels
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="caption" color="muted">
                Sur 10,000€ (base)
              </Typography>
              <Typography variant="body" className="font-semibold text-blue-600">
                {((10000 * baseRate) / 100).toFixed(2)}€ / an
              </Typography>
            </div>
            <div>
              <Typography variant="caption" color="muted">
                Sur 10,000€ (premium)
              </Typography>
              <Typography variant="body" className="font-semibold text-green-600">
                {((10000 * premiumRate) / 100).toFixed(2)}€ / an
              </Typography>
            </div>
          </div>
        </div>

        {baseRate >= premiumRate && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <Typography variant="caption" className="text-yellow-800">
              Le taux premium devrait être supérieur au taux de base
            </Typography>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || baseRate >= premiumRate}>
            {isLoading ? 'Mise à jour en cours...' : '💾 Sauvegarder les taux'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SavingRateManager;
