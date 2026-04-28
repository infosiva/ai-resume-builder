"use client";
import { useState } from "react";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";

export default function Home() {
  const [resume, setResume] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-500/15 blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="border-b border-white/5 backdrop-blur-xl bg-white/[0.02] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold">R</div>
            <span className="font-semibold text-lg tracking-tight">ResumeAI</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</a>
            <button className="text-sm px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 transition-all font-medium">
              Sign up free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Powered by Claude AI
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Your resume,{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            tailored by AI
          </span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10">
          Paste a job description. Get a perfectly tailored resume in seconds. Beat ATS filters and land more interviews.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 font-semibold transition-all shadow-lg shadow-violet-500/25 text-sm">
            Build my resume — free
          </button>
          <button className="px-8 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-all">
            See example
          </button>
        </div>
      </section>

      {/* Main builder */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ResumeForm onGenerate={setResume} setLoading={setLoading} />
        <ResumePreview resume={resume} loading={loading} />
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-4xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Simple pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "Free", price: "$0", features: ["3 resumes/month", "AI tailoring", "PDF export", "Basic templates"], cta: "Get started" },
            { name: "Pro", price: "$15", features: ["Unlimited resumes", "All templates", "Cover letter AI", "ATS score checker", "Priority support"], cta: "Start free trial", highlight: true },
          ].map((plan) => (
            <div key={plan.name} className={`p-8 rounded-2xl border ${plan.highlight ? "border-violet-500/50 bg-violet-500/10" : "border-white/10 bg-white/[0.03]"}`}>
              <div className="text-sm text-white/50 mb-1">{plan.name}</div>
              <div className="text-4xl font-bold mb-1">{plan.price}<span className="text-sm text-white/40 font-normal">/mo</span></div>
              <ul className="mt-6 space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-cyan-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${plan.highlight ? "bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500" : "border border-white/10 bg-white/5 hover:bg-white/10"}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
