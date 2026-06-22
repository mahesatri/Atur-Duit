"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { ArrowUpCircle, ArrowDownCircle, Trash2 } from "lucide-react";
import { deleteTransactionAction } from "@/lib/actions/transactions";
import { formatRp } from "@/lib/format";
import type { TransactionRow } from "@/lib/data/transactions";

export default function TransactionsList({ transactions }: { transactions: TransactionRow[] }) {
  const [optimisticTrx, removeOptimistic] = useOptimistic(
    transactions,
    (state, deletedId: string) => state.filter((t) => t.id !== deletedId)
  );
  const [, startTransition] = useTransition();

  async function handleDelete(id: string) {
    startTransition(() => { removeOptimistic(id); });
    await deleteTransactionAction(id);
  }

  if (optimisticTrx.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-textMuted text-sm">Belum ada transaksi</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-50">
      {optimisticTrx.map((trx) => {
        const isIncome = trx.type === "income";
        return (
          <div key={trx.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isIncome ? "bg-iconBg" : "bg-[#FFEEEE]"}`}>
              {isIncome
                ? <ArrowUpCircle className="text-income" size={20} />
                : <ArrowDownCircle className="text-expense" size={20} />
              }
            </div>
            <Link href={`/transactions/${trx.id}`} className="flex-1 min-w-0">
              <p className="text-textDark font-semibold text-sm truncate">{trx.title}</p>
              <p className="text-textMuted text-xs">
                {trx.transaction_date} · {isIncome ? "Pemasukan" : "Pengeluaran"}
              </p>
            </Link>
            <p className={`font-bold text-sm shrink-0 mr-3 ${isIncome ? "text-income" : "text-expense"}`}>
              {isIncome ? "+" : "−"} {formatRp(trx.amount)}
            </p>
            <button
              onClick={() => handleDelete(trx.id)}
              aria-label="Hapus transaksi"
              className="text-textMuted hover:text-expense transition-colors shrink-0"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
