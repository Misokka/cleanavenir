'use client';

import { useGetStocks } from '@/features/stocks/useGetStocks';
import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import CreateOrderForm from './CreateOrderForm';
import { Stock } from '@/infrastructure/web/services/stocksService';

// Type pour nos données simulées de graphique
type ChartDataPoint = {
  time: string;
  value: number;
};

// Fonction utilitaire pour formater le prix (ex: 15000 -> 150,00 €)
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

// Fonction pour générer de la fausse donnée historique (en attendant ton backend)
// Cela crée une courbe réaliste autour du prix actuel
const generateMockHistory = (currentPrice: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  let price = currentPrice;
  
  for (let i = 30; i >= 0; i--) {
    // Variation aléatoire entre -2% et +2%
    const variation = price * (Math.random() * 0.04 - 0.02);
    price = price - variation; 
    
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      time: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      value: Number(price.toFixed(2)),
    });
  }
  return data;
};

interface StockOverviewProps{
  fetchOrders: () => void;
  fetchPortfolio: () => void;
}

function StockOverview({ fetchOrders, fetchPortfolio }: StockOverviewProps) {
  const { stocks, fetchStocks, loading, error } = useGetStocks();
  
  // État pour savoir quelle action est sélectionnée pour afficher le graphe
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);

  //pour le formulaire de création d'ordre
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedStockForForm, setSelectedStockForForm] = useState<Stock | null>(null)
  function handleClose(){
    setIsFormOpen(false);
  }

  function selectStockForForm(stock: Stock){
    setSelectedStockForForm(stock);
    setIsFormOpen(true);
  }

  useEffect(() => {
    if(!error){
      setSelectedStockId(stocks.length > 0 ? stocks[0].id : null);
    }
  }, [stocks, error]);

  // Trouver l'action sélectionnée
  const selectedStock = stocks.find(s => s.id === selectedStockId);

  // Générer les données du graphique seulement quand la sélection change
  const chartData = useMemo(() => {
    if (!selectedStock) return [];
    return generateMockHistory(selectedStock.price);
  }, [selectedStock]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
        Erreur: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
     
      <CreateOrderForm 
        isOpen={isFormOpen}
        onClose={handleClose}
        selectedStock={selectedStockForForm}
        
        onOrderCreated={() => {
          fetchOrders();
          fetchPortfolio();
        }}
      />

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Ticker
              </th>
              <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                Entreprise
              </th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                Prix Actuel
              </th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {stocks.map((stock) => (
              <tr 
                key={stock.id} 
                onClick={() => setSelectedStockId(stock.id)}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${selectedStockId === stock.id ? 'bg-indigo-50 hover:bg-indigo-50' : ''}`}
              >
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {stock.ticker}
                    </span>
                  </div>
                </td>
                <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
                  {stock.company.name} 
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-mono text-gray-900">
                  {formatPrice(stock.price)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation(); // Empêche le clic de ligne
                      // Logique d'achat ici
                      selectStockForForm(stock);
                    }}
                  >
                    Acheter ou vendre
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- SECTION 2: LE GRAPHIQUE --- */}
      {selectedStock && (
        <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-gray-900/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Évolution de {selectedStock.ticker}
            </h3>
            <p className="text-sm text-gray-500">Historique sur 30 jours (simulé)</p>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{fontSize: 12, fill: '#6B7280'}}
                  dy={10}
                  minTickGap={30}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{fontSize: 12, fill: '#6B7280'}}
                  tickFormatter={(value: string) => `${value}€`}
                  domain={['auto', 'auto']} // Zoom automatique sur la variation
                />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [`${value} €`, 'Prix']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockOverview