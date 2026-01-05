'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { adminService, StatisticsDTO } from '@/infrastructure/web/services/adminService';
import { useParams } from 'next/navigation';

export default function DirectorDashboardPage() {
  const params = useParams();
  const locale = params.locale;
  const t = useTranslations('Director.dashboard');
  const [stats, setStats] = useState<StatisticsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await adminService.getStatistics();
        setStats(data);
      } catch (error) {
        console.error('Error loading statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Typography variant="h2">{t('title')}</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Typography variant="h2">{t('title')}</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="caption" color="muted" className="mb-2">
                  {t('stats.totalClients')}
                </Typography>
                <Typography variant="h2" color="primary">
                  {stats?.totalClients || 0}
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="caption" color="muted" className="mb-2">
                  {t('stats.totalAccounts')}
                </Typography>
                <Typography variant="h2" color="primary">
                  {stats?.totalAccounts || 0}
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="caption" color="muted" className="mb-2">
                  {t('stats.availableStocks')}
                </Typography>
                <Typography variant="h2" color="primary">
                  {stats?.availableStocks || 0}
                </Typography>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <Typography variant="h3" className="mb-4">{t('quickActions.title')}</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href={`/${locale}/director/accounts`}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-clean-dark hover:bg-clean-light transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div>
                  <Typography variant="body" className="font-medium">{t('quickActions.manageAccounts')}</Typography>
                  <Typography variant="caption" color="muted">{t('quickActions.manageAccountsDesc')}</Typography>
                </div>
              </div>
            </a>

            <a
              href={`/${locale}/director/savings`}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-clean-dark hover:bg-clean-light transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div>
                  <Typography variant="body" className="font-medium">{t('quickActions.updateSavingProducts')}</Typography>
                  <Typography variant="caption" color="muted">{t('quickActions.updateSavingProductsDesc')}</Typography>
                </div>
              </div>
            </a>

            <a
              href={`/${locale}/director/companies`}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-clean-dark hover:bg-clean-light transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div>
                  <Typography variant="body" className="font-medium">{t('quickActions.manageCompanies')}</Typography>
                  <Typography variant="caption" color="muted">{t('quickActions.manageCompaniesDesc')}</Typography>
                </div>
              </div>
            </a>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
