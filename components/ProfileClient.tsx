"use client";

import { useActionState, useState } from "react";
import { UserCog, Shield, HelpCircle, LogOut, ArrowRight, Lock, Mail, User } from "lucide-react";
import { logoutAction, updateProfileAction, changePasswordAction } from "@/lib/actions/auth";
import SubmitButton from "@/components/SubmitButton";
import type { CurrentUser } from "@/lib/current-user";

export default function ProfileClient({ user }: { user: CurrentUser }) {
  const [sheet, setSheet] = useState<"profile" | "password" | "help" | null>(null);
  const [profileState, profileAction] = useActionState(updateProfileAction, undefined);
  const [pwState, pwAction] = useActionState(changePasswordAction, undefined);

  return (
    <div className="space-y-5">
      {/* Avatar card */}
      <div
        className="rounded-2xl p-6 flex items-center gap-5"
        style={{ background: "linear-gradient(135deg,#1F4F3F,#2D7A5E)" }}
      >
        <div className="w-16 h-16 rounded-full bg-green flex items-center justify-center shrink-0">
          <span className="text-white text-[28px] font-bold">{user.name[0].toUpperCase()}</span>
        </div>
        <div>
          <p className="text-white text-lg font-bold">{user.name}</p>
          <p className="text-greenMist text-sm">{user.email}</p>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl shadow-card divide-y divide-gray-50">
        <MenuItem icon={<UserCog className="text-green" size={20} />} title="Ubah Profil"
          subtitle="Perbarui nama dan email" onTap={() => setSheet("profile")} />
        <MenuItem icon={<Shield className="text-green" size={20} />} title="Keamanan"
          subtitle="Ganti password akun" onTap={() => setSheet("password")} />
        <MenuItem icon={<HelpCircle className="text-green" size={20} />} title="Bantuan"
          subtitle="Pusat bantuan dan FAQ" onTap={() => setSheet("help")} />
      </div>

      {/* Logout */}
      <form action={logoutAction}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-expenseSoft text-expense font-bold text-sm hover:bg-expense/20 transition-colors border border-expense/20"
        >
          <LogOut size={18} /> Logout
        </button>
      </form>

      {/* ── Modal: Ubah Profil ── */}
      {sheet === "profile" && (
        <Modal title="Ubah Profil" onClose={() => setSheet(null)}>
          <form action={profileAction} className="space-y-3">
            {profileState?.formError && (
              <p className="text-xs text-expenseDeep">{profileState.formError}</p>
            )}
            <InputRow icon={<User className="text-green" size={18} />} name="name" placeholder="Nama Lengkap"
              defaultValue={user.name} error={profileState?.errors?.name?.[0]} />
            <InputRow icon={<Mail className="text-green" size={18} />} name="email" type="email"
              placeholder="Email" defaultValue={user.email} error={profileState?.errors?.email?.[0]} />
            <SubmitButton>Simpan</SubmitButton>
          </form>
        </Modal>
      )}

      {/* ── Modal: Ganti Password ── */}
      {sheet === "password" && (
        <Modal title="Ganti Password" onClose={() => setSheet(null)}>
          <form action={pwAction} className="space-y-3">
            {pwState?.formError && (
              <div className="bg-expenseSoft rounded-xl px-3.5 py-3 text-sm text-expenseDeep">
                {pwState.formError}
              </div>
            )}
            <InputRow icon={<Lock className="text-green" size={18} />} name="oldPassword" type="password"
              placeholder="Password Lama" error={pwState?.errors?.oldPassword?.[0]} />
            <InputRow icon={<Lock className="text-green" size={18} />} name="newPassword" type="password"
              placeholder="Password Baru" error={pwState?.errors?.newPassword?.[0]} />
            <SubmitButton>Simpan</SubmitButton>
          </form>
        </Modal>
      )}

      {/* ── Modal: Bantuan ── */}
      {sheet === "help" && (
        <Modal title="Bantuan" onClose={() => setSheet(null)}>
          <p className="text-textLabel text-sm leading-relaxed whitespace-pre-line">
            {`AturDuit membantu kamu mencatat pemasukan dan pengeluaran sehari-hari.\n\n• Tambah transaksi via tombol Tambah di pojok kanan atas\n• Klik ikon hapus (🗑) pada transaksi untuk menghapus\n• Lihat grafik di menu Analisis\n• Kelola kategori di menu Kategori`}
          </p>
          <button onClick={() => setSheet(null)}
            className="mt-4 w-full py-3 rounded-xl bg-iconBg text-green font-bold text-sm hover:bg-green/10 transition-colors">
            Mengerti
          </button>
        </Modal>
      )}
    </div>
  );
}

function MenuItem({ icon, title, subtitle, onTap }: {
  icon: React.ReactNode; title: string; subtitle: string; onTap: () => void;
}) {
  return (
    <button onClick={onTap}
      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-iconBg flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1 text-left">
        <p className="text-textDark font-semibold text-sm">{title}</p>
        <p className="text-textMuted text-xs">{subtitle}</p>
      </div>
      <ArrowRight className="text-textMuted" size={16} />
    </button>
  );
}

function InputRow({ icon, name, type = "text", placeholder, defaultValue, error }: {
  icon: React.ReactNode; name: string; type?: string; placeholder: string;
  defaultValue?: string; error?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 bg-bg rounded-xl px-4 py-3.5">
        {icon}
        <input name={name} type={type} placeholder={placeholder} defaultValue={defaultValue}
          className="flex-1 bg-transparent outline-none text-textDark placeholder:text-textMuted text-sm" />
      </div>
      {error && <p className="mt-1 ml-1 text-xs text-expenseDeep">{error}</p>}
    </div>
  );
}

function Modal({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-floating"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-textDark text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-textMuted hover:text-textDark text-xl leading-none">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
