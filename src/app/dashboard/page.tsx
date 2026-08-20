"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LinkIcon, 
  LogOut, 
  Wallet, 
  MousePointerClick, 
  Activity,
  Plus, 
  Copy, 
  ExternalLink, 
  Loader2,
  Trash2,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Building,
  Smartphone
} from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newUrl, setNewUrl] = useState("");
  const [creating, setCreating] = useState(false);

  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawData, setWithdrawData] = useState({
    amount: "",
    methodType: "BANK",
    provider: "BCA",
    accountNumber: "",
    accountName: ""
  });

  const BANK_OPTIONS = ["BCA", "Mandiri", "BNI", "BRI", "BSI", "CIMB Niaga"];
  const EWALLET_OPTIONS = ["GoPay", "OVO", "DANA", "ShopeePay", "LinkAja"];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/user/stats");
      const data = await res.json();
      if (data.success) {
        setStats({ user: data.user, totalClicks: data.stats.totalClicks, ratePerClick: data.ratePerClick });
        setLinks(data.links || []);
        setWithdrawals(data.withdrawals || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    setCreating(true);
    try {
      const res = await fetch("/api/link/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_url: newUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setNewUrl("");
        fetchData(); // Refresh list
      } else {
        alert(data.error || "Gagal membuat link");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setCreating(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(withdrawData.amount, 10);
    if (isNaN(amount) || amount < 50000) {
      alert("Minimal pencairan adalah Rp 50.000");
      return;
    }
    if (amount > (stats?.user?.balance || 0)) {
      alert("Saldo tidak mencukupi");
      return;
    }

    setWithdrawing(true);
    try {
      const res = await fetch("/api/user/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(withdrawData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Permintaan pencairan berhasil dibuat!");
        setShowWithdrawModal(false);
        setWithdrawData({
          amount: "",
          methodType: "BANK",
          provider: "BCA",
          accountNumber: "",
          accountName: ""
        });
        fetchData(); // Refresh balance & history
      } else {
        alert(data.error || "Gagal membuat permintaan pencairan");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem");
    } finally {
      setWithdrawing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus link ini?")) return;
    try {
      const res = await fetch("/api/link/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || "Gagal menghapus link");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem saat menghapus");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-[family-name:var(--font-geist-sans)]">
      {/* Navbar */}
      <nav className="border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400 hidden sm:block">
                {session?.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900/50 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                <Wallet className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-medium text-slate-300">Total Earnings</h2>
            </div>
            <p className="text-4xl font-bold text-white tracking-tight mb-4">
              {formatCurrency(stats?.user?.balance || 0)}
            </p>
            <button
              onClick={() => {
                const bal = stats?.user?.balance || 0;
                setWithdrawData(prev => ({ ...prev, amount: bal >= 50000 ? bal.toString() : "" }));
                setShowWithdrawModal(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
            >
              Tarik Saldo
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/50 to-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-medium text-slate-300">Total Valid Clicks</h2>
            </div>
            <p className="text-4xl font-bold text-white tracking-tight">
              {stats?.totalClicks || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-900/50 to-slate-900/50 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
                <Activity className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-medium text-slate-300">Rate Hari Ini</h2>
            </div>
            <p className="text-4xl font-bold text-white tracking-tight mb-2">
              {formatCurrency(stats?.ratePerClick || 15)}
            </p>
            <p className="text-xs text-slate-400">
              Per klik valid. Diperbarui setiap hari berdasar performa iklan.
            </p>
          </div>
        </div>

        {/* Create Link Section */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" />
            Shorten New Link
          </h3>
          <form onSubmit={handleCreateLink} className="flex flex-col sm:flex-row gap-4">
            <input
              type="url"
              required
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Paste your long URL here (e.g. https://youtube.com/...)"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={creating}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Shorten"}
            </button>
          </form>
        </div>

        {/* Links Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-semibold">Your Links</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Short Link</th>
                  <th className="px-6 py-4 font-medium">Original URL</th>
                  <th className="px-6 py-4 font-medium">Clicks</th>
                  <th className="px-6 py-4 font-medium">Earnings</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {links.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No links created yet.
                    </td>
                  </tr>
                ) : (
                  links.map((link) => {
                    const shortUrl = `${window.location.origin}/s/${link.short_code}`;
                    return (
                      <tr key={link._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-indigo-400">
                            /s/{link.short_code}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="truncate max-w-[200px] sm:max-w-xs text-slate-400" title={link.original_url}>
                            {link.original_url}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{link.clicks}</td>
                        <td className="px-6 py-4 font-medium text-emerald-400">
                          {formatCurrency(link.earnings)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => copyToClipboard(shortUrl)}
                              className="text-slate-400 hover:text-white transition-colors p-1"
                              title="Copy short link"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/s/${link.short_code}`}
                              target="_blank"
                              className="text-slate-400 hover:text-indigo-400 transition-colors p-1"
                              title="Open link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteLink(link._id)}
                              className="text-slate-400 hover:text-red-500 transition-colors p-1"
                              title="Delete link"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdrawals Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden mt-8">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-semibold">Riwayat Pencairan</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Tanggal</th>
                  <th className="px-6 py-4 font-medium">Nominal</th>
                  <th className="px-6 py-4 font-medium">Metode</th>
                  <th className="px-6 py-4 font-medium">Tujuan</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Belum ada riwayat pencairan.
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((w) => (
                    <tr key={w._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-400">
                        {w.createdAt ? new Date(w.createdAt._seconds * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                      <td className="px-6 py-4 font-medium text-emerald-400">
                        {formatCurrency(w.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                          {w.methodType === 'BANK' ? <Building className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                          {w.provider}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{w.accountNumber}</div>
                        <div className="text-xs text-slate-400">{w.accountName}</div>
                      </td>
                      <td className="px-6 py-4">
                        {w.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-400/20">
                            <Clock className="w-3 h-3" /> Diproses
                          </span>
                        )}
                        {w.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-400/20">
                            <CheckCircle2 className="w-3 h-3" /> Berhasil
                          </span>
                        )}
                        {w.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full text-xs font-medium border border-red-400/20">
                            <XCircle className="w-3 h-3" /> Ditolak
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold text-white mb-6">Tarik Saldo</h3>
            
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nominal Pencairan</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-500 font-medium">Rp</span>
                  <input
                    type="number"
                    required
                    min="50000"
                    max={stats?.user?.balance || 0}
                    value={withdrawData.amount}
                    onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="50000"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Minimal: Rp 50.000 | Saldo Anda: {formatCurrency(stats?.user?.balance || 0)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Metode</label>
                  <select
                    value={withdrawData.methodType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setWithdrawData({
                        ...withdrawData,
                        methodType: newType,
                        provider: newType === "BANK" ? BANK_OPTIONS[0] : EWALLET_OPTIONS[0]
                      })
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                    <option value="BANK">Bank</option>
                    <option value="EWALLET">E-Wallet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Penyedia</label>
                  <select
                    value={withdrawData.provider}
                    onChange={(e) => setWithdrawData({ ...withdrawData, provider: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                    {(withdrawData.methodType === "BANK" ? BANK_OPTIONS : EWALLET_OPTIONS).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nomor Rekening / HP</label>
                <input
                  type="text"
                  required
                  value={withdrawData.accountNumber}
                  onChange={(e) => setWithdrawData({ ...withdrawData, accountNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={withdrawData.methodType === "BANK" ? "Nomor Rekening" : "Nomor HP"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nama Pemilik Rekening</label>
                <input
                  type="text"
                  required
                  value={withdrawData.accountName}
                  onChange={(e) => setWithdrawData({ ...withdrawData, accountName: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                  placeholder="JOHN DOE"
                />
              </div>

              <button
                type="submit"
                disabled={withdrawing || parseInt(withdrawData.amount || '0') < 50000 || parseInt(withdrawData.amount || '0') > (stats?.user?.balance || 0)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold mt-4 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {withdrawing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Proses Pencairan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
