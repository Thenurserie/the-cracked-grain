import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createSession, setSessionCookie, validateEmail, validatePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json();

    // Validate inputs
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        phone: phone || null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        subscriptionTier: true,
        loyaltyPoints: true,
        createdAt: true,
      },
    });

    // Award welcome bonus (50 points)
    const WELCOME_BONUS = 50;
    try {
      await prisma.$queryRaw`
        INSERT INTO loyalty_transactions (user_id, points, type, description)
        VALUES (
          ${user.id}::uuid,
          ${WELCOME_BONUS}::integer,
          'welcome_bonus'::varchar,
          'Welcome to The Cracked Grain! Enjoy your bonus points.'::text
        )
      `;

      // Update user's loyalty points
      await prisma.$executeRawUnsafe(`
        UPDATE users
        SET loyalty_points = ${WELCOME_BONUS}
        WHERE id = '${user.id}'
      `);

      // Update user object to reflect the bonus points
      user.loyaltyPoints = WELCOME_BONUS;
    } catch (error) {
      console.error('Failed to award welcome bonus:', error);
      // Don't fail registration if loyalty bonus fails
    }

    // Create session
    const sessionToken = await createSession(user.id);
    await setSessionCookie(sessionToken);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
