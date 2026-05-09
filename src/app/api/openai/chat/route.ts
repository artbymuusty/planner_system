import { NextResponse } from 'next/server';
import { getOpenAIClient, isOpenAIConfigured, OPENAI_MODEL } from '@/lib/openai';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    configured: isOpenAIConfigured(),
    model: OPENAI_MODEL,
  });
}

export async function POST(request: Request) {
  if (!isOpenAIConfigured()) {
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
    const response = await getOpenAIClient().responses.create({
      model: OPENAI_MODEL,
      input,
    });

    return NextResponse.json({
      text: response.output_text,
      model: OPENAI_MODEL,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OpenAI request failed';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
