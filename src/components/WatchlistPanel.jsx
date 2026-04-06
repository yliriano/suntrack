import { useState, useEffect } from 'react';

const WatchlistPanel = ({ open, onClose, watchlist, onAdd, onRemove, onMarkSeen, newCount }) => {
  const [input, setInput] = useState('');
  useEffect(() => { if (open && watchlist.length) watchlist.forEach((term) => onMarkSeen(term)); }, [open]); // eslint-disable-line

  const handleAdd = () => { const trimmed = input.trim(); if (!trimmed) return; onAdd(trimmed); setInput(''); };

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 z-30 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-40 flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="bg-slate-900 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" /></svg>
            <h2 className="text-sm font-bold text-white">Zip Watchlist</h2>
            {newCount > 0 && <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full">{newCount}</span>}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1" aria-label="Close panel">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">Add zip codes or county names. Matching permits filed after you last opened this panel will be highlighted with a <span className="font-semibold text-blue-600">New</span> badge.</p>
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} placeholder="e.g. 20001 or Montgomery" className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 placeholder-slate-400" />
            <button onClick={handleAdd} className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-semibold rounded-lg transition-colors">Add</button>
          </div>
          {watchlist.length === 0 ? (
            <div className="text-center py-10 text-slate-300">
              <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" /></svg>
              <p className="text-sm text-slate-400">No territories yet</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {watchlist.map((term) => (
                <li key={term} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5">
                  <span className="text-sm font-medium text-slate-700">{term}</span>
                  <button onClick={() => onRemove(term)} className="text-slate-300 hover:text-red-400 transition-colors p-1" aria-label={`Remove ${term}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-slate-100 px-5 py-3 flex-shrink-0">
          <p className="text-xs text-slate-400 text-center">Saved locally · {watchlist.length} {watchlist.length === 1 ? 'territory' : 'territories'}</p>
        </div>
      </div>
    </>
  );
};
export default WatchlistPanel;
