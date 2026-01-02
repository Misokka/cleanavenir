'use client';
import { useGetMyOrders } from '@/features/orders/useGetMyOrders'
import React from 'react'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  BanknotesIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';


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

function MyOrdersOverview() {
  const { myOrders, loading, error } = useGetMyOrders();

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
        Une erreur est arrivée pendant la récupération de vos ordres.
      </div>
    );
  }

  if (!myOrders || myOrders.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500">Aucun ordre récent.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {myOrders.map((order) => {
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
                    {isBuy ? 'Achat' : 'Vente'}
                  </p>
                </div>
              </div>
              
              {/* Badge Statut */}
              <StatusBadge status={order.status} />
            </div>

            {/* --- BODY --- */}
            <div className="p-5 space-y-4 flex-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Quantité</span>
                <span className="font-medium text-gray-900">{order.quantity} titres</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Prix limite</span>
                <span className="font-medium text-gray-900">{formatCurrency(order.limitPrice)}</span> 
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Date</span>
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
                      Montant bloqué : <span className="font-bold">{formatCurrency(order.blockedMoneyAmount)}</span>
                    </span>
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-700">
                      Titres bloqués : <span className="font-bold">{order.blockedStockQuantity} unités</span>
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
  const styles = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    PARTIALLY_FILLED: "bg-blue-50 text-blue-700 border-blue-200",
    EXECUTED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-gray-50 text-gray-600 border-gray-200",
  };

  const labels = {
    PENDING: "En attente",
    PARTIALLY_FILLED: "Partiel",
    EXECUTED: "Exécuté",
    CANCELLED: "Annulé",
  };

  const icons = {
    PENDING: ClockIcon,
    PARTIALLY_FILLED: ClockIcon, // Ou une icône pie-chart
    EXECUTED: CheckCircleIcon,
    CANCELLED: XCircleIcon,
  };

  const style = styles[status as keyof typeof styles] || styles.CANCELLED;
  const label = labels[status as keyof typeof styles] || status;
  const Icon = icons[status as keyof typeof styles] || ClockIcon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

export default MyOrdersOverview