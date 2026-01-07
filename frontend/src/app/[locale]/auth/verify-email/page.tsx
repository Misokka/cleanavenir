import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AuthLayout } from '../../../../components/templates/AuthLayout';
import { VerifyEmailContent } from '../../../../components/organisms/VerifyEmailContent';
import { notFound } from 'next/navigation';

interface VerifyEmailPageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata({ params }: VerifyEmailPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const t = await getTranslations({ locale, namespace: 'Auth.verifyEmail' });
  
  return {
    title: `${t('title')} | Clean Avenir`,
    description: t('subtitle'),
    robots: {
      index: false,
      follow: false
    },
    alternates: {
      languages: {
        'fr': '/fr/auth/verify-email',
        'en': '/en/auth/verify-email'
      }
    }
  };
}

export default async function VerifyEmailPage({ params, searchParams }: VerifyEmailPageProps) {
  const { locale } = await params;
  const { token } = await searchParams;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const t = await getTranslations({ locale, namespace: 'Auth.verifyEmail' });
  
  return (
    <AuthLayout 
      title={t('title')} 
      subtitle={t('subtitle')}
    >
      <VerifyEmailContent token={token} />
    </AuthLayout>
  );
}
