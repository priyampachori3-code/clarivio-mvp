import { CheckCircle, AlertTriangle, XCircle, FileX } from 'lucide-react'

const CARDS = [
  { key: 'matched',     label: 'Matched',      icon: CheckCircle,  color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  { key: 'mismatch',    label: 'Mismatch',      icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { key: 'portal_only', label: 'Portal Only',   icon: XCircle,      color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
  { key: 'tally_only',  label: 'Tally Only',    icon: FileX,        color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
]

export default function SummaryCards({ summary }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {CARDS.map(({ key, label, icon: Icon, color, bg, border }) => (
        <div key={key} className={`rounded-xl border ${border} ${bg} p-4`}>
          <div className={`flex items-center gap-2 mb-1 ${color}`}>
            <Icon size={16} />
            <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
          </div>
          <p className={`text-3xl font-bold ${color}`}>{summary[key]}</p>
        </div>
      ))}
    </div>
  )
}
