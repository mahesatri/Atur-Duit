import { getCurrentUser } from "@/lib/current-user";
import { getCategories } from "@/lib/data/categories";
import { redirect } from "next/navigation";
import CategoriesClient from "@/components/CategoriesClient";

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const categories = await getCategories(user.id);
  return (
    <div className="min-h-screen">
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <p className="text-textMuted text-sm">Pengaturan</p>
        <h1 className="text-textDark text-xl font-bold">Kategori</h1>
      </div>
      <div className="p-6">
        <CategoriesClient categories={categories} />
      </div>
    </div>
  );
}
