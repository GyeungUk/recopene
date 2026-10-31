// Starts Kakao login with no scope, so no consent items (and no Kakao review) are needed: we only get the member number.
const crypto = require('crypto');
const { STATE_COOKIE, env, cookie, origin } = require('../_lib');

module.exports = (req, res) => {
  const state = crypto.randomBytes(16).toString('base64url');
  const q = new URLSearchParams({
    client_id: env('KAKAO_REST_API_KEY'),
    redirect_uri: origin(req) + '/api/kakao/callback',
    response_type: 'code',
    state,
  });
  res.setHeader('Set-Cookie', cookie(STATE_COOKIE, state, 600));
  res.statusCode = 302;
  res.setHeader('Location', 'https://kauth.kakao.com/oauth/authorize?' + q);
  res.end();
};
