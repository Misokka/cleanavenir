import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import Input from '../atoms/Input';
import { BeneficiaryDTO } from '@/infrastructure/web/services/beneficiaryService';

interface EditBeneficiaryModalProps {
  isOpen: boolean;
  beneficiary: BeneficiaryDTO | null;
  onClose: () => void;
  onSubmit: (id: string, label: string) => Promise<void>;
  isLoading?: boolean;
}

export const EditBeneficiaryModal = ({
  isOpen,
  beneficiary,
  onClose,
  onSubmit,
  isLoading = false,
}: EditBeneficiaryModalProps) => {
  const t = useTranslations('Beneficiaries');
  const [label, setLabel] = useState(beneficiary?.label || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!label.trim()) {
      setError(t('errors.labelRequired'));
      return;
    }

    if (!beneficiary) return;

    await onSubmit(beneficiary.id, label.trim());
    setError('');
  };

  const handleClose = () => {
    setLabel(beneficiary?.label || '');
    setError('');
    onClose();
  };

  if (!isOpen || !beneficiary) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md mx-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Typography variant="h3">{t('modals.editTitle')}</Typography>

          <div>
            <Typography variant="caption" color="muted" className="block mb-2">
              IBAN: {beneficiary.iban}
            </Typography>
            {beneficiary.accountName && (
              <Typography variant="caption" color="muted" className="block mb-4">
                {beneficiary.accountName}
              </Typography>
            )}
          </div>

          <div>
            <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-2">
              {t('fields.label')} *
            </label>
            <Input
              id="label"
              type="text"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                setError('');
              }}
              placeholder={t('fields.label')}
              className={error ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {error && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {error}
              </Typography>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              {t('modals.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="flex-1"
            >
              {t('modals.submit')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
