const { fetchTargetApi } = require('./core.js');

// 从系统变量读取配置
const TARGET_API_URL = process.env.TARGET_API_URL;
const API_TOKEN = process.env.API_TOKEN || "";
const REQUEST_TIMEOUT = Number(process.env.REQUEST_TIMEOUT) || 10;

if (!TARGET_API_URL) {
  const errorMsg = "local-env: env TARGET_API_URL is require";
  console.error(errorMsg);
  throw new Error(errorMsg);
}

// 引入Nodejs的内置http模块
let http = require("http");

// 创建服务器
let server = http.createServer(function (request, response) {

  response.setHeader("Content-Type", "application/json;charset=utf-8");

  fetchTargetApi(TARGET_API_URL, API_TOKEN, REQUEST_TIMEOUT).then((result) => {
    response.end(result);
  }).catch((error) => {
    response.end(error);
  });

});

// 设置监听端口，默认为80端口
server.listen(80, function () {
  console.log("local-dev: server is running: http://127.0.0.1:80");
  console.log("local-dev: server(api) is running: http://127.0.0.1:80/api");
});
