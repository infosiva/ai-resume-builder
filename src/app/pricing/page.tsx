import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pricing — ResumeVault | AI Resume Builder',
  description: 'Build your resume free. Upgrade to Pro for $9/mo — unlimited resumes, full ATS optimisation, LinkedIn import, and interview prep.',
  openGraph: {
    title: 'ResumeVault Pricing — Free AI Resume Builder',
    description: 'Free plan: 3 resumes/month + ATS analysis. Pro at $9/mo for unlimited resumes and full career toolkit.',
  },
}

const FREE_FEATURES = [
  '3 resumes per month',
  'Job match score',
  'ATS keyword analysis',
  'Cover letter generator',
  'Interview prep (3 questions)',
  'All export formats',
]

const PRO_FEATURES = [
  'Unlimited resumes & cover letters',
  'Full ATS optimisation engine',
  'LinkedIn import',
  'PDF export (all templates)',
  'Full interview prep (8 questions)',
  'Priority AI speed',
]

const FAQ = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — cancel from your dashboard, no questions asked. You keep Pro access until end of billing period.',
  },
  {
    q: 'What is ATS optimisation?',
    a: 'ATS (Applicant Tracking System) is software companies use to filter resumes. Our engine analyses your resume against the job description and tells you exactly which keywords to add.',
  },
  {
    q: 'Can I import my LinkedIn profile?',
    a: 'Yes — Pro users can import their LinkedIn profile to auto-populate resume sections. No copy-pasting required.',
  },
  {
    q: 'Is the free plan really free forever?',
    a: 'Yes. No credit card required. Free plan gives you 3 resumes per month with ATS analysis — enough to land interviews.',
  },
  {
    q: 'What export formats are supported?',
    a: 'PDF, DOCX, and plain text. All formats optimised for ATS parsing.',
  },
  {
    q: 'What is the refund policy?',
    a: 'We offer a 7-day money-back guarantee. If you\'re not happy, email us and we\'ll refund immediately.',
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)' }}>
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="text-sm font-bold text-[#1e3a5f] hover:text-[#2d4f7c] transition">← ResumeVault</Link>
        <Link href="/?upgrade=true" className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] hover:from-[#2d4f7c] hover:to-[#3a6ea8] transition">
          Start Pro →
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-700 mb-6">
            ⚡ Simple pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
            Build a resume that gets interviews.{' '}
            <span className="bg-gradient-to-r from-[#1e3a5f] to-[#f59e0b] bg-clip-text text-transparent">
              Start free.
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            AI-powered ATS optimisation, cover letters, and interview prep. Upgrade only when you need more.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20">
          {/* Free */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Free</div>
            <div className="text-5xl font-black text-gray-300 mb-1">$0</div>
            <div className="text-xs text-gray-300 mb-8">forever</div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-gray-300">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/" className="block w-full py-3 rounded-xl text-center text-sm font-semibold border border-gray-200 text-gray-400 hover:bg-gray-50 transition">
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border-2 border-[#1e3a5f] bg-[#1e3a5f] p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
            <span className="absolute -top-3.5 right-6 bg-amber-400 text-gray-900 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
              Most Popular
            </span>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Pro</div>
            <div className="text-5xl font-black text-white mb-1">$9</div>
            <div className="text-xs text-white/50 mb-8">/month · cancel anytime</div>
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                  <span className="text-amber-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/?upgrade=true" className="block w-full py-3 rounded-xl text-center text-sm font-bold bg-amber-400 hover:bg-amber-300 transition text-gray-900">
              Start Pro — $9/mo →
            </Link>
            <p className="text-[10px] text-center text-white/25 mt-3">7-day money-back guarantee</p>
          </div>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 mb-20">
          <span className="flex items-center gap-1.5">
            <span className="text-yellow-400">★★★★★</span> 4.8/5 rating
          </span>
          <span>·</span>
          <span>3,100+ resumes built</span>
          <span>·</span>
          <span>ATS optimised</span>
          <span>·</span>
          <span>No credit card for free plan</span>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center text-gray-900 mb-8">Frequently asked questions</h2>
          <div className="space-y-1">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group border-b border-gray-200 py-4">
                <summary className="cursor-pointer font-semibold text-sm text-gray-600 group-open:text-gray-900 transition list-none flex items-center justify-between">
                  {q}
                  <span className="text-gray-300 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="text-gray-400 text-sm mb-4">Still not sure? Start free — no credit card needed.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] hover:from-[#2d4f7c] hover:to-[#3a6ea8] transition text-white">
            Build my resume free →
          </Link>
        </div>
      </div>
    </main>
  )
}
