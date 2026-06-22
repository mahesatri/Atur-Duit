"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowLeftRight, Grid2X2, BarChart2, User, Wallet, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "./SidebarProvider";

const NAV = [
  { label: "Beranda",   href: "/dashboard",    Icon: Home },
  { label: "Transaksi", href: "/transactions", Icon: ArrowLeftRight },
  { label: "Kategori",  href: "/categories",   Icon: Grid2X2 },
  { label: "Analisis",  href: "/analysis",     Icon: BarChart2 },
  { label: "Profil",    href: "/profile",       Icon: User },
];

export default function Sidebar() {
  const path = usePathname();
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <aside
      className={`hidden md:flex flex-col min-h-screen bg-sidebar fixed left-0 top-0 z-40 shadow-sidebar transition-all duration-300 ease-in-out ${collapsed ? "w-16" : "w-52"}`}
    >
      {/* Brand */}
      <div className={`flex items-center border-b border-white/10 h-16 ${collapsed ? "justify-center" : "px-4 gap-3"}`}>
        <div className="w-8 h-8 rounded-lg bg-green flex items-center justify-center shrink-0">
          <Wallet size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-bold text-base leading-none">AturDuit</p>
            <p className="text-greenMist text-[10px] mt-0.5">Kelola keuanganmu</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {NAV.map(({ label, href, Icon }) => {
          const active = path === href || (href !== "/dashboard" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`flex items-center rounded-xl font-medium text-sm transition-all duration-150
                ${collapsed ? "justify-center py-3" : "gap-3 px-3 py-2.5"}
                ${active
                  ? "bg-green/20 text-white"
                  : "text-greenMist hover:bg-white/10 hover:text-white"
                }`}
            >
              <Icon size={18} className={`shrink-0 ${active ? "text-green" : ""}`} />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-white/10 p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center rounded-xl py-2.5 text-greenMist hover:bg-white/10 hover:text-white transition-colors ${collapsed ? "justify-center" : "gap-3 px-3"}`}
          title={collapsed ? "Perluas" : "Ciutkan"}
        >
          {collapsed
            ? <ChevronRight size={18} />
            : <><ChevronLeft size={18} /><span className="text-sm font-medium">Ciutkan</span></>
          }
        </button>
      </div>
    </aside>
  );
}
