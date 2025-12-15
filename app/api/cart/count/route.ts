import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/cart/count - Get total item count in cart
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get('x-session-id');

    if (!sessionId) {
      return NextResponse.json({ count: 0 });
    }

    const items = await prisma.cartItem.findMany({
      where: {
        sessionId,
      },
      select: {
        quantity: true,
      },
    });

    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error getting cart count:', error);
    return NextResponse.json(
      { error: 'Failed to get cart count' },
      { status: 500 }
    );
  }
}
