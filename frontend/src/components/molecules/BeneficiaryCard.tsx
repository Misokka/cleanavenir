import { useTranslations } from 'next-intl';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { BeneficiaryDTO } from '@/infrastructure/web/services/beneficiaryService';
import { maskIBAN } from '@/lib/formatters';

interface BeneficiaryCardProps {
  beneficiary: BeneficiaryDTO;
  onEdit?: (beneficiary: BeneficiaryDTO) => void;
  onDelete?: (beneficiary: BeneficiaryDTO) => void;
  onTransfer?: (beneficiary: BeneficiaryDTO) => void;
}

export const BeneficiaryCard = ({ 
  beneficiary, 
  onEdit, 
  onDelete,
  onTransfer 
}: BeneficiaryCardProps) => {
  const t = useTranslations('Beneficiaries');

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Typography variant="h4" className="mb-1">
            {beneficiary.label}
          </Typography>
          <Typography variant="caption" color="muted" className="block mb-1">
            {maskIBAN(beneficiary.iban)}
          </Typography>
          {beneficiary.accountName && (
            <Typography variant="caption" color="muted" className="block">
              {beneficiary.accountName}
            </Typography>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-100">
        {onTransfer && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onTransfer(beneficiary)}
            className="flex-1"
          >
            {t('actions.transfer')}
          </Button>
        )}
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(beneficiary)}
          >
            {t('actions.edit')}
          </Button>
        )}
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(beneficiary)}
            className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
          >
            {t('actions.delete')}
          </Button>
        )}
      </div>
    </Card>
  );
};
