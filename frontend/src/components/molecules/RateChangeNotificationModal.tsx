'use client';

import React from 'react';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';

interface RateChange {
  productId: string;
  productLabel: string;
  newRate: number;
  updatedAt: string;
}

interface RateChangeNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: () => void;
  rateChanges: RateChange[];
}

export function RateChangeNotificationModal({
  isOpen,
  onClose,
  onAcknowledge,
  rateChanges,
}: RateChangeNotificationModalProps) {
  const handleAcknowledge = () => {
    onAcknowledge();
    onClose();
  };

  if (!isOpen || rateChanges.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <Typography variant="h3" className="text-xl font-semibold">
            Changement de taux d'épargne
          </Typography>
        </div>

        <div className="px-6 py-4 space-y-4">
          <Typography variant="body" className="text-gray-700">
            Les taux des produits d'épargne suivants ont été modifiés :
          </Typography>

          <div className="space-y-3">
            {rateChanges.map((change) => (
              <div
                key={change.productId}
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <Typography variant="subtitle" className="font-semibold text-blue-900">
                  {change.productLabel}
                </Typography>
                <div className="mt-2 flex items-center gap-2">
                  <Typography variant="body" className="text-blue-700">
                    Nouveau taux :{' '}
                    <span className="font-bold text-lg">{change.newRate.toFixed(2)}%</span>
                  </Typography>
                </div>
                <Typography variant="caption" className="text-gray-500 mt-1">
                  Modifié le {new Date(change.updatedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <Typography variant="caption" className="text-gray-600">
              Les nouveaux taux s'appliquent immédiatement à vos comptes d'épargne existants.
            </Typography>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="primary" onClick={handleAcknowledge} className="min-w-[120px]">
            J'ai compris
          </Button>
        </div>
      </div>
    </div>
  );
}
