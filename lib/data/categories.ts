import "server-only";
import { supabaseServer } from "@/lib/supabase";

export type CategoryRow = {
  id: string;
  user_id: string | null;
  name: string;
  icon: string | null;
  created_at: string;
};

/** Kategori milik user + kategori bawaan global (user_id IS NULL), sama seperti versi mobile (user_id = 0). */
export async function getCategories(userId: string): Promise<CategoryRow[]> {
  const { data, error } = await supabaseServer
    .from("categories")
    .select("*")
    .or(`user_id.eq.${userId},user_id.is.null`)
    .order("name", { ascending: true });

  if (error || !data) return [];
  return data as CategoryRow[];
}
