import api, { authenticatedFetch } from "./api";

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
  const response = await authenticatedFetch("/ai/ask-tutor-stream/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.message || errorBody?.error || `AI tutor request failed (${response.status}).`
    );
  }

  if (!response.body) {
    const fallback = await askAITutor(payload);
    onChunk(fallback.reply);
    onDone(fallback.hint);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let completed = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data: ")) {
        let json: Record<string, unknown>;
        try {
          json = JSON.parse(trimmed.slice(6));
        } catch {
          continue;
        }
        if (typeof json.error === "string") throw new Error(json.error);
        if (typeof json.chunk === "string" && json.chunk) {
          onChunk(json.chunk);
        }
        if (json.done) {
          completed = true;
          onDone(typeof json.hint === "string" ? json.hint : undefined);
          return;
        }
      }
    }
  }

  if (!completed) throw new Error("The AI tutor response ended before completion.");
};
