import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import Input from '../atoms/Input';
import { CreateBeneficiaryDTO } from '@/infrastructure/web/services/beneficiaryService';

interface AddBeneficiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBeneficiaryDTO) => Promise<void>;
  isLoading?: boolean;
}

export const AddBeneficiaryModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AddBeneficiaryModalProps) => {
  const t = useTranslations('Beneficiaries');
  const [formData, setFormData] = useState<CreateBeneficiaryDTO>({
    iban: '',
    label: '',
    accountName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.iban.trim()) {
      newErrors.iban = t('errors.ibanRequired');
    }

    if (!formData.label.trim()) {
      newErrors.label = t('errors.labelRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit({
      iban: formData.iban.trim(),
      label: formData.label.trim(),
      accountName: formData.accountName?.trim() || undefined,
    });

    setFormData({ iban: '', label: '', accountName: '' });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({ iban: '', label: '', accountName: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md mx-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Typography variant="h3">{t('modals.addTitle')}</Typography>

          <div>
            <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-2">
              {t('fields.label')} *
            </label>
            <Input
              id="label"
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder={t('fields.label')}
              className={errors.label ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.label && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {errors.label}
              </Typography>
            )}
          </div>

          <div>
            <label htmlFor="iban" className="block text-sm font-medium text-gray-700 mb-2">
              {t('fields.iban')} *
            </label>
            <Input
              id="iban"
              type="text"
              value={formData.iban}
              onChange={(e) => setFormData({ ...formData, iban: e.target.value.toUpperCase() })}
              placeholder="FR76 1234 5678 9012 3456 7890 123"
              className={errors.iban ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.iban && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {errors.iban}
              </Typography>
            )}
          </div>

          <div>
            <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-2">
              {t('fields.accountName')}
            </label>
            <Input
              id="accountName"
              type="text"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              placeholder={t('fields.accountName')}
              disabled={isLoading}
            />
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
