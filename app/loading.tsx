import { Wallet } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-greenDark">
      <div className="w-[90px] h-[90px] rounded-[28px] bg-green flex items-center justify-center">
        <Wallet className="text-white" size={48} />
      </div>
      <h1 className="mt-5 text-white text-[32px] font-bold">AturDuit</h1>
      <p className="mt-2 text-greenMist text-sm">Atur keuanganmu dengan mudah</p>
      <div className="mt-10 w-8 h-8 border-4 border-green border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
