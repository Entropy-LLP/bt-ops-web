'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Zap } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = getSupabaseClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/ops/dashboard')
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.replace('/ops/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen dark:bg-[#09090B] bg-[#FAFAFA] flex items-center justify-center p-4">

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[600px] h-[600px] rounded-full
          bg-[#F97316]/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[#F97316] flex items-center justify-center mb-5 shadow-lg shadow-[#F97316]/20">
            <Zap size={28} className="text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold dark:text-white text-[#09090B] tracking-tight">
            BharatTruck
          </h1>
          <p className="text-sm dark:text-[#888] text-[#71717A] mt-1">
            Sign in to your portal
          </p>
        </div>

        {/* Card */}
        <div className="dark:bg-[#111111] bg-white rounded-2xl border dark:border-[#2A2A2A] border-[#E4E4E7] p-6 shadow-xl shadow-black/10">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium dark:text-[#CCC] text-[#09090B] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm
                    dark:bg-[#1A1A1A] bg-[#F4F4F5]
                    dark:border-[#2A2A2A] border-[#E4E4E7] border
                    dark:text-white text-[#09090B]
                    dark:placeholder-[#555] placeholder-[#A1A1AA]
                    focus:outline-none focus:border-[#F97316]
                    transition-colors"
                  placeholder="ops@bharattruck.in"
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-[#CCC] text-[#09090B] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm
                    dark:bg-[#1A1A1A] bg-[#F4F4F5]
                    dark:border-[#2A2A2A] border-[#E4E4E7] border
                    dark:text-white text-[#09090B]
                    focus:outline-none focus:border-[#F97316]
                    transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm text-white
                  bg-[#F97316] hover:bg-[#EA6E00]
                  transition-all active:scale-[0.98] shadow-lg shadow-[#F97316]/20
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>

            </div>
          </form>
        </div>

        <p className="text-center text-xs dark:text-[#555] text-[#A1A1AA] mt-6">
          BharatTruck Operations Console v1.0
        </p>
      </div>
    </div>
  )
}
