import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpCircle, ArrowDownCircle, Tag, Calendar, FileText } from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";
import { getTransactionById } from "@/lib/data/transactions";
import { formatRp } from "@/lib/format";

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const trx = await getTransactionById(id);
  if (!trx || trx.user_id !== user.id) notFound();

  const isIncome = trx.type === "income";

  return (
    <div className="min-h-screen bg-bg">
      {/* AppBar */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3">
        <Link href="/transactions" className="text-textDark"><ArrowLeft size={24} /></Link>
        <h1 className="text-textDark text-lg font-bold">Detail Transaksi</h1>
      </div>

      <div className="px-5 space-y-4">
        {/* Amount hero card */}
        <div
          className="rounded-[24px] p-6 flex flex-col items-center"
          style={{ background: "linear-gradient(135deg,#1F4F3F,#2D7A5E)" }}
        >
          <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center mb-3 ${isIncome ? "bg-iconBg" : "bg-[#FFEEEE]"}`}>
            {isIncome
              ? <ArrowUpCircle className="text-income" size={32} />
              : <ArrowDownCircle className="text-expense" size={32} />
            }
          </div>
          <p className={`text-3xl font-bold ${isIncome ? "text-income" : "text-expense"}`}>
            {isIncome ? "+" : "−"} {formatRp(trx.amount)}
          </p>
          <p className="text-white font-semibold mt-1">{trx.title}</p>
          <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${isIncome ? "bg-iconBg text-income" : "bg-[#FFEEEE] text-expense"}`}>
            {isIncome ? "Pemasukan" : "Pengeluaran"}
          </span>
        </div>

        {/* Detail rows */}
        <div className="bg-white rounded-[20px] p-4 shadow-card space-y-3">
          <DetailRow icon={<Calendar className="text-green" size={18} />} label="Tanggal" value={trx.transaction_date} />
          <DetailRow icon={<Tag className="text-green" size={18} />} label="Kategori"
            value={(trx.categories as { name: string } | null)?.name ?? "Tanpa Kategori"} />
          {trx.description && (
            <DetailRow icon={<FileText className="text-green" size={18} />} label="Catatan" value={trx.description} />
          )}
        </div>

        <Link
          href="/transactions"
          className="block w-full py-4 rounded-pill text-center bg-green text-white font-bold text-base"
        >
          Kembali
        </Link>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-iconBg flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-textMuted text-xs">{label}</p>
        <p className="text-textDark text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
