'use client';
import { useGetSavingProducts } from '@/features/savings/useGetSavingProducts';
import React, { useEffect, useState } from 'react'
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { SavingProductDTO } from '@/infrastructure/web/services/savingService';
import SavingProductForm from './SavingProductForm';

interface SavingProductsOverviewProps {
  savingProducts?: SavingProductDTO[];
  onSuccess: () => Promise<SavingProductDTO[] | undefined>;
}

function SavingProductsOverview({ savingProducts, onSuccess }: SavingProductsOverviewProps) {
  // const { savingProducts, isLoading, error, setError} = useGetSavingProducts();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isFormActive, setIsFormActive] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<SavingProductDTO | undefined>(undefined);

  useEffect(() => {
    if (!openMenuId) return;

    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId]);

  const handleMenuToggle = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === productId ? null : productId);
  };

  return (
    <>
      <div>
        {/* {isLoading ? <p>Loading...</p> : null}
        {error ? <p>Error: {error.message}</p> : null} */}

        <div className='flex flex-col gap-3 md:grid md:grid-cols-3'>
        {savingProducts && savingProducts.map((product) => (
          <Card key={product.id} className='relative'>
            <div className="flex justify-between items-center">
              <div>
                <Typography variant='h4'>{product.label.toUpperCase()}</Typography>
                <Typography variant='body'>Taux: {product.rate}%</Typography>
              </div>

              {/* ellipsis svg */}
              <div 
                onClick={(e) => handleMenuToggle(e, product.id)}
                className={`rounded-full hover:bg-slate-200 transition-all p-1 cursor-pointer ${openMenuId === product.id ? 'bg-slate-200' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* modal */}
            {openMenuId === product.id && (
              <div 
                className='absolute top-10 right-4 bg-white shadow-md w-32 rounded-md p-2 space-y-2 flex flex-col z-10 border border-slate-100'
                onClick={(e) => e.stopPropagation()} // Empêche le menu de se fermer si on clique DEDANS
              >
                
                <button className='text-left hover:bg-slate-50 p-1 rounded text-sm' onClick={() => {
                  setIsFormActive(true);
                  setProductToEdit(product);
                }}>Modifier</button>
              </div>
            )}
          </Card>
        ))}
        </div>
        
      </div>

      <SavingProductForm isActive={isFormActive} action='edit' productToEdit={productToEdit} onClose={() => setIsFormActive(false)} onSuccess={onSuccess}/>
    </>
  )
}

export default SavingProductsOverview