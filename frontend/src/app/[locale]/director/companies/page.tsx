'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { getAllCompanies, deleteCompany } from '@/lib/api/director/companies';
import { useToast } from '@/contexts/ToastProvider';
import Link from 'next/link';
import { useGetCompanies } from '@/features/companies/useGetCompanies';
import { Company } from '@/infrastructure/web/services/companiesService';

export default function DirectorCompaniesPage() {
  const t = useTranslations('Director.companies');
  const locale = useLocale();
  const { success, error: showError } = useToast();
  // const [companies, setCompanies] = useState<Company[]>([]);
  const { companies, fetchCompanies, fetchLoading, error } = useGetCompanies();
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // useEffect(() => {
  //   loadCompanies();
  // }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchQuery]);

  console.log('Companies:', companies);
  // const loadCompanies = async () => {
  //   setLoading(true);
  //   const data = await getAllCompanies();
  //   setCompanies(data);
  //   setLoading(false);
  // };

  const filterCompanies = () => {
    let filtered = companies;

    if (searchQuery) {
      filtered = filtered.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCompanies(filtered);
  };

  const handleDelete = async () => {
    if (!selectedCompany) return;

    setDeleting(true);
    try {
      await deleteCompany(selectedCompany.id);
      success(t('toasts.deleteSuccess'));
      setShowDeleteModal(false);
      await fetchCompanies();
    } catch (err) {
      console.error('Error deleting company:', err);
      showError(t('toasts.deleteError'));
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (fetchLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Typography variant="h2">{t('title')}</Typography>
          <Card className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded"></div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Typography variant="h2">{t('title')}</Typography>
          <Link href={`/${locale}/director/companies/create`}>
            <Button variant="primary" size="md">
              {t('list.addNew')}
            </Button>
          </Link>
        </div>

        <Card>
          <div className="mb-6">
            <Input
              type="text"
              placeholder={t('list.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.name')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.description')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      {t('list.noCompanies')}
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => (
                    <tr key={company.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{company.name}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {company.description.length > 100
                          ? `${company.description.substring(0, 100)}...`
                          : company.description}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link href={`/${locale}/director/companies/${company.id}/edit`}>
                            <Button variant="outline" size="sm">
                              {t('actions.edit')}
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCompany(company);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            {t('actions.delete')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {showDeleteModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full m-4">
            <Typography variant="h3" className="mb-4 text-red-600">
              {t('modals.deleteTitle')}
            </Typography>
            <Typography variant="body" className="mb-4">
              {t('modals.deleteMessage')}
            </Typography>
            <Typography variant="caption" color="muted" className="mb-4">
              {selectedCompany.name}
            </Typography>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(false)}>
                {t('modals.cancel')}
              </Button>
              <Button
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {t('modals.confirm')}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
