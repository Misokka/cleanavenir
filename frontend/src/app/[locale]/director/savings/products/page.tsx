'use client';
import { Button } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography'
import SavingProductForm from '@/components/organisms/SavingProductForm';
import SavingProductsOverview from '@/components/organisms/SavingProductsOverview';
import DashboardLayout from '@/components/templates/DashboardLayout'
import { useGetSavingProducts } from '@/features/savings/useGetSavingProducts';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react'

function page() {
  const t = useTranslations('Director.savings');
  const [formActive, setFormActive] = useState<boolean>(false);

  function close(){
    setFormActive(false)
  }

  const { getSavingProducts, savingProducts, isLoading, error, setError} = useGetSavingProducts();

  return (
    <>
    <DashboardLayout>
      <Typography variant='h1'>{t('savingProduct.title')}</Typography>

      <Button className='mt-8' onClick={() => setFormActive(true)}>
        + Créer un produit d'épargne
      </Button>

      <section className="mt-12">
        <SavingProductsOverview savingProducts={savingProducts} onSuccess={getSavingProducts}/>
      </section>

    </DashboardLayout>

    <SavingProductForm isActive={formActive} action='create' onClose={close} onSuccess={getSavingProducts}/>
    </>
  )
}

export default page