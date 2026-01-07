import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AuthLayout } from '../../../../components/templates/AuthLayout';
import { CheckEmailContent } from '../../../../components/organisms/CheckEmailContent';
import { notFound } from 'next/navigation';

interface CheckEmailPageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ email?: string }>;
}

export async function generateMetadata({ params }: CheckEmailPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const t = await getTranslations({ locale, namespace: 'Auth.checkEmail' });
  
  return {
    title: `${t('title')} | Clean Avenir`,
    description: t('subtitle'),
    robots: {
      index: false,
      follow: false
    },
    alternates: {
      languages: {
        'fr': '/fr/auth/check-email',
        'en': '/en/auth/check-email'
      }
    }
  };
}

export default async function CheckEmailPage({ params, searchParams }: CheckEmailPageProps) {
  const { locale } = await params;
  const { email } = await searchParams;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const t = await getTranslations({ locale, namespace: 'Auth.checkEmail' });
  
  return (
    <AuthLayout 
      title={t('title')} 
      subtitle={t('subtitle')}
    >
      <CheckEmailContent email={email} />
    </AuthLayout>
  );
}
