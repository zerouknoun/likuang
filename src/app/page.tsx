import Link from "next/link";
import { ArrowRight, Link as LinkIcon, DollarSign, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-[family-name:var(--font-geist-sans)]">
      {/* Navigation */}
      <header className="px-6 lg:px-12 py-6 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">LinkUang</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link 
            href="/login" 
            className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)]"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 lg:py-32 text-center relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium text-indigo-300 mb-8 backdrop-blur-sm">
          <span className="flex w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Monetize your traffic instantly
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
          Turn your links into <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">real income.</span>
        </h1>
        
        <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          The most advanced URL shortener designed for creators. Shorten links, share them with your audience, and get paid for every valid click.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="/login" 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] hover:-translate-y-1"
          >
            Start Earning Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-24">
          <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">High Payouts</h3>
            <p className="text-slate-400 text-sm">Earn premium rates for every unique visitor that clicks on your shortened links.</p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Anti-Fraud System</h3>
            <p className="text-slate-400 text-sm">Our advanced tracking ensures you get paid fairly while blocking bots and duplicate IPs.</p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm text-center">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400">
              <LinkIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Instant Shortening</h3>
            <p className="text-slate-400 text-sm">Lightning fast link generation and redirects. Manage everything from a sleek dashboard.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
