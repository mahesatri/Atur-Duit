"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { formatRp } from "@/lib/format";
import type { AnalysisData, AnalysisPeriod } from "@/lib/data/transactions";

const PERIODS: { key: AnalysisPeriod; label: string }[] = [
  { key: "daily", label: "Harian" },
  { key: "weekly", label: "Mingguan" },
  { key: "monthly", label: "Bulanan" },
  { key: "yearly", label: "Tahunan" },
];

const PERIOD_LABEL: Record<AnalysisPeriod, string> = {
  daily: "7 hari terakhir",
  weekly: "7 hari terakhir",
  monthly: "6 bulan terakhir",
  yearly: "5 tahun terakhir",
};

export default function AnalysisClient({
  data,
  period,
}: {
  data: AnalysisData;
  period: AnalysisPeriod;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setPeriod(p: AnalysisPeriod) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", p);
    router.replace(`${pathname}?${params.toString()}`);
  }

  const chartData = data.labels.map((label, i) => ({
    label,
    income: data.income[i],
    expense: data.expense[i],
  }));

  const totalIncome = data.income.reduce((s, v) => s + v, 0);
  const totalExpense = data.expense.reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-5">
      {/* Period selector */}
      <div className="flex bg-white rounded-xl p-1 shadow-card w-full md:w-auto md:inline-flex">
        {PERIODS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={`flex-1 md:flex-none md:px-5 py-2.5 rounded-lg text-sm font-semibold transition-all
              ${period === key ? "bg-green text-white" : "text-textMuted hover:text-textDark"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <SummaryCard
          label="Total Pemasukan"
          amount={totalIncome}
          color="text-income"
          bg="bg-iconBg"
          sub={PERIOD_LABEL[period]}
          icon={<ArrowUpCircle size={22} className="text-income" />}
        />
        <SummaryCard
          label="Total Pengeluaran"
          amount={totalExpense}
          color="text-expense"
          bg="bg-[#FFEEEE]"
          sub={PERIOD_LABEL[period]}
          icon={<ArrowDownCircle size={22} className="text-expense" />}
        />
      </div>

      {/* Chart card */}
      <div className="bg-white rounded-2xl p-5 shadow-card">
        <h2 className="text-textDark font-bold text-base">Pemasukan & Pengeluaran</h2>
        <p className="text-textMuted text-xs mb-5">{PERIOD_LABEL[period]}</p>

        {chartData.every((d) => d.income === 0 && d.expense === 0) ? (
          <div className="h-56 flex items-center justify-center">
            <p className="text-textMuted text-sm">Tidak ada data untuk periode ini</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barGap={3} barCategoryGap="28%">
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#4E6B54" }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: number, name: string) => [formatRp(v), name === "income" ? "Pemasukan" : "Pengeluaran"]}
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 13 }}
              />
              <Bar dataKey="income" fill="#00C58A" radius={[5, 5, 0, 0]} maxBarSize={18} />
              <Bar dataKey="expense" fill="#FF6B6B" radius={[5, 5, 0, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        )}

        <div className="flex gap-5 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-[3px] bg-income" />
            <span className="text-textLabel text-xs">Pemasukan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-[3px] bg-expense" />
            <span className="text-textLabel text-xs">Pengeluaran</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, amount, color, bg, sub, icon }: {
  label: string; amount: number; color: string; bg: string; sub: string; icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${bg}`}>{icon}</div>
      <p className="text-textLabel text-sm">{label}</p>
      <p className={`font-bold text-xl mt-1 ${color}`}>{formatRp(amount)}</p>
      <p className="text-textMuted text-xs mt-1">{sub}</p>
    </div>
  );
}
