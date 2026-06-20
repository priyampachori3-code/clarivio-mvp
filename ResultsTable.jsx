const STATUS_STYLE = {
  MATCHED:        'bg-green-100 text-green-800',
  AMOUNT_MISMATCH:'bg-yellow-100 text-yellow-800',
  FUZZY_MATCH:    'bg-yellow-100 text-yellow-800',
  PORTAL_ONLY:    'bg-red-100 text-red-800',
  TALLY_ONLY:     'bg-blue-100 text-blue-800',
}

const STATUS_LABEL = {
  MATCHED:        'Matched',
  AMOUNT_MISMATCH:'Amount Mismatch',
  FUZZY_MATCH:    'Fuzzy Match',
  PORTAL_ONLY:    'Portal Only',
  TALLY_ONLY:     'Tally Only',
}

export default function ResultsTable({ rows, filter }) {
  const filtered = filter === 'ALL' ? rows : rows.filter(r => r.status === filter)

  if (!filtered.length) {
    return <p className="text-center text-slate-400 py-12">No records for this filter.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-brand-900 text-white text-xs uppercase tracking-wide">
            {['Status', 'GSTIN', 'Invoice (Portal)', 'Invoice (Tally)', 'Taxable (Portal)', 'Taxable (Tally)', 'Diff (₹)', 'IGST', 'CGST', 'SGST'].map(h => (
              <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, i) => (
            <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[row.status]}`}>
                  {STATUS_LABEL[row.status]}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs">{row.gstin}</td>
              <td className="px-4 py-3">{row.invoice_no_portal || '—'}</td>
              <td className="px-4 py-3">{row.invoice_no_tally  || '—'}</td>
              <td className="px-4 py-3 text-right">₹{row.taxable_portal?.toLocaleString('en-IN')}</td>
              <td className="px-4 py-3 text-right">₹{row.taxable_tally?.toLocaleString('en-IN')}</td>
              <td className={`px-4 py-3 text-right font-semibold ${row.diff_taxable !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                {row.diff_taxable !== 0 ? `₹${row.diff_taxable?.toLocaleString('en-IN')}` : '✓'}
              </td>
              <td className="px-4 py-3 text-right">₹{row.igst_portal?.toLocaleString('en-IN')}</td>
              <td className="px-4 py-3 text-right">₹{row.cgst_portal?.toLocaleString('en-IN')}</td>
              <td className="px-4 py-3 text-right">₹{row.sgst_portal?.toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
