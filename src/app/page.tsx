"use client";
import { useState } from "react";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";

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

  return (
    <main className="min-h-screen relative z-10">
      {/* Nav — editorial masthead style */}
      <nav className="border-b-2 border-stone-900 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-0">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3 sans">
              <div className="w-7 h-7 rounded bg-orange-700 flex items-center justify-center text-white text-xs font-black">R</div>
              <span className="font-black text-lg tracking-tight text-stone-900">ResumeAI</span>
              <span className="hidden sm:block text-xs text-stone-400 border-l border-stone-200 pl-3 ml-1">AI-powered career toolkit</span>
            </div>
            <div className="flex items-center gap-6 sans">
              <a href="#how" className="text-sm text-stone-500 hover:text-stone-900 transition-colors hidden sm:block">How it works</a>
              <a href="#pricing" className="text-sm text-stone-500 hover:text-stone-900 transition-colors hidden sm:block">Pricing</a>
              <button className="text-sm px-4 py-2 bg-stone-900 text-white hover:bg-orange-700 transition-all font-semibold rounded">
                Try free →
              </button>
            </div>
          </div>
        </div>
        {/* Thin orange accent line */}
        <div className="h-0.5 bg-orange-600" />
      </nav>

      {/* Hero — editorial magazine style */}
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-4xl">
            <div className="sans inline-flex items-center gap-2 text-xs font-bold text-orange-700 uppercase tracking-widest mb-6 border-l-4 border-orange-600 pl-3">
              Powered by Claude AI · ATS-Optimised
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-stone-900 leading-[0.95] tracking-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Land the job<br />
              <span className="text-orange-700">you deserve.</span>
            </h1>
            <p className="sans text-xl text-stone-500 max-w-2xl leading-relaxed mb-8">
              Paste a job description. AI scores your match, finds keyword gaps, and crafts a tailored resume, cover letter, and interview prep — in under 60 seconds.
            </p>
            <div className="sans flex flex-wrap gap-2">
              {["✓ ATS keyword analysis", "✓ Match score", "✓ Cover letter", "✓ Interview prep", "✓ Salary hints"].map(f => (
                <span key={f} className="text-sm text-stone-600 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200">{f}</span>
              ))}
            </div>
          </div>
        </div>
        {/* Decorative rule + issue line */}
        <div className="max-w-7xl mx-auto px-6 pb-4 sans flex items-center justify-between text-xs text-stone-400 border-t border-stone-100 pt-3">
          <span>Est. 2024 · The smarter way to job hunt</span>
          <span>AI-assisted · Always free to start</span>
        </div>
      </section>

      {/* Step guide strip */}
      <section className="bg-stone-900 text-white sans">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-0 overflow-x-auto">
          {[
            { n: "01", label: "Paste job spec" },
            { n: "02", label: "Check match score" },
            { n: "03", label: "Generate resume" },
            { n: "04", label: "Write cover letter" },
            { n: "05", label: "Prep for interview" },
          ].map((s, i, arr) => (
            <div key={s.n} className="flex items-center flex-shrink-0">
              <div className="flex items-center gap-2 px-4 py-1">
                <span className="text-orange-500 font-black text-xs">{s.n}</span>
                <span className="text-xs text-stone-300 whitespace-nowrap">{s.label}</span>
              </div>
              {i < arr.length - 1 && <span className="text-stone-600 text-xs">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Main builder */}
      <section id="how" className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Override ResumeForm dark styles with light overrides */}
        <div className="[&_h2]:text-stone-900 [&_h2]:sans [&_p]:text-stone-500 [&_p]:sans [&_label]:text-stone-500 [&_label]:sans [&_textarea]:bg-white [&_textarea]:border-stone-200 [&_textarea]:text-stone-900 [&_textarea]:placeholder-stone-300 [&_textarea]:focus:border-orange-500 [&_input]:bg-white [&_input]:border-stone-200 [&_input]:text-stone-900 [&_input]:placeholder-stone-300 [&_input]:focus:border-orange-500 [&_.rounded-2xl]:bg-white [&_.rounded-2xl]:border-stone-200 [&_.rounded-2xl]:shadow-sm">
          <ResumeForm
            onGenerate={setResume}
            setLoading={setLoading}
            onAnalysis={setAnalysis}
            onCoverLetter={setCoverLetter}
            onInterviewPrep={setInterviewPrep}
          />
        </div>
        <div className="[&_h2]:text-stone-900 [&_h2]:sans [&_p]:text-stone-500">
          <ResumePreview
            resume={resume}
            loading={loading}
            analysis={analysis}
            coverLetter={coverLetter}
            interviewPrep={interviewPrep}
          />
        </div>
      </section>

      {/* Pricing — editorial table style */}
      <section id="pricing" className="border-t border-stone-200 bg-stone-50">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="sans text-center mb-12">
            <div className="text-xs font-bold text-orange-700 uppercase tracking-widest mb-3">Pricing</div>
            <h2 className="text-4xl font-black text-stone-900" style={{ fontFamily: 'Georgia, serif' }}>Simple, honest pricing</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-stone-200 rounded-lg overflow-hidden sans">
            {[
              { name: "Free", price: "$0", sub: "Always free", features: ["3 resumes / month", "Job match score", "ATS keyword analysis", "Cover letter generator", "Interview prep (3 questions)", "All export formats"], cta: "Get started free", highlight: false },
              { name: "Pro", price: "$15", sub: "per month", features: ["Unlimited resumes & cover letters", "Full interview prep (8 questions)", "Salary range insight", "ATS score checker", "Job alerts by email", "Priority support"], cta: "Start free trial", highlight: true },
            ].map((plan) => (
              <div key={plan.name} className={`p-8 ${plan.highlight ? "bg-stone-900 text-white" : "bg-white"}`}>
                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${plan.highlight ? 'text-orange-400' : 'text-stone-400'}`}>{plan.name}</div>
                <div className={`text-5xl font-black mb-0.5 ${plan.highlight ? 'text-white' : 'text-stone-900'}`} style={{ fontFamily: 'Georgia, serif' }}>{plan.price}</div>
                <div className={`text-sm mb-6 ${plan.highlight ? 'text-stone-400' : 'text-stone-500'}`}>{plan.sub}</div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlight ? 'text-stone-300' : 'text-stone-600'}`}>
                      <span className={plan.highlight ? 'text-orange-400 mt-0.5' : 'text-orange-600 mt-0.5'}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 font-bold text-sm transition-all rounded ${plan.highlight ? "bg-orange-600 text-white hover:bg-orange-500" : "bg-stone-900 text-white hover:bg-stone-800"}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-stone-900 bg-white sans">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-stone-400">
          <span className="font-black text-stone-900">ResumeAI</span>
          <span>© 2024 · AI-powered career toolkit</span>
        </div>
      </footer>
    </main>
  );
}
