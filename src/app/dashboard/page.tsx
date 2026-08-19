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
  Plus, 
  Copy, 
  ExternalLink, 
  Loader2 
} from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newUrl, setNewUrl] = useState("");
  const [creating, setCreating] = useState(false);

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
        setStats({ user: data.user, totalClicks: data.stats.totalClicks });
        setLinks(data.links);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900/50 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                <Wallet className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-medium text-slate-300">Total Earnings</h2>
            </div>
            <p className="text-4xl font-bold text-white tracking-tight">
              {formatCurrency(stats?.user?.balance || 0)}
            </p>
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
      </main>
    </div>
  );
}
