import { z } from "zod";

// ---- Auth ----
export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Nama lengkap wajib diisi"),
    email: z.string().trim().min(1, "Email wajib diisi").email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak sama",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

// ---- Transaction ----
export const transactionSchema = z.object({
  type: z.enum(["income", "expense"], { errorMap: () => ({ message: "Jenis transaksi tidak valid" }) }),
  amount: z.coerce.number({ invalid_type_error: "Jumlah harus berupa angka" }).positive("Jumlah harus lebih dari 0"),
  title: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  transactionDate: z.string().trim().min(1, "Tanggal wajib diisi"),
  description: z.string().trim().optional(),
});

// ---- Category ----
export const categorySchema = z.object({
  name: z.string().trim().min(1, "Nama kategori wajib diisi").max(40, "Nama kategori terlalu panjang"),
});

// ---- Profile ----
export const profileSchema = z.object({
  name: z.string().trim().min(1, "Nama lengkap wajib diisi"),
  email: z.string().trim().min(1, "Email wajib diisi").email("Format email tidak valid"),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Password lama wajib diisi"),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
  });
