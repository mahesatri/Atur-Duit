import { getCurrentUser } from "@/lib/current-user";
import { getAnalysisData } from "@/lib/data/transactions";
import { redirect } from "next/navigation";
import AnalysisClient from "@/components/AnalysisClient";
import type { AnalysisPeriod } from "@/lib/data/transactions";

export default async function AnalysisPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { period } = await searchParams;
  const validPeriod = (["daily", "weekly", "monthly", "yearly"] as AnalysisPeriod[]).includes(
    period as AnalysisPeriod
  )
    ? (period as AnalysisPeriod)
    : "monthly";

  const data = await getAnalysisData(user.id, validPeriod);

  return (
    <div className="min-h-screen">
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <p className="text-textMuted text-sm">Laporan</p>
        <h1 className="text-textDark text-xl font-bold">Analisis Keuangan</h1>
      </div>
      <div className="p-6">
        <AnalysisClient data={data} period={validPeriod} />
      </div>
    </div>
  );
}
