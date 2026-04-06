import { useState, useEffect, useCallback } from 'react';
import { isConfigured, signIn, signUp, signOut, refreshSession } from '../lib/supabase';

const SESSION_KEY = 'suntrack_session';

const loadSession = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } };
const saveSession = (session) => {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
};

export const useAuth = () => {
  const [session, setSession] = useState(loadSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = session?.user ?? null;
  const token = session?.access_token ?? null;

  useEffect(() => {
    if (!session?.refresh_token || !isConfigured) return;
    const expiresAt = session.expires_at;
    if (!expiresAt || Date.now() / 1000 < expiresAt - 60) return;
    refreshSession(session.refresh_token).then((data) => {
      if (data?.access_token) { const next = { ...session, ...data }; setSession(next); saveSession(next); }
      else { setSession(null); saveSession(null); }
    });
  }, []); // eslint-disable-line

  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    const data = await signIn(email, password);
    setLoading(false);
    if (data?.access_token) { setSession(data); saveSession(data); return { ok: true }; }
    const msg = data?.error_description || data?.msg || 'Sign in failed';
    setError(msg); return { ok: false, error: msg };
  }, []);

  const register = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    const data = await signUp(email, password);
    setLoading(false);
    if (data?.access_token) { setSession(data); saveSession(data); return { ok: true }; }
    if (data?.id || data?.user?.id) return { ok: true, confirm: true };
    const msg = data?.error_description || data?.msg || 'Registration failed';
    setError(msg); return { ok: false, error: msg };
  }, []);

  const logout = useCallback(async () => {
    if (token) signOut(token).catch(() => {});
    setSession(null); saveSession(null);
  }, [token]);

  return { user, token, loading, error, login, register, logout };
};
