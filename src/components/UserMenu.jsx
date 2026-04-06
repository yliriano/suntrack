import { useState, useRef, useEffect } from 'react';

const UserMenu = ({ user, onSignOut }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const email = user?.email ?? '';
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-slate-900 text-xs font-extrabold hover:bg-amber-400 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400/60"
        aria-label="User menu"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 top-10 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-700 truncate">{email}</p>
            <p className="text-xs text-slate-400 mt-0.5">Signed in</p>
          </div>
          <button
            onClick={() => { setOpen(false); onSignOut(); }}
            className="w-full text-left px-4 py-3 text-xs text-slate-500 hover:bg-slate-50 hover:text-red-500 transition-colors flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
