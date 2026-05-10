import 'server-only';

import OpenAI from 'openai';

let envClient: OpenAI | null = null;

export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export function isOpenAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

/**
 * OpenAI client.
 *  - `apiKey` verilirse (örn. request header'ından gelen kullanıcı key'i)
 *    her seferinde yeni bir client oluşturulur, cache edilmez.
 *  - Verilmezse `process.env.OPENAI_API_KEY` kullanılır ve client cache'lenir.
 */
export function getOpenAIClient(apiKey?: string) {
  if (apiKey && apiKey.trim()) {
    return new OpenAI({ apiKey: apiKey.trim() });
  }

  const envKey = process.env.OPENAI_API_KEY;
  if (!envKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  envClient ??= new OpenAI({ apiKey: envKey });
  return envClient;
}
