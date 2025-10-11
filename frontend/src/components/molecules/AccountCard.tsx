import { useTranslations, useLocale } from 'next-intl';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Account } from '@/features/accounts/types';
import { formatCurrency } from '@/features/accounts/mocks';

interface AccountCardProps {
  account: Account;
  showDetails?: boolean;
}

export const AccountCard = ({ account, showDetails = false }: AccountCardProps) => {
  const t = useTranslations('Accounts');
  
  const getAccountIcon = (type: Account['type']) => {

  };

  const getBalanceColor = (balance: number) => {
    return balance >= 0 ? 'text-green-600' : 'text-red-500';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getAccountIcon(account.type)}</div>
          <div>
            <Typography variant="h4" className="mb-1">
              {t(`types.${account.type}`)}
            </Typography>
            {showDetails && (
              <Typography variant="caption" color="muted">
                {account.accountNumber}
              </Typography>
            )}
          </div>
        </div>
        <div className="text-right">
          <Typography 
            variant="h4" 
            className={getBalanceColor(account.balance)}
          >
            {formatCurrency(account.balance, account.currency)}
          </Typography>
          {showDetails && (
            <Typography variant="caption" color="muted">
              {t('labels.currency')}
            </Typography>
          )}
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <Typography variant="caption" color="muted">
              {t('labels.createdOn')} {account.createdAt.toLocaleDateString('fr-FR')}
            </Typography>
            <div className={`px-2 py-1 rounded-full text-xs ${
              account.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {account.isActive ? t('status.active') : t('status.inactive')}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};