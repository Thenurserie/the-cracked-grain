import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/user/loyalty - Get user's loyalty points and transaction history
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get all transactions for the user, ordered by most recent first
    const transactions = await prisma.$queryRaw<any[]>`
      SELECT
        id,
        user_id as "userId",
        points,
        type,
        description,
        order_id as "orderId",
        created_at as "createdAt"
      FROM loyalty_transactions
      WHERE user_id = ${user.id}::uuid
      ORDER BY created_at DESC
    `;

    // Calculate total points
    const totalPoints = transactions.reduce((sum, txn) => sum + Number(txn.points), 0);

    return NextResponse.json({
      success: true,
      totalPoints,
      transactions,
    });
  } catch (error) {
    console.error('Get loyalty transactions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch loyalty data' },
      { status: 500 }
    );
  }
}

// POST /api/user/loyalty - Award loyalty points (internal use)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { points, type, description, orderId } = await request.json();

    // Validate required fields
    if (!points || !type) {
      return NextResponse.json(
        { success: false, error: 'Points and type are required' },
        { status: 400 }
      );
    }

    // Create transaction
    const transaction = await prisma.$queryRaw<any[]>`
      INSERT INTO loyalty_transactions (user_id, points, type, description, order_id)
      VALUES (
        ${user.id}::uuid,
        ${points}::integer,
        ${type}::varchar,
        ${description || null}::text,
        ${orderId || null}::uuid
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
      SET loyalty_points = loyalty_points + ${points}
      WHERE id = '${user.id}'
    `);

    return NextResponse.json({
      success: true,
      transaction: transaction[0],
    });
  } catch (error) {
    console.error('Award loyalty points error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to award loyalty points' },
      { status: 500 }
    );
  }
}
