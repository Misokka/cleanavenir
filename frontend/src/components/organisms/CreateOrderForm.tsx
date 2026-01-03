'use client';
import React, { FormEvent, useEffect, useState } from 'react'
import { Typography } from '../atoms/Typography'
import { createOrderRequest } from '@/infrastructure/web/services/orderService';
import { XMarkIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, BanknotesIcon, LockClosedIcon } from '@heroicons/react/24/outline'; // Icônes optionnelles
import { Stock } from '@/infrastructure/web/services/stocksService';
import { useCreateOrder } from '@/features/orders/useCreateOrder';
import { useGetMyOrders } from '@/features/orders/useGetMyOrders';
import { useShowBestBuyAndSellOrderForStock } from '@/features/orders/useShowBestBuyAndSellOrderForStock';


type CreateOrderFormProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedStock: Stock | null;
  onOrderCreated: () => void;
}

function CreateOrderForm({ isOpen, onClose, selectedStock, onOrderCreated}: CreateOrderFormProps) {
  const {createOrder, order, loading, error: createOrderError, reset} = useCreateOrder();
  const {fetchBestOrdersForStock, bestOrders, loading: bestOrdersLoading, error: bestOrdersError} = useShowBestBuyAndSellOrderForStock()
  const [formError, setFormError] = useState<string | null>(null)
  const [formData, setFormData] = useState<createOrderRequest>({
    stockId: selectedStock?.id ?? "", 
    quantity: 1,
    limitPrice: selectedStock?.price ?? 0,
    type: "BUY"
  });

  useEffect(() => {
    if (selectedStock) {
      setFormData(prev => ({
        ...prev,
        stockId: selectedStock.id,
        limitPrice: selectedStock.price
      }));

      fetchBestOrdersForStock(selectedStock.id);
    }
  }, [selectedStock]);

  const withdrawnAmount = ((formData.limitPrice ?? 0 ) * formData.quantity).toFixed(2)

  async function handleSubmit(e: FormEvent){
    e.preventDefault();
    const createOrderError = await createOrder(formData);
    
    if(createOrderError){
      setFormError(createOrderError.message);
    } else {
      onOrderCreated();
      onClose();
    }

  }

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex justify-center items-center p-4 sm:p-0'>
      <div 
        className='fixed inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity' 
        onClick={onClose}
      />

      {/* 2. La Carte Modale */}
      <div className='relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden ring-1 ring-gray-900/5'>
        
        {/* Header de la modale */}
        <div className='bg-gray-50 px-5 py-4 border-b border-gray-100 flex justify-between items-center'>
          <div>
            <Typography variant='h4' className='text-gray-900 font-semibold'>
              Passer un ordre
            </Typography>
            <p className='text-xs text-gray-500 mt-0.5'>Sur {selectedStock?.ticker}</p>
          </div>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition'>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/*BLOCK RAJOUTÉ POUR L'UTILISATEUR */}
        <div className='px-6 pt-5 pb-1'>
          <h4 className="block text-sm font-medium mb-2 text-gray-700">Carnet d'ordres</h4>
          
          {bestOrdersLoading ? (
            // Skeleton loader simple
            <div className="grid grid-cols-2 gap-3 animate-pulse">
                <div className="h-16 bg-gray-100 rounded-lg"></div>
                <div className="h-16 bg-gray-100 rounded-lg"></div>
            </div>
          ) : bestOrders ? (
             <div className="grid grid-cols-2 gap-3">
               
               {/* Carte ASK (Vendeurs) - Rouge */}
               <div className="bg-red-50/60 p-3 rounded-lg border border-red-100 flex flex-col items-center justify-center text-center">
                 <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">Meilleur Vendeur</span>
                 {bestOrders.bestSellOrder ? (
                   <>
                     <span className="text-lg font-bold text-gray-900">{bestOrders.bestSellOrder.limitPrice} €</span>
                     <span className="text-xs text-gray-500">{bestOrders.bestSellOrder.remainingQuanity} titres dispo</span>
                   </>
                 ) : (
                   <span className="text-xs text-gray-400 italic">Aucune offre</span>
                 )}
               </div>

               {/* Carte BID (Acheteurs) - Vert */}
               <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-100 flex flex-col items-center justify-center text-center">
                 <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Meilleur Acheteur</span>
                 {bestOrders.bestBuyOrder ? (
                   <>
                     <span className="text-lg font-bold text-gray-900">{bestOrders.bestBuyOrder.limitPrice} €</span>
                     <span className="text-xs text-gray-500">{bestOrders.bestBuyOrder.remainingQuanity} demandés</span>
                   </>
                 ) : (
                   <span className="text-xs text-gray-400 italic">Aucune demande</span>
                 )}
               </div>

             </div>
          ) : null}
        </div>

        {/* Formulaire */}
        <form className='p-6 space-y-6' onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Type d'ordre</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "BUY" })}
                className={`flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
                  formData.type === "BUY"
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ArrowTrendingUpIcon className="w-4 h-4" /> Achat
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "SELL" })}
                className={`flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
                  formData.type === "SELL"
                    ? "bg-white text-red-600 shadow-sm ring-1 ring-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ArrowTrendingDownIcon className="w-4 h-4" /> Vente
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {/* input quantité */}
            <label htmlFor="qty" className="block text-sm font-medium text-gray-700">Quantité</label>
            <div className="relative">
              <input
                id="qty"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="block w-full rounded-lg border-0 py-2.5 pl-4 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white shadow-sm"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-gray-500 text-xs font-medium uppercase">Titres</span>
              </div>
            </div>

            {/* input prix limit */}
            <div className="space-y-2">
              <label htmlFor="limitPrice" className="block text-sm font-medium text-gray-700">Prix Limite</label>
              <div className="relative">
                <input
                  id="limitPrice"
                  type="number"
                  step="0.01" // Permet les centimes
                  min="0.01"
                  value={formData.limitPrice}
                  onChange={(e) => setFormData({ ...formData, limitPrice: Number(e.target.value) })}
                  className="block w-full rounded-lg border-0 py-2.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white shadow-sm"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400 text-xs font-medium">€</span>
                </div>
              </div>
            </div>
          </div>



          {/* Bouton de confirmation */}
          <button
            type="submit"
            className={`w-full rounded-lg px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors ${
              formData.type === 'BUY' 
                ? 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600' 
                : 'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600'
            }`}
          >
            Confirmer {formData.type === 'BUY' ? "l'achat" : "la vente"}
          </button>

          {formData.type === "BUY" && (
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <BanknotesIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Impact sur solde</h3>
                  <div className="mt-1 text-sm text-blue-700">
                    <p>
                      Un montant de <span className="font-bold">{withdrawnAmount}€ + 1€ (frais d'achat/vente)</span> seront débité immédiatement de votre compte courant.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData.type === "SELL" && (
            <div className="rounded-lg bg-amber-50 p-4 border border-amber-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <LockClosedIcon className="h-5 w-5 text-amber-600" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Verrouillage des actifs</h3>
                  <div className="mt-1 text-sm text-amber-700">
                    <p>
                      <span className="font-bold">{formData.quantity} titres</span> {selectedStock?.ticker} seront verrouillés dans votre portefeuille jusqu'à l'exécution de l'ordre.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formError && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
              {formError}
            </div>
          )}
        </form>
      </div>    
    </div>
  )
}

export default CreateOrderForm