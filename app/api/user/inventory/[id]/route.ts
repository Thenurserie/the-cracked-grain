import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// PUT /api/user/inventory/[id] - Update item
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
      category,
      quantity,
      unit,
      purchaseDate,
      expirationDate,
      notes,
    } = await request.json();

    // Check if item exists and belongs to user
    const existingItem = await prisma.userInventory.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    const item = await prisma.userInventory.update({
      where: { id },
      data: {
        name,
        category,
        quantity: parseFloat(quantity),
        unit,
        purchaseDate: purchaseDate || null,
        expirationDate: expirationDate || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error('Update inventory item error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update inventory item' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/inventory/[id] - Delete item
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

    // Check if item exists and belongs to user
    const existingItem = await prisma.userInventory.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    await prisma.userInventory.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Inventory item deleted successfully',
    });
  } catch (error) {
    console.error('Delete inventory item error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete inventory item' },
      { status: 500 }
    );
  }
}
