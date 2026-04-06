import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchHomeowners } from '../utils/fetchHomeowners';
import { HOMEOWNER_APIS, PORTAL_SOURCES } from '../config/homeownerSources';

const PRICE_FILTERS = [
  { label: 'Any Price', value: 0 },
  { label: '$200k+', value: 200000 },
  { label: '$400k+', value: 400000 },
  { label: '$600k+', value: 600000 },
  { label: '$800k+', value: 800000 },
  { label: '$1M+', value: 1000000 },
];

const STATE_OPTIONS = [
  { value: 'all', label: 'All States' },
  ...Object.values(HOMEOWNER_APIS).reduce((acc, s) => {
    if (!acc.find(x => x.value === s.state)) acc.push({ value: s.state, label: s.state });
    return acc;
  }, []),
];

function fmt(n) {
  if (!n || n === 0) return '—';
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
  if (n >= 1000) return '$' + Math.round(n / 1000) + 'k';
  return '$' + n.toLocaleString();
}

function fmtDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch(e) { return d.slice(0, 10); }
}

function buildSolarIndex(solarPermits) {
  const idx = new Set();
  for (const p of (solarPermits || [])) {
    const addr = (p.address_1 || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (addr.length > 5) idx.add(addr);
  }
  return idx;
}

function hasSolarMatch(record, solarIndex) {
  const addr = (record.address || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return addr.length > 5 && solarIndex.has(addr);
}

export default function HomeownersTab({ solarPermits = [] }) {
  const [stateFilter, setStateFilter] = useState('all');
  const [minPrice, setMinPrice] = useState(0);
  const [records, setRecords] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  const solarIndex = useMemo(() => buildSolarIndex(solarPermits), [solarPermits]);

  const load = useCallback(async (sf) => {
    setLoading(true);
    try {
      const { records: r, errors: e } = await fetchHomeowners(sf);
      setRecords(r);
      setErrors(e);
    } finally {
      setLoading(false);
    }
    setPage(0);
  }, []);

  useEffect(() => { load(stateFilter); }, [stateFilter, load]);

  const filtered = useMemo(() =>
    minPrice > 0 ? records.filter(r => r.purchasePrice >= minPrice) : records,
    [records, minPrice]
  );

  const solarMatches = useMemo(() =>
    filtered.filter(r => hasSolarMatch(r, solarIndex)).length,
    [filtered, solarIndex]
  );

  const avgPrice = useMemo(() => {
    const priced = filtered.filter(r => r.purchasePrice > 0);
    if (!priced.length) return 0;
    return priced.reduce((s, r) => s + r.purchasePrice, 0) / priced.length;
  }, [filtered]);

  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const errorKeys = Object.keys(errors);

  function exportCSV() {
    const header = 'Date,Buyer,Seller,Address,City,State,Price,Solar Match,Source';
    const rows = filtered.map(r => [
      r.closeDate?.slice(0,10)||'',
      '"'+(r.buyerName||'').replace(/"/g,'""')+'"',
      '"'+(r.sellerName||'').replace(/"/g,'""')+'"',
      '"'+(r.address||'').replace(/"/g,'""')+'"',
      r.city||'', r.state||'',
      r.purchasePrice||0,
      hasSolarMatch(r, solarIndex) ? 'YES' : '',
      '"'+(r.source||'').replace(/"/g,'""')+'"',
    ].join(','));
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'homeowners_' + new Date().toISOString().slice(0,10) + '.csv';
    a.click();
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">State</label>
          <select
            value={stateFilter}
            onChange={e => { setStateFilter(e.target.value); setPage(0); }}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {STATE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Min Price</label>
          <div className="flex rounded-lg overflow-hidden border border-slate-200">
            {PRICE_FILTERS.map(pf => (
              <button key={pf.value}
                onClick={() => { setMinPrice(pf.value); setPage(0); }}
                className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${minPrice === pf.value ? 'bg-amber-500 text-slate-900' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >{pf.label}</button>
            ))}
          </div>
        </div>
        <button
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="ml-auto inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-slate-900 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4" /></svg>
          Export CSV
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Transfers', value: loading ? '…' : filtered.length.toLocaleString() },
          { label: 'Avg Sale Price', value: loading ? '…' : fmt(Math.round(avgPrice)) },
          { label: 'States with Data', value: loading ? '…' : new Set(filtered.map(r => r.state)).size },
          { label: 'Solar Matches', value: loading ? '…' : solarMatches, hi: solarMatches > 0 },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{m.label}</p>
            <p className={`text-2xl font-extrabold ${m.hi ? 'text-amber-500' : 'text-slate-800'}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Error notices */}
      {errorKeys.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-start gap-2">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
          <div>
            <span className="font-semibold">Some sources unavailable: </span>
            {errorKeys.map(k => `${HOMEOWNER_APIS[k]?.label || k} (${errors[k]})`).join(' · ')}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Date Closed','Buyer','Seller','Address','City / State','Sale Price','Solar','Source'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    Loading property transfer data…
                  </div>
                </td></tr>
              ) : pageData.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">No records found.</td></tr>
              ) : pageData.map((r, i) => {
                const solar = hasSolarMatch(r, solarIndex);
                return (
                  <tr key={r.id || i} className={`hover:bg-amber-50/60 transition-colors ${solar ? 'bg-emerald-50/40' : ''}`}>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{fmtDate(r.closeDate)}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 max-w-[160px] truncate" title={r.buyerName}>{r.buyerName || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[140px] truncate" title={r.sellerName}>{r.sellerName || '—'}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-[180px] truncate" title={r.address}>{r.address || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{[r.city,r.state].filter(Boolean).join(', ')||'—'}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{fmt(r.purchasePrice)}</td>
                    <td className="px-4 py-3">
                      {solar && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                          Solar
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                      <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">{r.source}</a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
            <span className="text-xs text-slate-500">
              {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">← Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page >= totalPages-1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Portal-only sources */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Additional Sources (Manual Search Required)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PORTAL_SOURCES.map(p => (
            <a key={p.key} href={p.url} target="_blank" rel="noopener noreferrer"
              className="flex items-start gap-2.5 bg-white rounded-lg border border-slate-200 p-3 hover:border-amber-300 hover:shadow-sm transition-all group">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              <div>
                <p className="text-sm font-semibold text-slate-700 group-hover:text-amber-600">{p.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{p.note}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
