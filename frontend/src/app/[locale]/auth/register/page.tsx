import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AuthLayout } from '../../../../components/templates/AuthLayout';
import { RegisterForm } from '../../../../components/organisms/RegisterForm';
import { notFound } from 'next/navigation';

interface RegisterPageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const t = await getTranslations({ locale, namespace: 'Auth.register' });
  
  return {
    title: `${t('title')} | Clean Avenir`,
    description: t('subtitle'),
    robots: {
      index: false, 
      follow: true
    },
    alternates: {
      languages: {
        'fr': '/fr/auth/register',
        'en': '/en/auth/register'
      }
    }
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const t = await getTranslations({ locale, namespace: 'Auth.register' });
  
  return (
    <AuthLayout 
      title={t('title')} 
      subtitle={t('subtitle')}
    >
      <RegisterForm />
    </AuthLayout>
  );
}