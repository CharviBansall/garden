import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export type Flower = {
  id: string;
  imageUrl: string; // data URL for now
  x: number; // 0–100 (% across)
  y: number; // 0–100 (% across)
  createdAt: string;
};

const FLOWERS_KEY = 'charvis-garden:flowers';

// Function to check if two flowers would overlap
function flowersOverlap(flower1: Flower, flower2: Flower): boolean {
  const minDistanceX = 10; // Minimum 10% separation in x
  const minDistanceY = 10; // Minimum 10% separation in y

  const dx = Math.abs(flower1.x - flower2.x);
  const dy = Math.abs(flower1.y - flower2.y);

  return dx < minDistanceX && dy < minDistanceY;
}

// Moderation stub function
async function isBadImage(image: string): Promise<boolean> {
  // TODO: connect to moderation API in future
  return false;
}

export async function GET() {
  try {
    const flowers = await kv.get<Flower[]>(FLOWERS_KEY) || [];
    return NextResponse.json(flowers);
  } catch (error) {
    console.error('Failed to fetch flowers:', error);
    return NextResponse.json([]);
  }
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

    // Get current flowers from KV
    const flowers = await kv.get<Flower[]>(FLOWERS_KEY) || [];

    // Find a non-overlapping position (percentages across the full garden)
    let x: number, y: number;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      x = Math.floor(Math.random() * 60) + 20; // 20-80
      y = Math.floor(Math.random() * 50) + 25; // 25-75 (avoid top/bottom)
      attempts++;
    } while (
      attempts < maxAttempts &&
      flowers.some(existingFlower => flowersOverlap({ x, y } as Flower, existingFlower))
    );

    // If we couldn't find a spot after max attempts, place it anyway
    const flower: Flower = {
      id: Math.random().toString(36).slice(2),
      imageUrl: image,
      x,
      y,
      createdAt: new Date().toISOString(),
    };
    
    // Add flower and save to KV
    flowers.push(flower);
    await kv.set(FLOWERS_KEY, flowers);
    
    return NextResponse.json({ status: 'ok', flower });
  } catch (e) {
    console.error('Failed to plant flower:', e);
    return NextResponse.json({ status: 'blocked' }, { status: 400 });
  }
}

export async function DELETE() {
  try {
    await kv.set(FLOWERS_KEY, []);
    return NextResponse.json({ status: 'ok', message: 'All flowers cleared' });
  } catch (error) {
    console.error('Failed to clear flowers:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
