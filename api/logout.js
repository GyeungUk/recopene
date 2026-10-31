// Clears the Kakao session cookie (Google sessions are cleared by supabase-js in the browser).
const { SESSION_COOKIE, cookie } = require('./_lib');

module.exports = (req, res) => {
  res.setHeader('Set-Cookie', cookie(SESSION_COOKIE, '', 0));
  res.status(200).json({ ok: true });
};
