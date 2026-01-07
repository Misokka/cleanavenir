'use client';
import { useGetMyOrders } from '@/features/orders/useGetMyOrders'
import { useTranslations } from 'next-intl';

import React, { FormEvent, useState, useRef, useEffect } from 'react'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  BanknotesIcon,
  LockClosedIcon,
  EllipsisVerticalIcon, // <--- NOUVEL IMPORT
  TrashIcon             // <--- NOUVEL IMPORT
} from '@heroicons/react/24/outline';
import { Order } from '@/infrastructure/web/services/orderService';
import { useCancelMyOrder } from '@/features/orders/useCancelMyOrder';

// --- UTILITAIRES ---
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
  error: Error | null,
  refetchOrders: () => void;
  refetchPortfolio: () => void;
}


function MyOrdersOverview({orders, loading, error, refetchOrders, refetchPortfolio}: MyOrdersOverviewProps) {
    const t = useTranslations('Investment.orders');


  // Cette fonction est passée aux enfants
  async function handleCancelOrder(orderId: string){
    const response = await cancelMyOrder(orderId);
    if(response instanceof Error){
      throw response
    } else {
      console.log(response.message);
      refetchOrders();
      refetchPortfolio();

    }
  }

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
      {orders.map((order) => (
        <OrderCard 
          key={order.id} 
          order={order} 
          onCancelOrder={handleCancelOrder} 
        />
      ))}
    </div>
  )
}

// --- SOUS-COMPOSANT CARTE (Pour isoler la logique du menu) ---
interface OrderCardProps {
  order: Order;
  onCancelOrder: (id: string) => Promise<void>;
}

function OrderCard({ order, onCancelOrder }: OrderCardProps) {
  const isBuy = order.type === 'BUY';
  const isCancelable = ["PENDING", "PARTIALLY_FILLED"].includes(order.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible hover:shadow-md transition-shadow duration-200 flex flex-col relative">


      
      
      
      
      
      
      
      
      
      
      
      
      
      
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
}

// --- SOUS-COMPOSANT MENU DÉROULANT ---
function OrderMenu({ orderId, onCancel }: { orderId: string, onCancel: (id: string) => Promise<void> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCancelClick = async () => {
    try {
      setIsCancelling(true);
      await onCancel(orderId);
      setIsCancelling(false);
      setIsOpen(false);
    } catch (e) {
      console.error(e);
      setIsCancelling(false);
    }
  };

  return (
    <div className="relative ml-2" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="Options"
      >
        <EllipsisVerticalIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
          <div className="py-1">
            <button
              onClick={handleCancelClick}
              disabled={isCancelling}
              className="group flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCancelling ? (
                <div className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
              ) : (
                <TrashIcon className="mr-3 h-4 w-4 text-red-500 group-hover:text-red-600" aria-hidden="true" />
              )}
              {isCancelling ? 'Annulation...' : "Annuler l'ordre"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SOUS-COMPOSANT BADGE STATUT ---
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
    PARTIALLY_FILLED: ClockIcon, 
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

export default MyOrdersOverview;