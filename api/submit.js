// Saves one response per account; submitting again replaces it. The table has no public policies, so only this function (service role) can write to it.
const { identify, supabaseHeaders, env } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  try {
    const who = await identify(req);
    if (!who) return res.status(401).json({ error: 'login' });

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const answers = body.answers;
    if (!answers || typeof answers !== 'object' || Array.isArray(answers) || JSON.stringify(answers).length > 10000) {
      return res.status(400).json({ error: 'answers' });
    }
    // the age check and the required consent are kept with the response as the record of consent
    if (answers.over14 !== true || answers.consent !== true) return res.status(400).json({ error: 'consent' });
    // a name is kept only with a prize entry (to confirm the winner), as 2–30 characters.
    // pages loaded before the name field existed send no prize_name key; their entry stands on the phone alone
    const name = typeof answers.prize_name === 'string' ? answers.prize_name.replace(/\s+/g, ' ').trim() : '';
    if (answers.prize_entry && 'prize_name' in answers) {
      const len = Array.from(name).length;
      if (len < 2 || len > 30) return res.status(400).json({ error: 'name' });
      answers.prize_name = name;
    } else {
      answers.prize_name = '';
    }
    // a phone number is kept only with a prize or launch-alert consent, and only as 10–11 digits
    const phone = String(answers.phone || '').replace(/\D/g, '');
    if (answers.prize_entry || answers.launch_alert) {
      if (!/^01\d{8,9}$/.test(phone)) return res.status(400).json({ error: 'phone' });
      answers.phone = phone;
    } else {
      answers.phone = '';
    }

    // upsert on the respondent key: an edit overwrites the answers, created_at keeps the first submit time
    const r = await fetch(env('SUPABASE_URL') + '/rest/v1/survey_responses', {
      method: 'POST',
      headers: supabaseHeaders({ 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ respondent: who.respondent, provider: who.provider, answers }),
    });
    if (!r.ok) throw new Error('upsert ' + r.status + ' ' + (await r.text()));
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('submit', e);
    res.status(500).json({ error: 'server' });
  }
};
