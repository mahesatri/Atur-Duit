"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowLeftRight, Grid2X2, BarChart2, User } from "lucide-react";

const NAV = [
  { label: "Beranda",   href: "/dashboard",    Icon: Home },
  { label: "Transaksi", href: "/transactions", Icon: ArrowLeftRight },
  { label: "Kategori",  href: "/categories",   Icon: Grid2X2 },
  { label: "Analisis",  href: "/analysis",     Icon: BarChart2 },
  { label: "Profil",    href: "/profile",       Icon: User },
];

export default function BottomNav() {
  const path = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-nav z-50">
      <ul className="flex">
        {NAV.map(({ label, href, Icon }) => {
          const active = path === href || (href !== "/dashboard" && path.startsWith(href));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center pt-3 pb-2 gap-0.5 ${active ? "text-green" : "text-textMuted"}`}
              >
                <Icon size={22} />
                <span className="text-[11px] font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
