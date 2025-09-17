import React, { useState } from 'react'
import { login as apiLogin, signup as apiSignup } from '../utils/storage.js'

export default function Auth({ onSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let result
      if (mode === 'login') {
        result = await apiLogin({ email, password })
      } else {
        result = await apiSignup({ email, name, password })
      }
      onSuccess?.(result) // { token, user }
    } catch (e) {
      setError(e.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0e0e0e] border border-white/10 rounded-2xl p-6">
        <div className="flex justify-center mb-4 gap-2">
          <button
            className={`px-3 py-1.5 rounded-lg text-sm ${mode === 'login' ? 'bg-emerald-500 text-white' : 'bg-[#1b1b1b] text-gray-300'}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm ${mode === 'signup' ? 'bg-emerald-500 text-white' : 'bg-[#1b1b1b] text-gray-300'}`}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>

        <h1 className="text-xl font-semibold text-center mb-2">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-center text-gray-400 text-sm mb-6">
          {mode === 'login' ? 'Log in to access your contacts' : 'Start managing your contacts securely'}
        </p>

        {error && (
          <div className="mb-4 text-sm text-rose-400 bg-rose-950/40 border border-rose-900 rounded-lg p-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="text-sm text-gray-300">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-[#1b1b1b] border border-white/10 rounded-xl px-3 py-2 outline-none"
              placeholder="you@example.com"
            />
          </label>

          {mode === 'signup' && (
            <label className="block">
              <span className="text-sm text-gray-300">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full bg-[#1b1b1b] border border-white/10 rounded-xl px-3 py-2 outline-none"
                placeholder="Your name (optional)"
              />
            </label>
          )}

          <label className="block">
            <span className="text-sm text-gray-300">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-[#1b1b1b] border border-white/10 rounded-xl px-3 py-2 outline-none"
              placeholder="••••••••"
              minLength={6}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none text-white rounded-xl py-2 mt-2"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  )
}