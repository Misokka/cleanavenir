'use client';

import React, { useEffect, useState, use } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { getCompanyById, updateCompany } from '@/lib/api/director/companies';
import { useToast } from '@/contexts/ToastProvider';

interface EditCompanyPageProps {
  readonly params: Promise<{ id: string }>;
}

export default function EditCompanyPage({ params }: EditCompanyPageProps) {
  const resolvedParams = use(params);
  const t = useTranslations('Director.companies');
  const locale = useLocale();
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCompany();
  }, [resolvedParams.id]);

  const loadCompany = async () => {
    setLoading(true);
    const company = await getCompanyById(resolvedParams.id);
    if (company) {
      setName(company.name);
      setDescription(company.description);
    } else {
      showError('Entreprise introuvable');
      router.push(`/${locale}/director/companies`);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showError('Le nom est requis');
      return;
    }

    setSubmitting(true);
    try {
      await updateCompany(resolvedParams.id, {
        name: name.trim(),
        description: description.trim(),
      });
      success(t('toasts.updateSuccess'));
      router.push(`/${locale}/director/companies`);
    } catch (err) {
      console.error('Error updating company:', err);
      showError(t('toasts.updateError'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Typography variant="h2">{t('form.editTitle')}</Typography>
          <Card className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Typography variant="h2">{t('form.editTitle')}</Typography>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2">
                <Typography variant="caption" className="font-medium">
                  {t('form.name')} *
                </Typography>
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />
            </div>

            <div>
              <label className="block mb-2">
                <Typography variant="caption" className="font-medium">
                  {t('form.description')}
                </Typography>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-clean-dark focus:ring-clean-dark"
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => router.push(`/${locale}/director/companies`)}
                className="flex-1"
              >
                {t('form.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={submitting || !name.trim()}
                className="flex-1"
              >
                {t('form.submit')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
