"use client";
import { useState, useEffect, useRef } from "react";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import GuidedTour, { type TourStep } from "@/components/GuidedTour";

const RESUME_TOUR: TourStep[] = [
  { target: '#hero-cta', title: 'Build your resume free', icon: '📄', body: 'Fill in your details — AI writes polished bullet points, action verbs, and summaries for you.', placement: 'bottom' },
  { target: '#proof', title: 'Real results', icon: '📈', body: 'Join 50,000+ job seekers who landed interviews with AI-written resumes.', placement: 'top' },
  { target: '#how', title: 'How it works', icon: '🔧', body: '3 simple steps: paste your info, AI rewrites it professionally, download as PDF.', placement: 'top' },
  { target: '#pricing', title: 'Unlock all templates', icon: '✨', body: 'Pro unlocks 20+ ATS-optimised templates and unlimited downloads.', placement: 'top' },
]

const SESSION_KEY = "resumevault-session";
const PRO_KEY = "resumevault-pro";

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

// ATS Score meter component
function ATSMeter() {
  const [score, setScore] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const target = 94;
          const step = () => {
            current += 2;
            if (current >= target) { setScore(target); return; }
            setScore(current);
            requestAnimationFrame(step);
          };
          setTimeout(() => requestAnimationFrame(step), 300);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(30,58,95,0.15)" strokeWidth="8" />
          <circle
            cx="48" cy="48" r="40" fill="none"
            stroke="#f59e0b" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black" style={{ color: '#1e3a5f' }}>{score}%</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-bold" style={{ color: '#1e3a5f' }}>ATS Score</div>
        <div className="text-xs" style={{ color: '#6b7280' }}>Beats 96% of resumes</div>
      </div>
    </div>
  );
}

// Typing effect component
function TypingEffect({ lines }: { lines: string[] }) {
  const [displayed, setDisplayed] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (lineIndex >= lines.length) { setDone(true); return; }
    const currentLine = lines[lineIndex];
    if (charIndex < currentLine.length) {
      const t = setTimeout(() => {
        setDisplayed((prev) => prev + currentLine[charIndex]);
        setCharIndex((c) => c + 1);
      }, 30);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setDisplayed((prev) => prev + "\n");
        setLineIndex((l) => l + 1);
        setCharIndex(0);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [charIndex, lineIndex, lines, done]);

  return (
    <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono" style={{ color: '#374151' }}>
      {displayed}
      {!done && <span className="inline-block w-0.5 h-3 ml-0.5 animate-pulse" style={{ background: '#f59e0b', verticalAlign: 'text-bottom' }} />}
    </pre>
  );
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
  const [isPro, setIsPro] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setSavedSession(JSON.parse(raw));
      if (localStorage.getItem(PRO_KEY) === '1') setIsPro(true);
    } catch { /* ignore */ }

    // Handle ?upgraded=1
    const params = new URLSearchParams(window.location.search);
    if (params.get('upgraded') === '1') {
      localStorage.setItem(PRO_KEY, '1');
      setIsPro(true);
      window.history.replaceState({}, '', '/');
    }

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-3d').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const typingLines = [
    "• Led cross-functional team of 8 engineers",
    "  delivering $2.4M product on schedule",
    "• Reduced infrastructure costs by 34%",
    "  via microservices migration to AWS",
    "• Championed agile transformation —",
    "  improved sprint velocity by 28%",
  ];

  const companies = [
    { name: "Google", bg: "#4285F4" },
    { name: "Meta", bg: "#1877F2" },
    { name: "Amazon", bg: "#FF9900" },
    { name: "Apple", bg: "#555" },
    { name: "Netflix", bg: "#E50914" },
    { name: "Stripe", bg: "#635BFF" },
  ];

  return (
    <main className="min-h-screen relative z-10" style={{ background: '#fafafa', color: '#111827' }}>

      {/* Subtle paper depth layers */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(30,58,95,0.04) 0%, transparent 70%)',
        zIndex: 0,
      }} />
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true" style={{
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(245,158,11,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(30,58,95,0.05) 0%, transparent 50%)',
        zIndex: 0,
      }} />

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 border-b" style={{ background: 'rgba(250,250,250,0.92)', backdropFilter: 'blur(20px)', borderColor: 'rgba(30,58,95,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <span className="font-black text-lg tracking-tight" style={{ color: '#1e3a5f' }}>ResumeVault</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full hidden sm:inline-flex" style={{ background: 'rgba(245,158,11,0.12)', color: '#b45309', border: '1px solid rgba(245,158,11,0.25)' }}>
                ATS-Optimized
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#how" className="text-sm font-medium hidden sm:block" style={{ color: '#6b7280' }}>How it works</a>
              <a href="#pricing" className="text-sm font-medium hidden sm:block" style={{ color: '#6b7280' }}>Pricing</a>
              {isPro ? (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#b45309' }}>
                  ✦ Pro
                </span>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={checkoutLoading}
                  className="text-sm px-5 py-2 font-semibold rounded-lg transition-all"
                  style={{ background: '#1e3a5f', color: '#fff' }}
                >
                  {checkoutLoading ? 'Loading…' : 'Go Pro — $9/mo'}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: 'rgba(30,58,95,0.06)' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center min-h-[88vh] px-6 md:px-12 py-16">

          {/* Left: Copy */}
          <div className="flex flex-col gap-6 relative z-10">
            <div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5" style={{ background: 'rgba(30,58,95,0.07)', color: '#1e3a5f', border: '1px solid rgba(30,58,95,0.12)' }}>
                <span style={{ color: '#f59e0b' }}>✦</span> #1 AI Resume Builder for ATS
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight reveal" style={{ color: '#111827' }}>
              Land your dream job with an<br />
              <span style={{
                background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5986 50%, #1e3a5f 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>AI-crafted resume</span>{' '}
              <span style={{ color: '#f59e0b' }}>that gets past ATS</span>
            </h1>
            <p className="text-base max-w-md leading-relaxed" style={{ color: '#6b7280' }}>
              Paste your job description, add your experience — our AI tailors every bullet point for maximum ATS compatibility and recruiter impact.
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                "ATS keyword optimisation for every posting",
                "Job description match scoring",
                "One-click PDF export",
                "AI-written cover letters included",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: '#374151' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: 'rgba(245,158,11,0.15)', color: '#b45309' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Social proof */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2">
                {['JL','MK','SR','AP','NK'].map((initials) => (
                  <div key={initials} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white" style={{ background: '#1e3a5f' }}>{initials}</div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5" style={{ color: '#f59e0b' }}>{'★★★★★'}</div>
                <div className="text-xs" style={{ color: '#6b7280' }}>
                  <span className="font-bold" style={{ color: '#1e3a5f' }}>8,000+</span> job seekers landed interviews
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#how"
                id="hero-cta"
                className="px-6 py-3 text-sm font-bold rounded-lg transition-all"
                style={{ background: '#1e3a5f', color: '#fff', boxShadow: '0 4px 16px rgba(30,58,95,0.25)' }}
              >
                Build My Resume — Free
              </a>
              <a
                href="#proof"
                className="px-6 py-3 text-sm font-semibold rounded-lg transition-all border"
                style={{ borderColor: 'rgba(30,58,95,0.2)', color: '#1e3a5f', background: 'transparent' }}
              >
                See before/after
              </a>
            </div>
          </div>

          {/* Right: Resume Mockup + ATS meter */}
          <div className="relative flex items-center justify-center">
            {/* Floating document shadow behind */}
            <div className="absolute" style={{ width: 280, height: 360, background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(30,58,95,0.10)', transform: 'rotate(-3deg) translateX(-8px) translateY(8px)', zIndex: 0 }} />
            <div className="absolute" style={{ width: 280, height: 360, background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(30,58,95,0.07)', transform: 'rotate(1.5deg) translateX(6px) translateY(-4px)', zIndex: 1 }} />

            {/* Main resume card */}
            <div className="relative rounded-2xl p-6 w-full max-w-sm z-10" style={{ background: '#fff', border: '1px solid rgba(30,58,95,0.10)', boxShadow: '0 20px 60px rgba(30,58,95,0.12)' }}>
              {/* ATS Score badge */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full flex flex-col items-center justify-center" style={{ background: '#fff', border: '2px solid rgba(245,158,11,0.4)', boxShadow: '0 4px 16px rgba(245,158,11,0.2)' }}>
                <span className="text-sm font-black" style={{ color: '#b45309' }}>94%</span>
                <span className="text-[8px] font-semibold" style={{ color: '#6b7280' }}>ATS</span>
              </div>

              {/* Resume header */}
              <div className="mb-4 pb-4 border-b" style={{ borderColor: 'rgba(30,58,95,0.08)' }}>
                <div className="font-black text-lg leading-tight" style={{ color: '#111827' }}>Alexandra Chen</div>
                <div className="text-sm font-semibold mb-2" style={{ color: '#1e3a5f' }}>Senior Product Manager</div>
                <div className="flex flex-wrap gap-1.5">
                  {['San Francisco, CA', 'a.chen@email.com', 'linkedin.com/in/achen'].map((pill) => (
                    <span key={pill} className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(30,58,95,0.06)', color: '#6b7280', border: '1px solid rgba(30,58,95,0.1)' }}>{pill}</span>
                  ))}
                </div>
              </div>

              {/* AI typing section */}
              <div className="mb-3">
                <div className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: '#1e3a5f' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#f59e0b' }} />
                  AI Writing Experience…
                </div>
                <TypingEffect lines={typingLines} />
              </div>

              {/* Keywords highlighted */}
              <div className="pt-3 border-t" style={{ borderColor: 'rgba(30,58,95,0.06)' }}>
                <div className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#6b7280' }}>ATS Keywords Matched</div>
                <div className="flex flex-wrap gap-1">
                  {['Python','AWS','Agile','Product Strategy','SQL','Stakeholder Mgmt'].map((kw) => (
                    <span key={kw} className="text-[9px] px-1.5 py-0.5 rounded font-semibold" style={{ background: 'rgba(245,158,11,0.12)', color: '#92400e' }}>{kw}</span>
                  ))}
                </div>
              </div>

              {/* AI label */}
              <div className="pt-3 mt-2 border-t flex items-center gap-1.5" style={{ borderColor: 'rgba(30,58,95,0.06)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
                <span className="text-[9px]" style={{ color: '#9ca3af' }}>AI-generated · tailored to job description</span>
              </div>
            </div>

            {/* Floating ATS meter */}
            <div className="absolute -bottom-6 -left-6 rounded-2xl p-4 z-20" style={{ background: '#fff', border: '1px solid rgba(30,58,95,0.10)', boxShadow: '0 8px 30px rgba(30,58,95,0.10)' }}>
              <ATSMeter />
            </div>
          </div>
        </div>
      </section>

      {/* Company badges — social proof */}
      <section id="proof" className="border-b py-8" style={{ background: '#fff', borderColor: 'rgba(30,58,95,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#9ca3af' }}>
            ResumeVault users got interviews at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {companies.map((c) => (
              <div key={c.name} className="flex items-center gap-2 px-4 py-2 rounded-lg border" style={{ borderColor: 'rgba(30,58,95,0.08)', background: '#fafafa' }}>
                <div className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-black text-white" style={{ background: c.bg }}>{c.name[0]}</div>
                <span className="text-sm font-semibold" style={{ color: '#374151' }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After comparison */}
      <section className="py-20 border-b" style={{ borderColor: 'rgba(30,58,95,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#f59e0b' }}>Before vs After</div>
            <h2 className="text-3xl font-black tracking-tight" style={{ color: '#111827' }}>See the AI difference</h2>
            <p className="text-sm mt-2" style={{ color: '#6b7280' }}>Same candidate — completely different results</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="rounded-2xl p-6 reveal" style={{ background: '#fff', border: '1px solid rgba(220,38,38,0.15)', boxShadow: '0 4px 20px rgba(220,38,38,0.05)' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: '#ef4444' }}>✕</span>
                <span className="text-sm font-bold" style={{ color: '#ef4444' }}>Before ResumeVault</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(220,38,38,0.08)', color: '#ef4444' }}>ATS: 31%</span>
              </div>
              <div className="space-y-2 text-xs leading-relaxed" style={{ color: '#9ca3af' }}>
                <p>• Responsible for managing projects</p>
                <p>• Worked with team members on deliverables</p>
                <p>• Helped improve company processes</p>
                <p>• Did various tasks related to product</p>
                <p style={{ color: '#d1d5db' }}>Skills: Excel, PowerPoint, communication</p>
              </div>
              <div className="mt-4 text-xs font-medium" style={{ color: '#ef4444' }}>
                ✕ Generic · No keywords · Rejected by ATS
              </div>
            </div>
            {/* After */}
            <div className="rounded-2xl p-6 reveal stagger-2" style={{ background: '#fff', border: '1px solid rgba(34,197,94,0.2)', boxShadow: '0 4px 20px rgba(34,197,94,0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: '#22c55e' }}>✓</span>
                <span className="text-sm font-bold" style={{ color: '#16a34a' }}>After ResumeVault</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a' }}>ATS: 94%</span>
              </div>
              <div className="space-y-2 text-xs leading-relaxed" style={{ color: '#374151' }}>
                <p>• <strong>Led product roadmap</strong> for B2B SaaS, driving <strong>$1.2M ARR</strong> growth in 6 months</p>
                <p>• Managed <strong>cross-functional team of 12</strong> across Engineering, Design & Data</p>
                <p>• Implemented <strong>agile sprint framework</strong>, improving velocity by <strong>34%</strong></p>
                <p>• Shipped <strong>3 major features</strong> with 98% on-time delivery rate</p>
                <p>Skills: <strong>Product Strategy, SQL, Python, Stakeholder Management, OKRs</strong></p>
              </div>
              <div className="mt-4 text-xs font-medium" style={{ color: '#16a34a' }}>
                ✓ Keyword-rich · Metrics · Passes every ATS filter
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Builder */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="rounded-2xl p-8 border" style={{ background: '#fff', borderColor: 'rgba(30,58,95,0.08)', boxShadow: '0 4px 20px rgba(30,58,95,0.06)' }}>
          <ResumeForm
            onGenerate={(r) => { setResume(r); setActivePreviewTab('resume'); }}
            setLoading={setLoading}
            onAnalysis={setAnalysis}
            onCoverLetter={(cl) => { setCoverLetter(cl); setActivePreviewTab('cover'); }}
            onInterviewPrep={(p) => { setInterviewPrep(p); setActivePreviewTab('prep'); }}
            initialValues={savedSession}
          />
        </div>
        <div>
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

      {/* Why Pro section */}
      <section className="py-20 border-t border-b" style={{ borderColor: 'rgba(30,58,95,0.06)', background: '#fff' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#f59e0b' }}>Why Pro</div>
            <h2 className="text-3xl font-black tracking-tight" style={{ color: '#111827' }}>Everything you need to land the role</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '∞', title: 'Unlimited Resumes', desc: 'Create a tailored resume for every job — no monthly limits.' },
              { icon: '🎯', title: 'ATS Optimisation', desc: 'AI scans job postings and injects exact keywords that pass filters.' },
              { icon: '✉', title: 'Cover Letters', desc: 'Personalised cover letters generated alongside every resume.' },
              { icon: '🔗', title: 'LinkedIn Import', desc: 'Import your LinkedIn profile with one click — zero re-typing.' },
              { icon: '⬇', title: 'PDF Export', desc: 'Download polished, recruiter-ready PDFs in seconds.' },
              { icon: '💬', title: 'Interview Prep', desc: 'AI-generated interview questions tailored to the exact role.' },
            ].map((feat, i) => (
              <div key={feat.title} className={`rounded-xl p-5 border reveal stagger-${(i % 6) + 1}`} style={{ background: '#fafafa', borderColor: 'rgba(30,58,95,0.08)' }}>
                <div className="text-2xl mb-3">{feat.icon}</div>
                <div className="font-bold text-sm mb-1" style={{ color: '#111827' }}>{feat.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{feat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#f59e0b' }}>Pricing</div>
            <h2 className="text-3xl font-black tracking-tight" style={{ color: '#111827' }}>Simple, honest pricing</h2>
            <p className="text-sm mt-2" style={{ color: '#6b7280' }}>One plan. Everything included. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="rounded-2xl p-8 border reveal" style={{ background: '#fff', borderColor: 'rgba(30,58,95,0.10)' }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>Free</div>
              <div className="text-5xl font-black mb-0.5" style={{ color: '#111827' }}>$0</div>
              <div className="text-sm mb-6" style={{ color: '#9ca3af' }}>Always free</div>
              <ul className="space-y-2.5 mb-8">
                {[
                  "3 resumes per month",
                  "Job match score",
                  "ATS keyword analysis",
                  "Cover letter generator",
                  "Interview prep (3 questions)",
                  "All export formats",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: '#6b7280' }}>
                    <span style={{ color: '#1e3a5f' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="#how" className="block w-full py-3 text-center font-semibold text-sm rounded-lg border transition-all" style={{ borderColor: 'rgba(30,58,95,0.2)', color: '#1e3a5f' }}>
                Get started free
              </a>
            </div>

            {/* Pro */}
            <div className="rounded-2xl p-8 border reveal stagger-2 relative overflow-hidden" style={{ background: '#1e3a5f', borderColor: '#1e3a5f' }}>
              {/* Gold accent stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
              <div className="absolute -top-3 right-6 text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#f59e0b', color: '#111827' }}>Most Popular</div>

              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#f59e0b' }}>Pro</div>
              <div className="flex items-baseline gap-1 mb-0.5">
                <span className="text-5xl font-black text-white">$9</span>
                <span className="text-lg text-white/60">/mo</span>
              </div>
              <div className="text-sm mb-6 text-white/50">Cancel anytime · no contracts</div>
              <ul className="space-y-2.5 mb-8">
                {[
                  "Unlimited resumes & cover letters",
                  "Full ATS optimisation engine",
                  "LinkedIn import",
                  "PDF export (all templates)",
                  "Full interview prep (8 questions)",
                  "Salary range insights",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                    <span style={{ color: '#f59e0b' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              {isPro ? (
                <div className="w-full py-3 text-center font-bold text-sm rounded-lg" style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}>
                  ✦ You&apos;re on Pro
                </div>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={checkoutLoading}
                  className="w-full py-3 font-bold text-sm rounded-lg transition-all"
                  style={{ background: '#f59e0b', color: '#111827', boxShadow: '0 4px 16px rgba(245,158,11,0.35)' }}
                >
                  {checkoutLoading ? 'Loading…' : 'Start Pro — $9/mo'}
                </button>
              )}
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs" style={{ color: '#9ca3af' }}>
            <span className="flex items-center gap-1.5">🔒 Secure Stripe checkout</span>
            <span className="flex items-center gap-1.5">↩ Cancel anytime</span>
            <span className="flex items-center gap-1.5">✓ No hidden fees</span>
            <span className="flex items-center gap-1.5">★ 4.9/5 rating</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8" style={{ borderColor: 'rgba(30,58,95,0.06)', background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs" style={{ color: '#9ca3af' }}>
          <span className="font-bold" style={{ color: '#1e3a5f' }}>ResumeVault</span>
          <span>© 2025 · AI-powered career toolkit · resumevault.app</span>
        </div>
      </footer>
      <GuidedTour steps={RESUME_TOUR} storageKey="resumevault_tour_v1" accentColor="#1e3a5f" />
    </main>
  );
}
