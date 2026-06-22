import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/ProfileClient";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <div className="min-h-screen">
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <p className="text-textMuted text-sm">Akun</p>
        <h1 className="text-textDark text-xl font-bold">Profil</h1>
      </div>
      <div className="p-6 max-w-2xl">
        <ProfileClient user={user} />
      </div>
    </div>
  );
}
