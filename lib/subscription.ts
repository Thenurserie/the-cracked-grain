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

export type SubscriptionTier = 'free' | 'premium';
export type ResourceType = 'batches' | 'inventory' | 'recipes';

interface UserSubscription {
  tier: SubscriptionTier;
  expiresAt: Date | null;
}

/**
 * Get user's current subscription tier
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  try {
    const subscriptions = await prisma.$queryRaw<any[]>`
      SELECT
        tier,
        expires_at as "expiresAt"
      FROM subscriptions
      WHERE user_id = ${userId}::uuid
      ORDER BY created_at DESC
      LIMIT 1
    `;

    let subscription = subscriptions[0];

    // If no subscription exists, create a free one
    if (!subscription) {
      await prisma.$queryRaw`
        INSERT INTO subscriptions (user_id, tier, started_at, expires_at, payment_method, auto_renew)
        VALUES (
          ${userId}::uuid,
          'free'::varchar,
          CURRENT_TIMESTAMP,
          NULL,
          'default'::varchar,
          FALSE
        )
      `;
      return { tier: 'free', expiresAt: null };
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
          WHERE user_id = '${userId}'
        `);
        return { tier: 'free', expiresAt: null };
      }
    }

    return {
      tier: subscription.tier as SubscriptionTier,
      expiresAt: subscription.expiresAt ? new Date(subscription.expiresAt) : null,
    };
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return { tier: 'free', expiresAt: null };
  }
}

/**
 * Check if user has reached their limit for a specific resource type
 * Returns { allowed: boolean, currentCount: number, limit: number, tier: string }
 */
export async function checkUserLimits(
  userId: string,
  resourceType: ResourceType
): Promise<{ allowed: boolean; currentCount: number; limit: number; tier: SubscriptionTier }> {
  try {
    // Get user's subscription tier
    const subscription = await getUserSubscription(userId);
    const tier = subscription.tier;

    // Get the limit for this tier
    const limit = TIER_LIMITS[tier][resourceType];

    // Premium users have no limits
    if (tier === 'premium') {
      return { allowed: true, currentCount: 0, limit, tier };
    }

    // Get current count for this resource
    let currentCount = 0;

    switch (resourceType) {
      case 'batches':
        const batchCount = await prisma.$queryRaw<any[]>`
          SELECT COUNT(*) as count FROM user_batches WHERE user_id = ${userId}::uuid
        `;
        currentCount = Number(batchCount[0].count);
        break;

      case 'inventory':
        const inventoryCount = await prisma.$queryRaw<any[]>`
          SELECT COUNT(*) as count FROM user_inventory WHERE user_id = ${userId}::uuid
        `;
        currentCount = Number(inventoryCount[0].count);
        break;

      case 'recipes':
        const recipeCount = await prisma.$queryRaw<any[]>`
          SELECT COUNT(*) as count FROM user_recipes WHERE user_id = ${userId}::uuid
        `;
        currentCount = Number(recipeCount[0].count);
        break;
    }

    // Check if user has reached their limit
    const allowed = currentCount < limit;

    return { allowed, currentCount, limit, tier };
  } catch (error) {
    console.error('Error checking user limits:', error);
    // Default to free tier limits on error
    return { allowed: false, currentCount: 0, limit: TIER_LIMITS.free[resourceType], tier: 'free' };
  }
}
