import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/user/inventory - Get user's inventory
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const inventory = await prisma.userInventory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

// POST /api/user/inventory - Add item
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
      category,
      quantity,
      unit,
      purchaseDate,
      expirationDate,
      notes,
    } = await request.json();

    // Validate required fields
    if (!name || !category || quantity === undefined || !unit) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const item = await prisma.userInventory.create({
      data: {
        userId: user.id,
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
    console.error('Create inventory item error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}
