'use client';
import React, { FormEvent } from 'react'
import { Typography } from '../atoms/Typography'
import { useGetMyPortfolio } from '@/features/portfolios/useGetMyPortfolio';
import { useCreatePortfolio } from '@/features/portfolios/useCreatePortfolio';
import { BriefcaseIcon, PlusIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// --- 1. MOCK DATA (Données en Euros) ---
const MOCK_HOLDINGS = [
  {
    id: '1',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    quantity: 12,
    avgPrice: 145.50, // Directement en Euros
    currentPrice: 172.30, 
  },
  {
    id: '2',
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    quantity: 8,
    avgPrice: 245.00,
    currentPrice: 210.00, // Perte
  },
  {
    id: '3',
    ticker: 'NVDA',
    name: 'NVIDIA Corp.',
    quantity: 5,
    avgPrice: 420.00,
    currentPrice: 850.00, // Gain
  }
]

// --- 2. UTILITAIRES ---
// Plus de division par 100 ici, on formate directement le nombre
const formatCurrency = (value: number) => 
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);

const formatPercent = (value: number) => 
  new Intl.NumberFormat('fr-FR', { style: 'percent', minimumFractionDigits: 2 }).format(value);

function MyPortfolioOverview() {

  const {portfolio, fetchMyPortfolio, loading, error} = useGetMyPortfolio();
  const {createPortfolio, success, error: createPortfolioError} = useCreatePortfolio();

  // Calculs (inchangés, fonctionnent pareil avec des entiers ou des floats)
  const totalPortfolioValue = MOCK_HOLDINGS.reduce((acc, h) => acc + (h.quantity * h.currentPrice), 0);
  const totalInvested = MOCK_HOLDINGS.reduce((acc, h) => acc + (h.quantity * h.avgPrice), 0);
  const totalPnl = totalPortfolioValue - totalInvested;
  
  // Protection contre la division par zéro si totalInvested = 0
  const totalPnlPercent = totalInvested > 0 ? totalPnl / totalInvested : 0;


  async function handleCreatePortfolio(e: FormEvent){
    e.preventDefault();
    await createPortfolio();
    if(success){
      fetchMyPortfolio();
    } else {
      console.error(createPortfolioError)
    }
  }

if(loading){
    return (
      <div className="space-y-6 animate-pulse">
        {/* Skeleton Carte Principale */}
        <div className="h-32 bg-gray-200 rounded-2xl w-full"></div>
        
        {/* Skeleton Titre */}
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>

        {/* Skeleton Liste */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded ml-auto"></div>
                <div className="h-3 w-16 bg-gray-200 rounded ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if(!portfolio){
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 text-center">
        <div className="bg-indigo-50 p-4 rounded-full mb-4">
          <BriefcaseIcon className="w-8 h-8 text-indigo-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900">Aucun portefeuille actif</h3>
        <p className="text-gray-500 max-w-sm mt-2 mb-6 text-sm">
          Commencez votre aventure d'investissement dès maintenant en ouvrant votre premier portefeuille de titres.
        </p>

        <form onSubmit={handleCreatePortfolio}>
          <button 
            type="submit"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="w-5 h-5" />
            Ouvrir mon portefeuille
          </button>
        </form>
        
        {/* Message d'erreur discret si la création échoue */}
        {createPortfolioError && (
          <p className="text-red-600 text-xs mt-4 bg-red-50 px-3 py-1 rounded-md">
              Erreur : {createPortfolioError.message}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* --- BLOC 1: RÉSUMÉ GLOBAL --- */}
      {/* <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg">
        <Typography variant="body" className="text-indigo-100 opacity-80">
          Valeur totale estimée
        </Typography>
        <div className="flex items-baseline gap-4 mt-1">
          <span className="text-3xl font-bold tracking-tight">
            {formatCurrency(totalPortfolioValue)}
          </span>
          <div className={`flex items-center text-sm font-medium px-2 py-0.5 rounded-full ${totalPnl >= 0 ? 'bg-green-400/20 text-green-100' : 'bg-red-400/20 text-red-100'}`}>
            {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)} ({formatPercent(totalPnlPercent)})
          </div>
        </div>
      </div> */}

      {/* --- BLOC 2: LISTE DES HOLDINGS --- */}
      <div className="space-y-4">
        <Typography variant="h3" className="font-semibold text-gray-900">
          Mes Positions
        </Typography>

        {portfolio && !portfolio.holdings.length && (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white border border-dashed border-gray-300 rounded-xl text-center">
            {/* Icône décorative */}
            <div className="bg-indigo-50 p-3 rounded-full mb-4">
              <MagnifyingGlassIcon className="w-6 h-6 text-indigo-600" />
            </div>

            {/* Titre et Description */}
            <h3 className="text-sm font-semibold text-gray-900">
              Votre portefeuille est vide
            </h3>
            <p className="mt-1 text-sm text-gray-500 max-w-xs mx-auto">
              Vous n'avez pas encore de positions ouvertes. Explorez le marché pour trouver votre première opportunité.
            </p>
          </div>
        )}

        {portfolio && portfolio.holdings.length > 0 && (
          <>
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {portfolio.holdings.map((holding) => {
                  const currentValue = holding.quantity * holding.stock.price;
                  const investValue = holding.quantity * holding.averagePrice;
                  const profitAndLoss = currentValue - investValue;
                  const profitAndLossPercent = investValue > 0 ? profitAndLoss / investValue : 0;
                  const isProfit = profitAndLoss >= 0;

                  return (
                    <li key={holding.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        
                        {/* Gauche: Info Action */}
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600 border border-gray-200">
                            {holding.stock.ticker}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{holding.stock.company.name}</p>
                            <p className="text-sm text-gray-500">
                              {holding.quantity} part{holding.quantity > 1 ? 's' : ''} • PRU {formatCurrency(holding.averagePrice)}
                            </p>
                          </div>
                        </div>

                        {/* Droite: Valeur et Perf */}
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(currentValue)}</p>
                          <p className={`text-sm flex items-center justify-end gap-1 ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                            {isProfit ? '▲' : '▼'} {formatPercent(profitAndLossPercent)}
                          </p>
                        </div>

                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default MyPortfolioOverview