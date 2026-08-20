"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, LinkIcon, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminWithdrawPage() {
  const params = useParams();
  const token = params?.token as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (token) {
      fetchInfo();
    }
  }, [token]);

  const fetchInfo = async () => {
    try {
      const res = await fetch(`/api/admin/withdraw-info?token=${token}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || "Gagal mengambil data");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAction = async (action: "approve" | "reject") => {
    if (action === "reject" && !confirm("Tolak pencairan ini? Saldo akan dikembalikan ke akun pengguna.")) return;
    if (action === "approve" && !confirm("Setujui pencairan ini? Pastikan Anda sudah mentransfer uang ke rekening pengguna.")) return;

    setActionLoading(action);
    try {
      const res = await fetch("/api/admin/withdraw-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg(action === "approve" ? "Pencairan berhasil disetujui." : "Pencairan ditolak dan saldo dikembalikan.");
        setData(null); // Hide the form
      } else {
        alert(json.error || "Gagal memproses");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]">
              <LinkIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">LinkUang</span>
          </Link>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-20%] w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
          
          <h2 className="text-2xl font-bold text-white text-center mb-8 relative z-10">
            Persetujuan Pencairan
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-slate-400">Memeriksa link keamanan...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Akses Ditolak</h3>
              <p className="text-slate-400">{error}</p>
            </div>
          ) : successMsg ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Berhasil</h3>
              <p className="text-slate-400">{successMsg}</p>
              <p className="text-sm text-slate-500 mt-4">Link ini telah hangus secara otomatis.</p>
            </div>
          ) : data ? (
            <div className="space-y-6 relative z-10">
              <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800">
                <div className="text-center mb-6">
                  <p className="text-sm text-slate-400 mb-1">Nominal Pencairan</p>
                  <p className="text-4xl font-bold text-emerald-400 tracking-tight">
                    {formatCurrency(data.amount)}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-sm text-slate-400">Email User</span>
                    <span className="text-sm font-medium text-white">{data.email}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-sm text-slate-400">Metode</span>
                    <span className="text-sm font-medium text-white">{data.methodType} - {data.provider}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-sm text-slate-400">No. Rekening/HP</span>
                    <span className="text-sm font-bold text-indigo-400">{data.accountNumber}</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-sm text-slate-400">Atas Nama</span>
                    <span className="text-sm font-medium text-white">{data.accountName}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAction("reject")}
                  disabled={!!actionLoading}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                >
                  {actionLoading === "reject" ? <Loader2 className="w-5 h-5 animate-spin" /> : <><XCircle className="w-5 h-5" /> Tolak</>}
                </button>
                <button
                  onClick={() => handleAction("approve")}
                  disabled={!!actionLoading}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                >
                  {actionLoading === "approve" ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Setujui</>}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
