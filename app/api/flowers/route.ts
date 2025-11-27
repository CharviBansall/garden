import { NextRequest, NextResponse } from 'next/server';

export type Flower = {
  id: string;
  imageUrl: string; // data URL for now
  x: number; // 0–100 (% across)
  y: number; // 0–100 (% across)
  createdAt: string;
};

// In-memory array for flowers (will reset on reload)
const flowers: Flower[] = [];

// Moderation stub function
async function isBadImage(image: string): Promise<boolean> {
  // TODO: connect to moderation API in future
  return false;
}

export async function GET() {
  return NextResponse.json(flowers);
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (
      !image ||
      typeof image !== 'string' ||
      !image.startsWith('data:image/png;base64,') ||
      image.length > 1_000_000 // ~1MB
    ) {
      return NextResponse.json({ status: 'blocked' }, { status: 400 });
    }

    if (await isBadImage(image)) {
      return NextResponse.json({ status: 'blocked' });
    }

    // Random x/y within specified bounds
    const x = Math.floor(Math.random() * (90 - 10 + 1)) + 10;
    const y = Math.floor(Math.random() * (80 - 20 + 1)) + 20;
    const flower: Flower = {
      id: Math.random().toString(36).slice(2),
      imageUrl: image,
      x,
      y,
      createdAt: new Date().toISOString(),
    };
    flowers.push(flower);
    return NextResponse.json({ status: 'ok', flower });
  } catch (e) {
    return NextResponse.json({ status: 'blocked' }, { status: 400 });
  }
}
