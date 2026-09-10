"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F5F7FB] font-sans flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.05),_transparent_50%)]"></div>
        <img src="/parliament.png" alt="Parliament" className="absolute bottom-0 right-0 w-[600px] opacity-[0.05] object-contain mix-blend-multiply" />
        <img src="/tricolour-wave.png" alt="Tricolour Wave" className="absolute top-0 left-0 w-full h-[120px] object-cover opacity-80" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full bg-white/80 backdrop-blur-md border-b border-[#D9E1EC] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/gov-india-logo.svg" alt="Government of India" className="h-12 object-contain" />
            <div className="h-10 w-px bg-[#D9E1EC]"></div>
            <div>
              <h1 className="text-[20px] font-black text-[#10264A] tracking-tight leading-none">
                Legal<span className="text-[#D9A928]">Lens</span>
              </h1>
              <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mt-0.5">Compliance System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/login')} className="px-5 py-2 text-[13px] font-bold text-[#10264A] hover:bg-[#F5F7FB] rounded-lg transition-colors border border-transparent hover:border-[#D9E1EC]">
              Login
            </button>
            <button onClick={() => router.push('/register')} className="px-5 py-2 text-[13px] font-bold text-white bg-[#1557C0] hover:bg-[#10264A] rounded-lg transition-colors shadow-sm">
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="flex items-center gap-3 mb-6 bg-white px-4 py-2 rounded-full border border-[#D9E1EC] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span className="text-[11px] font-bold text-[#10264A] tracking-wider uppercase">Smart India Hackathon 2026 · PS-034</span>
        </div>

        <h2 className="text-[48px] md:text-[64px] font-black text-[#0B1F3A] tracking-tight leading-[1.1] max-w-4xl mb-6">
          AI-Assisted Packaged Commodity <span className="text-[#1557C0]">Compliance</span>
        </h2>
        
        <p className="text-[16px] md:text-[18px] text-[#64748B] font-medium max-w-2xl leading-relaxed mb-10">
          Ensure transparency and consumer protection with automated AI scanning of product declarations as per Legal Metrology (Packaged Commodities) Rules, 2011.
        </p>

        <div className="flex items-center gap-4 mb-16">
          <button onClick={() => router.push('/login')} className="px-8 py-4 bg-[#2563EB] hover:bg-[#1557C0] text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] transition-all flex items-center gap-2 text-[15px]">
            Access Platform <span>→</span>
          </button>
          <button onClick={() => router.push('/register')} className="px-8 py-4 bg-white hover:bg-[#F5F7FB] text-[#10264A] font-bold rounded-xl shadow-sm border border-[#D9E1EC] transition-all text-[15px]">
            Create Account
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
          <div className="bg-white p-6 rounded-2xl border border-[#D9E1EC] shadow-sm text-left flex flex-col items-start hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[24px] mb-4 border border-blue-100">📷</div>
            <h3 className="text-[16px] font-black text-[#10264A] mb-2">AI Scanning</h3>
            <p className="text-[13px] text-[#64748B] font-medium leading-relaxed">Automatically extract and verify mandatory declarations like MRP, Net Quantity, and Manufacturer details from product images.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-[#D9E1EC] shadow-sm text-left flex flex-col items-start hover:shadow-md transition-shadow">
            <div className={"w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-[24px] mb-4 border border-amber-100"}>🔍</div>
            <h3 className="text-[16px] font-black text-[#10264A] mb-2">Instant Compliance</h3>
            <p className="text-[13px] text-[#64748B] font-medium leading-relaxed">Real-time matching against Legal Metrology Rules, 2011 to identify violations instantly without manual effort.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D9E1EC] shadow-sm text-left flex flex-col items-start hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-[24px] mb-4 border border-green-100">📊</div>
            <h3 className="text-[16px] font-black text-[#10264A] mb-2">Detailed Reports</h3>
            <p className="text-[13px] text-[#64748B] font-medium leading-relaxed">Generate official audit reports and violation notices seamlessly for legal enforcement and record-keeping.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#D9E1EC] bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="text-[11px] font-bold text-[#64748B]">
               <p>Department of Consumer Affairs</p>
               <p>Government of India</p>
             </div>
          </div>
          <div className="text-[10px] font-bold text-[#64748B] flex items-center gap-4 uppercase tracking-widest">
            <span>Consumer Protection</span>
            <span className="w-1 h-1 rounded-full bg-[#D9E1EC]"></span>
            <span>Fair Trade</span>
            <span className="w-1 h-1 rounded-full bg-[#D9E1EC]"></span>
            <span>Transparent Markets</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
