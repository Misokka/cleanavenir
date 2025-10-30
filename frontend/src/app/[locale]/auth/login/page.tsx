import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AuthLayout } from '../../../../components/templates/AuthLayout';
import { LoginForm } from '../../../../components/organisms/LoginForm';
import { notFound } from 'next/navigation';

interface LoginPageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const t = await getTranslations({ locale, namespace: 'Auth.login' });
  
  return {
    title: `${t('title')} | Clean Avenir`,
    description: t('subtitle'),
    robots: {
      index: false,
      follow: true
    },
    alternates: {
      languages: {
        'fr': '/fr/auth/login',
        'en': '/en/auth/login'
      }
    }
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const t = await getTranslations({ locale, namespace: 'Auth.login' });
  
  return (
    <AuthLayout 
      title={t('title')} 
      subtitle={t('subtitle')}
    >
      <LoginForm />
    </AuthLayout>
  );
}