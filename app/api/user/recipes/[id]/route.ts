import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// PUT /api/user/recipes/[id] - Update recipe
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const {
      name,
      style,
      batchSize,
      recipeData,
      notes,
      isPublic,
    } = await request.json();

    // Check if recipe exists and belongs to user
    const existingRecipe = await prisma.userRecipe.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingRecipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    const recipe = await prisma.userRecipe.update({
      where: { id },
      data: {
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
    console.error('Update recipe error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/recipes/[id] - Delete recipe
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if recipe exists and belongs to user
    const existingRecipe = await prisma.userRecipe.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingRecipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    await prisma.userRecipe.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Recipe deleted successfully',
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}
