import Link from "next/link";
import { ArrowRight, Link as LinkIcon, DollarSign, ShieldCheck, BarChart3, Users, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-[family-name:var(--font-geist-sans)] selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Navigation */}
      <header className="px-6 lg:px-12 py-6 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:scale-105">
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">LinkUang</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
            Masuk
          </Link>
          <Link 
            href="/login" 
            className="text-sm font-medium bg-white text-slate-950 hover:bg-slate-200 px-5 py-2.5 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            Daftar Gratis
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center overflow-hidden">
        {/* Hero Section */}
        <section className="relative w-full flex flex-col items-center justify-center px-6 py-32 lg:py-40 text-center">
          {/* Abstract Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-indigo-500/30 text-sm font-medium text-indigo-300 mb-8 backdrop-blur-md shadow-inner shadow-indigo-500/10 hover:bg-slate-800/50 transition-colors">
            <span className="flex w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Platform Shortlink #1 di Indonesia
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-100 to-slate-400 leading-[1.1]">
            Ubah Setiap Klik Menjadi <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">Penghasilan Nyata.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
            LinkUang adalah URL shortener terbaik untuk kreator. Perpendek link Anda, bagikan ke audiens, dan dapatkan bayaran tertinggi untuk setiap klik yang valid.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="/login" 
              className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_50px_rgba(79,70,229,0.5)] hover:-translate-y-1"
            >
              Mulai Hasilkan Uang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#cara-kerja" 
              className="flex items-center gap-2 text-slate-300 bg-slate-800/50 hover:bg-slate-800 px-8 py-4 rounded-full text-lg font-medium transition-all border border-slate-700/50 backdrop-blur-sm hover:text-white"
            >
              Pelajari Cara Kerjanya
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full border-y border-slate-800/50 bg-slate-900/30 backdrop-blur-sm py-12">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <span className="text-4xl font-black text-white mb-2 tracking-tight">10K+</span>
              <span className="text-sm font-medium text-slate-400">Kreator Aktif</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-4xl font-black text-white mb-2 tracking-tight">12M+</span>
              <span className="text-sm font-medium text-slate-400">Klik Diproses</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-4xl font-black text-white mb-2 tracking-tight">Rp 5M+</span>
              <span className="text-sm font-medium text-slate-400">Total Dibayarkan</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-4xl font-black text-white mb-2 tracking-tight">99.9%</span>
              <span className="text-sm font-medium text-slate-400">Uptime Server</span>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="cara-kerja" className="w-full py-32 px-6 max-w-6xl mx-auto flex flex-col items-center">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Hasilkan Uang Dalam 3 Langkah</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Sistem kami didesain agar Anda bisa langsung menghasilkan uang tanpa proses yang rumit.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative w-full">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-slate-800 via-indigo-500/50 to-slate-800 -z-10" />
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/20 transition-all duration-300 relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-lg">1</div>
                <LinkIcon className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">1. Perpendek Link</h3>
              <p className="text-slate-400">Daftar akun dan mulai perpendek URL apa saja. Bisa link download, artikel, atau video.</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:border-cyan-500/50 group-hover:shadow-cyan-500/20 transition-all duration-300 relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-sm shadow-lg">2</div>
                <Globe className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">2. Bagikan Link</h3>
              <p className="text-slate-400">Sebarkan link pendek Anda ke media sosial, blog, YouTube, atau grup komunitas Anda.</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/20 transition-all duration-300 relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-lg">3</div>
                <DollarSign className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">3. Dapatkan Bayaran</h3>
              <p className="text-slate-400">Setiap pengunjung yang mengklik link Anda akan melewati iklan sebentar, dan Anda mendapat bayaran.</p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-24 px-6 bg-slate-950 flex flex-col items-center relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          
          <div className="text-center mb-16 z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Mengapa Memilih LinkUang?</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Fitur premium yang kami sediakan khusus untuk memaksimalkan pendapatan Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl z-10">
            <div className="flex flex-col p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md hover:bg-slate-800/60 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Bayaran Tertinggi (CPM)</h3>
              <p className="text-slate-400 leading-relaxed">Kami menawarkan Rate (CPM) tertinggi di kelasnya. Dapatkan bayaran premium untuk setiap pengunjung unik yang valid.</p>
            </div>
            
            <div className="flex flex-col p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md hover:bg-slate-800/60 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Sistem Anti-Curang Cerdas</h3>
              <p className="text-slate-400 leading-relaxed">Sistem tracking AI kami memastikan klik yang dihitung adalah klik asli dari manusia, memblokir bot, VPN, dan klik palsu.</p>
            </div>
            
            <div className="flex flex-col p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md hover:bg-slate-800/60 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Proses Sangat Cepat</h3>
              <p className="text-slate-400 leading-relaxed">Link akan dipersingkat dalam hitungan milidetik. Redirect tanpa lag yang membuat pengunjung Anda nyaman.</p>
            </div>
            
            <div className="flex flex-col p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md hover:bg-slate-800/60 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Analitik Real-time</h3>
              <p className="text-slate-400 leading-relaxed">Pantau statistik klik, pendapatan, dan sumber trafik Anda secara langsung melalui dashboard intuitif kami.</p>
            </div>
            
            <div className="flex flex-col p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md hover:bg-slate-800/60 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Dukungan API & Mass Shrinker</h3>
              <p className="text-slate-400 leading-relaxed">Punya banyak link? Gunakan fitur Mass Shrinker atau API kami untuk mempersingkat ribuan URL sekaligus dengan mudah.</p>
            </div>

            <div className="flex flex-col p-8 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl group-hover:bg-indigo-500/30 transition-colors"></div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-3 text-white">Mulai Hasilkan Sekarang</h3>
                <p className="text-indigo-200 mb-6">Bergabung dengan ribuan kreator lain yang telah menghasilkan puluhan juta setiap bulannya.</p>
                <Link 
                  href="/login" 
                  className="inline-flex items-center justify-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-400 transition-colors w-fit"
                >
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer CTA */}
        <section className="w-full py-24 px-6 border-t border-slate-800/50 bg-gradient-to-b from-slate-950 to-indigo-950/20 text-center relative overflow-hidden">
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
           <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Siap untuk memonetisasi trafik Anda?</h2>
           <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">Tidak ada biaya pendaftaran. Mulai perpendek link Anda dan dapatkan bayaran pertama Anda hari ini juga.</p>
           <Link 
              href="/login" 
              className="inline-flex items-center gap-2 bg-white text-slate-950 px-10 py-5 rounded-full text-lg font-bold hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300"
            >
              Buat Akun Gratis
            </Link>
            <div className="mt-8 text-sm text-slate-500 flex items-center justify-center gap-4">
              <span>✓ Pendaftaran 1 Menit</span>
              <span>✓ Pembayaran Tepat Waktu</span>
            </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-8 px-6 border-t border-slate-800/50 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} LinkUang. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}
