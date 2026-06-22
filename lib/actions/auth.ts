"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase";
import { setSession, clearSession, getSessionUserId } from "@/lib/session";
import {
  loginSchema,
  registerSchema,
  profileSchema,
  changePasswordSchema,
} from "@/lib/validations";

export type FormState = {
  errors?: Record<string, string[] | undefined>;
  formError?: string;
} | undefined;

// Task 2 (Integritas Data): schema Zod didefinisikan di lib/validations.ts
// dan divalidasi di sini dengan .safeParse() sebelum data masuk ke Supabase.

export async function registerAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const { data: existing } = await supabaseServer
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return { formError: "Email sudah terdaftar" };
  }

  const hashed = await bcrypt.hash(password, 10);

  const { data: created, error } = await supabaseServer
    .from("users")
    .insert({ name, email, password: hashed })
    .select("id")
    .single();

  if (error || !created) {
    console.error("REGISTER ERROR:", error);
    return { formError: error?.message || "Gagal membuat akun, silakan coba lagi" };
  }

  await setSession(created.id as string);
  redirect("/dashboard");
}

export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  const { data: user } = await supabaseServer
    .from("users")
    .select("id, password")
    .eq("email", email)
    .maybeSingle();

  if (!user) {
    return { formError: "Email tidak ditemukan" };
  }

  const match = await bcrypt.compare(password, user.password as string);
  if (!match) {
    return { formError: "Password salah" };
  }

  await setSession(user.id as string);
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}

export async function updateProfileAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await supabaseServer
    .from("users")
    .update({ name: parsed.data.name, email: parsed.data.email })
    .eq("id", userId);

  if (error) {
    return { formError: "Gagal memperbarui profil" };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { formError: undefined };
}

export async function changePasswordAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const parsed = changePasswordSchema.safeParse({
    oldPassword: formData.get("oldPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { data: user } = await supabaseServer
    .from("users")
    .select("password")
    .eq("id", userId)
    .maybeSingle();

  if (!user) {
    return { formError: "Akun tidak ditemukan" };
  }

  const match = await bcrypt.compare(parsed.data.oldPassword, user.password as string);
  if (!match) {
    return { formError: "Password lama salah" };
  }

  const hashed = await bcrypt.hash(parsed.data.newPassword, 10);
  const { error } = await supabaseServer.from("users").update({ password: hashed }).eq("id", userId);

  if (error) {
    return { formError: "Gagal mengganti password" };
  }

  return { formError: undefined };
}
