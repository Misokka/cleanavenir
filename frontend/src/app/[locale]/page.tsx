"use client";
import { useTranslations, useLocale } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <div className="mb-4 text-sm text-gray-500">
        Locale actuelle: {locale}
      </div>
      <h1 className="text-3xl font-bold text-blue-600">{t("title")}</h1>
      <p className="mt-2 text-lg text-gray-600">{t("subtitle")}</p>
    </main>
  );
}