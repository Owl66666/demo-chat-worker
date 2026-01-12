export default {
  async fetch(request, env) {

    // ===== 1️⃣ 处理 CORS 预检 =====
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      })
    }

    // ===== 2️⃣ 只允许 POST =====
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
    }

    // ===== 3️⃣ 读取网页发来的数据 =====
    const { message } = await request.json()

    // ===== 4️⃣ 调用 DeepSeek =====
    const resp = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "你是一个网页里的聊天助手, 回答的内容尽可能简短, 以便于快速回答" },
          { role: "user", content: message }
        ]
      })
    })

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      }
    });
  }
}
