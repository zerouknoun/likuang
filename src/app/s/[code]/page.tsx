"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";

export default function WaitPage() {
  const { code } = useParams();
  const router = useRouter();
  
  const [timeLeft, setTimeLeft] = useState(10);
  const [canProceed, setCanProceed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanProceed(true);
    }
  }, [timeLeft]);

  const handleContinue = async () => {
    if (!canProceed) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/link/${code}`);
      const data = await res.json();

      if (res.ok && data.success && data.original_url) {
        window.location.href = data.original_url;
      } else {
        setError(data.error || "Failed to process link.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while verifying the link.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-[family-name:var(--font-geist-sans)] relative overflow-hidden">
      {/* Abstract Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Verifying your request...
        </h1>
        <p className="text-slate-400 mb-8 max-w-md">
          Please wait a moment while we securely process your destination link and ensure your safety.
        </p>

        {/* Article Content / Ad Space */}
        <div className="w-full bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-8 text-left max-h-[400px] overflow-y-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-snug">
            Hangat dan Menyehatkan: Panduan Lengkap Cara Membuat Wedang Jahe Tradisional
          </h2>
          <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
            <p>
              Di tengah cuaca yang sejuk atau saat tubuh terasa kurang fit, segelas minuman hangat sering kali menjadi solusi yang paling dicari. Salah satu minuman tradisional Nusantara yang tak pernah lekang oleh waktu adalah wedang jahe. Selain memberikan efek hangat yang menenangkan, wedang jahe juga kaya akan manfaat kesehatan, seperti meredakan mual, melancarkan pencernaan, dan meningkatkan sistem kekebalan tubuh.
            </p>
            <p>
              Membuat wedang jahe di rumah sangatlah mudah dan tidak membutuhkan banyak bahan. Keunggulannya, Anda bisa menyesuaikan tingkat kepekatan rasa jahe dan manisnya sesuai dengan selera pribadi. Berikut adalah panduan langkah demi langkah untuk meracik wedang jahe yang nikmat dan beraroma.
            </p>
            
            <h3 className="text-lg font-semibold text-indigo-400 mt-6 mb-2">Bahan-bahan yang Diperlukan:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Jahe segar:</strong> 2 ruas (sekitar 5-7 cm). Anda bisa menggunakan jahe biasa atau jahe merah jika menginginkan rasa pedas dan efek hangat yang lebih kuat.</li>
              <li><strong>Air mineral:</strong> 500 ml (sekitar 2 gelas).</li>
              <li><strong>Gula merah atau gula aren:</strong> 50 gram (bisa disesuaikan selera). Alternatif lain, Anda bisa menggunakan madu sebagai pemanis alami.</li>
              <li><strong>Serai:</strong> 1 batang, memarkan (opsional, untuk menambah aroma).</li>
              <li><strong>Daun pandan:</strong> 1 lembar, ikat simpul (opsional).</li>
              <li><strong>Kayu manis:</strong> 1 batang kecil (opsional, memberikan sentuhan aroma rempah yang manis).</li>
            </ul>

            <h3 className="text-lg font-semibold text-indigo-400 mt-6 mb-2">Langkah-langkah Pembuatan:</h3>
            <ol className="list-decimal pl-5 space-y-4">
              <li>
                <strong>Persiapkan Jahe dengan Tepat</strong><br/>
                Kunci dari wedang jahe yang lezat ada pada persiapan jahenya. Cuci bersih jahe dari sisa tanah. Untuk mengeluarkan aroma dan minyak atsirinya secara maksimal, bakar jahe di atas api kompor selama 1-2 menit hingga kulitnya sedikit menghitam. Setelah itu, kupas kulitnya (atau biarkan saja jika sudah dicuci sangat bersih) dan memarkan (geprek) jahe hingga pipih.
              </li>
              <li>
                <strong>Rebus Bahan-bahan Aromatik</strong><br/>
                Siapkan panci kecil, lalu masukkan air mineral. Tambahkan jahe yang sudah digeprek, batang serai yang sudah dimemarkan, daun pandan, dan kayu manis. Nyalakan kompor dengan api sedang.
              </li>
              <li>
                <strong>Proses Pemanasan dan Ekstraksi</strong><br/>
                Biarkan air direbus hingga mendidih. Setelah mendidih, turunkan api menjadi kecil dan biarkan rebusan tersebut mendidih perlahan (simmer) selama sekitar 10-15 menit. Proses ini bertujuan untuk mengekstrak seluruh rasa, aroma, dan khasiat dari jahe serta rempah lainnya agar menyatu sempurna dengan air. Air rebusan perlahan akan berubah warna menjadi agak kecokelatan.
              </li>
              <li>
                <strong>Tambahkan Pemanis</strong><br/>
                Masukkan gula merah atau gula aren yang sudah disisir halus agar lebih cepat larut. Aduk perlahan hingga seluruh gula mencair dan menyatu dengan kuah jahe. Jika Anda memilih menggunakan madu, jangan masukkan madu saat air masih mendidih di atas kompor agar nutrisi madu tidak rusak. Matikan api terlebih dahulu, tunggu sejenak hingga suhu sedikit turun, barulah tambahkan madu dan aduk rata.
              </li>
              <li>
                <strong>Saring dan Sajikan</strong><br/>
                Matikan api. Siapkan gelas saji dan saringan. Tuang wedang jahe melalui saringan untuk memisahkan ampas rempah-rempahnya, sehingga Anda mendapatkan minuman yang bersih dan nyaman saat diteguk.
              </li>
            </ol>

            <h3 className="text-lg font-semibold text-indigo-400 mt-6 mb-2">Tips Tambahan:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Wedang Jahe Susu:</strong> Jika Anda menyukai rasa yang lebih <i>creamy</i>, Anda bisa menambahkan sedikit susu kental manis atau susu evaporasi ke dalam gelas saji sebelum menuangkan wedang jahe.</li>
              <li><strong>Penyimpanan:</strong> Jika membuat dalam jumlah banyak, wedang jahe (tanpa madu/susu) bisa disimpan di dalam kulkas dan dipanaskan kembali keesokan harinya, rasanya bahkan akan terasa lebih pekat.</li>
            </ul>
            <p className="pt-4 border-t border-slate-800/60 text-slate-400 italic">
              Wedang jahe kini siap dinikmati. Aroma rempahnya yang menguar perlahan dan sensasi hangat saat minuman ini mengalir di tenggorokan dijamin mampu memberikan relaksasi instan setelah beraktivitas seharian. Selamat mencoba!
            </p>
          </div>
        </div>

        {/* Timer / Button Area */}
        <div className="min-h-[60px] flex items-center justify-center">
          {error ? (
            <div className="text-red-400 bg-red-400/10 border border-red-400/20 px-6 py-3 rounded-xl font-medium">
              {error}
            </div>
          ) : !canProceed ? (
            <div className="flex flex-col items-center">
              <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2 font-mono">
                {timeLeft}
              </div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-widest">
                Seconds Remaining
              </div>
            </div>
          ) : (
            <button
              onClick={handleContinue}
              disabled={loading}
              className="group relative flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Continue to Link
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          )}
        </div>
      </div>
      
      <p className="mt-8 text-sm text-slate-600 font-medium">
        Powered by LinkUang
      </p>
    </div>
  );
}
