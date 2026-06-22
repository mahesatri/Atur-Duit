"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3.5 rounded-xl bg-green text-white font-bold text-sm hover:bg-green/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Memproses..." : children}
    </button>
  );
}
