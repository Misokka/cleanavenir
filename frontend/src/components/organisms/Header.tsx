"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Header");

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/").filter(Boolean);
    segments[0] = newLocale;
    return "/" + segments.join("/");
  };

  return (
    <header className="w-full p-4 shadow-md bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href={`/${locale}`} className="text-xl font-bold text-[#083A31]">
          Clean Avenir
        </Link>

        <nav className="flex gap-4 text-sm font-medium">
          <Link href={`/${locale}`} className="hover:text-[#3F6868] transition">
            {t("home")}
          </Link>
          <Link href={`/${locale}/about`} className="hover:text-[#3F6868] transition">
            {t("about")}
          </Link>
          <Link href={`/${locale}/contact`} className="hover:text-[#3F6868] transition">
            {t("contact")}
          </Link>
        </nav>

        <div className="flex gap-2">
          <Link
            href={switchLocale("fr")}
            className={`px-2 py-1 rounded ${
              locale === "fr" ? "bg-[#083A31] text-white" : "text-[#083A31]"
            }`}
          >
            {t("fr")}
          </Link>
          <Link
            href={switchLocale("en")}
            className={`px-2 py-1 rounded ${
              locale === "en" ? "bg-[#083A31] text-white" : "text-[#083A31]"
            }`}
          >
            {t("en")}
          </Link>
        </div>
      </div>
    </header>
  );
}
