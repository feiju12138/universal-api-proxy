const app = require("./index.js");

// 腾讯云云函数，只能监听 9000 端口
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server start on http://127.0.0.1:${PORT}`);
  console.log(`Api Server start on http://127.0.0.1:${PORT}/api`);
});
