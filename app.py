import os
import json
from urllib import request, error
from flask import Flask, jsonify, Response

app = Flask(__name__)

@app.route('/')
def root():
    return "ok", 200

@app.route('/api')
def forward_api():
    """
    通用API转发接口
    从环境变量读取配置，转发请求并完整返回上游响应
    """
    try:
        # ===================== 从环境变量读取配置 =====================
        # 上游目标API地址（必填）
        TARGET_API_URL = os.getenv("TARGET_API_URL")
        # 认证令牌（可选，根据上游API要求配置）
        API_TOKEN = os.getenv("API_TOKEN")
        # 请求超时时间（秒，默认10秒，适配Vercel限制）
        REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "10"))

        # 校验必填配置
        if not TARGET_API_URL:
            return jsonify({
                "code": 400,
                "msg": "环境变量配置错误：未设置 TARGET_API_URL"
            }), 400

        # ===================== 构造转发请求 =====================
        headers = {"Content-Type": "application/json"}
        # 如果配置了令牌，自动添加认证请求头（适配Bearer认证格式）
        if API_TOKEN:
            headers["Authorization"] = f"Bearer {API_TOKEN}"

        # 构造GET请求（适配UptimeRobot等通用API，可根据需求修改请求方法）
        req = request.Request(
            url=TARGET_API_URL,
            headers=headers,
            method='GET'
        )

        # ===================== 发送请求并获取响应 =====================
        with request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
            # 读取原始响应内容
            raw_data = resp.read()
            # 获取上游接口原始状态码
            status_code = resp.getcode()

            # 尝试解析为JSON，成功则返回JSON格式，失败则返回原始文本
            try:
                json_data = json.loads(raw_data.decode('utf-8'))
                return jsonify(json_data), status_code
            except json.JSONDecodeError:
                # 非JSON响应，原样返回
                return Response(
                    response=raw_data,
                    status=status_code,
                    content_type=resp.headers.get('Content-Type', 'text/plain')
                )

    # ===================== 异常处理 =====================
    except error.HTTPError as e:
        # 上游返回HTTP错误，原样透传错误码和错误信息
        error_msg = e.read().decode('utf-8', errors='replace')
        return jsonify({
            "code": e.code,
            "msg": f"上游API HTTP错误",
            "detail": error_msg
        }), e.code
    except error.URLError as e:
        # 网络连接异常
        return jsonify({
            "code": 500,
            "msg": "网络请求失败",
            "detail": str(e)
        }), 500
    except ValueError as e:
        # 配置参数格式错误
        return jsonify({
            "code": 400,
            "msg": "配置参数异常",
            "detail": str(e)
        }), 400
    except Exception as e:
        # 其他未知异常
        return jsonify({
            "code": 500,
            "msg": "服务内部异常",
            "detail": str(e)
        }), 500

# 本地调试入口，Vercel环境不会执行
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000, debug=True)
