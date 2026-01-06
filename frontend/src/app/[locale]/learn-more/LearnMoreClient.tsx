'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';

export function LearnMoreClient() {
  const t = useTranslations('LearnMore');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-clean-dark to-clean-secondary text-white py-16 lg:py-24">
        <div className="container mx-auto px-6 text-center">
          <Typography variant="h1" color="white" className="mb-6 max-w-3xl mx-auto">
            {t('hero.title')}
          </Typography>
          <Typography variant="subtitle" color="white" className="max-w-2xl mx-auto opacity-90">
            {t('hero.subtitle')}
          </Typography>
        </div>
      </section>

      {/* Avantages principaux */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-4">
              {t('advantages.title')}
            </Typography>
            <Typography variant="body" color="muted" className="max-w-2xl mx-auto">
              {t('advantages.subtitle')}
            </Typography>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pas de frais d'arbitrage */}
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💰</span>
              </div>
              <Typography variant="h3" className="mb-4">
                {t('advantages.noArbitrage.title')}
              </Typography>
              <Typography variant="body" color="muted">
                {t('advantages.noArbitrage.description')}
              </Typography>
            </Card>

            {/* Frais fixes */}
            <Card className="text-center p-8 hover:shadow-lg transition-shadow border-2 border-clean-dark">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <Typography variant="h3" className="mb-4">
                {t('advantages.fixedFees.title')}
              </Typography>
              <Typography variant="body" color="muted" className="mb-4">
                {t('advantages.fixedFees.description')}
              </Typography>
              <div className="bg-clean-light rounded-lg p-4">
                <Typography variant="h2" className="text-clean-dark">
                  1€
                </Typography>
                <Typography variant="caption" color="muted">
                  {t('advantages.fixedFees.perTransaction')}
                </Typography>
              </div>
            </Card>

            {/* Propriété des actions */}
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔐</span>
              </div>
              <Typography variant="h3" className="mb-4">
                {t('advantages.ownership.title')}
              </Typography>
              <Typography variant="body" color="muted">
                {t('advantages.ownership.description')}
              </Typography>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparaison avec concurrents */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-4">
              {t('comparison.title')}
            </Typography>
            <Typography variant="body" color="muted" className="max-w-2xl mx-auto">
              {t('comparison.subtitle')}
            </Typography>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-clean-dark text-white">
                  <tr>
                    <th className="p-4 text-left">{t('comparison.table.feature')}</th>
                    <th className="p-4 text-center">Clean Avenir</th>
                    <th className="p-4 text-center">{t('comparison.table.others')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">{t('comparison.table.arbitrageFees')}</td>
                    <td className="p-4 text-center text-green-600 font-bold">0€</td>
                    <td className="p-4 text-center text-red-600">0.5% - 2%</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-medium">{t('comparison.table.transactionFees')}</td>
                    <td className="p-4 text-center text-green-600 font-bold">1€</td>
                    <td className="p-4 text-center text-red-600">1€ - 10€</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">{t('comparison.table.ownership')}</td>
                    <td className="p-4 text-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-red-600 text-xl">✗</span>
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4 font-medium">{t('comparison.table.transparency')}</td>
                    <td className="p-4 text-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-yellow-500 text-xl">~</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </section>

      {/* Avertissement important */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <Card className="bg-amber-50 border-amber-200 max-w-3xl mx-auto">
            <div className="flex items-start space-x-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <Typography variant="h4" className="mb-2 text-amber-800">
                  {t('warning.title')}
                </Typography>
                <Typography variant="body" className="text-amber-700">
                  {t('warning.description')}
                </Typography>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 lg:py-24 bg-clean-dark text-white">
        <div className="container mx-auto px-6 text-center">
          <Typography variant="h2" color="white" className="mb-6">
            {t('cta.title')}
          </Typography>
          <Typography variant="body" color="white" className="mb-8 opacity-90 max-w-2xl mx-auto">
            {t('cta.description')}
          </Typography>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/auth/register`}>
              <Button size="lg" className="!bg-white !text-clean-dark hover:!bg-gray-100 font-semibold">
                {t('cta.register')}
              </Button>
            </Link>
            <Link href={`/${locale}`}>
              <Button size="lg" className="!bg-transparent !border-2 !border-white !text-white hover:!bg-white hover:!text-clean-dark">
                {t('cta.backHome')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}