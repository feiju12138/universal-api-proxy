const { fetchTargetApi } = require('../core.js');

/**
 * Vercel 无服务器函数处理入口
 * @param {import('http').IncomingMessage} req - 请求对象
 * @param {import('http').ServerResponse} res - 响应对象
 */
module.exports = async (req, res) => {
  // 从Vercel读取配置
  const TARGET_API_URL = process.env.TARGET_API_URL;
  const API_TOKEN = process.env.API_TOKEN || "";
  const REQUEST_TIMEOUT = Number(process.env.REQUEST_TIMEOUT) || 10;

  if (!TARGET_API_URL) {
    const errorMsg = "vercel: env TARGET_API_URL is required";
    console.error(errorMsg);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.statusCode = 500;
    return res.end(errorMsg);
  }

  // 2. 路由匹配处理（匹配vercel.json中配置的路由规则）
  const { url } = req;
  try {
    switch (url) {
      case "/":
        // 根路由响应
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("ok");
        break;

      case "/api":
        // 代理API路由，调用核心方法
        const result = await fetchTargetApi(TARGET_API_URL, API_TOKEN, REQUEST_TIMEOUT);
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(result);
        break;

      default:
        // 404 未找到路由
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("404");
        break;
    }
  } catch (err) {
    // 全局异常捕获，统一返回错误信息
    console.error("Request error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(err.message || "Server Internal Error");
  }
};
