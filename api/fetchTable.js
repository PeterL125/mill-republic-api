export default async function handler(req, res) {
  // 允许你的正式域名和预览域名访问
  const allowedOrigins = [
    'https://track-mill-republic.lovable.app',
    'https://d4afd83a-1a7d-4171-ab7a-f2684f653e05.lovableproject.com'
  ];
  const origin = req.headers.get('origin');
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  const APP_ID = process.env.FEISHU_APP_ID;
  const APP_SECRET = process.env.FEISHU_APP_SECRET;
  const APP_TOKEN = 'HjAdbGuycaoKvBswXuvjdcdPpcf';
  const TABLE_ID = 'tblUcLcfmpy7B7IP';

  try {
    const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET })
    });
    const tokenData = await tokenRes.json();
    if (tokenData.code !== 0) throw new Error(`获取Token失败: ${JSON.stringify(tokenData)}`);
    const accessToken = tokenData.tenant_access_token;

    const recordsRes = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records?page_size=100`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const recordsData = await recordsRes.json();
    if (recordsData.code !== 0) throw new Error(`获取数据失败: ${JSON.stringify(recordsData)}`);

    res.status(200).json({
      success: true,
      data: recordsData.data
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || '服务器内部错误'
    });
  }
}
