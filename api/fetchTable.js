`// 文件：api/fetchTable.js`
`export default async function handler(request, response) {`
  `// 1. 设置跨域，允许你的Lovable域名访问`
  `response.setHeader('Access-Control-Allow-Origin', 'https://track-mill-republic.lovable.app');`
  `response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');`

  `// 2. 从环境变量读取你的飞书凭证（需在Vercel项目设置中配置）`
  `const APP_ID = process.env.FEISHU_APP_ID;`
  `const APP_SECRET = process.env.FEISHU_APP_SECRET;`
  `// ！！！重要：请从你的表格URL中手动提取并替换下面的值 ！！！`
  `const APP_TOKEN = 'HjAdbGuycaoKvBswXuvjdcdPpcf'; // 这是你URL中 base/ 后面的部分`
  `const TABLE_ID = 'tblUcLcfmpy7B7IP'; // 这是你URL中 table= 后面的部分`

  `try {`
    `// 3. 获取飞书访问令牌 (tenant_access_token)`
    `const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {`
      `method: 'POST',`
      `headers: { 'Content-Type': 'application/json' },`
      `body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET })`
    `});`
    `const tokenData = await tokenRes.json();`
    `if (tokenData.code !== 0) throw new Error(获取Token失败: ${JSON.stringify(tokenData)});`
    `const accessToken = tokenData.tenant_access_token;`

    // 4. 调用飞书API，获取表格数据（这里获取前100条，可根据需要调整）
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
    
    // 5. 将飞书数据返回给前端
    response.status(200).json({
      success: true,
      data: recordsData.data
    });

  `} catch (error) {`
    `console.error('API Error:', error);`
    `response.status(500).json({`
      `success: false,`
      `message: error.message || '服务器内部错误'`
    `});`
  `}`
`}`
