import { useState, useEffect, useCallback } from 'react';
import { formatDate, normalizeStatus, STATUS_LABELS, STATUS_COLORS } from '../utils/formatters';
import { LEAD_STATUSES, LEAD_STATUS_STYLES } from '../hooks/useLeadStatus';
const PAGE_SIZE = 15;
const STATUS_STYLES = { issued:'bg-emerald-50 text-emerald-700 ring-emerald-200/80 border border-emerald-100','in-review':'bg-amber-50 text-amber-700 ring-amber-200/80 border border-amber-100',filed:'bg-sky-50 text-sky-700 ring-sky-200/80 border border-sky-100',expired:'bg-red-50 text-red-600 ring-red-200/80 border border-red-100',unknown:'bg-slate-100 text-slate-500 ring-slate-200/80 border border-slate-200' };
const StatusBadge = ({ status }) => { const norm = normalizeStatus(status); return (<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[norm]}`}><span className={`mr-1.5 w-1.5 h-1.5 rounded-full ${norm==='issued'?'bg-emerald-500':norm==='in-review'?'bg-amber-400':norm==='filed'?'bg-sky-500':norm==='expired'?'bg-red-400':'bg-slate-400'}`}/>{STATUS_LABELS[norm]}</span>); };
const CopyButton = ({ value }) => { const [copied, setCopied] = useState(false); const handleCopy = useCallback((e) => { e.stopPropagation(); navigator.clipboard.writeText(value||'').then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),1500); }); },[value]); if(!value) return null; return (<button onClick={handleCopy} title={copied?'Copied!':'Copy'} className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-200 transition-all relative flex-shrink-0">{copied?(<svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>):(<svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/></svg>)}{copied&&<span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap pointer-events-none z-10">Copied!</span>}</button>); };
const LeadStatusDropdown = ({ permitNumber, current, onChange }) => { const style = current ? LEAD_STATUS_STYLES[current] : 'bg-slate-50 text-slate-400 border-slate-200'; return (<select value={current||''} onChange={(e)=>onChange(permitNumber,e.target.value||null)} onClick={(e)=>e.stopPropagation()} className={`text-xs font-semibold border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400/60 cursor-pointer transition-all ${style}`}><option value="">— Set status</option>{LEAD_STATUSES.map((s)=>(<option key={s} value={s}>{s}</option>))}</select>); };
const SkeletonRows = () => Array.from({length:8}).map((_,i)=>(<tr key={i} className="animate-pulse border-b border-slate-50">{Array.from({length:10}).map((__,j)=>(<td key={j} className="px-5 py-3.5"><div className="h-3.5 bg-slate-100 rounded-md" style={{width:`${50+(j*13)%45}%`}}/></td>))}</tr>));
const Pagination = ({ page, totalPages, total, onPrev, onNext }) => (<div className="px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-50/50"><p className="text-xs text-slate-400 order-2 sm:order-1"><span className="font-semibold text-slate-600">{((page-1)*PAGE_SIZE+1).toLocaleString()}–{Math.min(page*PAGE_SIZE,total).toLocaleString()}</span>{' '}of{' '}<span className="font-semibold text-slate-600">{total.toLocaleString()}</span> results</p><div className="flex items-center gap-1.5 order-1 sm:order-2"><button onClick={onPrev} disabled={page===1} className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-white hover:border-slate-300 hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all text-slate-600">← Prev</button><span className="px-3 py-1.5 text-xs font-medium text-slate-400 bg-white border border-slate-200 rounded-lg min-w-[60px] text-center">{page} / {totalPages}</span><button onClick={onNext} disabled={page===totalPages} className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-white hover:border-slate-300 hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all text-slate-600">Next →</button></div></div>);
const COLUMNS = ['Filed Date','Permit #','Address','Owner','State','Contractor','Description','Status','Source','Lead Status'];
const PermitTable = ({ permits, loading, error, leadStatuses={}, onLeadStatusChange, newPermitNumbers }) => {
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [permits]);
  const totalPages = Math.max(1, Math.ceil(permits.length/PAGE_SIZE));
  const paginated = permits.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  if (error) return (<div className="bg-white border border-red-100 rounded-2xl shadow-sm p-12 text-center"><div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-4"><svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg></div><p className="text-slate-800 font-semibold mb-1">Could not load permit data</p><p className="text-slate-400 text-sm">The data source is temporarily unavailable. Try refreshing, or use the portal links above.</p></div>);
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="bg-slate-900">{COLUMNS.map((col)=>(<th key={col} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap first:rounded-tl-xl last:rounded-tr-xl">{col}</th>))}</tr></thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (<SkeletonRows/>) : paginated.length===0 ? (
              <tr><td colSpan={10} className="px-5 py-20 text-center text-slate-400 text-sm"><svg className="w-10 h-10 mx-auto mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414A1 1 0 0 1 19 9.414V19a2 2 0 0 1-2 2z"/></svg>No permits match your current filters.</td></tr>
            ) : paginated.map((permit,i) => {
              const description = [permit.permit_type_name,permit.permit_subtype_name].filter(Boolean).join(' – ');
              const isNew = newPermitNumbers && newPermitNumbers.has(permit.permit_number);
              const currentLeadStatus = leadStatuses[permit.permit_number];
              return (
                <tr key={permit.permit_number||i} className={`hover:bg-slate-50/80 transition-colors group ${isNew?'bg-blue-50/40':''}`}>
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 text-xs font-medium">{formatDate(permit.application_date)}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap"><div className="flex items-center gap-1"><span className="font-mono text-xs text-slate-700 bg-slate-100 group-hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors">{permit.permit_number||'—'}</span>{isNew&&<span className="text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">New</span>}</div></td>
                  <td className="px-5 py-3.5 max-w-[180px]" title={permit.address_1}><div className="flex items-center"><span className="text-slate-800 font-medium text-xs truncate">{permit.address_1||'—'}</span><CopyButton value={permit.address_1}/></div></td>
                  <td className="px-5 py-3.5 max-w-[160px]" title={permit.owner_name}><div className="flex items-center"><span className="text-slate-600 text-xs truncate">{permit.owner_name||<span className="text-slate-300">—</span>}</span>{permit.owner_name&&<CopyButton value={permit.owner_name}/>}</div></td>
                  <td className="px-5 py-3.5 whitespace-nowrap">{permit.state?(<span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-600 tracking-wide">{permit.state}</span>):<span className="text-slate-300">—</span>}</td>
                  <td className="px-5 py-3.5 text-slate-500 max-w-[160px] truncate text-xs" title={permit.contractor_company_name}>{permit.contractor_company_name||<span className="text-slate-300">—</span>}</td>
                  <td className="px-5 py-3.5 text-slate-400 max-w-[200px] truncate text-xs" title={description}>{description||<span className="text-slate-300">—</span>}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap"><StatusBadge status={permit.status_current}/></td>
                  <td className="px-5 py-3.5 whitespace-nowrap"><a href={permit._sourceUrl||'#'} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-600 text-xs font-semibold inline-flex items-center gap-1 transition-colors">{permit._sourceLabel||'Open Data'}<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></a></td>
                  <td className="px-5 py-3.5 whitespace-nowrap">{onLeadStatusChange?(<LeadStatusDropdown permitNumber={permit.permit_number} current={currentLeadStatus} onChange={onLeadStatusChange}/>):<span className="text-slate-300 text-xs">—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!loading && permits.length>PAGE_SIZE && <Pagination page={page} totalPages={totalPages} total={permits.length} onPrev={()=>setPage((p)=>Math.max(1,p-1))} onNext={()=>setPage((p)=>Math.min(totalPages,p+1))}/>}
    </div>
  );
};
export default PermitTable;