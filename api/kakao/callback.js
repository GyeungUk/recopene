// Kakao sends the user back here with a code; we trade it for a token, read the member number and set our own session cookie.
const { SESSION_COOKIE, STATE_COOKIE, WEEK, env, parseCookies, cookie, origin, sign } = require('../_lib');

function back(res, extra, query) {
  res.statusCode = 302;
  res.setHeader('Set-Cookie', [cookie(STATE_COOKIE, '', 0)].concat(extra || []));
  res.setHeader('Location', '/survey/' + (query || ''));
  res.end();
}

module.exports = async (req, res) => {
  const url = new URL(req.url, origin(req));
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  // the user pressed cancel, or the request did not come from our login button
  if (!code || !state || state !== parseCookies(req)[STATE_COOKIE]) return back(res, null, '?login=failed');

  try {
    const form = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: env('KAKAO_REST_API_KEY'),
      redirect_uri: origin(req) + '/api/kakao/callback',
      code,
    });
    if (process.env.KAKAO_CLIENT_SECRET) form.set('client_secret', process.env.KAKAO_CLIENT_SECRET);
    const t = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: form,
    });
    const token = await t.json();
    if (!t.ok || !token.access_token) throw new Error('token ' + t.status + ' ' + JSON.stringify(token));

    const u = await fetch('https://kapi.kakao.com/v2/user/me', { headers: { Authorization: 'Bearer ' + token.access_token } });
    const me = await u.json();
    if (!u.ok || !me.id) throw new Error('user ' + u.status);

    const session = sign({ sub: String(me.id), exp: Math.floor(Date.now() / 1000) + WEEK });
    back(res, [cookie(SESSION_COOKIE, session, WEEK)]);
  } catch (e) {
    console.error('kakao callback', e);
    back(res, null, '?login=failed');
  }
};
