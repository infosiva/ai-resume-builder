"use client";
import { useState, useEffect } from "react";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";

const SESSION_KEY = "resumevault-session";

interface Analysis {
  role_title?: string;
  company_type?: string;
  required_keywords?: string[];
  nice_to_have?: string[];
  matched_keywords?: string[];
  missing_keywords?: string[];
  match_score?: number;
  match_label?: string;
  key_gaps?: string[];
  strengths?: string[];
  job_search_terms?: string;
}

interface InterviewPrep {
  role_title?: string;
  questions?: { question: string; category: string; why_asked: string; answer_framework: string; sample_answer_start: string }[];
  red_flags_to_avoid?: string[];
  questions_to_ask_them?: string[];
  salary_range_hint?: string;
}

export default function Home() {
  const [resume, setResume] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [interviewPrep, setInterviewPrep] = useState<InterviewPrep | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<'resume' | 'cover' | 'prep'>('resume');
  const [savedSession, setSavedSession] = useState<{
    jobDesc: string; experience: string; skills: string; name: string; currentTitle: string;
  } | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setSavedSession(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  return (
    <main className="min-h-screen relative z-10" style={{ background: '#0a0a0f', color: '#fff' }}>
      {/* Nav — Premium Dark Recruitment */}
      <nav className="border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl" style={{ background: 'rgba(10,10,15,0.92)' }}>
        <div className="max-w-7xl mx-auto px-6 py-0">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <span className="text-xl">💼</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">ResumeVault</span>
                <span className="hidden sm:block text-xs text-white/40 border-l border-white/10 pl-3 ml-1">AI Career Toolkit</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="#how" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">How it works</a>
              <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">Pricing</a>
              <a href="#how" className="text-sm px-4 py-2 font-semibold rounded-lg transition-all" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0a0a0f' }}>
                Build Free Resume
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero — Premium Dark */}
      <section className="border-b border-white/5" style={{ background: '#0a0a0f' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border mb-7" style={{ borderColor: '#f59e0b', color: '#f59e0b', background: 'rgba(245,158,11,0.08)' }}>
              ✦ Powered by Claude AI · ATS-Optimised
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[0.95] mb-6">
              Land the job<br />
              <span style={{ textDecoration: 'underline', textDecorationColor: '#f59e0b', textDecorationThickness: '3px' }}>you deserve.</span>
            </h1>
            <p className="text-base sm:text-xl text-white/60 max-w-2xl leading-relaxed mb-8">
              Paste a job description. AI scores your match, finds keyword gaps, and crafts a tailored resume, cover letter, and interview prep — in under 60 seconds.
            </p>
            {/* Trust pills */}
            <div className="flex flex-wrap gap-2">
              {["ATS Analysis", "Match Score", "Cover Letter", "Interview Prep"].map(f => (
                <span key={f} className="text-xs font-medium px-3 py-1.5 rounded-full border" style={{ borderColor: 'rgba(245,158,11,0.4)', color: '#f59e0b', background: 'rgba(245,158,11,0.06)' }}>{f}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Step guide strip */}
      <section className="hidden sm:block border-b border-white/5" style={{ background: 'rgba(245,158,11,0.04)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-0">
          {[
            { n: "01", label: "Paste job spec" },
            { n: "02", label: "Check match score" },
            { n: "03", label: "Generate resume" },
            { n: "04", label: "Write cover letter" },
            { n: "05", label: "Prep for interview" },
          ].map((s, i, arr) => (
            <div key={s.n} className="flex items-center flex-shrink-0">
              <div className="flex items-center gap-2 px-4 py-1">
                <span className="font-black text-xs" style={{ color: '#f59e0b' }}>{s.n}</span>
                <span className="text-xs text-white/40 whitespace-nowrap">{s.label}</span>
              </div>
              {i < arr.length - 1 && <span className="text-white/15 text-xs">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Main builder */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="[&_h2]:text-white [&_p]:text-white/60 [&_label]:text-white/50 [&_textarea]:bg-white/5 [&_textarea]:border-white/10 [&_textarea]:text-white [&_textarea]:placeholder-white/25 [&_input]:bg-white/5 [&_input]:border-white/10 [&_input]:text-white [&_input]:placeholder-white/25 [&_.rounded-2xl]:bg-white/5 [&_.rounded-2xl]:border-white/10">
          <ResumeForm
            onGenerate={(r) => { setResume(r); setActivePreviewTab('resume'); }}
            setLoading={setLoading}
            onAnalysis={setAnalysis}
            onCoverLetter={(cl) => { setCoverLetter(cl); setActivePreviewTab('cover'); }}
            onInterviewPrep={(p) => { setInterviewPrep(p); setActivePreviewTab('prep'); }}
            initialValues={savedSession}
          />
        </div>
        <div className="[&_h2]:text-white [&_p]:text-white/60">
          <ResumePreview
            resume={resume}
            loading={loading}
            analysis={analysis}
            coverLetter={coverLetter}
            interviewPrep={interviewPrep}
            activeTab={activePreviewTab}
            onTabChange={setActivePreviewTab}
          />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#f59e0b' }}>Pricing</div>
            <h2 className="text-4xl font-bold text-white tracking-tight">Simple, honest pricing</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-xl overflow-hidden border border-white/10">
            {[
              { name: "Free", price: "$0", sub: "Always free", features: ["3 resumes / month", "Job match score", "ATS keyword analysis", "Cover letter generator", "Interview prep (3 questions)", "All export formats"], cta: "Get started free", highlight: false },
              { name: "Pro", price: "$15", sub: "per month", features: ["Unlimited resumes & cover letters", "Full interview prep (8 questions)", "Salary range insight", "ATS score checker", "Job alerts by email", "Priority support"], cta: "Start free trial", highlight: true },
            ].map((plan) => (
              <div key={plan.name} className="p-8" style={{ background: plan.highlight ? 'rgba(245,158,11,0.07)' : 'rgba(255,255,255,0.03)' }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: plan.highlight ? '#f59e0b' : 'rgba(255,255,255,0.3)' }}>{plan.name}</div>
                <div className="text-5xl font-bold text-white mb-0.5">{plan.price}</div>
                <div className="text-sm mb-6 text-white/40">{plan.sub}</div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="mt-0.5" style={{ color: '#f59e0b' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 font-semibold text-sm transition-all rounded-lg" style={plan.highlight ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0a0a0f' } : { border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', background: 'transparent' }}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-white/30">
          <a href="https://resumevault.app" className="font-bold text-white/70 hover:text-amber-400 transition-colors">ResumeVault</a>
          <span>© 2025 · AI-powered career toolkit</span>
        </div>
      </footer>
    </main>
  );
}
