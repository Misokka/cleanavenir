'use client';

import { useState, useEffect } from 'react';
import { SavingDTO } from '@/infrastructure/web/services/savingService';

interface RateChange {
  productId: string;
  productLabel: string;
  newRate: number;
  updatedAt: string;
}

const STORAGE_KEY = 'savingsRateNotifications';

interface StoredNotificationData {
  lastSeenRateUpdate?: string;
}

export function useRateChangeNotification(savings: SavingDTO[] | null | undefined) {
  const [rateChanges, setRateChanges] = useState<RateChange[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!savings || savings.length === 0) {
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    let lastSeenDate: Date | null = null;

    if (stored) {
      try {
        const data: StoredNotificationData = JSON.parse(stored);
        if (data.lastSeenRateUpdate) {
          lastSeenDate = new Date(data.lastSeenRateUpdate);
        }
      } catch (e) {
        console.error('Error parsing stored notification data:', e);
      }
    }

    const changes: RateChange[] = [];

    for (const saving of savings) {
      if (saving.savingProduct && saving.savingProduct.rateUpdatedAt) {
        const updatedAt = new Date(saving.savingProduct.rateUpdatedAt);

        if (!lastSeenDate || updatedAt > lastSeenDate) {
          const alreadyAdded = changes.some(
            (c) => c.productId === saving.savingProduct!.id
          );

          if (!alreadyAdded) {
            changes.push({
              productId: saving.savingProduct.id,
              productLabel: saving.savingProduct.label,
              newRate: saving.savingProduct.rate,
              updatedAt: saving.savingProduct.rateUpdatedAt,
            });
          }
        }
      }
    }

    if (changes.length > 0) {
      setRateChanges(changes);
      setShowModal(true);
    }
  }, [savings]);

  const handleAcknowledge = () => {
    const data: StoredNotificationData = {
      lastSeenRateUpdate: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setShowModal(false);
    setRateChanges([]);
  };

  return {
    rateChanges,
    showModal,
    setShowModal,
    handleAcknowledge,
  };
}
