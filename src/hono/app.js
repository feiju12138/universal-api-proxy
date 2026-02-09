import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchTargetApi } from "../core/index";

const app = new Hono();
app.use(cors())

app.get("/", (c) => {
  return c.text("ok");
});

app.get("/api", async (c) => {
  // 读取环境变量
  const TARGET_API_URL = c.env.TARGET_API_URL;
  const API_TOKEN = c.env.API_TOKEN || "";
  const REQUEST_TIMEOUT = Number(c.env.REQUEST_TIMEOUT) || 10;

  // 校验必填配置
  if (!TARGET_API_URL) {
    c.status(500);
    c.header("Content-Type", "text/plain; charset=utf-8")
    return c.text("hono: env TARGET_API_URL is required");
  }

  try {
    const result = await fetchTargetApi(TARGET_API_URL, API_TOKEN, REQUEST_TIMEOUT);
    c.header("Content-Type", "application/json; charset=utf-8");
    return c.text(result);
  } catch (err) {
    c.status(500);
    c.header("Content-Type", "text/plain; charset=utf-8");
    return c.text(err || "hono: Server Internal Error");
  }
});

module.exports = app;
