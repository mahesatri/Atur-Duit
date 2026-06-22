"use client";

import { useSidebar } from "./SidebarProvider";

export default function MainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div
      className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${collapsed ? "md:ml-16" : "md:ml-52"}`}
    >
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
    </div>
  );
}
