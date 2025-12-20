import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/user/recipes - Get user's recipes
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const recipes = await prisma.userRecipe.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      recipes,
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

// POST /api/user/recipes - Save recipe
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
      batchSize,
      recipeData,
      notes,
      isPublic,
    } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Recipe name is required' },
        { status: 400 }
      );
    }

    const recipe = await prisma.userRecipe.create({
      data: {
        userId: user.id,
        name,
        style: style || null,
        batchSize: batchSize ? parseFloat(batchSize) : null,
        recipeData: recipeData || {},
        notes: notes || null,
        isPublic: isPublic || false,
      },
    });

    return NextResponse.json({
      success: true,
      recipe,
    });
  } catch (error) {
    console.error('Create recipe error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}
