const express = require("express");
const { fetchTargetApi } = require("../core.js");

// 创建 Express 实例
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 统一配置响应头（含跨域，按需开启）
app.use((req, res, next) => {
  // 允许跨域，生产环境可替换为指定域名
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // 处理预检请求
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// 根路由
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send("ok");
});

// api路由
app.get("/api", async (req, res) => {
  // 读取环境变量
  const TARGET_API_URL = process.env.TARGET_API_URL;
  const API_TOKEN = process.env.API_TOKEN || "";
  const REQUEST_TIMEOUT = Number(process.REQUEST_TIMEOUT) || 10;

  // 校验必填配置
  if (!TARGET_API_URL) {
    const errorMsg = "vercel: env TARGET_API_URL is required";
    console.error(errorMsg);
    return res.status(500).set("Content-Type", "text/plain; charset=utf-8").send(errorMsg);
  }

  try {
    // 调用核心接口方法
    const result = await fetchTargetApi(TARGET_API_URL, API_TOKEN, REQUEST_TIMEOUT);
    // 返回JSON格式数据
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.send(result);
  } catch (err) {
    // 异常处理
    console.error("Request error:", err);
    res.status(500).set("Content-Type", "text/plain; charset=utf-8").send(err.message || "Server Internal Error");
  }
});

// 404路由
app.use((req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(404).send("404");
});

// Vercel 无服务器函数导出规范
module.exports = app;
