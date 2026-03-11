const ARK_API_KEY = "f5232c4a-ac29-4ba6-bf7f-6946f9877c72";
const MODEL_EP = "ep-20260311222553-d8ppd";

export async function callAI(prompt: string, systemPrompt?: string) {
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ARK_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL_EP,
      messages: messages,
    })
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
