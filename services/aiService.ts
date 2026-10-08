import api from "./api";
import useAuthStore from "../store/authStore";

export interface AskTutorPayload {
  userQuery: string;
  gradeLevel?: string;
  subject?: string;
  stream?: string;
  preferredLanguage?: string;
  conversationHistory?: Array<{ sender?: string; role?: string; text?: string; content?: string }>;
}

export interface TutorResponseData {
  reply: string;
  hint?: string;
  suggestedFollowUps?: string[];
}

export const askAITutor = (payload: AskTutorPayload): Promise<TutorResponseData> =>
  api.post("/ai/ask-tutor/", payload).then((res) => res.data?.data || res.data);

export const streamAITutor = async (
  payload: AskTutorPayload,
  onChunk: (chunk: string) => void,
  onDone: (hint?: string) => void
): Promise<void> => {
  const baseURL = (api.defaults.baseURL || "http://127.0.0.1:8000/api").replace(/\/$/, "");
  const response = await fetch(`${baseURL}/ai/ask-tutor-stream/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(useAuthStore.getState().token ? { Authorization: `Bearer ${useAuthStore.getState().token}` } : {})
    },
    body: JSON.stringify(payload)
  });

  if (!response.body) {
    const fallback = await askAITutor(payload);
    onChunk(fallback.reply);
    onDone(fallback.hint);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data: ")) {
        try {
          const json = JSON.parse(trimmed.replace("data: ", ""));
          if (json.chunk) {
            onChunk(json.chunk);
          }
          if (json.done) {
            onDone(json.hint);
            return;
          }
        } catch {
        }
      }
    }
  }

  onDone();
};
