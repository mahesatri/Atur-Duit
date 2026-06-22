import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import { SidebarProvider } from "@/components/SidebarProvider";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <MainContent>{children}</MainContent>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}
