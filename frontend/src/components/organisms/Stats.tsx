"use client";
import { useTranslations } from 'next-intl';
import { Typography } from '../atoms/Typography';
import { StatCard } from '../molecules/StatCard';
import { mockBankStats, formatNumber } from '@/features/accounts/mocks';

export const Stats = () => {
  const t = useTranslations('Home.stats');

  const stats = [
    {
      value: formatNumber(mockBankStats.totalUsers),
      label: t('users'),
      suffix: '+',
    },
    {
      value: formatNumber(mockBankStats.totalTransactions),
      label: t('transactions'),
      suffix: '+',
    },
    {
      value: mockBankStats.satisfactionRate.toString(),
      label: t('satisfaction'),
      suffix: '%',
    },
  ];

  return (
    <section id="stats" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Typography variant="h2" className="mb-4">
            {t('title')}
          </Typography>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
            />
          ))}
        </div>
      </div>
    </section>
  );
};