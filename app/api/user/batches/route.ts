import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { checkUserLimits } from '@/lib/subscription';

// GET /api/user/batches - Get user's batches
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const batches = await prisma.userBatch.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      batches,
    });
  } catch (error) {
    console.error('Get batches error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch batches' },
      { status: 500 }
    );
  }
}

// POST /api/user/batches - Create batch
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const {
      name,
      style,
      brewDate,
      status,
      originalGravity,
      finalGravity,
      abv,
      notes,
    } = await request.json();

    // Validate required fields
    if (!name || !style || !brewDate || !status || !originalGravity || !finalGravity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check subscription limits
    const limitCheck = await checkUserLimits(user.id, 'batches');
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Batch limit reached. Free tier allows ${limitCheck.limit} batches. Upgrade to Premium for unlimited batches!`,
          limitReached: true,
          currentCount: limitCheck.currentCount,
          limit: limitCheck.limit,
          tier: limitCheck.tier,
        },
        { status: 403 }
      );
    }

    const batch = await prisma.userBatch.create({
      data: {
        userId: user.id,
        name,
        style,
        brewDate,
        status,
        originalGravity,
        finalGravity,
        abv: parseFloat(abv || 0),
        notes: notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      batch,
    });
  } catch (error) {
    console.error('Create batch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create batch' },
      { status: 500 }
    );
  }
}
