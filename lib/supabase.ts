import "server-only";
import { createClient } from "@supabase/supabase-js";

// Project ini memakai autentikasi kustom (bukan Supabase Auth), jadi semua
// query dijalankan di server (Server Action / Server Component) memakai
// service role key. Client ini TIDAK BOLEH diimpor dari file yang berjalan
// di browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseServer = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
