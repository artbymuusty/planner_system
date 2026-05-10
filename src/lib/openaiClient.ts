/**
 * Client-side OpenAI köprüsü.
 * Settings panelinden kaydedilen `planner_openai_key`'i `localStorage`'dan
 * okur ve `/api/openai/chat` route'una `x-openai-key` header'ı olarak iletir.
 *
 * Browser-only: bu modül "server-only" değil; sadece client component'lerden
 * import edilmelidir. SSR sırasında çağrılırsa key olmadan istek gider.
 */

export const OPENAI_KEY_STORAGE = 'planner_openai_key';

export function getStoredOpenAIKey(): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(OPENAI_KEY_STORAGE)?.trim() || '';
  } catch {
    return '';
  }
}

export function hasStoredOpenAIKey(): boolean {
  return Boolean(getStoredOpenAIKey());
}

export interface OpenAIChatResponse {
  text: string;
  model: string;
  keySource?: 'user' | 'env';
}

export interface OpenAIChatError {
  error: string;
}

/**
 * /api/openai/chat'e POST atar.
 * `apiKey` parametresi verilirse onu, verilmezse localStorage'daki key'i kullanır.
 * Hiçbiri yoksa header gönderilmez (server env'e fallback).
 */
export async function openaiChat(
  input: string,
  opts: {
    apiKey?: string;
    signal?: AbortSignal;
    images?: string[];
    responseFormat?: 'photo_planner_plan';
  } = {}
): Promise<OpenAIChatResponse> {
  const key = (opts.apiKey ?? getStoredOpenAIKey()).trim();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (key) headers['x-openai-key'] = key;

  const res = await fetch('/api/openai/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      input,
      images: opts.images,
      responseFormat: opts.responseFormat,
    }),
    signal: opts.signal,
  });

  const data = (await res.json().catch(() => ({}))) as Partial<OpenAIChatResponse & OpenAIChatError>;

  if (!res.ok) {
    throw new Error(data.error || `OpenAI request failed (${res.status})`);
  }

  return {
    text: data.text || '',
    model: data.model || '',
    keySource: data.keySource,
  };
}

/**
 * /api/openai/chat'e GET atar — key konfigüre mi kontrolü.
 */
export async function openaiStatus(
  opts: { apiKey?: string } = {}
): Promise<{ configured: boolean; model: string; keySource?: 'user' | 'env' | null }> {
  const key = (opts.apiKey ?? getStoredOpenAIKey()).trim();
  const headers: Record<string, string> = {};
  if (key) headers['x-openai-key'] = key;

  const res = await fetch('/api/openai/chat', { headers });
  if (!res.ok) return { configured: false, model: '' };
  return res.json();
}
