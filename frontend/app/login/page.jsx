"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem("full_name", data.full_name);
        router.push("/");
      } else {
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = (demoUser) => {
    setUsername(demoUser);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen flex font-sans bg-[#F5F7FB]">
      
      {/* Left Branding Side (Matches Reference) */}
      <div className="hidden lg:flex w-7/12 bg-gradient-to-br from-[#0B1F3A] via-[#10264A] to-[#1557C0] relative overflow-hidden flex-col">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute left-10 top-10 pointer-events-none opacity-[0.06]">
          <img src="/emblem.svg" alt="" className="w-[800px] h-[800px] object-contain filter sepia hue-rotate-15 saturate-200" />
        </div>
        
        {/* Tricolour swoop (abstract) */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-80" style={{ background: 'linear-gradient(90deg, #F59E0B 0%, #FFFFFF 50%, #16A34A 100%)', maskImage: 'radial-gradient(ellipse at bottom, white 0%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at bottom, white 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-0 left-0 w-full h-24 opacity-60 mix-blend-overlay" style={{ background: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==)'}}></div>

        {/* Top Header */}
        <div className="relative z-10 p-12 w-full">
           <div className="flex items-center gap-3 mb-12">
              <span className="w-12 h-1 bg-[#D9A928]"></span>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#D9A928] uppercase">Smart India Hackathon 2026 · PS-034</span>
           </div>
           
           <div className="flex items-center gap-4 mb-8">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1557C0] flex items-center justify-center border border-white/20 shadow-lg">
                <span className="text-4xl">⚖️</span>
             </div>
             <h1 className="text-[64px] font-black text-white tracking-tight leading-none">
               Legal <span className="text-[#D9A928]">Lens</span>
             </h1>
           </div>
           
           <h2 className="text-[20px] font-bold text-white/90 max-w-lg leading-snug mb-6">
             AI-Assisted Packaged Commodity Compliance System under Legal Metrology Rules, 2011
           </h2>
           <p className="text-[14px] text-white/60 font-medium max-w-md leading-relaxed">
             Scan. Verify. Comply.<br/>Empowering consumers and authorities with AI to check compliance of packaged commodities through product, image and label scanning.
           </p>

           {/* Feature Pills */}
           <div className="flex gap-4 mt-10">
             <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-3 flex items-center gap-3">
               <span className="text-[24px]">📷</span>
               <div>
                 <p className="text-[11px] font-black text-white leading-tight">Scan Products</p>
                 <p className="text-[9px] font-medium text-white/60">Barcode / QR / Image</p>
               </div>
             </div>
             <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-3 flex items-center gap-3">
               <span className="text-[24px]">📄</span>
               <div>
                 <p className="text-[11px] font-black text-white leading-tight">Check Labels</p>
                 <p className="text-[9px] font-medium text-white/60">Net Quantity, MRP, etc.</p>
               </div>
             </div>
             <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-3 flex items-center gap-3">
               <span className="text-[24px]">🛡️</span>
               <div>
                 <p className="text-[11px] font-black text-white leading-tight">Verify Compliance</p>
                 <p className="text-[9px] font-medium text-white/60">As per Legal Metrology Rules</p>
               </div>
             </div>
           </div>
        </div>
        
        {/* Bottom Logo & Footer inside left panel */}
        <div className="mt-auto p-12 relative z-10 flex justify-between items-end">
           <div className="flex items-center gap-4">
              <img src="/emblem.svg" alt="" className="w-12 h-16 object-contain filter drop-shadow-md brightness-0 invert opacity-90"/>
              <div>
                <p className="text-[14px] font-black text-white leading-tight">Department of Consumer Affairs</p>
                <p className="text-[11px] font-bold text-white/70">Government of India</p>
              </div>
           </div>
           
           <div className="flex items-center gap-6 text-[10px] text-white/50 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2"><span className="text-[#16A34A] text-[14px]">✓</span> Legal Metrology Rules, 2011</span>
              <span className="flex items-center gap-2"><span className="text-[#16A34A] text-[14px]">✓</span> Consumer Protection</span>
              <span className="flex items-center gap-2"><span className="text-[#16A34A] text-[14px]">✓</span> Transparent Markets</span>
           </div>
        </div>
      </div>

      {/* Right Login Side */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-8 relative z-20">
        
        <div className="w-full max-w-[420px] bg-white rounded-[24px] p-10 shadow-[0_20px_60px_rgb(0,0,0,0.08)] border border-[#D9E1EC] relative overflow-hidden">
          
          <div className="flex flex-col items-center mb-8">
            <img src="/emblem.svg" alt="Emblem" className="w-12 h-14 object-contain mb-3"/>
            <h1 className="text-[16px] font-black text-[#10264A] text-center leading-tight">भारत सरकार<br/>Government of India</h1>
            <p className="text-[9px] font-bold text-[#64748B] text-center mt-1">Ministry of Consumer Affairs, Food &amp; Public Distribution</p>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-[28px] font-black text-[#10264A] tracking-tight">Sign In</h2>
            <p className="text-[12px] font-medium text-[#64748B]">Access the compliance platform</p>
          </div>

          {/* Quick Demo Login Grid */}
          <div className="mb-6">
            <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest mb-3 flex items-center gap-2 before:h-px before:flex-1 before:bg-[#D9E1EC] after:h-px after:flex-1 after:bg-[#D9E1EC]">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => handleDemoClick('r.sharma')}
                className="bg-[#EF4444] hover:bg-red-600 text-white rounded-xl p-3 flex items-center gap-3 transition-colors shadow-sm">
                <span className="text-[20px]">👤</span>
                <div className="text-left">
                   <p className="text-[12px] font-black leading-tight">Admin</p>
                   <p className="text-[9px] font-bold text-red-100">r.sharma</p>
                </div>
              </button>
              <button type="button" onClick={() => handleDemoClick('p.verma')}
                className="bg-[#1557C0] hover:bg-blue-700 text-white rounded-xl p-3 flex items-center gap-3 transition-colors shadow-sm">
                <span className="text-[20px]">🏛️</span>
                <div className="text-left">
                   <p className="text-[12px] font-black leading-tight">Gov. Official</p>
                   <p className="text-[9px] font-bold text-blue-100">p.verma</p>
                </div>
              </button>
              <button type="button" onClick={() => handleDemoClick('manufacturer1')}
                className="bg-[#8B5CF6] hover:bg-purple-600 text-white rounded-xl p-3 flex items-center gap-3 transition-colors shadow-sm">
                <span className="text-[20px]">🏭</span>
                <div className="text-left">
                   <p className="text-[12px] font-black leading-tight">Manufacturer</p>
                   <p className="text-[9px] font-bold text-purple-100">manufacturer1</p>
                </div>
              </button>
              <button type="button" onClick={() => handleDemoClick('demo_inspector')}
                className="bg-[#F59E0B] hover:bg-orange-600 text-white rounded-xl p-3 flex items-center gap-3 transition-colors shadow-sm">
                <span className="text-[20px]">🔍</span>
                <div className="text-left">
                   <p className="text-[12px] font-black leading-tight">Inspector</p>
                   <p className="text-[9px] font-bold text-orange-100">demo_inspector</p>
                </div>
              </button>
            </div>
          </div>

          <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest mb-4 flex items-center gap-2 before:h-px before:flex-1 before:bg-[#D9E1EC] after:h-px after:flex-1 after:bg-[#D9E1EC] text-center">or enter manually</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#10264A] mb-1.5">Username or Email</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                className="w-full border border-[#D9E1EC] rounded-xl px-4 py-3 text-[14px] font-medium bg-[#F5F7FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1557C0] transition-all text-[#17233C]" 
                placeholder="Enter username" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#10264A] mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full border border-[#D9E1EC] rounded-xl px-4 py-3 text-[14px] font-medium bg-[#F5F7FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1557C0] transition-all text-[#17233C]" 
                placeholder="Enter password" />
            </div>
            
            {error && <div className="p-3 bg-red-50 text-red-600 text-[12px] font-bold rounded-lg border border-red-100 flex items-center gap-2"><span>⚠️</span> {error}</div>}

            <button type="submit" disabled={loading}
              className="w-full bg-[#1557C0] hover:bg-[#10264A] text-white font-bold rounded-xl py-3.5 transition-colors shadow-md disabled:opacity-50 text-[14px] flex justify-center items-center gap-2 mt-2">
              {loading ? "Authenticating..." : <>Sign In <span className="text-[16px]">→</span></>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[12px] font-medium text-[#64748B]">New user? <Link href="/register" className="text-[#1557C0] font-bold hover:underline">Create account</Link></p>
          </div>
        </div>
        
        {/* SIH Logo absolute right bottom */}
        <div className="absolute bottom-8 right-8">
           <img src="/sih-logo.svg" alt="SIH 2026 Logo" className="h-12 object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all"/>
        </div>
      </div>
    </div>
  );
}
