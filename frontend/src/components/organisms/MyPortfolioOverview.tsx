import React from 'react'
import { Typography } from '../atoms/Typography'

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

  // Calculs (inchangés, fonctionnent pareil avec des entiers ou des floats)
  const totalPortfolioValue = MOCK_HOLDINGS.reduce((acc, h) => acc + (h.quantity * h.currentPrice), 0);
  const totalInvested = MOCK_HOLDINGS.reduce((acc, h) => acc + (h.quantity * h.avgPrice), 0);
  const totalPnl = totalPortfolioValue - totalInvested;
  
  // Protection contre la division par zéro si totalInvested = 0
  const totalPnlPercent = totalInvested > 0 ? totalPnl / totalInvested : 0;

  return (
    <div className="space-y-6">
      
      {/* --- BLOC 1: RÉSUMÉ GLOBAL --- */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg">
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
      </div>

      {/* --- BLOC 2: LISTE DES HOLDINGS --- */}
      <div className="space-y-4">
        <Typography variant="h3" className="font-semibold text-gray-900">
          Mes Positions
        </Typography>

        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {MOCK_HOLDINGS.map((holding) => {
              const currentValue = holding.quantity * holding.currentPrice;
              const investValue = holding.quantity * holding.avgPrice;
              const pnl = currentValue - investValue;
              const pnlPercent = investValue > 0 ? pnl / investValue : 0;
              const isProfit = pnl >= 0;

              return (
                <li key={holding.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    
                    {/* Gauche: Info Action */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600 border border-gray-200">
                        {holding.ticker}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{holding.name}</p>
                        <p className="text-sm text-gray-500">
                          {holding.quantity} part{holding.quantity > 1 ? 's' : ''} • PRU {formatCurrency(holding.avgPrice)}
                        </p>
                      </div>
                    </div>

                    {/* Droite: Valeur et Perf */}
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(currentValue)}</p>
                      <p className={`text-sm flex items-center justify-end gap-1 ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                        {isProfit ? '▲' : '▼'} {formatPercent(pnlPercent)}
                      </p>
                    </div>

                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MyPortfolioOverview