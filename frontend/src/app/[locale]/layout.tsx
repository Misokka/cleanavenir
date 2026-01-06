import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { AuthProvider } from "@/contexts/AuthProvider";
import { ToastProvider } from "@/contexts/ToastProvider";
import { ToastContainer } from "@/components/organisms/ToastContainer";
import { OrganizationSchema, WebsiteSchema } from "@/components/seo/JsonLd";
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
  metadataBase: new URL('https://cleanavenir.com'),
  title: {
    template: '%s | Clean Avenir',
    default: 'Clean Avenir - Votre banque du futur',
  },
  description: 'Clean Avenir révolutionne votre gestion financière avec une approche simple, moderne et responsable. Découvrez une expérience bancaire nouvelle génération.',
  keywords: ['banque', 'finance', 'moderne', 'numérique', 'épargne', 'compte bancaire', 'investissement', 'bourse', 'actions', 'clean architecture', 'banque en ligne', 'néobanque'],
  authors: [{ name: 'Clean Avenir Team' }],
  creator: 'Clean Avenir',
  publisher: 'Clean Avenir',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
    alternateLocale: 'en_US',
    url: 'https://cleanavenir.com',
    title: 'Clean Avenir - Votre banque du futur',
    description: 'Clean Avenir révolutionne votre gestion financière avec une approche simple, moderne et responsable.',
    siteName: 'Clean Avenir',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Clean Avenir - Banque moderne et responsable',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clean Avenir - Votre banque du futur',
    description: 'Clean Avenir révolutionne votre gestion financière avec une approche simple, moderne et responsable.',
    creator: '@cleanavenir',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome', url: '/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://cleanavenir.com',
    languages: {
      'fr-FR': 'https://cleanavenir.com/fr',
      'en-US': 'https://cleanavenir.com/en',
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
  category: 'finance',
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
      <head>
        {/* External styles */}
        <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.6.0/uicons-bold-rounded/css/uicons-bold-rounded.css' />
        
        {/* Structured Data */}
        <OrganizationSchema locale={locale} />
        <WebsiteSchema locale={locale} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <ToastProvider>
              <Header />
              <main className="min-h-[calc(100vh-100px)]">{children}</main>
              <Footer />
              <ToastContainer />
            </ToastProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
