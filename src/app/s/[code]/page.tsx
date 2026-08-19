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

        {/* Dummy Ad Slot */}
        <div className="w-full h-24 sm:h-32 bg-slate-800/50 border border-slate-700/50 rounded-xl mb-8 flex items-center justify-center overflow-hidden relative">
          <span className="text-slate-500 text-sm font-medium tracking-widest uppercase">Advertisement Space</span>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
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
