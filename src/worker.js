import { fetchTargetApi } from "./core.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 允许跨域，生产环境可替换为指定域名
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "text/plain; charset=utf-8"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    try {
      switch (true) {
        // root
        case url.pathname === "/" && request.method === "GET":
          corsHeaders["Content-Type"] = "text/plain; charset=utf-8";
          return new Response("ok", { headers: corsHeaders });

        // api
        case url.pathname === "/api" && request.method === "GET": {
          // 读取环境变量
          const TARGET_API_URL = env.TARGET_API_URL;
          const API_TOKEN = env.API_TOKEN || "";
          const REQUEST_TIMEOUT = Number(env.REQUEST_TIMEOUT) || 10;

          // 校验必填环境变量
          if (!TARGET_API_URL) {
            const errorMsg = "cloudflare: env TARGET_API_URL is required";
            console.error(errorMsg);
            corsHeaders["Content-Type"] = "text/plain; charset=utf-8";
            return new Response(errorMsg, { status: 500, headers: corsHeaders });
          }

          try {
            // 调用核心方法
            const result = await fetchTargetApi(TARGET_API_URL, API_TOKEN, REQUEST_TIMEOUT);
            // 返回JSON格式数据
            corsHeaders["Content-Type"] = "application/json; charset=utf-8";
            return new Response(result, { status: 200, headers: corsHeaders });
          } catch (err) {
            console.error("Request error:", err);
            corsHeaders["Content-Type"] = "text/plain; charset=utf-8";
            return new Response(err.message || "cloudflare: Server Internal Error", { status: 500, headers: corsHeaders });
          }
        }

        // 404
        default:
          return new Response("404", { status: 404, headers: corsHeaders });
      }
    } catch (err) {
      // 全局兜底异常捕获
      const errorMsg = "cloudflare: env TARGET_API_URL is required";
      console.error(errorMsg);
      corsHeaders["Content-Type"] = "text/plain; charset=utf-8";
      return new Response(err.message || "cloudflare: Global Server Internal Error", { status: 500, headers: corsHeaders });
    }
  }
};
