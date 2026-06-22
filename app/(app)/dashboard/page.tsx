import Link from "next/link";
import { Plus, Bell, ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp } from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";
import { getSummary, getRecentTransactions } from "@/lib/data/transactions";
import { formatRp } from "@/lib/format";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [summary, recent] = await Promise.all([
    getSummary(user.id),
    getRecentTransactions(user.id, 5),
  ]);

  return (
    <div className="min-h-screen">
      {/* ── Topbar ── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div>
          <p className="text-textMuted text-sm">Selamat Datang,</p>
          <h1 className="text-textDark text-xl font-bold leading-tight">{user.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/transactions/add"
            className="hidden md:flex items-center gap-2 bg-green text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-green/90 transition-colors"
          >
            <Plus size={16} /> Tambah Transaksi
          </Link>
          <button className="w-10 h-10 rounded-xl bg-iconBg flex items-center justify-center text-green">
            <Bell size={20} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* ── Stats row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Balance card */}
          <div
            className="md:col-span-1 rounded-2xl p-5 flex flex-col justify-between min-h-[140px]"
            style={{ background: "linear-gradient(135deg,#1F4F3F,#2D7A5E)" }}
          >
            <div className="flex items-start justify-between">
              <p className="text-greenMist text-sm">Total Saldo</p>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Wallet size={20} className="text-white" />
              </div>
            </div>
            <div>
              <p className="text-white text-[28px] font-bold leading-tight">{formatRp(summary.balance)}</p>
              <p className="text-greenMist text-xs mt-1">Saldo aktif</p>
            </div>
          </div>

          {/* Income card */}
          <div className="bg-white rounded-2xl p-5 shadow-card flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <p className="text-textLabel text-sm">Pemasukan</p>
              <div className="w-10 h-10 rounded-xl bg-iconBg flex items-center justify-center">
                <ArrowUpCircle size={20} className="text-income" />
              </div>
            </div>
            <div>
              <p className="text-income text-[22px] font-bold leading-tight">{formatRp(summary.income)}</p>
              <p className="text-textMuted text-xs mt-1">Total masuk</p>
            </div>
          </div>

          {/* Expense card */}
          <div className="bg-white rounded-2xl p-5 shadow-card flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <p className="text-textLabel text-sm">Pengeluaran</p>
              <div className="w-10 h-10 rounded-xl bg-[#FFEEEE] flex items-center justify-center">
                <ArrowDownCircle size={20} className="text-expense" />
              </div>
            </div>
            <div>
              <p className="text-expense text-[22px] font-bold leading-tight">{formatRp(summary.expense)}</p>
              <p className="text-textMuted text-xs mt-1">Total keluar</p>
            </div>
          </div>
        </div>

        {/* ── Recent transactions ── */}
        <div className="bg-white rounded-2xl shadow-card">
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-green" />
              <h2 className="text-textDark font-bold text-base">Transaksi Terakhir</h2>
            </div>
            <Link href="/transactions" className="text-green text-sm font-medium hover:underline">
              Lihat Semua →
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-textMuted text-sm">Belum ada transaksi</p>
              <Link href="/transactions/add" className="inline-block mt-3 text-green text-sm font-semibold">
                + Tambah transaksi pertama
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recent.map((trx) => {
                const isIncome = trx.type === "income";
                return (
                  <div key={trx.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isIncome ? "bg-iconBg" : "bg-[#FFEEEE]"}`}>
                      {isIncome
                        ? <ArrowUpCircle className="text-income" size={20} />
                        : <ArrowDownCircle className="text-expense" size={20} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-textDark font-semibold text-sm truncate">{trx.title}</p>
                      <p className="text-textMuted text-xs">{trx.transaction_date}</p>
                    </div>
                    <p className={`font-bold text-sm shrink-0 ${isIncome ? "text-income" : "text-expense"}`}>
                      {isIncome ? "+" : "−"} {formatRp(trx.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
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
