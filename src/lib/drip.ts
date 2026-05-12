/**
 * Email drip helpers for ResumeVault — Resend Contacts + Vercel Cron
 *
 * Requires env vars:
 *   RESEND_API_KEY
 *   RESEND_AUDIENCE_ID  (optional — auto-fetched from first audience if not set)
 */
import { Resend } from 'resend'

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

let _audienceId: string | null = process.env.RESEND_AUDIENCE_ID ?? process.env.RESEND_AUDIENCE_ID_RESUMEVAULT ?? null

export const AUDIENCE_ID: string | null = _audienceId

async function getAudienceId(): Promise<string | null> {
  if (_audienceId) return _audienceId
  if (!resend) return null
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await (resend.audiences as any).list()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const first = (res as any).data?.data?.[0] ?? (res as any).data?.[0]
    if (first?.id) {
      _audienceId = first.id
      console.log('[drip] auto-detected audience id:', _audienceId)
    }
  } catch (e) {
    console.error('[drip] failed to fetch audience id', e)
  }
  return _audienceId
}

export async function subscribeContact(email: string, firstName?: string): Promise<void> {
  if (!resend) {
    console.warn('[drip] Resend not configured')
    return
  }
  const audienceId = await getAudienceId()
  if (!audienceId) {
    console.warn('[drip] no audience id available')
    return
  }
  await resend.contacts.create({
    audienceId,
    email,
    firstName: firstName ?? '',
    unsubscribed: false,
  })
}

export async function listContacts(): Promise<Array<{ email: string; firstName: string; createdAt: string; id: string }>> {
  if (!resend) return []
  const audienceId = await getAudienceId()
  if (!audienceId) return []
  const res = await resend.contacts.list({ audienceId })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((res as any).data?.data ?? [])
}

export const DRIP_EMAILS: Array<{
  day: number
  subject: string
  html: (firstName: string) => string
}> = [
  {
    day: 1,
    subject: 'Your AI resume is ready — here\'s what to do next',
    html: (name) => `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fff;">
        <div style="margin-bottom:24px;">
          <span style="font-size:13px;font-weight:700;color:#1e3a5f;letter-spacing:0.05em;text-transform:uppercase;">ResumeVault</span>
        </div>
        <h2 style="font-size:22px;font-weight:800;color:#111;margin:0 0 12px;">Your resume is ready to download, ${name || 'there'} ✓</h2>
        <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 16px;">
          Your AI-crafted resume is waiting. Before you hit apply, here are the 3 things top candidates do:
        </p>
        <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
          ${[
            ['1', 'Tailor for each role', 'Paste a new JD and regenerate — takes 30 seconds, boosts ATS score by 40%'],
            ['2', 'Download as PDF', 'Always submit PDF, never Word — formatting stays perfect across every ATS'],
            ['3', 'Match the job title', 'Use the exact job title from the posting in your resume headline'],
          ].map(([num, title, desc]) => `
            <tr>
              <td style="padding:10px 12px 10px 0;vertical-align:top;">
                <span style="display:inline-block;width:24px;height:24px;background:#1e3a5f;border-radius:50%;color:#fff;font-size:12px;font-weight:700;text-align:center;line-height:24px;">${num}</span>
              </td>
              <td style="padding:10px 0;">
                <strong style="color:#111;font-size:14px;display:block;">${title}</strong>
                <span style="color:#777;font-size:13px;">${desc}</span>
              </td>
            </tr>`).join('')}
        </table>
        <a href="https://resumevault.app/#how" style="display:inline-block;background:#1e3a5f;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">
          Open ResumeVault →
        </a>
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0 16px;" />
        <p style="color:#aaa;font-size:12px;">ResumeVault · <a href="{{unsubscribeUrl}}" style="color:#aaa;">Unsubscribe</a></p>
      </div>`,
  },
  {
    day: 3,
    subject: '3 resume mistakes that quietly fail ATS (and how to fix them)',
    html: (name) => `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fff;">
        <div style="margin-bottom:24px;">
          <span style="font-size:13px;font-weight:700;color:#1e3a5f;letter-spacing:0.05em;text-transform:uppercase;">ResumeVault</span>
        </div>
        <h2 style="font-size:22px;font-weight:800;color:#111;margin:0 0 12px;">3 silent ATS killers, ${name || 'there'}</h2>
        <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px;">
          75% of resumes are rejected before a human ever reads them. Here's what kills them:
        </p>
        ${[
          {
            n: 1, emoji: '❌', title: 'Tables & columns',
            bad: 'Using multi-column layouts or tables for skills/experience',
            fix: 'ATS systems read left-to-right, top-to-bottom. Use plain single-column formatting — ResumeVault does this automatically.'
          },
          {
            n: 2, emoji: '❌', title: 'Missing exact keywords',
            bad: 'Writing "managed stakeholders" when the JD says "stakeholder management"',
            fix: 'Copy exact phrases from the job description. ResumeVault\'s JD match score shows every missing keyword.'
          },
          {
            n: 3, emoji: '❌', title: 'No quantifiable impact',
            bad: '"Responsible for improving sales performance"',
            fix: '"Increased MRR by 34% in Q3 by renegotiating top 10 accounts" — always add a number and outcome.'
          },
        ].map(item => `
          <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:16px;border:1px solid #e5e7eb;">
            <div style="font-size:14px;font-weight:800;color:#111;margin-bottom:6px;">${item.emoji} Mistake ${item.n}: ${item.title}</div>
            <div style="font-size:13px;color:#ef4444;margin-bottom:8px;"><strong>Problem:</strong> ${item.bad}</div>
            <div style="font-size:13px;color:#16a34a;"><strong>Fix:</strong> ${item.fix}</div>
          </div>`).join('')}
        <a href="https://resumevault.app/#how" style="display:inline-block;background:#1e3a5f;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:8px;">
          Fix my resume now →
        </a>
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0 16px;" />
        <p style="color:#aaa;font-size:12px;">ResumeVault · <a href="{{unsubscribeUrl}}" style="color:#aaa;">Unsubscribe</a></p>
      </div>`,
  },
  {
    day: 7,
    subject: 'Still job hunting? This one change lands 2× more interviews',
    html: (name) => `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fff;">
        <div style="margin-bottom:24px;">
          <span style="font-size:13px;font-weight:700;color:#1e3a5f;letter-spacing:0.05em;text-transform:uppercase;">ResumeVault</span>
        </div>
        <h2 style="font-size:22px;font-weight:800;color:#111;margin:0 0 12px;">One week in, ${name || 'there'} — how's the search going?</h2>
        <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 16px;">
          The single highest-ROI thing most job seekers skip: <strong>tailoring the resume for each application</strong>.
        </p>
        <div style="background:#fff8f0;border-left:4px solid #f59e0b;border-radius:4px;padding:16px;margin:0 0 24px;">
          <p style="color:#374151;font-size:14px;margin:0 0 8px;"><strong>Generic resume:</strong> 2–3% interview rate</p>
          <p style="color:#374151;font-size:14px;margin:0;"><strong>Tailored resume (ATS score 80%+):</strong> up to 6% interview rate</p>
        </div>
        <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px;">
          With ResumeVault Pro, every application gets a uniquely tailored resume + cover letter in under 2 minutes. Unlimited — for $9/month.
        </p>
        <a href="https://resumevault.app/#pricing" style="display:inline-block;background:#f59e0b;color:#111;font-weight:800;font-size:15px;padding:14px 28px;border-radius:8px;text-decoration:none;">
          Upgrade to Pro — $9/mo →
        </a>
        <p style="color:#9ca3af;font-size:12px;margin-top:12px;">Cancel anytime. No contracts.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0 16px;" />
        <p style="color:#aaa;font-size:12px;">ResumeVault · <a href="{{unsubscribeUrl}}" style="color:#aaa;">Unsubscribe</a></p>
      </div>`,
  },
]
