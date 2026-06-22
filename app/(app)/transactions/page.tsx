import Link from "next/link";
import { Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";
import { getTransactions, getSummary } from "@/lib/data/transactions";
import { formatRp } from "@/lib/format";
import { redirect } from "next/navigation";
import TransactionsList from "@/components/TransactionsList";
import SearchBar from "@/components/SearchBar";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { q } = await searchParams;
  const [transactions, summary] = await Promise.all([
    getTransactions(user.id, q),
    getSummary(user.id),
  ]);

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen">
      {/* Topbar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div>
          <p className="text-textMuted text-sm">Keuangan</p>
          <h1 className="text-textDark text-xl font-bold">Transaksi</h1>
        </div>
        <Link
          href="/transactions/add"
          className="flex items-center gap-2 bg-green text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-green/90 transition-colors"
        >
          <Plus size={16} /> Tambah
        </Link>
      </div>

      <div className="p-6">
        {/* Summary bar */}
        <div
          className="rounded-2xl p-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ background: "linear-gradient(135deg,#1F4F3F,#2D7A5E)" }}
        >
          <div>
            <p className="text-greenMist text-xs">Total Saldo</p>
            <p className="text-white text-2xl font-bold">{formatRp(summary.balance)}</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-incomeChip rounded-xl px-5 py-3 text-center">
              <p className="text-textLabel text-[11px]">Income</p>
              <p className="text-income text-sm font-bold mt-0.5">{formatRp(totalIncome)}</p>
            </div>
            <div className="bg-expenseChip rounded-xl px-5 py-3 text-center">
              <p className="text-textLabel text-[11px]">Expense</p>
              <p className="text-expense text-sm font-bold mt-0.5">{formatRp(totalExpense)}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5">
          <SearchBar defaultValue={q} placeholder="Cari transaksi..." />
        </div>

        <h2 className="text-textDark text-base font-bold mb-3">Riwayat Transaksi</h2>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <TransactionsList transactions={transactions} />
        </div>
      </div>

      {/* FAB: mobile only */}
      <Link
        href="/transactions/add"
        className="md:hidden fixed bottom-20 right-5 w-14 h-14 bg-green rounded-full flex items-center justify-center shadow-floating z-40"
        aria-label="Tambah Transaksi"
      >
        <Plus className="text-white" size={28} />
      </Link>
    </div>
  );
}
