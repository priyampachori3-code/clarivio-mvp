import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LogOut } from 'lucide-react'

export default function Navbar() {
  const { firmName, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-brand-700 tracking-tight">clarivio</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">{firmName}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </nav>
  )
}
