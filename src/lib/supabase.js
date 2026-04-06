// ─────────────────────────────────────────────────────────────────────────────
// Supabase config — get these free at https://supabase.com
//   Dashboard → Project Settings → API → Project URL + anon public key
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL     = 'https://YOUR_PROJECT_ID.supabase.co'; // ← replace
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';                 // ← replace

export const isConfigured =
  !SUPABASE_URL.includes('YOUR_PROJECT_ID') &&
  !SUPABASE_ANON_KEY.includes('YOUR_ANON_KEY');

const hdrs = (token) => ({
  apikey: SUPABASE_ANON_KEY,
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const signUp = (email, password) =>
  fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST', headers: hdrs(), body: JSON.stringify({ email, password }),
  }).then((r) => r.json());

export const signIn = (email, password) =>
  fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST', headers: hdrs(), body: JSON.stringify({ email, password }),
  }).then((r) => r.json());

export const signOut = (token) =>
  fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: 'POST', headers: hdrs(token) });

export const refreshSession = (refreshToken) =>
  fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST', headers: hdrs(), body: JSON.stringify({ refresh_token: refreshToken }),
  }).then((r) => r.json());

export const getUserData = async (token, userId) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/user_data?user_id=eq.${userId}&select=*`,
    { headers: hdrs(token) }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0] ?? null;
};

export const upsertUserData = (token, userId, patch) =>
  fetch(`${SUPABASE_URL}/rest/v1/user_data`, {
    method: 'POST',
    headers: { ...hdrs(token), Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({ user_id: userId, ...patch }),
  }).then((r) => r.ok);
