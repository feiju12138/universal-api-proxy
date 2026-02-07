/**
 * 向目标API服务器发送请求并返回解析后的JSON响应
 * @param {string} TARGET_API_URL - 目标API地址
 * @param {string} [API_TOKEN] - API鉴权Token（可选）
 * @param {number|string} [REQUEST_TIMEOUT=10] - 请求超时时间（秒）
 * @returns {Promise<Object>} 解析后的响应JSON对象
 * @throws {Error} 请求失败/超时/解析失败时抛出异常（统一提示API请求失败）
 */
async function fetchTargetApi(TARGET_API_URL, API_TOKEN, REQUEST_TIMEOUT = 10) {

  let error = null;

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
  headers.set('Content-Type', 'application/json');
  if (API_TOKEN) {
    headers.set('Authorization', `Bearer ${API_TOKEN}`);
  }

  // 发送请求（带超时控制）
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout * 1000);

  try {
    const response = await fetch(TARGET_API_URL, {
      method: 'GET',
      headers: headers,
      signal: controller.signal,
      redirect: 'follow'
    });
    clearTimeout(timeoutId);

    // 校验响应状态（非2xx视为失败）
    if (!response.ok) {
      error = {
        message: "api request error",
        payload: response.status
      };
    }

    // 解析响应并返回
    return await response.text();
  } catch (e) {
    clearTimeout(timeoutId); // 确保超时后清理定时器
    error = {
      message: "api request error",
      payload: e
    };
  }

  if (!error) {
    if (!error.payload) {
      console.error(`${error.message}: ${error.payload}`);
    } else {
      console.error(`${error.message}`);
    }
    throw new Error(error.message);
  }
}

// 若需适配Node.js/模块化环境，可添加导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchTargetApi };
}
