import { fetchTargetApi } from "./core.js";

export default {
  async fetch(request, env, ctx) {
    // 解析请求路径、请求方法
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // 2. 统一跨域响应头（与原 Express 配置一致）
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "text/plain; charset=utf-8"
    };

    // 3. 处理 OPTIONS 预检请求（跨域必备）
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    try {
      // 4. 路由分发逻辑，等价原 Express 路由
      switch (true) {
        // 根路由 GET /
        case pathname === "/" && method === "GET":
          return new Response("ok", { headers: corsHeaders });

        // API 路由 GET /api
        case pathname === "/api" && method === "GET": {
          // 从 Workers 环境变量获取配置（替代 process.env）
          const TARGET_API_URL = env.TARGET_API_URL;
          const API_TOKEN = env.API_TOKEN || "";
          const REQUEST_TIMEOUT = Number(env.REQUEST_TIMEOUT) || 10;

          // 校验必填环境变量
          if (!TARGET_API_URL) {
            const errorMsg = "cloudflare: env TARGET_API_URL is required";
            console.error(errorMsg);
            return new Response(errorMsg, {
              status: 500,
              headers: corsHeaders
            });
          }

          try {
            // 调用核心方法，与原逻辑完全一致
            const result = await fetchTargetApi(TARGET_API_URL, API_TOKEN, REQUEST_TIMEOUT);
            // 返回 JSON 格式响应，覆盖 Content-Type
            return new Response(JSON.stringify(result), {
              status: 200,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json; charset=utf-8"
              }
            });
          } catch (err) {
            // 接口调用异常处理
            console.error("Request error:", err);
            return new Response(err.message || "Server Internal Error", {
              status: 500,
              headers: corsHeaders
            });
          }
        }

        // 默认：404 未找到（等价原 Express 404 中间件）
        default:
          return new Response("404", {
            status: 404,
            headers: corsHeaders
          });
      }
    } catch (err) {
      // 全局兜底异常捕获
      console.error("Global error:", err);
      return new Response("Server Internal Error", {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
