import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AturDuit — Atur keuanganmu dengan mudah",
  description: "Aplikasi manajemen keuangan pribadi AturDuit",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={roboto.variable}>
      <body className="font-sans bg-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}
