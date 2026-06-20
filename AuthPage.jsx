import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../utils/api'

export default function AuthPage() {
  const [mode, setMode]       = useState('login')  // 'login' | 'register'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [firmName, setFirmName] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let res
      if (mode === 'register') {
        res = await api.post('/auth/register', { email, password, firm_name: firmName })
      } else {
        const form = new FormData()
        form.append('username', email)
        form.append('password', password)
        res = await api.post('/auth/login', form)
      }
      login(res.data.access_token, res.data.firm_name)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-900 to-brand-600">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-700 tracking-tight">clarivio</h1>
          <p className="text-slate-500 mt-1 text-sm">GST Reconciliation for CA firms</p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
          {['login', 'register'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                mode === m
                  ? 'bg-white shadow text-brand-700'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CA Firm Name</label>
              <input
                type="text"
                required
                value={firmName}
                onChange={e => setFirmName(e.target.value)}
                placeholder="Sharma & Associates"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ca@example.com"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
