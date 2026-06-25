"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase";
import { getSessionUserId } from "@/lib/session";
import { transactionSchema } from "@/lib/validations";
import type { FormState } from "@/lib/actions/auth";


export async function addTransactionAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const parsed = transactionSchema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount"),
    title: formData.get("title"),
    categoryId: formData.get("categoryId") || undefined,
    transactionDate: formData.get("transactionDate"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { type, amount, title, categoryId, transactionDate, description } = parsed.data;

  const { error } = await supabaseServer.from("transactions").insert({
    user_id: userId,
    category_id: categoryId || null,
    title: title && title.length > 0 ? title : type === "income" ? "Pemasukan" : "Pengeluaran",
    type,
    amount,
    transaction_date: transactionDate,
    description: description || null,
  });

  if (error) {
    return { formError: "Gagal menyimpan transaksi, silakan coba lagi" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/analysis");
  redirect("/transactions");
}

export async function updateTransactionAction(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const parsed = transactionSchema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount"),
    title: formData.get("title"),
    categoryId: formData.get("categoryId") || undefined,
    transactionDate: formData.get("transactionDate"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { type, amount, title, categoryId, transactionDate, description } = parsed.data;

  const { error } = await supabaseServer
    .from("transactions")
    .update({
      category_id: categoryId || null,
      title: title && title.length > 0 ? title : type === "income" ? "Pemasukan" : "Pengeluaran",
      type,
      amount,
      transaction_date: transactionDate,
      description: description || null,
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return { formError: "Gagal memperbarui transaksi" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/analysis");
  redirect("/transactions");
}


export async function deleteTransactionAction(id: string): Promise<{ success: boolean }> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const { error } = await supabaseServer.from("transactions").delete().eq("id", id).eq("user_id", userId);

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/analysis");

  return { success: !error };
}
