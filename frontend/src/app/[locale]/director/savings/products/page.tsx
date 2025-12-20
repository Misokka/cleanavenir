import { Typography } from '@/components/atoms/Typography'
import DashboardLayout from '@/components/templates/DashboardLayout'
import { useTranslations } from 'next-intl';
import React from 'react'

function page() {
  const t = useTranslations('Director.savings');
  return (
    <DashboardLayout>
      <Typography variant='h1'>{t('savingProduct.title')}</Typography>
    </DashboardLayout>
  )
}

export default page