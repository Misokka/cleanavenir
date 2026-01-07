'use client';
import { useGetMyOrders } from '@/features/orders/useGetMyOrders';
import React from 'react'
import { useTranslations } from 'next-intl';
import DashboardLayout from '../templates/DashboardLayout';
import { Typography } from '../atoms/Typography';
import StockOverview from './StockOverview';
import MyPortfolioOverview from './MyPortfolioOverview';
import MyOrdersOverview from './MyOrdersOverview';
import { useGetMyPortfolio } from '@/features/portfolios/useGetMyPortfolio';

function InvestmentDashBoard() {
  const t = useTranslations('Investment');
  const { fetchMyOrders, myOrders, loading: getOrdersLoading, error: getOrdersError } = useGetMyOrders();
  const {fetchMyPortfolio, portfolio, loading: getPortfolioLoading, error: getPortfolioError} = useGetMyPortfolio();

  return (
    <>
      <DashboardLayout>
        <Typography variant="h1" className='mb-4'>{t('title')}</Typography>
        <Typography>
          {t('welcome')}
        </Typography>

        <section className="mb-8">
          <Typography variant="h2" className='mt-6 mb-4'>{t('stocks.title')}</Typography>
          {/* List all available stocks for investment */}
          <StockOverview fetchOrders={fetchMyOrders} fetchPortfolio={fetchMyPortfolio}/>
        </section>

        <section className="mb-8">
          <Typography variant="h2" className='mt-6 mb-4'>{t('portfolio.title')}</Typography>
          <MyPortfolioOverview
            portfolio={portfolio}
            fetchPortfolio={fetchMyPortfolio}
            loading={getPortfolioLoading}
            error={getPortfolioError}
          />
        </section>

        <section className="mb-8">
          <Typography variant='h2' className='mt-6 mb-4'>{t('orders.title')}</Typography>
          <MyOrdersOverview
            orders={myOrders}
            loading={getOrdersLoading}
            error={getOrdersError}
          />
        </section>
      </DashboardLayout>
    </>
  )
}

export default InvestmentDashBoard