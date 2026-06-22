import "server-only";
import { supabaseServer } from "@/lib/supabase";
import { getSessionUserId } from "@/lib/session";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const { data, error } = await supabaseServer
    .from("users")
    .select("id, name, email")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}
