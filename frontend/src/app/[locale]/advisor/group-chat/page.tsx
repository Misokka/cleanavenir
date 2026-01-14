import { getTranslations } from 'next-intl/server';
import GroupChatClient from './GroupChatClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'GroupChat' });
  
  return {
    title: t('title'),
  };
}

export default async function GroupChatPage({ params }: PageProps) {
  const { locale } = await params;
  return <GroupChatClient locale={locale} />;
}
