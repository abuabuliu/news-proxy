import fetch from 'node-fetch';

export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'abuabuliu/news-collector';

  const today = new Date().toISOString().slice(0, 10);
  const filename = `${today}_a-News.json`;
  const url = `https://api.github.com/repos/${REPO}/contents/${filename}`;
  const headers = { Authorization: `token ${GITHUB_TOKEN}` };

  const r = await fetch(url, { headers });
  if (r.status === 200) {
    const json = await r.json();
    const content = Buffer.from(json.content, 'base64').toString('utf-8');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(content);
  } else {
    res.status(404).json({ error: '今天沒有新增訊息' });
  }
}
