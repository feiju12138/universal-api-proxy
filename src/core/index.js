/**
 * 向目标API服务器发送请求并返回解析后的JSON响应
 * @param {string} TARGET_API_URL - 目标API地址
 * @param {string} [API_TOKEN] - API鉴权Token（可选）
 * @param {number|string} [REQUEST_TIMEOUT=10] - 请求超时时间（秒）
 * @returns {Promise<Object>} 解析后的响应JSON对象
 * @throws {Error} 请求失败/超时/解析失败时抛出异常（统一提示API请求失败）
 */
async function fetchTargetApi(TARGET_API_URL, API_TOKEN, REQUEST_TIMEOUT = 10) {

  // 入参校验
  if (!TARGET_API_URL) {
    const errorMsg = "env TARGET_API_URL is required";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // 格式化超时时间（确保为数字）
  const timeout = parseInt(REQUEST_TIMEOUT, 10) || 10;

  // 构造请求头
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  if (API_TOKEN) {
    headers.set("Authorization", `Bearer ${API_TOKEN}`);
  }

  // 发送请求（带超时控制）
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout * 1000);

  try {
    const response = await fetch(TARGET_API_URL, { method: "GET", headers: headers, signal: controller.signal, redirect: "follow" });
    clearTimeout(timeoutId);
    if (response.ok) {
      return response.text();
    }

    const errorMsg = `api response error: ${response.status}`;
    console.error(errorMsg)
    return errorMsg;
  } catch (err) {
    clearTimeout(timeoutId);
    const errorMsg = `api request error: ${err}`;
    console.error(errorMsg)
    return errorMsg;
  }
}

module.exports = { fetchTargetApi };
