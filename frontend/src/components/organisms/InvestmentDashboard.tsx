'use client';
import { useGetMyOrders } from '@/features/orders/useGetMyOrders';
import React from 'react'
import DashboardLayout from '../templates/DashboardLayout';
import { Typography } from '../atoms/Typography';
import StockOverview from './StockOverview';
import MyPortfolioOverview from './MyPortfolioOverview';
import MyOrdersOverview from './MyOrdersOverview';
import { useGetMyPortfolio } from '@/features/portfolios/useGetMyPortfolio';

function InvestmentDashBoard() {
  const { fetchMyOrders, myOrders, loading: getOrdersLoading, error: getOrdersError } = useGetMyOrders();
  const { fetchMyPortfolio, portfolio, loading: getPortfolioLoading, error: getPortfolioError} = useGetMyPortfolio();

  return (
    <>
      <DashboardLayout>
        <Typography variant="h1" className='mb-4'>Investment Page</Typography>
        <Typography>
          Welcome to the investment section of our client portal.
        </Typography>

        <section className="mb-8">
          <Typography variant="h2" className='mt-6 mb-4'>Stocks</Typography>
          {/* List all available stocks for investment */}
          <StockOverview fetchOrders={fetchMyOrders} fetchPortfolio={fetchMyPortfolio}/>
        </section>

        <section className="mb-8">
          <Typography variant="h2" className='mt-6 mb-4'>My portfolio</Typography>
          <MyPortfolioOverview
            portfolio={portfolio}
            fetchPortfolio={fetchMyPortfolio}
            loading={getPortfolioLoading}
            error={getPortfolioError}
          />
        </section>

        <section className="mb-8">
          <Typography variant='h2' className='mt-6 mb-4'>Mes ordres</Typography>
          <MyOrdersOverview
            orders={myOrders}
            loading={getOrdersLoading}
            error={getOrdersError}
            refetchOrders={fetchMyOrders}
            refetchPortfolio={fetchMyPortfolio}
          />
        </section>
      </DashboardLayout>
    </>
  )
}

export default InvestmentDashBoard