import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['fr', 'en'];

export default getRequestConfig(async ({ locale }) => {
  const validLocale = locale || 'fr';
  if (!locales.includes(validLocale as any)) notFound();

  return {
    locale: validLocale,
    messages: (await import(`../locales/${validLocale}/common.json`)).default,
    timeZone: 'Europe/Paris'
  };
});