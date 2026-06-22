"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase";
import { getSessionUserId } from "@/lib/session";
import { categorySchema } from "@/lib/validations";
import type { FormState } from "@/lib/actions/auth";

export async function addCategoryAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const parsed = categorySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await supabaseServer.from("categories").insert({
    user_id: userId,
    name: parsed.data.name,
  });

  if (error) {
    return { formError: "Gagal menambah kategori" };
  }

  revalidatePath("/categories");
  revalidatePath("/transactions/add");
  return { formError: undefined };
}

export async function deleteCategoryAction(id: string): Promise<{ success: boolean }> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  // Transaksi lama yang memakai kategori ini otomatis menjadi category_id = NULL
  // (ON DELETE SET NULL pada skema), sehingga relasi tidak menampilkan kategori
  // yang sudah terhapus — lihat catatan Error di logbook Minggu 9.
  const { error } = await supabaseServer.from("categories").delete().eq("id", id).eq("user_id", userId);

  revalidatePath("/categories");
  revalidatePath("/transactions");

  return { success: !error };
}
