const app = require("./src/index.js");

// 配置本地服务端口
const PORT = process.env.PORT || 9000;

// 调用 listen 启动服务
app.listen(PORT, () => {
  console.log(`本地开发服务启动成功：`);
  console.log(`根路径：http://127.0.0.1:${PORT}`);
  console.log(`代理接口：http://127.0.0.1:${PORT}/api`);
});
