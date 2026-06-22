"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";

/**
 * Task 3: URL sebagai State
 * Setiap kali user mengetik, kita update URL query parameter ?q=... menggunakan
 * router.replace() (client-side navigation) tanpa reload halaman penuh.
 * Ini membuat hasil pencarian tetap ada di URL sehingga tidak hilang saat
 * halaman di-refresh — persis seperti yang diajarkan di materi minggu 9.
 */
export default function SearchBar({
  defaultValue,
  placeholder = "Cari...",
}: {
  defaultValue?: string;
  placeholder?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("q", e.target.value);
    } else {
      params.delete("q");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex items-center gap-2.5 bg-white rounded-pill px-4 py-3 shadow-card">
      <Search className="text-textMuted" size={18} />
      <input
        type="search"
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-textDark placeholder:text-textMuted text-sm"
      />
    </div>
  );
}
