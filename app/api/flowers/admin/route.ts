import { NextRequest, NextResponse } from 'next/server';

// Simple admin authentication
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
    
    if (password === adminPassword) {
      // Generate a simple token (in production, use JWT or similar)
      const token = Buffer.from(`${adminPassword}:${Date.now()}`).toString('base64');
      
      return NextResponse.json({ 
        authenticated: true,
        token 
      });
    }
    
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ authenticated: false }, { status: 400 });
  }
}

