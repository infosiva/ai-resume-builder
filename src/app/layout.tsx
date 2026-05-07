import type { Metadata } from 'next'
import './globals.css'
import SharedNavbar from '@/components/SharedNavbar'
import SharedFooter from '@/components/SharedFooter'
import type { BrandConfig } from '@/components/SharedNavbar'

export const brand: BrandConfig = {
  name: 'ResumeVault',
  tagline: 'AI-powered resume builder — tailored to every job description in seconds.',
  icon: '📄',
  color: '#10b981',
  url: 'https://resumevault.app',
  navLinks: [{ label: 'Build resume', href: '/' }, { label: 'Interview prep', href: '/?tab=interview' }],
  cta: { label: 'Build free →', href: '/' },
}

export const metadata: Metadata = {
  title: 'ResumeVault — AI Resume Builder',
  description: 'Paste a job description and get a polished, tailored resume in seconds. Free AI resume builder for job seekers.',
  keywords: ['resume builder', 'AI resume', 'CV generator', 'job application', 'free resume maker'],
  openGraph: { title: 'ResumeVault — AI Resume Builder', description: 'Tailored resumes from job descriptions in seconds.', type: 'website', locale: 'en_GB', siteName: 'ResumeVault', url: 'https://resumevault.app' },
  twitter: { card: 'summary_large_image', title: 'ResumeVault', description: 'AI resume builder — tailored to every job.' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "SoftwareApplication", "name": "ResumeVault", "url": brand.url, "description": brand.tagline, "applicationCategory": "BusinessApplication", "operatingSystem": "Web", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" } },
            { "@type": "WebSite", "name": "ResumeVault", "url": brand.url }
          ]
        })}} />
      </head>
      <body className="flex flex-col min-h-screen">
        <SharedNavbar brand={brand} />
        <main className="flex-1 pt-16">{children}</main>
        <SharedFooter brand={brand} />
        <script src="http://31.97.56.148:3098/t.js" data-site="resumevault.app" defer></script>
      </body>
    </html>
  )
}
