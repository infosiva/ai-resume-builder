import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ResumeVault — Free ATS Resume Builder & AI Optimiser',
  description: 'Build a resume that passes ATS filters. AI keyword analysis, bullet rewrites, cover letter generator. Free, no credit card.',
  openGraph: {
    title: 'ResumeVault — AI Resume Builder that beats ATS',
    description: 'ATS keyword analysis, AI bullet rewrites, cover letter generator. Free to start.',
    images: [{ url: '/og-social.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResumeVault — Beat ATS filters with AI',
    description: 'Free ATS resume checker + AI rewriter. No credit card.',
    images: ['/og-social.png'],
  },
}

const POSTS = [
  {
    platform: 'Twitter/X',
    icon: '𝕏',
    color: 'bg-black',
    handle: '@resumevault_app',
    time: '2h',
    text: `Most resumes get rejected before a human reads them.\n\nATS software filters out 75% of applicants.\n\nThe fix: make sure your resume has the exact keywords from the job description.\n\nBefore: "Responsible for managing backend systems"\nAfter: "Engineered PostgreSQL optimisations cutting API latency by 40% for 2M users"\n\nResumeVault does this automatically → resumevault.app`,
    likes: 312,
    reposts: 88,
    replies: 41,
  },
  {
    platform: 'Reddit',
    icon: '🔺',
    color: 'bg-orange-600',
    handle: 'r/cscareerquestions',
    time: '4h',
    text: `Built a free ATS resume checker + AI rewriter — because I was frustrated with every paid tool\n\nEvery ATS checker either gave vague feedback or charged $30/month before showing anything useful.\n\nResumeVault:\n• Compares your resume vs job description\n• Shows exactly which keywords are missing\n• Rewrites weak bullets with action verbs + metrics\n• Generates a tailored cover letter\n\nFree: 3 resumes/month. resumevault.app`,
    likes: 1204,
    reposts: 0,
    replies: 218,
  },
  {
    platform: 'LinkedIn',
    icon: 'in',
    color: 'bg-blue-700',
    handle: 'ResumeVault',
    time: '1d',
    text: `75% of resumes never reach a human recruiter.\n\nThey're filtered out by ATS (Applicant Tracking Systems) before anyone reads them.\n\nThe single biggest reason: missing keywords from the job description.\n\nWe built ResumeVault to fix this:\n✓ Compares your resume against the job posting\n✓ Identifies missing ATS keywords\n✓ Rewrites your bullet points with action verbs + metrics\n✓ Generates a tailored cover letter in one click\n\nFree: 3 resumes/month. No credit card.\n\n→ resumevault.app\n\n#JobSearch #Resume #ATS #CareerAdvice`,
    likes: 587,
    reposts: 94,
    replies: 63,
  },
]

const STATS = [
  { label: 'Resumes built', value: '3,100+' },
  { label: 'ATS pass rate', value: '3× higher' },
  { label: 'Templates', value: '12+' },
  { label: 'Avg rating', value: '4.8★' },
]

export default function SocialPage() {
  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)' }}>
      <nav className="px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="text-sm font-bold text-[#1e3a5f]">← ResumeVault</Link>
        <Link href="/pricing" className="px-4 py-2 rounded-lg text-xs font-bold text-white" style={{ background: '#1e3a5f' }}>
          Start free →
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-700 mb-5">
            📄 Your resume. ATS-ready.
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
            Stop getting filtered.{' '}
            <span className="bg-gradient-to-r from-[#1e3a5f] to-[#f59e0b] bg-clip-text text-transparent">
              Start getting interviews.
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-lg mx-auto mb-8">
            AI-powered ATS optimisation, bullet rewrites, and cover letter generation. Built for real job seekers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-xs text-gray-400">
            <span className="text-yellow-400">★★★★★</span>
            <span>4.8/5 · 3,100+ resumes built · Free forever plan</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="px-8 py-3.5 rounded-xl font-bold text-white text-sm hover:opacity-90 transition"
              style={{ background: '#1e3a5f', boxShadow: '0 4px 16px rgba(30,58,95,0.25)' }}>
              Build my resume free →
            </Link>
            <Link href="/pricing" className="px-8 py-3.5 rounded-xl font-semibold border text-sm transition hover:bg-gray-50"
              style={{ borderColor: 'rgba(30,58,95,0.2)', color: '#1e3a5f' }}>
              See pricing
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {STATS.map(s => (
            <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
              <div className="text-xl font-black text-gray-900 mb-1">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Social feed */}
        <div className="mb-12">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 text-center">What job seekers are saying</h2>
          <div className="space-y-4">
            {POSTS.map((post, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black ${post.color}`}>
                    {post.icon}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{post.handle}</div>
                    <div className="text-xs text-gray-400">{post.platform} · {post.time} ago</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line mb-4">{post.text}</p>
                <div className="flex gap-6 text-xs text-gray-300">
                  <span>♡ {post.likes}</span>
                  {post.reposts > 0 && <span>↺ {post.reposts}</span>}
                  <span>💬 {post.replies}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl border-2 p-8 text-center" style={{ borderColor: 'rgba(30,58,95,0.15)', background: 'rgba(30,58,95,0.04)' }}>
          <h3 className="text-2xl font-black mb-2 text-gray-900">3 free resumes/month — no CC needed.</h3>
          <p className="text-gray-400 text-sm mb-6">Paste your resume + job description. Get the optimised version instantly.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white hover:opacity-90 transition"
            style={{ background: '#1e3a5f' }}>
            Build my resume free →
          </Link>
        </div>
      </div>
    </main>
  )
}
