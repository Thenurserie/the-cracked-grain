import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Subscription tier limits
export const TIER_LIMITS = {
  free: {
    batches: 5,
    inventory: 20,
    recipes: 3,
  },
  premium: {
    batches: Infinity,
    inventory: Infinity,
    recipes: Infinity,
  },
};

// GET /api/user/subscription - Get current subscription status
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get subscription
    const subscriptions = await prisma.$queryRaw<any[]>`
      SELECT
        id,
        user_id as "userId",
        tier,
        started_at as "startedAt",
        expires_at as "expiresAt",
        payment_method as "paymentMethod",
        auto_renew as "autoRenew",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM subscriptions
      WHERE user_id = ${user.id}::uuid
      ORDER BY created_at DESC
      LIMIT 1
    `;

    let subscription = subscriptions[0];

    // If no subscription exists, create a free one
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
        RETURNING
          id,
          user_id as "userId",
          tier,
          started_at as "startedAt",
          expires_at as "expiresAt",
          payment_method as "paymentMethod",
          auto_renew as "autoRenew",
          created_at as "createdAt",
          updated_at as "updatedAt"
      `;
      subscription = newSubs[0];
    }

    // Check if premium subscription has expired
    if (subscription.tier === 'premium' && subscription.expiresAt) {
      const now = new Date();
      const expiresAt = new Date(subscription.expiresAt);

      if (now > expiresAt) {
        // Subscription expired, downgrade to free
        await prisma.$executeRawUnsafe(`
          UPDATE subscriptions
          SET tier = 'free', expires_at = NULL
          WHERE id = '${subscription.id}'
        `);
        subscription.tier = 'free';
        subscription.expiresAt = null;
      }
    }

    // Get current usage
    const [batchCount, inventoryCount, recipeCount] = await Promise.all([
      prisma.$queryRaw<any[]>`SELECT COUNT(*) as count FROM user_batches WHERE user_id = ${user.id}::uuid`,
      prisma.$queryRaw<any[]>`SELECT COUNT(*) as count FROM user_inventory WHERE user_id = ${user.id}::uuid`,
      prisma.$queryRaw<any[]>`SELECT COUNT(*) as count FROM user_recipes WHERE user_id = ${user.id}::uuid`,
    ]);

    const usage = {
      batches: Number(batchCount[0].count),
      inventory: Number(inventoryCount[0].count),
      recipes: Number(recipeCount[0].count),
    };

    const limits = TIER_LIMITS[subscription.tier as 'free' | 'premium'];

    return NextResponse.json({
      success: true,
      subscription,
      usage,
      limits,
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}
