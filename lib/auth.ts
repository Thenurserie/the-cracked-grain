import { compare, hash } from 'bcrypt';
import { cookies } from 'next/headers';
import { prisma } from './db';

const SALT_ROUNDS = 10;
const SESSION_COOKIE_NAME = 'session_token';
const SESSION_DURATION_DAYS = 30;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function createSession(userId: string): Promise<string> {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  await prisma.userSession.create({
    data: {
      userId,
      sessionToken,
      expiresAt,
    },
  });

  return sessionToken;
}

export async function getSessionUser(sessionToken: string) {
  const session = await prisma.userSession.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session) return null;

  // Check if session is expired
  if (session.expiresAt < new Date()) {
    await prisma.userSession.delete({ where: { id: session.id } });
    return null;
  }

  return session.user;
}

export async function deleteSession(sessionToken: string) {
  await prisma.userSession.deleteMany({
    where: { sessionToken },
  });
}

export async function setSessionCookie(sessionToken: string) {
  const cookieStore = await cookies();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const sessionToken = await getSessionToken();
  if (!sessionToken) return null;

  return getSessionUser(sessionToken);
}

function generateSessionToken(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  return { valid: true };
}
