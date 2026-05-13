'use client'
import { useState } from 'react'

export default function NewsletterFormLight() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setState(res.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return <p className="text-sm text-gray-600">You&apos;re subscribed! 🎉</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@email.com"
        required
        className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#1e3a5f]/40"
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition"
        style={{ background: '#1e3a5f' }}
      >
        {state === 'loading' ? '...' : 'Subscribe'}
      </button>
    </form>
  )
}
