'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { createCompany } from '@/lib/api/director/companies';
import { useToast } from '@/contexts/ToastProvider';

export default function CreateCompanyPage() {
  const t = useTranslations('Director.companies');
  const locale = useLocale();
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showError('Le nom est requis');
      return;
    }

    setSubmitting(true);
    try {
      await createCompany({ name: name.trim(), description: description.trim() });
      success(t('toasts.createSuccess'));
      router.push(`/${locale}/director/companies`);
    } catch (err) {
      console.error('Error creating company:', err);
      showError(t('toasts.createError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Typography variant="h2">{t('form.createTitle')}</Typography>
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
                placeholder="Apple Inc."
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
                placeholder="Description de l'entreprise..."
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
