const express = require("express");
const cors = require("cors");
const { fetchTargetApi } = require("../core/index");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send("ok");
});

app.get("/api", async (req, res) => {
  // 读取环境变量
  const TARGET_API_URL = process.env.TARGET_API_URL;
  const API_TOKEN = process.env.API_TOKEN || "";
  const REQUEST_TIMEOUT = Number(process.env.REQUEST_TIMEOUT) || 10;

  // 校验必填配置
  if (!TARGET_API_URL) {
    return res.status(500).set("Content-Type", "text/plain; charset=utf-8").send("express: env TARGET_API_URL is required");
  }

  try {
    const result = await fetchTargetApi(TARGET_API_URL, API_TOKEN, REQUEST_TIMEOUT);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.send(result);
  } catch (err) {
    res.status(500).set("Content-Type", "text/plain; charset=utf-8").send(err.message || "express: Server Internal Error");
  }
});

module.exports = app;
