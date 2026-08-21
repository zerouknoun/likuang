"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import Script from "next/script";

declare global {
  interface Window {
    fluidPlayer: any;
  }
}

export default function WaitPage() {
  const { code } = useParams();
  const router = useRouter();
  
  const [timeLeft, setTimeLeft] = useState(20);
  const [canProceed, setCanProceed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdBlockActive, setIsAdBlockActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const detectAdBlock = () => {
      // 1. Deteksi berbasis CSS (Browser Extensions seperti uBlock Origin)
      const bait = document.createElement('div');
      bait.innerHTML = '&nbsp;';
      bait.className = 'adsbox ad-placement doubleclick ad-placeholder ad-badge';
      bait.style.height = '1px';
      bait.style.width = '1px';
      bait.style.position = 'absolute';
      bait.style.top = '-1000px';
      bait.style.left = '-1000px';
      document.body.appendChild(bait);

      setTimeout(() => {
        if (!document.body.contains(bait)) return;
        const isBlocked = bait.offsetHeight === 0 || window.getComputedStyle(bait).display === 'none';
        if (isBlocked) setIsAdBlockActive(true);
        bait.remove();
      }, 100);

      // 2. Deteksi tingkat DNS/Network (AdGuard DNS, Pi-hole, dll)
      const testImage = new Image();
      testImage.onerror = () => setIsAdBlockActive(true);
      testImage.src = "https://publishers.clickadilla.com/favicon.ico?_t=" + Date.now();

      // 3. Deteksi Agresif (Brave Browser Shields & Strict Blockers)
      // Brave sangat agresif memblokir request ke server Google Syndication
      fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", { 
        method: 'HEAD', 
        mode: 'no-cors',
        cache: 'no-store' 
      }).catch(() => {
        setIsAdBlockActive(true);
      });
    };

    // Initial check
    detectAdBlock();
    
    // Check periodically in case user disables it dynamically
    interval = setInterval(detectAdBlock, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAdBlockActive) return; // Pause timer when adblock is active

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanProceed(true);
    }
  }, [timeLeft, isAdBlockActive]);

  const initVideoAd = () => {
    if (typeof window !== "undefined" && window.fluidPlayer) {
      try {
        window.fluidPlayer('vast-video-player', {
          layoutControls: {
            fillToContainer: true,
            posterImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', // Placeholder image
            playButtonShowing: true,
          },
          vastOptions: {
            adList: [
              {
                roll: 'preRoll',
                vastTag: 'https://vast.yomeno.xyz/vast?spot_id=1499581',
                adText: 'Advertisement - Video will resume after ad'
              }
            ]
          }
        });
      } catch (e) {
        console.error("Fluid Player Error:", e);
      }
    } else {
      setTimeout(initVideoAd, 500); // Retry until script loads
    }
  };

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
    <div className="min-h-screen bg-slate-50 font-[family-name:var(--font-geist-sans)] text-slate-800 selection:bg-indigo-100 relative">
      <link rel="stylesheet" href="https://cdn.fluidplayer.com/v3/current/fluidplayer.min.css" type="text/css" />
      <Script src="https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js" strategy="lazyOnload" onLoad={initVideoAd} />
      
      {/* AdBlock Warning Overlay */}
      {isAdBlockActive && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-t-8 border-red-500 animate-in fade-in zoom-in duration-300">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">AdBlock Terdeteksi!</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Mohon matikan AdBlocker (pemblokir iklan) di peramban Anda untuk melanjutkan. Penghasilan kreator bergantung pada iklan agar layanan ini tetap berjalan.
            </p>
            <div className="bg-red-50 p-4 rounded-xl text-sm font-medium text-red-800 border border-red-100 text-left">
              ⏳ <strong className="font-bold">Timer saat ini berhenti.</strong> Matikan AdBlock dan *refresh* halaman ini atau tunggu sistem mendeteksi otomatis dalam beberapa detik.
            </div>
          </div>
        </div>
      )}
      
      {/* Anti AdBlock Script (Hanya berjalan di halaman ini) */}
      <script 
        id="anti-adblock-script"
        data-cfasync="false"
        dangerouslySetInnerHTML={{
          __html: `function R(K,h){var O=X();return R=function(p,E){p=p-0x87;var Z=O[p];return Z;},R(K,h);}(function(K,h){var Xo=R,O=K();while(!![]){try{var p=parseInt(Xo(0xac))/0x1*(-parseInt(Xo(0x90))/0x2)+parseInt(Xo(0xa5))/0x3*(-parseInt(Xo(0x8d))/0x4)+parseInt(Xo(0xb5))/0x5*(-parseInt(Xo(0x93))/0x6)+parseInt(Xo(0x89))/0x7+-parseInt(Xo(0xa1))/0x8+parseInt(Xo(0xa7))/0x9*(parseInt(Xo(0xb2))/0xa)+parseInt(Xo(0x95))/0xb*(parseInt(Xo(0x9f))/0xc);if(p===h)break;else O['push'](O['shift']());}catch(E){O['push'](O['shift']());}}}(X,0x33565),(function(){var XG=R;function K(){var Xe=R,h=455785,O='a3klsam',p='a',E='db',Z=Xe(0xad),S=Xe(0xb6),o=Xe(0xb0),e='cs',D='k',c='pro',u='xy',Q='su',G=Xe(0x9a),j='se',C='cr',z='et',w='sta',Y='tic',g='adMa',V='nager',A=p+E+Z+S+o,s=p+E+Z+S+e,W=p+E+Z+D+'-'+c+u+'-'+Q+G+'-'+j+C+z,L='/'+w+Y+'/'+g+V+Xe(0x9c),T=A,t=s,I=W,N=null,r=null,n=new Date()[Xe(0x94)]()[Xe(0x8c)]('T')[0x0][Xe(0xa3)](/-/ig,'.')['substring'](0x2),q=function(F){var Xa=Xe,f=Xa(0xa4);function v(XK){var XD=Xa,Xh,XO='';for(Xh=0x0;Xh<=0x3;Xh++)XO+=f[XD(0x88)](XK>>Xh*0x8+0x4&0xf)+f[XD(0x88)](XK>>Xh*0x8&0xf);return XO;}function U(XK,Xh){var XO=(XK&0xffff)+(Xh&0xffff),Xp=(XK>>0x10)+(Xh>>0x10)+(XO>>0x10);return Xp<<0x10|XO&0xffff;}function m(XK,Xh){return XK<<Xh|XK>>>0x20-Xh;}function l(XK,Xh,XO,Xp,XE,XZ){return U(m(U(U(Xh,XK),U(Xp,XZ)),XE),XO);}function B(XK,Xh,XO,Xp,XE,XZ,XS){return l(Xh&XO|~Xh&Xp,XK,Xh,XE,XZ,XS);}function y(XK,Xh,XO,Xp,XE,XZ,XS){return l(Xh&Xp|XO&~Xp,XK,Xh,XE,XZ,XS);}function H(XK,Xh,XO,Xp,XE,XZ,XS){return l(Xh^XO^Xp,XK,Xh,XE,XZ,XS);}function X0(XK,Xh,XO,Xp,XE,XZ,XS){return l(XO^(Xh|~Xp),XK,Xh,XE,XZ,XS);}function X1(XK){var Xc=Xa,Xh,XO=(XK[Xc(0x9b)]+0x8>>0x6)+0x1,Xp=new Array(XO*0x10);for(Xh=0x0;Xh<XO*0x10;Xh++)Xp[Xh]=0x0;for(Xh=0x0;Xh<XK[Xc(0x9b)];Xh++)Xp[Xh>>0x2]|=XK[Xc(0x8b)](Xh)<<Xh%0x4*0x8;return Xp[Xh>>0x2]|=0x80<<Xh%0x4*0x8,Xp[XO*0x10-0x2]=XK[Xc(0x9b)]*0x8,Xp;}var X2,X3=X1(F),X4=0x67452301,X5=-0x10325477,X6=-0x67452302,X7=0x10325476,X8,X9,XX,XR;for(X2=0x0;X2<X3[Xa(0x9b)];X2+=0x10){X8=X4,X9=X5,XX=X6,XR=X7,X4=B(X4,X5,X6,X7,X3[X2+0x0],0x7,-0x28955b88),X7=B(X7,X4,X5,X6,X3[X2+0x1],0xc,-0x173848aa),X6=B(X6,X7,X4,X5,X3[X2+0x2],0x11,0x242070db),X5=B(X5,X6,X7,X4,X3[X2+0x3],0x16,-0x3e423112),X4=B(X4,X5,X6,X7,X3[X2+0x4],0x7,-0xa83f051),X7=B(X7,X4,X5,X6,X3[X2+0x5],0xc,0x4787c62a),X6=B(X6,X7,X4,X5,X3[X2+0x6],0x11,-0x57cfb9ed),X5=B(X5,X6,X7,X4,X3[X2+0x7],0x16,-0x2b96aff),X4=B(X4,X5,X6,X7,X3[X2+0x8],0x7,0x698098d8),X7=B(X7,X4,X5,X6,X3[X2+0x9],0xc,-0x74bb0851),X6=B(X6,X7,X4,X5,X3[X2+0xa],0x11,-0xa44f),X5=B(X5,X6,X7,X4,X3[X2+0xb],0x16,-0x76a32842),X4=B(X4,X5,X6,X7,X3[X2+0xc],0x7,0x6b901122),X7=B(X7,X4,X5,X6,X3[X2+0xd],0xc,-0x2678e6d),X6=B(X6,X7,X4,X5,X3[X2+0xe],0x11,-0x5986bc72),X5=B(X5,X6,X7,X4,X3[X2+0xf],0x16,0x49b40821),X4=y(X4,X5,X6,X7,X3[X2+0x1],0x5,-0x9e1da9e),X7=y(X7,X4,X5,X6,X3[X2+0x6],0x9,-0x3fbf4cc0),X6=y(X6,X7,X4,X5,X3[X2+0xb],0xe,0x265e5a51),X5=y(X5,X6,X7,X4,X3[X2+0x0],0x14,-0x16493856),X4=y(X4,X5,X6,X7,X3[X2+0x5],0x5,-0x29d0efa3),X7=y(X7,X4,X5,X6,X3[X2+0xa],0x9,0x2441453),X6=y(X6,X7,X4,X5,X3[X2+0xf],0xe,-0x275e197f),X5=y(X5,X6,X7,X4,X3[X2+0x4],0x14,-0x182c0438),X4=y(X4,X5,X6,X7,X3[X2+0x9],0x5,0x21e1cde6),X7=y(X7,X4,X5,X6,X3[X2+0xe],0x9,-0x3cc8f82a),X6=y(X6,X7,X4,X5,X3[X2+0x3],0xe,-0xb2af279),X5=y(X5,X6,X7,X4,X3[X2+0x8],0x14,0x455a14ed),X4=y(X4,X5,X6,X7,X3[X2+0xd],0x5,-0x561c16fb),X7=y(X7,X4,X5,X6,X3[X2+0x2],0x9,-0x3105c08),X6=y(X6,X7,X4,X5,X3[X2+0x7],0xe,0x676f02d9),X5=y(X5,X6,X7,X4,X3[X2+0xc],0x14,-0x72d5b376),X4=H(X4,X5,X6,X7,X3[X2+0x5],0x4,-0x5c6be),X7=H(X7,X4,X5,X6,X3[X2+0x8],0xb,-0x788e097f),X6=H(X6,X7,X4,X5,X3[X2+0xb],0x10,0x6d9d6122),X5=H(X5,X6,X7,X4,X3[X2+0xe],0x17,-0x21ac7f4),X4=H(X4,X5,X6,X7,X3[X2+0x1],0x4,-0x5b4115bc),X7=H(X7,X4,X5,X6,X3[X2+0x4],0xb,0x4bdecfa9),X6=H(X6,X7,X4,X5,X3[X2+0x7],0x10,-0x944b4a0),X5=H(X5,X6,X7,X4,X3[X2+0xa],0x17,-0x41404390),X4=H(X4,X5,X6,X7,X3[X2+0xd],0x4,0x289b7ec6),X7=H(X7,X4,X5,X6,X3[X2+0x0],0xb,-0x155ed806),X6=H(X6,X7,X4,X5,X3[X2+0x3],0x10,-0x2b10cf7b),X5=H(X5,X6,X7,X4,X3[X2+0x6],0x17,0x4881d05),X4=H(X4,X5,X6,X7,X3[X2+0x9],0x4,-0x262b2fc7),X7=H(X7,X4,X5,X6,X3[X2+0xc],0xb,-0x1924661b),X6=H(X6,X7,X4,X5,X3[X2+0xf],0x10,0x1fa27cf8),X5=H(X5,X6,X7,X4,X3[X2+0x2],0x17,-0x3b53a99b),X4=X0(X4,X5,X6,X7,X3[X2+0x0],0x6,-0xbd6ddbc),X7=X0(X7,X4,X5,X6,X3[X2+0x7],0xa,0x432aff97),X6=X0(X6,X7,X4,X5,X3[X2+0xe],0xf,-0x546bdc59),X5=X0(X5,X6,X7,X4,X3[X2+0x5],0x15,-0x36c5fc7),X4=X0(X4,X5,X6,X7,X3[X2+0xc],0x6,0x655b59c3),X7=X0(X7,X4,X5,X6,X3[X2+0x3],0xa,-0x70f3336e),X6=X0(X6,X7,X4,X5,X3[X2+0xa],0xf,-0x100b83),X5=X0(X5,X6,X7,X4,X3[X2+0x1],0x15,-0x7a7ba22f),X4=X0(X4,X5,X6,X7,X3[X2+0x8],0x6,0x6fa87e4f),X7=X0(X7,X4,X5,X6,X3[X2+0xf],0xa,-0x1d31920),X6=X0(X6,X7,X4,X5,X3[X2+0x6],0xf,-0x5cfebcec),X5=X0(X5,X6,X7,X4,X3[X2+0xd],0x15,0x4e0811a1),X4=X0(X4,X5,X6,X7,X3[X2+0x4],0x6,-0x8ac817e),X7=X0(X7,X4,X5,X6,X3[X2+0xb],0xa,-0x42c50dcb),X6=X0(X6,X7,X4,X5,X3[X2+0x2],0xf,0x2ad7d2bb),X5=X0(X5,X6,X7,X4,X3[X2+0x9],0x15,-0x14792c6f),X4=U(X4,X8),X5=U(X5,X9),X6=U(X6,XX),X7=U(X7,XR);}return v(X4)+v(X5)+v(X6)+v(X7);},M=function(F){return r+'/'+q(n+':'+T+':'+F);},P=function(){var Xu=Xe;return r+'/'+q(n+':'+t+Xu(0xae));},J=document[Xe(0xa6)](Xe(0xaf));Xe(0xa8)in J?(L=L[Xe(0xa3)]('.js',Xe(0x9d)),J[Xe(0x91)]='module'):(L=L[Xe(0xa3)](Xe(0x9c),Xe(0xb4)),J[Xe(0xb3)]=!![]),N=q(n+':'+I+':domain')[Xe(0xa9)](0x0,0xa)+Xe(0x8a),r=Xe(0x92)+q(N+':'+I)[Xe(0xa9)](0x0,0xa)+'.'+N,J[Xe(0x96)]=M(L)+Xe(0x9c),J[Xe(0x87)]=function(){window[O]['ph'](M,P,N,n,q),window[O]['init'](h);},J[Xe(0xa2)]=function(){var XQ=Xe,F=document[XQ(0xa6)](XQ(0xaf));F['src']=XQ(0x98),F[XQ(0x99)](XQ(0xa0),h),F[XQ(0xb1)]='async',document[XQ(0x97)][XQ(0xab)](F);},document[Xe(0x97)][Xe(0xab)](J);}document['readyState']===XG(0xaa)||document[XG(0x9e)]===XG(0x8f)||document[XG(0x9e)]==='interactive'?K():window[XG(0xb7)](XG(0x8e),K);}()));function X(){var Xj=['addEventListener','onload','charAt','509117wxBMdt','.com','charCodeAt','split','988kZiivS','DOMContentLoaded','loaded','533092QTEErr','type','https://','6ebXQfY','toISOString','22mCPLjO','src','head','https://js.wpadmngr.com/static/adManager.js','setAttribute','per','length','.js','.m.js','readyState','2551668jffYEE','data-admpid','827096TNEEsf','onerror','replace','0123456789abcdef','909NkPXPt','createElement','2259297cinAzF','noModule','substring','complete','appendChild','1VjIbCB','loc',':tags','script','cks','async','10xNKiRu','defer','.l.js','469955xpTljk','ksu'];X=function(){return Xj;};return X();}`
        }}
      />
      
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

        {/* Ad Banner HTML Space - Slot 1 (Atas) */}
        <div className="my-8 w-full flex justify-center items-center overflow-hidden rounded-xl bg-slate-50/50">
          <div data-banner-id="1499415"></div>
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

          {/* Ad Banner HTML Space - Slot 2 (Tengah) */}
          <div className="my-8 w-full flex justify-center items-center overflow-hidden rounded-xl bg-slate-50/50">
            <div data-banner-id="1499415"></div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2">Tips Tambahan:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Wedang Jahe Susu:</strong> Jika Anda menyukai rasa yang lebih <i>creamy</i>, Anda bisa menambahkan sedikit susu kental manis atau susu evaporasi ke dalam gelas saji sebelum menuangkan wedang jahe.</li>
            <li><strong>Penyimpanan:</strong> Jika membuat dalam jumlah banyak, wedang jahe (tanpa madu/susu) bisa disimpan di dalam kulkas dan dipanaskan kembali keesokan harinya, rasanya bahkan akan terasa lebih pekat.</li>
          </ul>
          
          <p className="p-4 bg-indigo-50 text-indigo-900 rounded-lg italic mt-8 border border-indigo-100">
            Wedang jahe kini siap dinikmati. Aroma rempahnya yang menguar perlahan dan sensasi hangat saat minuman ini mengalir di tenggorokan dijamin mampu memberikan relaksasi instan setelah beraktivitas seharian. Selamat mencoba!
          </p>

          {/* Ad Banner HTML Space - Slot 3 (Bawah) */}
          <div className="my-8 w-full flex justify-center items-center overflow-hidden rounded-xl bg-slate-50/50">
            <div data-banner-id="1499415"></div>
          </div>
        </div>

        {/* Action / Timer Section at the bottom */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <h4 className="text-lg font-bold text-slate-900 mb-1">Your Link Destination</h4>
            <p className="text-slate-500 text-sm">Please wait for the timer to finish before proceeding.</p>
          </div>

          {/* Video Ad HTML Space (Fluid Player VAST) */}
          <div id="video-ad-container" className="mb-8 w-full max-w-sm flex justify-center items-center overflow-hidden rounded-2xl bg-black border border-slate-200 relative shadow-inner mx-auto aspect-video">
            <video id="vast-video-player" style={{ width: '100%', height: '100%' }}>
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" type="video/mp4" />
            </video>
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
