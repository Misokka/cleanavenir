import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
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
  title: "CleanAvenir",
  description: "Your clean architecture banking application",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        <NextIntlClientProvider messages={messages}>
          <header className="w-full p-4 shadow-md bg-white">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold text-[#083A31]">Clean Avenir</h1>
              <nav className="flex gap-4">
                <a href="/fr" className="hover:underline">FR</a>
                <a href="/en" className="hover:underline">EN</a>
              </nav>
            </div>
          </header>

          <main className="min-h-[calc(100vh-100px)]">{children}</main>

          <footer className="w-full p-4 bg-[#083A31] text-white text-center">
            © 2025 Clean Avenir — Tous droits réservés
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
