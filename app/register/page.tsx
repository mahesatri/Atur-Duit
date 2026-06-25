"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Wallet } from "lucide-react";
import { registerAction } from "@/lib/actions/auth";
import InputField from "@/components/InputField";
import SubmitButton from "@/components/SubmitButton";

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerAction, undefined);

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left panel */}
      <div
        className="hidden md:flex flex-col justify-between w-1/2 p-12"
        style={{ background: "linear-gradient(135deg,#1F4F3F,#2D7A5E)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green flex items-center justify-center">
            <Wallet size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">AturDuit</span>
        </div>
        <div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Mulai perjalanan<br />finansialmu hari ini
          </h2>
          <p className="text-greenMist text-base leading-relaxed">
            Daftar gratis dan mulai mencatat keuanganmu. Tidak butuh kartu kredit.
          </p>
        </div>
        <p className="text-greenMist/50 text-sm">© 2025 AturDuit</p>
      </div>

      {/* Right panel: form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-green flex items-center justify-center">
              <Wallet size={18} className="text-white" />
            </div>
            <span className="text-textDark font-bold text-xl">AturDuit</span>
          </div>

          <p className="text-textMuted text-sm mb-1">Buat Akun Baru</p>
          <h1 className="text-textDark text-2xl font-bold mb-7">Daftar ke AturDuit</h1>

          <form action={formAction} className="space-y-3">
            {state?.formError && (
              <div className="bg-expenseSoft rounded-xl px-4 py-3 text-sm text-expenseDeep">
                {state.formError}
              </div>
            )}

            <InputField
              name="name"
              type="text"
              placeholder="Nama Lengkap"
              icon={<User size={20} />}
              error={state?.errors?.name?.[0]}
            />

            <InputField
              name="email"
              type="email"
              placeholder="Email"
              icon={<Mail size={20} />}
              error={state?.errors?.email?.[0]}
            />

            <InputField
              name="password"
              type="password"
              placeholder="Password"
              icon={<Lock size={20} />}
              error={state?.errors?.password?.[0]}
            />

            <InputField
              name="confirmPassword"
              type="password"
              placeholder="Konfirmasi Password"
              icon={<Lock size={20} />}
              error={state?.errors?.confirmPassword?.[0]}
            />

            <div className="pt-3">
              <SubmitButton>Daftar Sekarang</SubmitButton>
            </div>

            <p className="text-center pt-2">
              <Link href="/login" className="text-green font-semibold text-sm hover:underline">
                Sudah punya akun? Masuk
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
