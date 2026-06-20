import { useState } from 'react'
import { Upload, Download, RefreshCw, FileJson, FileSpreadsheet } from 'lucide-react'
import api from '../utils/api'
import SummaryCards from '../components/SummaryCards'
import ResultsTable from '../components/ResultsTable'
import Navbar from '../components/Navbar'

const FILTERS = [
  { value: 'ALL',           label: 'All' },
  { value: 'MATCHED',       label: 'Matched' },
  { value: 'AMOUNT_MISMATCH', label: 'Amount Mismatch' },
  { value: 'FUZZY_MATCH',   label: 'Fuzzy Match' },
  { value: 'PORTAL_ONLY',   label: 'Portal Only' },
  { value: 'TALLY_ONLY',    label: 'Tally Only' },
]

export default function Dashboard() {
  const [gstr2bFile, setGstr2bFile] = useState(null)
  const [tallyFile,  setTallyFile]  = useState(null)
  const [result,     setResult]     = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [dlLoading,  setDlLoading]  = useState(false)
  const [error,      setError]      = useState('')
  const [filter,     setFilter]     = useState('ALL')

  async function handleReconcile() {
    if (!gstr2bFile || !tallyFile) {
      setError('Upload both files to continue.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const form = new FormData()
      form.append('gstr2b_file', gstr2bFile)
      form.append('tally_file',  tallyFile)
      const res = await api.post('/reconcile/run', form)
      setResult(res.data)
      setFilter('ALL')
    } catch (err) {
      setError(err.response?.data?.detail || 'Reconciliation failed. Check your files.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDownload() {
    if (!gstr2bFile || !tallyFile) return
    setDlLoading(true)
    try {
      const form = new FormData()
      form.append('gstr2b_file', gstr2bFile)
      form.append('tally_file',  tallyFile)
      const res = await api.post('/reconcile/download', form, { responseType: 'blob' })
      const url  = URL.createObjectURL(res.data)
      const link = document.createElement('a')
      link.href     = url
      link.download = 'clarivio_reconciliation.xlsx'
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Download failed.')
    } finally {
      setDlLoading(false)
    }
  }

  function reset() {
    setGstr2bFile(null)
    setTallyFile(null)
    setResult(null)
    setError('')
    setFilter('ALL')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">GST Reconciliation</h2>
          <p className="text-slate-500 mt-1 text-sm">Upload GSTR-2B (JSON) and Tally purchase register (Excel) to reconcile</p>
        </div>

        {/* Upload Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <FileDropzone
              label="GSTR-2B (JSON)"
              accept=".json"
              icon={FileJson}
              file={gstr2bFile}
              onChange={setGstr2bFile}
              hint="Download from GST portal → Returns → GSTR-2B"
            />
            <FileDropzone
              label="Tally Purchase Register (Excel)"
              accept=".xlsx,.xls"
              icon={FileSpreadsheet}
              file={tallyFile}
              onChange={setTallyFile}
              hint="Export from Tally → Purchase Register → Excel"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 mb-4">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleReconcile}
              disabled={loading || !gstr2bFile || !tallyFile}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-40"
            >
              {loading
                ? <><RefreshCw size={16} className="animate-spin" /> Running…</>
                : <><Upload size={16} /> Reconcile</>
              }
            </button>

            {result && (
              <>
                <button
                  onClick={handleDownload}
                  disabled={dlLoading}
                  className="flex items-center gap-2 border border-brand-600 text-brand-700 hover:bg-brand-50 font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-40"
                >
                  {dlLoading
                    ? <><RefreshCw size={16} className="animate-spin" /> Preparing…</>
                    : <><Download size={16} /> Download Excel</>
                  }
                </button>
                <button onClick={reset} className="ml-auto text-sm text-slate-400 hover:text-slate-600">
                  Start over
                </button>
              </>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <>
            {/* Stats bar */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-semibold text-slate-500">
                {result.summary.total} invoices · {result.summary.match_rate}% match rate
              </span>
            </div>

            <SummaryCards summary={result.summary} />

            {/* Filter tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    filter === f.value
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-brand-400'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <ResultsTable rows={result.rows} filter={filter} />
          </>
        )}
      </main>
    </div>
  )
}

function FileDropzone({ label, accept, icon: Icon, file, onChange, hint }) {
  return (
    <label className="block cursor-pointer">
      <p className="text-sm font-semibold text-slate-700 mb-2">{label}</p>
      <div className={`rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
        file ? 'border-brand-400 bg-brand-50' : 'border-slate-300 hover:border-brand-400'
      }`}>
        <Icon size={28} className={`mx-auto mb-2 ${file ? 'text-brand-600' : 'text-slate-400'}`} />
        {file
          ? <p className="text-sm font-medium text-brand-700">{file.name}</p>
          : <p className="text-sm text-slate-400">Click to upload</p>
        }
        <p className="text-xs text-slate-400 mt-1">{hint}</p>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => onChange(e.target.files[0] || null)}
        />
      </div>
    </label>
  )
}
