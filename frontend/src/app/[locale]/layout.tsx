import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import "../../styles/global.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Clean Avenir',
    default: 'Clean Avenir - Votre banque du futur',
  },
  description: 'Clean Avenir révolutionne votre gestion financière avec une approche simple, moderne et responsable. Découvrez une expérience bancaire nouvelle génération.',
  keywords: ['banque', 'finance', 'moderne', 'numérique', 'épargne', 'compte bancaire', 'clean architecture'],
  authors: [{ name: 'Clean Avenir Team' }],
  creator: 'Clean Avenir',
  publisher: 'Clean Avenir',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://cleanavenir.fr',
    title: 'Clean Avenir - Votre banque du futur',
    description: 'Clean Avenir révolutionne votre gestion financière avec une approche simple, moderne et responsable.',
    siteName: 'Clean Avenir',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clean Avenir - Votre banque du futur',
    description: 'Clean Avenir révolutionne votre gestion financière avec une approche simple, moderne et responsable.',
    creator: '@cleanavenir',
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="min-h-[calc(100vh-100px)]">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
