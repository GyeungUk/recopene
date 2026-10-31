// Shared helpers for the survey API. Files starting with "_" are not exposed as routes on Vercel.
const crypto = require('crypto');

const SESSION_COOKIE = 'rc_kakao';
const STATE_COOKIE = 'rc_kakao_state';
const WEEK = 60 * 60 * 24 * 7;

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error('Missing env ' + name);
  return v;
}

function parseCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

function cookie(name, value, maxAge) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function origin(req) {
  const proto = req.headers['x-forwarded-proto'] || (String(req.headers.host).startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${req.headers.host}`;
}

const b64 = (buf) => Buffer.from(buf).toString('base64url');

function hmac(data) {
  return crypto.createHmac('sha256', env('SESSION_SECRET')).update(data).digest('base64url');
}

// a tiny signed token: base64url(payload).signature
function sign(payload) {
  const body = b64(JSON.stringify(payload));
  return body + '.' + hmac(body);
}

function verify(token) {
  if (!token || token.indexOf('.') < 0) return null;
  const [body, sig] = token.split('.');
  const expected = hmac(body);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString());
    return p.exp > Date.now() / 1000 ? p : null;
  } catch (e) {
    return null;
  }
}

function supabaseHeaders(extra) {
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  return Object.assign({ apikey: key, Authorization: 'Bearer ' + key }, extra);
}

// Works out who is calling: a Kakao session cookie, or a Supabase (Google) access token in the Authorization header.
async function identify(req) {
  const kakao = verify(parseCookies(req)[SESSION_COOKIE]);
  if (kakao) return { respondent: 'kakao:' + kakao.sub, provider: 'kakao', name: null };

  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  const r = await fetch(env('SUPABASE_URL') + '/auth/v1/user', {
    headers: { apikey: env('SUPABASE_SERVICE_ROLE_KEY'), Authorization: auth },
  });
  if (!r.ok) return null;
  const u = await r.json();
  const m = u.user_metadata || {};
  return {
    respondent: (u.app_metadata && u.app_metadata.provider || 'google') + ':' + u.id,
    provider: u.app_metadata && u.app_metadata.provider || 'google',
    name: m.full_name || m.name || null,
  };
}

// this account's stored answers, or null when it has not responded yet
async function savedAnswers(respondent) {
  const url = env('SUPABASE_URL') + '/rest/v1/survey_responses?select=answers&respondent=eq.' + encodeURIComponent(respondent);
  const r = await fetch(url, { headers: supabaseHeaders() });
  if (!r.ok) throw new Error('Supabase select failed: ' + r.status);
  const rows = await r.json();
  return rows.length ? rows[0].answers : null;
}

module.exports = { SESSION_COOKIE, STATE_COOKIE, WEEK, env, parseCookies, cookie, origin, sign, verify, supabaseHeaders, identify, savedAnswers };
