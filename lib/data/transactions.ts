import "server-only";
import { supabaseServer } from "@/lib/supabase";
import { MONTH_NAMES_ID } from "@/lib/format";

export type TransactionRow = {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  type: "income" | "expense";
  amount: number;
  transaction_date: string;
  description: string | null;
  created_at: string;
  categories?: { name: string } | null;
};

/**
 * Daftar transaksi milik user, opsional difilter oleh kata kunci pencarian.
 * `search` dikirim dari Search Bar di halaman /transactions yang nilainya
 * berasal dari URL (?q=...) — lihat Task 3: URL sebagai State.
 */
export async function getTransactions(userId: string, search?: string): Promise<TransactionRow[]> {
  let query = supabaseServer
    .from("transactions")
    .select("*, categories(name)")
    .eq("user_id", userId)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (search && search.trim().length > 0) {
    query = query.ilike("title", `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data as unknown as TransactionRow[];
}

export async function getRecentTransactions(userId: string, limit = 5): Promise<TransactionRow[]> {
  const { data, error } = await supabaseServer
    .from("transactions")
    .select("*, categories(name)")
    .eq("user_id", userId)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as unknown as TransactionRow[];
}

export async function getTransactionById(id: string): Promise<TransactionRow | null> {
  const { data, error } = await supabaseServer
    .from("transactions")
    .select("*, categories(name)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as TransactionRow;
}

export type Summary = { income: number; expense: number; balance: number };

/** Port dari DatabaseService.getSummary(): income & expense bulan berjalan, balance keseluruhan. */
export async function getSummary(userId: string): Promise<Summary> {
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().substring(0, 10);

  const [{ data: monthRows }, { data: allRows }] = await Promise.all([
    supabaseServer
      .from("transactions")
      .select("type, amount")
      .eq("user_id", userId)
      .gte("transaction_date", monthStart)
      .lt("transaction_date", nextMonth),
    supabaseServer.from("transactions").select("type, amount").eq("user_id", userId),
  ]);

  const income = (monthRows ?? [])
    .filter((r) => r.type === "income")
    .reduce((s, r) => s + (r.amount as number), 0);
  const expense = (monthRows ?? [])
    .filter((r) => r.type === "expense")
    .reduce((s, r) => s + (r.amount as number), 0);

  const totalIncome = (allRows ?? [])
    .filter((r) => r.type === "income")
    .reduce((s, r) => s + (r.amount as number), 0);
  const totalExpense = (allRows ?? [])
    .filter((r) => r.type === "expense")
    .reduce((s, r) => s + (r.amount as number), 0);

  return { income, expense, balance: totalIncome - totalExpense };
}

export type AnalysisPeriod = "daily" | "weekly" | "monthly" | "yearly";
export type AnalysisData = { labels: string[]; income: number[]; expense: number[] };

/** Port dari DatabaseService.getAnalysisData() untuk grafik di halaman Analisis. */
export async function getAnalysisData(userId: string, period: AnalysisPeriod): Promise<AnalysisData> {
  const { data: rows } = await supabaseServer
    .from("transactions")
    .select("type, amount, transaction_date")
    .eq("user_id", userId);

  const all = rows ?? [];
  const labels: string[] = [];
  const income: number[] = [];
  const expense: number[] = [];

  const sumFor = (predicate: (date: string) => boolean, type: "income" | "expense") =>
    all
      .filter((r) => r.type === type && predicate(r.transaction_date as string))
      .reduce((s, r) => s + (r.amount as number), 0);

  const now = new Date();

  if (period === "monthly") {
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      labels.push(MONTH_NAMES_ID[d.getMonth()]);
      income.push(sumFor((date) => date.startsWith(prefix), "income"));
      expense.push(sumFor((date) => date.startsWith(prefix), "expense"));
    }
  } else if (period === "yearly") {
    for (let i = 4; i >= 0; i--) {
      const year = now.getFullYear() - i;
      labels.push(`${year}`);
      income.push(sumFor((date) => date.startsWith(`${year}`), "income"));
      expense.push(sumFor((date) => date.startsWith(`${year}`), "expense"));
    }
  } else {
    // daily & weekly: 7 hari terakhir (sama seperti versi mobile)
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().substring(0, 10);
      labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
      income.push(sumFor((date) => date === dateStr, "income"));
      expense.push(sumFor((date) => date === dateStr, "expense"));
    }
  }

  return { labels, income, expense };
}
