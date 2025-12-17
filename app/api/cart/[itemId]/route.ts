import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// PUT /api/cart/[itemId] - Update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const body = await request.json();
    const { quantity } = body;
    const { itemId } = await params;

    if (quantity === undefined) {
      return NextResponse.json(
        { error: 'Quantity is required' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      // Delete item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: {
          id: itemId,
        },
      });
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: {
          id: itemId,
        },
        data: {
          quantity,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[itemId] - Remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;

    await prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}
