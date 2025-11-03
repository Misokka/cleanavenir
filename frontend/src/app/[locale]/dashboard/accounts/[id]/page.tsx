import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DashboardLayout } from '../../../../../components/templates/DashboardLayout';
import { Card } from '../../../../../components/atoms/Card';
import { Typography } from '../../../../../components/atoms/Typography';
import { Button } from '../../../../../components/atoms/Button';
import { RecentOperations } from '../../../../../components/organisms/RecentOperations';
import { 
  mockAccounts, 
  mockOperations, 
  formatCurrency,
  formatDate
} from '../../../../../features/dashboard/mocks';

interface AccountDetailPageProps {
  readonly params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: AccountDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const account = mockAccounts.find(acc => acc.id === id);
  
  if (!account) {
    notFound();
  }
  
  const accountsT = await getTranslations({ locale, namespace: 'Accounts' });
  
  const accountTypeName = accountsT(`types.${account.type}`);
  
  const t = await getTranslations({ locale, namespace: 'Dashboard.accounts' });
  
  return {
    title: `${accountTypeName} | Clean Avenir`,
    description: `${t('accountDetailsDescription')} ${accountTypeName.toLowerCase()}`,
    robots: {
      index: false, 
      follow: false
    }
  };
}

export default async function AccountDetailPage({ params }: AccountDetailPageProps) {
  const { locale, id } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  const account = mockAccounts.find(acc => acc.id === id);
  
  if (!account) {
    notFound();
  }

  const accountOperations = mockOperations.filter(op => op.accountId === account.id);

  const t = await getTranslations({ locale, namespace: 'Dashboard.accounts' });
  const accountsT = await getTranslations({ locale, namespace: 'Accounts' });

  const getAccountTypeIcon = (type: string): string => {
    switch (type) {
      case 'checking': return '';
      case 'savings': return '';
      case 'investment': return '';
      default: return '';
    }
  };

  const getBalanceColor = (balance: number): string => {
    return balance >= 0 ? 'text-green-600' : 'text-red-500';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <Card className="bg-gradient-to-r from-clean-dark to-clean-secondary text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{getAccountTypeIcon(account.type)}</span>
              <div>
                <Typography variant="h2" className="text-white mb-2">
                  {accountsT(`types.${account.type}`)}
                </Typography>
                <Typography variant="body" className="text-white opacity-90">
                  {account.accountNumber}
                </Typography>
              </div>
            </div>
            <div className="text-right">
              <Typography variant="caption" className="text-white opacity-75 mb-1">
                {t('balance')}
              </Typography>
              <Typography variant="h1" className={`font-bold ${getBalanceColor(account.balance)} text-white`}>
                {formatCurrency(account.balance)}
              </Typography>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <Typography variant="caption" color="muted" className="mb-2">
              {t('accountNumber')}
            </Typography>
            <Typography variant="body" className="font-mono">
              {account.accountNumber}
            </Typography>
          </Card>
          
          <Card>
            <Typography variant="caption" color="muted" className="mb-2">
              {t('openedOn')}
            </Typography>
            <Typography variant="body">
              {formatDate(account.createdAt)}
            </Typography>
          </Card>
          
          <Card>
            <Typography variant="caption" color="muted" className="mb-2">
              {t('status')}
            </Typography>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              account.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {account.isActive ? accountsT('status.active') : accountsT('status.inactive')}
            </div>
          </Card>
        </div>

        {account.interestRate && (
          <Card className="bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h4" className="text-green-800 mb-1">
                  {t('interestRate')}
                </Typography>
                <Typography variant="caption" className="text-green-600">
                  {t('annualGrossRate')}
                </Typography>
              </div>
              <Typography variant="h2" className="text-green-600 font-bold">
                {account.interestRate}%
              </Typography>
            </div>
          </Card>
        )}

        <div className="flex flex-wrap gap-4">
          <Button variant="primary">
            {t('actions.makeTransfer')}
          </Button>
          <Button variant="outline">
            {t('actions.downloadRib')}
          </Button>
          <Button variant="outline">
            {t('actions.fullHistory')}
          </Button>
        </div>

        <RecentOperations 
          operations={accountOperations}
          limit={10}
        />
      </div>
    </DashboardLayout>
  );
}