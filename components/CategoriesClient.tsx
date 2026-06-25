"use client";

import { useOptimistic, useTransition, useActionState, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, LayoutGrid } from "lucide-react";
import { addCategoryAction } from "@/lib/actions/categories";
import { deleteCategoryAction } from "@/lib/actions/categories";
import SubmitButton from "@/components/SubmitButton";
import type { CategoryRow } from "@/lib/data/categories";

export default function CategoriesClient({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [optimisticCats, removeOptimistic] = useOptimistic(
    categories,
    (state, deletedId: string) => state.filter((c) => c.id !== deletedId)
  );
  const [, startTransition] = useTransition();

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);
  const [addState, addAction] = useActionState(addCategoryAction, undefined);

  // Long-press logic
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function startPress(cat: CategoryRow) {
    // Kategori bawaan (user_id null, milik semua user) sengaja tidak boleh dihapus.
    if (cat.user_id === null) return;
    pressTimer.current = setTimeout(() => {
      setDeleteTarget(cat);
    }, 500);
  }

  function cancelPress() {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    startTransition(() => removeOptimistic(id));
    await deleteCategoryAction(id);
  }

  function handleCardClick(cat: CategoryRow) {
    // Klik biasa → buka form tambah transaksi dengan kategori ter-select
    router.push(`/transactions/add?categoryId=${cat.id}`);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-textDark text-lg font-bold">Daftar Kategori</h2>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2 bg-green text-white text-sm font-bold px-5 py-3 rounded-2xl hover:bg-green/90 transition-colors shadow-floating"
        >
          <Plus size={18} /> Tambah
        </button>
      </div>

      {/* Grid kategori */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {optimisticCats.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCardClick(cat)}
            onMouseDown={() => startPress(cat)}
            onMouseUp={cancelPress}
            onMouseLeave={cancelPress}
            onTouchStart={() => startPress(cat)}
            onTouchEnd={cancelPress}
            className="bg-white rounded-3xl shadow-card p-5 flex flex-col items-center gap-3 select-none
              hover:shadow-floating hover:-translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer text-left"
            title={cat.user_id === null ? "Klik untuk tambah transaksi (kategori bawaan, tidak bisa dihapus)" : "Klik untuk tambah transaksi · Tahan untuk hapus"}
          >
            {/* Icon container mirip flutter */}
            <div className="w-14 h-14 rounded-2xl bg-iconBg flex items-center justify-center">
              <LayoutGrid className="text-green" size={26} />
            </div>
            <p className="text-textDark text-sm font-semibold text-center leading-tight line-clamp-2 w-full">
              {cat.name}
            </p>
            {cat.user_id === null && (
              <span className="text-[10px] text-textMuted bg-bg px-2 py-0.5 rounded-full">Bawaan</span>
            )}
          </button>
        ))}

        {optimisticCats.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <LayoutGrid size={40} className="text-textMuted mx-auto mb-3 opacity-40" />
            <p className="text-textMuted text-sm">Belum ada kategori</p>
            <p className="text-textMuted text-xs mt-1">Klik "+ Tambah" untuk membuat kategori baru</p>
          </div>
        )}
      </div>

      {/* Hint teks */}
      {optimisticCats.length > 0 && (
        <p className="text-textMuted text-xs mt-5 text-center">
          Klik kategori untuk tambah transaksi · Tahan untuk hapus
        </p>
      )}

      {/* ── Dialog: Tambah Kategori ── */}
      {showAddDialog && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddDialog(false)}
        >
          <div
            className="bg-[#EEF4F1] w-full max-w-sm rounded-3xl p-7 shadow-floating"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-textDark text-2xl font-bold mb-5">Tambah Kategori</h2>
            <form
              action={async (fd) => {
                await addAction(fd);
                setShowAddDialog(false);
              }}
            >
              {addState?.errors?.name && (
                <p className="text-xs text-expenseDeep mb-2">{addState.errors.name[0]}</p>
              )}
              <input
                name="name"
                type="text"
                placeholder="Nama kategori"
                autoFocus
                className="w-full bg-white border-2 border-green rounded-xl px-4 py-3.5 text-textDark placeholder:text-textMuted text-base outline-none mb-5"
              />
              <div className="flex justify-end gap-6 items-center">
                <button
                  type="button"
                  onClick={() => setShowAddDialog(false)}
                  className="text-greenDark font-bold text-base px-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-green text-white font-bold text-base px-7 py-3 rounded-2xl hover:bg-green/90 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Dialog: Konfirmasi Hapus ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-[#EEF4F1] w-full max-w-sm rounded-3xl p-7 shadow-floating"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-textDark text-2xl font-bold mb-3">Hapus Kategori</h2>
            <p className="text-textLabel text-base mb-8">
              Hapus &ldquo;{deleteTarget.name}&rdquo;?
            </p>
            <div className="flex justify-end gap-8 items-center">
              <button
                onClick={() => setDeleteTarget(null)}
                className="text-greenDark font-bold text-base px-2"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="text-expense font-bold text-base px-2"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}