"use client";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="w-full p-4 bg-[#083A31] text-white text-center text-sm mt-10">
      {t("copyright")}
    </footer>
  );
}
