import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import { Download, FileJson, FileSpreadsheet, LogOut, RefreshCw, Upload } from 'lucide-react'
import './index.css'

const api = axios.create({ baseURL: '/' })
api.interceptors.request.use(config => {
  const token = localStorage.getItem('cv_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

function App() {
  const [token, setToken] = useState(localStorage.getItem('cv_token'))
  const [firm, setFirm] = useState(localStorage.getItem('cv_firm') || '')
  const [authMode, setAuthMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firmName, setFirmName] = useState('')
  const [gstr2bFile, setGstr2bFile] = useState(null)
  const [tallyFile, setTallyFile] = useState(null)
  const [result, setResult] = useState(null)
  const [filter, setFilter] = useState('ALL')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function saveAuth(data) {
    localStorage.setItem('cv_token', data.access_token)
    localStorage.setItem('cv_firm', data.firm_name)
    setToken(data.access_token)
    setFirm(data.firm_name)
  }

  async function submitAuth(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      let response
      if (authMode === 'register') {
        response = await api.post('/auth/register', { email, password, firm_name: firmName })
      } else {
        const form = new FormData()
        form.append('username', email)
        form.append('password', password)
        response = await api.post('/auth/login', form)
      }
      saveAuth(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  async function reconcile() {
    if (!gstr2bFile || !tallyFile) {
      setError('Upload both files to continue.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const form = new FormData()
      form.append('gstr2b_file', gstr2bFile)
      form.append('tally_file', tallyFile)
      const response = await api.post('/reconcile/run', form)
      setResult(response.data)
      setFilter('ALL')
    } catch (err) {
      setError(err.response?.data?.detail || 'Reconciliation failed')
    } finally {
      setLoading(false)
    }
  }

  async function downloadReport() {
    const form = new FormData()
    form.append('gstr2b_file', gstr2bFile)
    form.append('tally_file', tallyFile)
    const response = await api.post('/reconcile/download', form, { responseType: 'blob' })
    const url = URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = url
    link.download = 'clarivio_reconciliation.xlsx'
    link.click()
    URL.revokeObjectURL(url)
  }

  function logout() {
    localStorage.removeItem('cv_token')
    localStorage.removeItem('cv_firm')
    setToken(null)
    setFirm('')
    setResult(null)
  }

  if (!token) {
    return <main className="auth-shell"><section className="auth-card"><h1>clarivio</h1><p>GST Reconciliation for CA firms</p><div className="tabs"><button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Sign In</button><button className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>Create Account</button></div><form onSubmit={submitAuth}>{authMode === 'register' && <input required placeholder="CA firm name" value={firmName} onChange={event => setFirmName(event.target.value)} />}<input required type="email" placeholder="ca@example.com" value={email} onChange={event => setEmail(event.target.value)} /><input required type="password" placeholder="Password" value={password} onChange={event => setPassword(event.target.value)} />{error && <div className="error">{error}</div>}<button className="primary" disabled={loading}>{loading ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Create Account'}</button></form></section></main>
  }

  const rows = result ? (filter === 'ALL' ? result.rows : result.rows.filter(row => row.status === filter)) : []
  const filters = ['ALL', 'MATCHED', 'AMOUNT_MISMATCH', 'FUZZY_MATCH', 'PORTAL_ONLY', 'TALLY_ONLY']

  return <main><nav><strong>clarivio</strong><span>{firm}</span><button onClick={logout}><LogOut size={16} /> Sign out</button></nav><section className="workspace"><header><h1>GST Reconciliation</h1><p>Upload GSTR-2B JSON and a Tally purchase register Excel file.</p></header><div className="upload-grid"><FileInput label="GSTR-2B JSON" icon={<FileJson />} accept=".json" file={gstr2bFile} setFile={setGstr2bFile} /><FileInput label="Tally Excel" icon={<FileSpreadsheet />} accept=".xlsx,.xls" file={tallyFile} setFile={setTallyFile} /></div>{error && <div className="error">{error}</div>}<div className="actions"><button className="primary" onClick={reconcile} disabled={loading || !gstr2bFile || !tallyFile}>{loading ? <RefreshCw className="spin" size={16} /> : <Upload size={16} />} Reconcile</button>{result && <button className="secondary" onClick={downloadReport}><Download size={16} /> Download Excel</button>}</div>{result && <><div className="cards"><Summary label="Matched" value={result.summary.matched} /><Summary label="Mismatch" value={result.summary.mismatch} /><Summary label="Portal Only" value={result.summary.portal_only} /><Summary label="Tally Only" value={result.summary.tally_only} /></div><div className="filter-row">{filters.map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item.replaceAll('_', ' ')}</button>)}</div><div className="table-wrap"><table><thead><tr><th>Status</th><th>GSTIN</th><th>Portal Inv</th><th>Tally Inv</th><th>Portal Taxable</th><th>Tally Taxable</th><th>Diff</th></tr></thead><tbody>{rows.map((row, index) => <tr key={index}><td><span className={`badge ${row.status.toLowerCase()}`}>{row.status.replaceAll('_', ' ')}</span></td><td>{row.gstin}</td><td>{row.invoice_no_portal || '-'}</td><td>{row.invoice_no_tally || '-'}</td><td>{format(row.taxable_portal)}</td><td>{format(row.taxable_tally)}</td><td>{format(row.diff_taxable)}</td></tr>)}</tbody></table></div></>}</section></main>
}

function FileInput({ label, icon, accept, file, setFile }) {
  return <label className="dropzone">{icon}<strong>{label}</strong><span>{file ? file.name : 'Click to upload'}</span><input type="file" accept={accept} onChange={event => setFile(event.target.files?.[0] || null)} /></label>
}

function Summary({ label, value }) {
  return <article><span>{label}</span><strong>{value}</strong></article>
}

function format(value) {
  return `Rs. ${Number(value || 0).toLocaleString('en-IN')}`
}

createRoot(document.getElementById('root')).render(<App />)
