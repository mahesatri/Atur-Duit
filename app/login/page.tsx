"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Wallet } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";
import InputField from "@/components/InputField";
import SubmitButton from "@/components/SubmitButton";

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left panel: branding (desktop) */}
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
            Kelola keuanganmu<br />dengan lebih cerdas
          </h2>
          <p className="text-greenMist text-base leading-relaxed">
            Catat pemasukan dan pengeluaran, pantau tren keuangan, dan raih tujuan finansialmu bersama AturDuit.
          </p>
        </div>
        <p className="text-greenMist/50 text-sm">© 2025 AturDuit</p>
      </div>

      {/* Right panel: form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-green flex items-center justify-center">
              <Wallet size={18} className="text-white" />
            </div>
            <span className="text-textDark font-bold text-xl">AturDuit</span>
          </div>

          <p className="text-textMuted text-sm mb-1">Selamat Datang Kembali</p>
          <h1 className="text-textDark text-2xl font-bold mb-7">Masuk ke Akun</h1>

          <form action={formAction} className="space-y-3">
            {state?.formError && (
              <div className="bg-expenseSoft rounded-xl px-4 py-3 text-sm text-expenseDeep">
                {state.formError}
              </div>
            )}

            <InputField
              name="email"
              type="email"
              placeholder="Email"
              icon={<Mail size={20} />}
              error={state?.errors?.email?.[0]}
            />

            <InputField
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              icon={<Lock size={20} />}
              error={state?.errors?.password?.[0]}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-green shrink-0"
                  aria-label="Tampilkan password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <div className="pt-3">
              <SubmitButton>Masuk</SubmitButton>
            </div>

            <p className="text-center pt-2">
              <Link href="/register" className="text-green font-semibold text-sm hover:underline">
                Belum punya akun? Daftar sekarang
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
