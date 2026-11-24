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
  // 已更新为新 Base 的 APP_TOKEN 和 TABLE_ID
  const APP_TOKEN = 'MYdubIoIZafJ4nsV1wxjB0AAplc';
  const TABLE_ID = 'tblr8Jya9ugrXiKt';

  try {
    const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET })
    });
    const tokenData = await tokenRes.json();
    if (tokenData.code !== 0) throw new Error(`获取Token失败: ${JSON.stringify(tokenData)}`);
    const accessToken = tokenData.tenant_access_token;

    // 分页读取全部记录：飞书/Lark 接口每页最多 500 条，超过时返回 has_more + page_token。
    // 之前只请求了一页（page_size=100），第 101 条以后的记录永远不会返回给前端。
    const items = [];
    let pageToken = '';
    let pages = 0;
    do {
      const params = new URLSearchParams({ page_size: '500' });
      if (pageToken) params.set('page_token', pageToken);
      const recordsRes = await fetch(
        `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const recordsData = await recordsRes.json();
      if (recordsData.code !== 0) throw new Error(`获取数据失败: ${JSON.stringify(recordsData)}`);
      items.push(...(recordsData.data?.items || []));
      pageToken = recordsData.data?.has_more ? recordsData.data.page_token : '';
      pages += 1;
    } while (pageToken && pages < 50); // 安全上限：最多 50 页（25,000 条）

    // 保持原来的返回结构（data.items），前端不用改
    res.status(200).json({
      success: true,
      data: { items, total: items.length, has_more: false }
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || '服务器内部错误'
    });
  }
}
