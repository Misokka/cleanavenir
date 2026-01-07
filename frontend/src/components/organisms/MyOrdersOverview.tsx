'use client';
import { useGetMyOrders } from '@/features/orders/useGetMyOrders'
import React from 'react'
import { useTranslations } from 'next-intl';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  BanknotesIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { Order } from '@/infrastructure/web/services/orderService';


const formatCurrency = (value: number | undefined) => {
  if (value === undefined) return '0,00 €';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface MyOrdersOverviewProps {
  orders: Order[] | undefined,
  loading: boolean,
  error: Error | null
}

function MyOrdersOverview({orders, loading, error}: MyOrdersOverviewProps) {
  const t = useTranslations('Investment.orders');

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
        {t('error')}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => {
        const isBuy = order.type === 'BUY';
        
        return (
          <div 
            key={order.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col"
          >
            {/* --- HEADER --- */}
            <div className="p-5 border-b border-gray-50 flex justify-between items-start">
              <div className="flex gap-3">
                {/* Icône Type d'ordre */}
                <div className={`p-2 rounded-lg ${isBuy ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                  {isBuy ? <ArrowTrendingUpIcon className="w-5 h-5" /> : <ArrowTrendingDownIcon className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{order.stockName}</h3>
                  <p className={`text-xs font-medium uppercase tracking-wider ${isBuy ? 'text-indigo-600' : 'text-orange-600'}`}>
                    {isBuy ? t('buy') : t('sell')}
                  </p>
                </div>
              </div>
              
              {/* Badge Statut */}
              <StatusBadge status={order.status} />
            </div>

            {/* --- BODY --- */}
            <div className="p-5 space-y-4 flex-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{t('initialQuantity')}</span>
                <span className="font-medium text-gray-900">{order.initialQuantity} {t('shares')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{t('remainingQuantity')}</span>
                <span className="font-medium text-gray-900">{order.remainingQuanity} {t('shares')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{t('limitPrice')}</span>
                <span className="font-medium text-gray-900">{formatCurrency(order.limitPrice)}</span> 
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{t('date')}</span>
                <span className="text-gray-700">{formatDate(order.createdAt)}</span>
              </div>
            </div>

            {/* --- FOOTER (Info Bloquée) --- */}
            <div className={`px-5 py-3 text-xs font-medium border-t ${isBuy ? 'bg-indigo-50/50 border-indigo-100' : 'bg-orange-50/50 border-orange-100'}`}>
              <div className="flex items-center gap-2">
                {isBuy ? (
                  <>
                    <BanknotesIcon className="w-4 h-4 text-indigo-500" />
                    <span className="text-indigo-700">
                      {t('blockedAmount')} : <span className="font-bold">{formatCurrency(order.blockedMoneyAmount)}</span>
                    </span>
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-700">
                      {t('blockedShares')} : <span className="font-bold">{order.blockedStockQuantity} {t('units')}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )
}

// Petit composant interne pour gérer les couleurs des statuts
function StatusBadge({ status }: { status: string }) {
  const t = useTranslations('Investment.orders.status');
  const styles = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    PARTIALLY_FILLED: "bg-blue-50 text-blue-700 border-blue-200",
    EXECUTED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-gray-50 text-gray-600 border-gray-200",
  };

  const statusKeyMap = {
    PENDING: 'pending',
    PARTIALLY_FILLED: 'partiallyFilled',
    EXECUTED: 'executed',
    CANCELLED: 'cancelled',
  } as const;

  const icons = {
    PENDING: ClockIcon,
    PARTIALLY_FILLED: ClockIcon, // Ou une icône pie-chart
    EXECUTED: CheckCircleIcon,
    CANCELLED: XCircleIcon,
  };

  const style = styles[status as keyof typeof styles] || styles.CANCELLED;
  const key = statusKeyMap[status as keyof typeof statusKeyMap];
  const label = key ? t(key) : status;
  const Icon = icons[status as keyof typeof styles] || ClockIcon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

export default MyOrdersOverview