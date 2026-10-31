// Tells the survey page who is logged in and whether they have already answered (with their answers, so they can edit them).
const { identify, savedAnswers } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const who = await identify(req);
    if (!who) return res.status(200).json({ loggedIn: false });
    const answers = await savedAnswers(who.respondent);
    res.status(200).json({ loggedIn: true, provider: who.provider, name: who.name, done: !!answers, answers });
  } catch (e) {
    console.error('me', e);
    res.status(500).json({ error: 'server' });
  }
};
