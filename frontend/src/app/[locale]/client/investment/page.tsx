import { Typography } from '@/components/atoms/Typography'
import MyOrdersOverview from '@/components/organisms/MyOrdersOverview'
import MyPortfolioOverview from '@/components/organisms/MyPortfolioOverview'
import StockOverview from '@/components/organisms/StockOverview'
import DashboardLayout from '@/components/templates/DashboardLayout'
import React from 'react'

function page() {
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
          <StockOverview />
        </section>

        <section className="mb-8">
          <Typography variant="h2" className='mt-6 mb-4'>My portfolio</Typography>
          <MyPortfolioOverview />
        </section>

        <section className="mb-8">
          <Typography variant='h2' className='mt-6 mb-4'>Mes ordres</Typography>
          <MyOrdersOverview />
        </section>
      </DashboardLayout>
    </>
  )
}

export default page