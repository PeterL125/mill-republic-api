import { useState } from 'react';

function App() {
  const [message] = useState('网站构建成功！前端已连接。');
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Mill Republic 追踪系统</h1>
      <p>{message}</p>
      <p>这是一个临时界面，用于验证构建。下一步将恢复完整功能。</p>
    </div>
  );
}
// 以下这行导出语句至关重要，绝对不能少！
export default App;
