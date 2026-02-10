export default async function handler(req, res) {
  // 方案一：允许所有域名访问（最简单，适合测试阶段）
  const allowedOrigins = '*';
  const origin = req.headers?.origin || req.headers?.Origin;

  // 统一的CORS设置逻辑
  if (allowedOrigins === '*') {
    // 如果是通配符，直接允许所有
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)) {
    // 如果是数组，且来源在列表中，则允许该特定来源
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // 如果来源不在列表中，则不设置CORS头，浏览器会阻止请求

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
