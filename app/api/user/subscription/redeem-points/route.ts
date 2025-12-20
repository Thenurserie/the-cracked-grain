import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

const POINTS_PER_MONTH = 500; // 500 points = 1 month premium

// POST /api/user/subscription/redeem-points - Redeem points for premium subscription
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { months = 1 } = await request.json();

    // Validate months
    if (!months || months < 1 || months > 12) {
      return NextResponse.json(
        { success: false, error: 'Invalid number of months (1-12)' },
        { status: 400 }
      );
    }

    const pointsRequired = POINTS_PER_MONTH * months;

    // Check if user has enough points
    const currentUser = await prisma.$queryRaw<any[]>`
      SELECT loyalty_points as "loyaltyPoints"
      FROM users
      WHERE id = ${user.id}::uuid
    `;

    if (currentUser.length === 0 || currentUser[0].loyaltyPoints < pointsRequired) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient loyalty points. You need ${pointsRequired} points for ${months} month(s).`,
          required: pointsRequired,
          current: currentUser[0]?.loyaltyPoints || 0,
        },
        { status: 400 }
      );
    }

    // Get current subscription
    const subscriptions = await prisma.$queryRaw<any[]>`
      SELECT
        id,
        tier,
        expires_at as "expiresAt"
      FROM subscriptions
      WHERE user_id = ${user.id}::uuid
      ORDER BY created_at DESC
      LIMIT 1
    `;

    let subscription = subscriptions[0];

    // If no subscription, create one
    if (!subscription) {
      const newSubs = await prisma.$queryRaw<any[]>`
        INSERT INTO subscriptions (user_id, tier, started_at, expires_at, payment_method, auto_renew)
        VALUES (
          ${user.id}::uuid,
          'free'::varchar,
          CURRENT_TIMESTAMP,
          NULL,
          'default'::varchar,
          FALSE
        )
        RETURNING id, tier, expires_at as "expiresAt"
      `;
      subscription = newSubs[0];
    }

    // Calculate new expiration date
    const now = new Date();
    let newExpiresAt: Date;

    if (subscription.tier === 'premium' && subscription.expiresAt) {
      // If already premium and not expired, extend from current expiration
      const currentExpiration = new Date(subscription.expiresAt);
      if (currentExpiration > now) {
        newExpiresAt = new Date(currentExpiration);
      } else {
        newExpiresAt = new Date(now);
      }
    } else {
      // If free or expired, start from now
      newExpiresAt = new Date(now);
    }

    // Add months
    newExpiresAt.setMonth(newExpiresAt.getMonth() + months);

    // Update subscription
    await prisma.$executeRawUnsafe(`
      UPDATE subscriptions
      SET
        tier = 'premium',
        expires_at = '${newExpiresAt.toISOString()}',
        payment_method = 'points',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = '${subscription.id}'
    `);

    // Deduct points
    await prisma.$executeRawUnsafe(`
      UPDATE users
      SET loyalty_points = loyalty_points - ${pointsRequired}
      WHERE id = '${user.id}'
    `);

    // Create loyalty transaction
    await prisma.$queryRaw`
      INSERT INTO loyalty_transactions (user_id, points, type, description)
      VALUES (
        ${user.id}::uuid,
        ${-pointsRequired}::integer,
        'subscription_redemption'::varchar,
        ${`Redeemed ${pointsRequired} points for ${months} month(s) of Premium subscription`}::text
      )
    `;

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to Premium for ${months} month(s)!`,
      subscription: {
        tier: 'premium',
        expiresAt: newExpiresAt.toISOString(),
      },
      pointsDeducted: pointsRequired,
    });
  } catch (error) {
    console.error('Redeem points for subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to redeem points' },
      { status: 500 }
    );
  }
}
