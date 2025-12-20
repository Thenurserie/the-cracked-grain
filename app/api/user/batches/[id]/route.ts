import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// PUT /api/user/batches/[id] - Update batch
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
      brewDate,
      status,
      originalGravity,
      finalGravity,
      abv,
      notes,
    } = await request.json();

    // Check if batch exists and belongs to user
    const existingBatch = await prisma.userBatch.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingBatch) {
      return NextResponse.json(
        { success: false, error: 'Batch not found' },
        { status: 404 }
      );
    }

    const batch = await prisma.userBatch.update({
      where: { id },
      data: {
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
    console.error('Update batch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update batch' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/batches/[id] - Delete batch
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

    // Check if batch exists and belongs to user
    const existingBatch = await prisma.userBatch.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingBatch) {
      return NextResponse.json(
        { success: false, error: 'Batch not found' },
        { status: 404 }
      );
    }

    await prisma.userBatch.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Batch deleted successfully',
    });
  } catch (error) {
    console.error('Delete batch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete batch' },
      { status: 500 }
    );
  }
}
