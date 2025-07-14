import fetch from 'node-fetch';

// 今天的新聞 https://news-proxy-2.vercel.app/api/today_news
// 昨天的新聞 https://news-proxy-2.vercel.app/api/today_news?date=2025-07-13
// 指定日期的新聞 https://news-proxy-2.vercel.app/api/today_news?date=2025-07-12
// 讀取今天的新聞
//let todayURL = "https://news-proxy-2.vercel.app/api/today_news"
// 讀取昨天的新聞
//let yesterdayURL = "https://news-proxy-2.vercel.app/api/today_news?date=2025-07-13"
// 讀取指定日期的新聞
//let specificDateURL = "https://news-proxy-2.vercel.app/api/today_news?date=2025-07-12"

export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'abuabuliu/news-collector';

  // 從查詢參數取得日期，如果沒有提供則使用今天的日期
  const { date } = req.query;
  const targetDate = date || new Date().toISOString().slice(0, 10);
  
  const filename = `${targetDate}_a-News.json`;
  const url = `https://api.github.com/repos/${REPO}/contents/${filename}`;
  const headers = { Authorization: `token ${GITHUB_TOKEN}` };

  try {
    const r = await fetch(url, { headers });
    if (r.status === 200) {
      const json = await r.json();
      const content = Buffer.from(json.content, 'base64').toString('utf-8');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(content);
    } else {
      // 根據是否有指定日期來回傳不同的錯誤訊息
      if (date) {
        res.status(404).json({ error: `${date} 沒有新增訊息` });
      } else {
        res.status(404).json({ error: '今天沒有新增訊息' });
      }
    }
  } catch (error) {
    console.error('API 錯誤:', error);
    res.status(500).json({ error: '讀取檔案時發生錯誤' });
  }
} 
