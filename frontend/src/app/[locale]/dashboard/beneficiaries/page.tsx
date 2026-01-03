'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '../../../../components/templates/DashboardLayout';
import { Typography } from '../../../../components/atoms/Typography';
import { Button } from '../../../../components/atoms/Button';
import { BeneficiaryList } from '../../../../components/organisms/BeneficiaryList';
import { AddBeneficiaryModal } from '../../../../components/molecules/AddBeneficiaryModal';
import { EditBeneficiaryModal } from '../../../../components/molecules/EditBeneficiaryModal';
import { DeleteBeneficiaryConfirmModal } from '../../../../components/molecules/DeleteBeneficiaryConfirmModal';
import { useAuth } from '../../../../contexts/AuthProvider';
import { useGetBeneficiaries } from '../../../../features/beneficiaries/useGetBeneficiaries';
import { useAddBeneficiary } from '../../../../features/beneficiaries/useAddBeneficiary';
import { useUpdateBeneficiary } from '../../../../features/beneficiaries/useUpdateBeneficiary';
import { useDeleteBeneficiary } from '../../../../features/beneficiaries/useDeleteBeneficiary';
import { BeneficiaryDTO, CreateBeneficiaryDTO } from '@/infrastructure/web/services/beneficiaryService';

export default function BeneficiariesPage() {
  const router = useRouter();
  const t = useTranslations('Beneficiaries');
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const { beneficiaries, loading, error, refetch } = useGetBeneficiaries();
  const { addBeneficiary, loading: addLoading, success: addSuccess } = useAddBeneficiary();
  const { updateBeneficiaryLabel, loading: updateLoading, success: updateSuccess } = useUpdateBeneficiary();
  const { deleteBeneficiary, loading: deleteLoading, success: deleteSuccess } = useDeleteBeneficiary();

  const [locale] = useState('fr');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<BeneficiaryDTO | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/auth/login`);
    }
  }, [authLoading, isAuthenticated, router, locale]);

  useEffect(() => {
    if (addSuccess) {
      setIsAddModalOpen(false);
      refetch();
    }
  }, [addSuccess, refetch]);

  useEffect(() => {
    if (updateSuccess) {
      setIsEditModalOpen(false);
      setSelectedBeneficiary(null);
      refetch();
    }
  }, [updateSuccess, refetch]);

  useEffect(() => {
    if (deleteSuccess) {
      setIsDeleteModalOpen(false);
      setSelectedBeneficiary(null);
      refetch();
    }
  }, [deleteSuccess, refetch]);

  const handleAddBeneficiary = async (data: CreateBeneficiaryDTO) => {
    await addBeneficiary(data);
  };

  const handleEditBeneficiary = async (id: string, label: string) => {
    await updateBeneficiaryLabel(id, { label });
  };

  const handleDeleteBeneficiary = async (id: string) => {
    await deleteBeneficiary(id);
  };

  const handleTransfer = (beneficiary: BeneficiaryDTO) => {
    router.push(`/${locale}/dashboard/operations/transfer?beneficiaryId=${beneficiary.id}&iban=${encodeURIComponent(beneficiary.iban)}`);
  };

  const handleEditClick = (beneficiary: BeneficiaryDTO) => {
    setSelectedBeneficiary(beneficiary);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (beneficiary: BeneficiaryDTO) => {
    setSelectedBeneficiary(beneficiary);
    setIsDeleteModalOpen(true);
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="mb-2">
              {t('title')}
            </Typography>
            <Typography color="muted">
              {t('subtitle')}
            </Typography>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            {t('add')}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <Typography className="text-red-600">{error}</Typography>
          </div>
        )}

        <BeneficiaryList
          beneficiaries={beneficiaries}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onTransfer={handleTransfer}
        />
      </div>

      <AddBeneficiaryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBeneficiary}
        isLoading={addLoading}
      />

      <EditBeneficiaryModal
        isOpen={isEditModalOpen}
        beneficiary={selectedBeneficiary}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBeneficiary(null);
        }}
        onSubmit={handleEditBeneficiary}
        isLoading={updateLoading}
      />

      <DeleteBeneficiaryConfirmModal
        isOpen={isDeleteModalOpen}
        beneficiary={selectedBeneficiary}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBeneficiary(null);
        }}
        onConfirm={handleDeleteBeneficiary}
        isLoading={deleteLoading}
      />
    </DashboardLayout>
  );
}
