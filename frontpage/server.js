// frontpage/server.js
const express = require('express');
const path = require('path');
const app = express();

// 服务静态文件
app.use(express.static(path.join(__dirname, 'dist')));

// 所有路由都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});