import "server-only";
import { cookies } from "next/headers";

// Nama cookie sesi — dicek oleh middleware.ts (Task 1: Keamanan Middleware)
export const SESSION_COOKIE = "au_session";

/**
 * Dipanggil dari dalam Server Action (login/register) untuk "menyimulasikan
 * login": menyimpan id user ke cookie. Middleware nantinya hanya mengecek
 * KEBERADAAN cookie ini untuk melindungi rute /dashboard, /transactions, dst.
 */
export async function setSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Dipakai di Server Component / Server Action untuk ambil id user aktif. */
export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}
