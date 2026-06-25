"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign, Type, Tag, Calendar, FileText, ArrowLeft, ArrowUp, ArrowDown,
} from "lucide-react";
import { addTransactionAction } from "@/lib/actions/transactions";
import SubmitButton from "@/components/SubmitButton";
import type { CategoryRow } from "@/lib/data/categories";

export default function TransactionForm({
  categories,
  defaultCategoryId,
}: {
  categories: CategoryRow[];
  defaultCategoryId?: string;
}) {
  const [state, formAction] = useActionState(addTransactionAction, undefined);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [amountDigits, setAmountDigits] = useState(""); // angka mentah, dikirim ke server
  const [amountDisplay, setAmountDisplay] = useState(""); // versi "150.000", cuma buat tampilan
  const router = useRouter();

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digitsOnly = e.target.value.replace(/\D/g, ""); // buang semua selain angka
    setAmountDigits(digitsOnly);
    setAmountDisplay(digitsOnly ? new Intl.NumberFormat("id-ID").format(Number(digitsOnly)) : "");
  }

  return (
    <div className="min-h-screen">
      {/* Topbar */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-bg flex items-center justify-center text-textDark hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="text-textMuted text-xs">Transaksi</p>
          <h1 className="text-textDark text-lg font-bold leading-tight">Tambah Transaksi</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-xl">
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="transactionDate" value={date} />

            {state?.formError && (
              <div className="bg-expenseSoft rounded-xl px-4 py-3 text-sm text-expenseDeep">
                {state.formError}
              </div>
            )}

            {/* Type toggle — persis seperti flutter */}
            <div className="flex bg-white rounded-2xl p-1.5 shadow-card">
              {(["income", "expense"] as const).map((t) => {
                const active = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all
                      ${active
                        ? t === "income"
                          ? "bg-income text-white shadow-card"
                          : "bg-expense text-white shadow-card"
                        : "bg-transparent text-textMuted"
                      }`}
                  >
                    {t === "income" ? <ArrowUp size={15} /> : <ArrowDown size={15} />}
                    {t === "income" ? "Pemasukan" : "Pengeluaran"}
                  </button>
                );
              })}
            </div>

            {/* Amount */}
            <div>
              <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-card">
                <DollarSign className="text-green shrink-0" size={20} />
                {/* Input yang dilihat user: otomatis pakai titik ribuan, mis. 150.000 */}
                <input
                  type="text"
                  inputMode="numeric"
                  value={amountDisplay}
                  onChange={handleAmountChange}
                  placeholder="Jumlah (Rp)"
                  className="flex-1 bg-transparent outline-none text-textDark placeholder:text-textMuted text-base"
                />
                {/* Yang benar-benar dikirim ke server: angka mentah tanpa titik */}
                <input type="hidden" name="amount" value={amountDigits} />
              </div>
              {state?.errors?.amount && (
                <p className="mt-1.5 ml-1 text-xs text-expenseDeep">{state.errors.amount[0]}</p>
              )}
            </div>

            {/* Title */}
            <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-card">
              <Type className="text-green shrink-0" size={20} />
              <input
                name="title"
                type="text"
                placeholder="Sumber / Keterangan singkat"
                className="flex-1 bg-transparent outline-none text-textDark placeholder:text-textMuted text-base"
              />
            </div>

            {/* Category — defaultValue dari URL */}
            <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-2 shadow-card">
              <Tag className="text-green shrink-0" size={20} />
              <select
                name="categoryId"
                defaultValue={defaultCategoryId ?? ""}
                className="flex-1 bg-transparent outline-none text-textDark text-base py-3 font-medium"
              >
                <option value="">Tanpa Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-card">
                <Calendar className="text-green shrink-0" size={20} />
                <input
                  type="date"
                  value={date}
                  max={new Date().toISOString().substring(0, 10)}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-textDark text-base"
                />
              </div>
              {state?.errors?.transactionDate && (
                <p className="mt-1.5 ml-1 text-xs text-expenseDeep">{state.errors.transactionDate[0]}</p>
              )}
            </div>

            {/* Description */}
            <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-card">
              <FileText className="text-green shrink-0" size={20} />
              <input
                name="description"
                type="text"
                placeholder="Catatan (opsional)"
                className="flex-1 bg-transparent outline-none text-textDark placeholder:text-textMuted text-base"
              />
            </div>

            <div className="pt-2">
              <SubmitButton>Tambah Transaksi</SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}