import { openAiApi } from "../api";

export async function generateJobDescription(prompt: string, apiKey: string) {  
  const resource = `/completions`;
  const body = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  try {
    const response = await openAiApi.post(resource, body, {
      headers,
    });

    return response;
  } catch (error: any) {
    throw Error(error.response.data.error.message);
  }
}
