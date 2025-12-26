import { Page, expect } from '@playwright/test';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * Handle age verification modal if it appears
 */
export async function handleAgeGate(page: Page): Promise<void> {
  try {
    // Wait for age gate modal to appear (max 3 seconds)
    const ageGateButton = page.locator('button:has-text("Yes, I am 21+")');
    await ageGateButton.waitFor({ timeout: 3000 });

    // Click "Yes, I am 21+"
    await ageGateButton.click();

    // Wait for modal to disappear
    await page.waitForTimeout(1000);
  } catch (error) {
    // Age gate not present or already dismissed - continue
  }
}

/**
 * Generate a unique test email using timestamp
 */
export function generateTestEmail(): string {
  const timestamp = Date.now();
  return `test+${timestamp}@test.com`;
}

/**
 * Generate complete test user data
 */
export function generateTestUser(): UserData {
  return {
    firstName: 'Test',
    lastName: 'User',
    email: generateTestEmail(),
    password: 'TestPass123!',
  };
}

/**
 * Register a new user
 */
export async function registerUser(page: Page, userData: UserData): Promise<void> {
  await page.goto('/register');
  await handleAgeGate(page);

  // Fill in registration form
  await page.fill('input[name="firstName"]', userData.firstName);
  await page.fill('input[name="lastName"]', userData.lastName);
  await page.fill('input[name="email"]', userData.email);
  await page.fill('input[name="password"]', userData.password);
  await page.fill('input[name="confirmPassword"]', userData.password);

  // Accept terms
  await page.check('input[type="checkbox"][name="terms"]');

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for navigation after successful registration
  await page.waitForURL('**/', { timeout: 10000 });
}

/**
 * Login as a user
 */
export async function loginAs(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await handleAgeGate(page);

  // Fill in login form
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for navigation after successful login
  await page.waitForURL('**/', { timeout: 10000 });
}

/**
 * Logout the current user
 */
export async function logout(page: Page): Promise<void> {
  // Click user button in header (shows user's first name)
  const userButton = page.locator('button:has(.lucide-user)').first();
  await userButton.click();

  // Wait for dropdown to appear and click logout
  await page.waitForTimeout(500);
  await page.click('button:has-text("Logout")');

  // Wait for logout to complete
  await page.waitForTimeout(1000);
}

/**
 * Check if user is logged in by checking header
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    // Look for user icon or first name in header (indicates logged in state)
    const userIndicator = await page.locator('button:has-text("Test"), button:has-text("User"), .lucide-user').first().count();
    return userIndicator > 0;
  } catch {
    return false;
  }
}

/**
 * Check if user is logged out by checking for Sign In button
 */
export async function isLoggedOut(page: Page): Promise<boolean> {
  try {
    const signInButton = await page.locator('button:has-text("Sign In"), a:has-text("Sign In")').count();
    return signInButton > 0;
  } catch {
    return false;
  }
}
