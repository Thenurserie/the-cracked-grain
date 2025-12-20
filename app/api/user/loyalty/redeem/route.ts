import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

// POST /api/user/loyalty/redeem - Redeem loyalty points
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { points, description } = await request.json();

    // Validate required fields
    if (!points || points <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid points amount is required' },
        { status: 400 }
      );
    }

    // Check if user has enough points
    const currentUser = await prisma.$queryRaw<any[]>`
      SELECT loyalty_points as "loyaltyPoints"
      FROM users
      WHERE id = ${user.id}::uuid
    `;

    if (currentUser.length === 0 || currentUser[0].loyaltyPoints < points) {
      return NextResponse.json(
        { success: false, error: 'Insufficient loyalty points' },
        { status: 400 }
      );
    }

    // Create redemption transaction (negative points)
    const transaction = await prisma.$queryRaw<any[]>`
      INSERT INTO loyalty_transactions (user_id, points, type, description)
      VALUES (
        ${user.id}::uuid,
        ${-points}::integer,
        'redemption'::varchar,
        ${description || 'Points redeemed'}::text
      )
      RETURNING
        id,
        user_id as "userId",
        points,
        type,
        description,
        order_id as "orderId",
        created_at as "createdAt"
    `;

    // Update user's loyalty points in users table
    await prisma.$executeRawUnsafe(`
      UPDATE users
      SET loyalty_points = loyalty_points - ${points}
      WHERE id = '${user.id}'
    `);

    return NextResponse.json({
      success: true,
      transaction: transaction[0],
      message: `Successfully redeemed ${points} points`,
    });
  } catch (error) {
    console.error('Redeem loyalty points error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to redeem loyalty points' },
      { status: 500 }
    );
  }
}
