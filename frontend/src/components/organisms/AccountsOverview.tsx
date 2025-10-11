"use client";
import { useTranslations } from 'next-intl';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { AccountCard } from '../molecules/AccountCard';
import { mockAccounts } from '@/features/accounts/mocks';

export const AccountsOverview = () => {
  const t = useTranslations('Home.accounts');

  const previewAccounts = mockAccounts.slice(0, 3);

  return (
    <section className="py-20 bg-clean-light">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <Typography variant="h2">
            {t('title')}
          </Typography>
          <Button variant="outline">
            {t('viewAll')}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              showDetails={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
};