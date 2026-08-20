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
    <div className="min-h-screen bg-slate-50 font-[family-name:var(--font-geist-sans)] text-slate-800 selection:bg-indigo-100">
      
      {/* Blog Header / Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-lg text-slate-900">LinkUang</span>
          </div>
          <div className="text-sm font-medium text-slate-500">
            {error ? "Error" : canProceed ? "Link Ready" : `Please wait... ${timeLeft}s`}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 bg-white min-h-screen shadow-sm">
        
        {/* Article Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
            Hangat dan Menyehatkan: Panduan Lengkap Cara Membuat Wedang Jahe Tradisional
          </h1>
          <p className="text-slate-500 text-sm">Dipublikasikan untuk Anda sambil menyiapkan tautan tujuan</p>
        </div>

        {/* Ad Banner HTML Space */}
        <div className="my-8 w-full flex justify-center items-center overflow-hidden rounded-xl bg-slate-50/50">
          <div data-banner-id="1499410"></div>
        </div>

        {/* Article Content */}
        <div className="prose prose-slate max-w-none text-slate-700 text-base leading-relaxed space-y-6">
          <p>
            Di tengah cuaca yang sejuk atau saat tubuh terasa kurang fit, segelas minuman hangat sering kali menjadi solusi yang paling dicari. Salah satu minuman tradisional Nusantara yang tak pernah lekang oleh waktu adalah wedang jahe. Selain memberikan efek hangat yang menenangkan, wedang jahe juga kaya akan manfaat kesehatan, seperti meredakan mual, melancarkan pencernaan, dan meningkatkan sistem kekebalan tubuh.
          </p>
          <p>
            Membuat wedang jahe di rumah sangatlah mudah dan tidak membutuhkan banyak bahan. Keunggulannya, Anda bisa menyesuaikan tingkat kepekatan rasa jahe dan manisnya sesuai dengan selera pribadi. Berikut adalah panduan langkah demi langkah untuk meracik wedang jahe yang nikmat dan beraroma.
          </p>
          
          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2">Bahan-bahan yang Diperlukan:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Jahe segar:</strong> 2 ruas (sekitar 5-7 cm). Anda bisa menggunakan jahe biasa atau jahe merah jika menginginkan rasa pedas dan efek hangat yang lebih kuat.</li>
            <li><strong>Air mineral:</strong> 500 ml (sekitar 2 gelas).</li>
            <li><strong>Gula merah atau gula aren:</strong> 50 gram (bisa disesuaikan selera). Alternatif lain, Anda bisa menggunakan madu sebagai pemanis alami.</li>
            <li><strong>Serai:</strong> 1 batang, memarkan (opsional, untuk menambah aroma).</li>
            <li><strong>Daun pandan:</strong> 1 lembar, ikat simpul (opsional).</li>
            <li><strong>Kayu manis:</strong> 1 batang kecil (opsional, memberikan sentuhan aroma rempah yang manis).</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2">Langkah-langkah Pembuatan:</h3>
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

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2">Tips Tambahan:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Wedang Jahe Susu:</strong> Jika Anda menyukai rasa yang lebih <i>creamy</i>, Anda bisa menambahkan sedikit susu kental manis atau susu evaporasi ke dalam gelas saji sebelum menuangkan wedang jahe.</li>
            <li><strong>Penyimpanan:</strong> Jika membuat dalam jumlah banyak, wedang jahe (tanpa madu/susu) bisa disimpan di dalam kulkas dan dipanaskan kembali keesokan harinya, rasanya bahkan akan terasa lebih pekat.</li>
          </ul>
          
          <p className="p-4 bg-indigo-50 text-indigo-900 rounded-lg italic mt-8 border border-indigo-100">
            Wedang jahe kini siap dinikmati. Aroma rempahnya yang menguar perlahan dan sensasi hangat saat minuman ini mengalir di tenggorokan dijamin mampu memberikan relaksasi instan setelah beraktivitas seharian. Selamat mencoba!
          </p>
        </div>

        {/* Action / Timer Section at the bottom */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <h4 className="text-lg font-bold text-slate-900 mb-1">Your Link Destination</h4>
            <p className="text-slate-500 text-sm">Please wait for the timer to finish before proceeding.</p>
          </div>

          <div className="min-h-[80px] w-full flex items-center justify-center">
            {error ? (
              <div className="text-red-600 bg-red-50 border border-red-200 px-6 py-4 rounded-xl font-medium w-full text-center">
                {error}
              </div>
            ) : !canProceed ? (
              <div className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl w-full max-w-sm border border-slate-200 shadow-inner">
                <div className="text-6xl font-extrabold text-indigo-600 mb-2 font-mono">
                  {timeLeft}
                </div>
                <div className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                  Seconds Remaining
                </div>
              </div>
            ) : (
              <button
                onClick={handleContinue}
                disabled={loading}
                className="w-full max-w-sm group relative flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-5 rounded-2xl text-lg font-bold transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Continue to Link
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            )}
          </div>
        </div>

      </main>
      
      <footer className="text-center py-6 text-sm text-slate-500 bg-slate-50 border-t border-slate-200">
        &copy; {new Date().getFullYear()} LinkUang. All rights reserved.
      </footer>
    </div>
  );
}
