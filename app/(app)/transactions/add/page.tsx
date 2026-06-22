import { getCurrentUser } from "@/lib/current-user";
import { getCategories } from "@/lib/data/categories";
import { redirect } from "next/navigation";
import TransactionForm from "@/components/TransactionForm";

export default async function AddTransactionPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [categories, { categoryId }] = await Promise.all([
    getCategories(user.id),
    searchParams,
  ]);

  return (
    <div>
      <TransactionForm categories={categories} defaultCategoryId={categoryId} />
    </div>
  );
}
