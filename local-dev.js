const { fetchTargetApi } = require('./core.js');

// 从系统环境变量读取配置
const TARGET_API_URL = process.env.TARGET_API_URL;
const API_TOKEN = process.env.API_TOKEN || "";
const REQUEST_TIMEOUT = Number(process.env.REQUEST_TIMEOUT) || 10;

if (!TARGET_API_URL) {
  const errorMsg = "local-env: env TARGET_API_URL is required";
  console.error(errorMsg);
  throw new Error(errorMsg);
}

// 引入Nodejs的内置http模块
const http = require("http");

// 创建服务器
const server = http.createServer(function (request, response) {
  switch (request.url) {
    case "/":
      response.setHeader("Content-Type", "text/plain;charset=utf-8");
      response.end("ok");
      break;
    case "/api":
      fetchTargetApi(TARGET_API_URL, API_TOKEN, REQUEST_TIMEOUT).then((result) => {
        response.setHeader("Content-Type", "application/json;charset=utf-8");
        response.end(result);
      }).catch((err) => {
        response.statusCode = 500;
        response.setHeader("Content-Type", "text/plain;charset=utf-8");
        response.end(err.message);
      });
      break;
    default:
        response.writeHead(404, { "Content-Type": "text/plain;charset=utf-8" });
        response.end("404");
        break;
  }
});

// 设置监听端口
server.listen(9000, function () {
  console.log("local-dev: server is running: http://127.0.0.1:9000");
  console.log("local-dev: server(api) is running: http://127.0.0.1:9000/api");
});
