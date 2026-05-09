import 'server-only';

import OpenAI from 'openai';

let client: OpenAI | null = null;

export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5';

export function isOpenAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  client ??= new OpenAI({ apiKey });
  return client;
}
