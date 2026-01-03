import { useTranslations } from 'next-intl';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { BeneficiaryDTO } from '@/infrastructure/web/services/beneficiaryService';
import { maskIBAN } from '@/lib/formatters';

interface DeleteBeneficiaryConfirmModalProps {
  isOpen: boolean;
  beneficiary: BeneficiaryDTO | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export const DeleteBeneficiaryConfirmModal = ({
  isOpen,
  beneficiary,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteBeneficiaryConfirmModalProps) => {
  const t = useTranslations('Beneficiaries');

  const handleConfirm = async () => {
    if (!beneficiary) return;
    await onConfirm(beneficiary.id);
  };

  if (!isOpen || !beneficiary) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md mx-4">
        <div className="space-y-6">
          <Typography variant="h3">{t('modals.deleteTitle')}</Typography>

          <div>
            <Typography className="mb-4">
              {t('modals.deleteMessage')}
            </Typography>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Typography variant="body" className="font-medium mb-1">
                {beneficiary.label}
              </Typography>
              <Typography variant="caption" color="muted">
                {maskIBAN(beneficiary.iban)}
              </Typography>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              {t('modals.cancel')}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirm}
              isLoading={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {t('modals.confirm')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
