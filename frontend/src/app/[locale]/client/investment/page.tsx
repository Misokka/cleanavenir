import { Typography } from '@/components/atoms/Typography'
import InvestmentDashBoard from '@/components/organisms/InvestmentDashboard'
import MyOrdersOverview from '@/components/organisms/MyOrdersOverview'
import MyPortfolioOverview from '@/components/organisms/MyPortfolioOverview'
import StockOverview from '@/components/organisms/StockOverview'
import DashboardLayout from '@/components/templates/DashboardLayout'
import React from 'react'

function page() {
  return (
    <InvestmentDashBoard />
  )
}

export default page