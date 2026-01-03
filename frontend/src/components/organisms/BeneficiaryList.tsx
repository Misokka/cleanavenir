import { useTranslations } from 'next-intl';
import { Typography } from '../atoms/Typography';
import { BeneficiaryCard } from '../molecules/BeneficiaryCard';
import { BeneficiarySkeleton } from '../molecules/BeneficiarySkeleton';
import { BeneficiaryDTO } from '@/infrastructure/web/services/beneficiaryService';

interface BeneficiaryListProps {
  beneficiaries: BeneficiaryDTO[] | null;
  loading: boolean;
  onEdit?: (beneficiary: BeneficiaryDTO) => void;
  onDelete?: (beneficiary: BeneficiaryDTO) => void;
  onTransfer?: (beneficiary: BeneficiaryDTO) => void;
}

export const BeneficiaryList = ({
  beneficiaries,
  loading,
  onEdit,
  onDelete,
  onTransfer,
}: BeneficiaryListProps) => {
  const t = useTranslations('Beneficiaries');

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <BeneficiarySkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!beneficiaries || beneficiaries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <Typography variant="h4" className="mb-2">
          {t('empty')}
        </Typography>
        <Typography color="muted">
          {t('emptyDescription')}
        </Typography>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {beneficiaries.map((beneficiary) => (
        <BeneficiaryCard
          key={beneficiary.id}
          beneficiary={beneficiary}
          onEdit={onEdit}
          onDelete={onDelete}
          onTransfer={onTransfer}
        />
      ))}
    </div>
  );
};
