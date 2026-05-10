import { NextResponse } from 'next/server';
import { getOpenAIClient, isOpenAIConfigured, OPENAI_MODEL } from '@/lib/openai';

export const runtime = 'nodejs';

const HEADER_KEY = 'x-openai-key';
const MAX_IMAGES = 3;
const DATA_IMAGE_RE = /^data:image\/(?:png|jpe?g|webp|gif);base64,/i;

const photoPlannerSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'items', 'medicines', 'expenses', 'warnings'],
  properties: {
    summary: {
      type: 'string',
      description: 'Fotoğraftan çıkarılan planner önerisinin Türkçe kısa özeti.',
    },
    warnings: {
      type: 'array',
      items: { type: 'string' },
      description: 'Eksik veya emin olunmayan tarih/saat gibi notlar.',
    },
    items: {
      type: 'array',
      maxItems: 12,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'date', 'kind', 'category', 'importance', 'allDay'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          date: {
            type: 'string',
            description: 'YYYY-MM-DD formatında tarih.',
          },
          startTime: {
            type: 'string',
            description: 'HH:MM formatında başlangıç saati. Bilinmiyorsa boş string.',
          },
          endTime: {
            type: 'string',
            description: 'HH:MM formatında bitiş saati. Bilinmiyorsa boş string.',
          },
          kind: {
            type: 'string',
            enum: ['event', 'task', 'goal'],
          },
          category: {
            type: 'string',
            enum: ['personal', 'work', 'study', 'health', 'other'],
          },
          importance: {
            type: 'string',
            enum: ['high', 'medium', 'low'],
          },
          estimatedMin: {
            type: 'number',
            description: 'Görev için tahmini dakika. Bilinmiyorsa 30.',
          },
          allDay: {
            type: 'boolean',
            description: 'Saat fotoğrafta net değilse true.',
          },
          sourceNote: {
            type: 'string',
            description: 'Bu önerinin fotoğrafta hangi satır/alandan geldiğine dair kısa not.',
          },
        },
      },
    },
    medicines: {
      type: 'array',
      maxItems: 8,
      description: 'Fotoğrafta ilaç kutusu/reçete/ilaç kullanım bilgisi varsa İlaçlarım modülüne eklenecek ilaçlar.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'dosage', 'frequency', 'countPerDose', 'boxSize', 'duration'],
        properties: {
          name: {
            type: 'string',
            description: 'İlaç adı. Örn: Parol, Augmentin.',
          },
          dosage: {
            type: 'string',
            description: 'Dozaj/açıklama. Örn: 500mg, 1000mg tablet, tok karnına.',
          },
          frequency: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['Sabah', 'Öğle', 'Akşam', 'Gece'],
            },
            description: 'Kullanım vakitleri. Emin değilsen Sabah seç.',
          },
          countPerDose: {
            type: 'number',
            description: 'Her kullanımda kaç adet alınacağı. Bilinmiyorsa 1.',
          },
          boxSize: {
            type: 'number',
            description: 'Kutudaki toplam adet. Bilinmiyorsa 20.',
          },
          duration: {
            type: 'number',
            description: 'Kaç gün kullanılacağı. Bilinmiyorsa 10.',
          },
          sourceNote: {
            type: 'string',
            description: 'Bu ilaç önerisinin fotoğrafta nereden çıkarıldığına dair kısa not.',
          },
        },
      },
    },
    expenses: {
      type: 'array',
      maxItems: 20,
      description: 'Fotoğrafta fiş/fatura/ödeme belgesi varsa Bütçe > Harcamalar modülüne eklenecek harcamalar.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'amount', 'category', 'date'],
        properties: {
          name: {
            type: 'string',
            description: 'Harcama açıklaması. Fişte mağaza adı varsa onu kullan; kalem kalem çıkarmak daha uygunsa ürün adını kullan.',
          },
          amount: {
            type: 'number',
            description: 'TL cinsinden tutar. Virgüllü kuruşları ondalık sayı yap.',
          },
          category: {
            type: 'string',
            enum: ['Yiyecek', 'Ulaşım', 'Sağlık', 'Eğlence', 'Giyim', 'Fatura', 'Diğer'],
          },
          date: {
            type: 'string',
            description: 'YYYY-MM-DD formatında fiş tarihi. Belirsizse bugünün tarihi.',
          },
          sourceNote: {
            type: 'string',
            description: 'Bu harcamanın fotoğrafta nereden çıkarıldığına dair kısa not.',
          },
        },
      },
    },
  },
};

export async function GET(request: Request) {
  const headerKey = request.headers.get(HEADER_KEY)?.trim() || '';
  const envConfigured = isOpenAIConfigured();
  return NextResponse.json({
    configured: Boolean(headerKey) || envConfigured,
    model: OPENAI_MODEL,
    keySource: headerKey ? 'user' : envConfigured ? 'env' : null,
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
  const rawImages: unknown[] = Array.isArray(body?.images) ? body.images : [];
  const images = rawImages
        .filter((url: unknown): url is string => typeof url === 'string' && DATA_IMAGE_RE.test(url))
        .slice(0, MAX_IMAGES);
  const responseFormat = body?.responseFormat === 'photo_planner_plan'
    ? 'photo_planner_plan'
    : null;

  if (!input) {
    return NextResponse.json(
      { error: 'input is required' },
      { status: 400 }
    );
  }

  try {
    const apiInput = images.length > 0
      ? [
          {
            role: 'user' as const,
            content: [
              { type: 'input_text' as const, text: input },
              ...images.map(imageUrl => ({
                type: 'input_image' as const,
                image_url: imageUrl,
                detail: 'auto' as const,
              })),
            ],
          },
        ]
      : input;

    const response = await getOpenAIClient(headerKey || undefined).responses.create({
      model: OPENAI_MODEL,
      input: apiInput,
      ...(responseFormat
        ? {
            text: {
              format: {
                type: 'json_schema' as const,
                name: 'photo_planner_plan',
                strict: false,
                schema: photoPlannerSchema,
              },
            },
          }
        : {}),
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
