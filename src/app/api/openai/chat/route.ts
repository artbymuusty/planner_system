import { NextResponse } from 'next/server';
import { getOpenAIClient, isOpenAIConfigured, OPENAI_MODEL } from '@/lib/openai';

export const runtime = 'nodejs';

const HEADER_KEY = 'x-openai-key';

export async function GET(request: Request) {
  const headerKey = request.headers.get(HEADER_KEY)?.trim() || '';
  return NextResponse.json({
    configured: Boolean(headerKey) || isOpenAIConfigured(),
    model: OPENAI_MODEL,
  });
}

export async function POST(request: Request) {
  const headerKey = request.headers.get(HEADER_KEY)?.trim() || '';
  const hasKey = Boolean(headerKey) || isOpenAIConfigured();

  if (!hasKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured' },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const input = typeof body?.input === 'string' ? body.input.trim() : '';

  if (!input) {
    return NextResponse.json(
      { error: 'input is required' },
      { status: 400 }
    );
  }

  try {
    const response = await getOpenAIClient(headerKey || undefined).responses.create({
      model: OPENAI_MODEL,
      input,
    });

    return NextResponse.json({
      text: response.output_text,
      model: OPENAI_MODEL,
      keySource: headerKey ? 'user' : 'env',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OpenAI request failed';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
