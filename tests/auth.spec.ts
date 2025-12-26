import { test, expect, Page } from '@playwright/test';

// Shared test user credentials - consistent across all tests
const TEST_USER = {
  firstName: 'Test',
  lastName: 'User',
  email: 'testuser@thecrackedgrain.com',
  password: 'TestPass123!',
  phone: '5551234567'
};

// Helper to handle age gate
async function handleAgeGate(page: Page) {
  try {
    const ageButton = page.locator('text=Yes, I am 21+');
    await ageButton.click({ timeout: 3000 });
    // Wait for modal to fully disappear
    await page.waitForTimeout(1000);
  } catch {
    // Age gate not present or already dismissed
  }
}

// Helper to dismiss cookie consent
async function handleCookieConsent(page: Page) {
  try {
    const acceptButton = page.locator('text=Accept All');
    await acceptButton.click({ timeout: 2000 });
    await page.waitForTimeout(500);
  } catch {
    // Cookie consent not present or already dismissed
  }
}

// Helper to login with test user
async function loginTestUser(page: Page) {
  await page.goto('/login');
  await handleAgeGate(page);
  await handleCookieConsent(page);

  await page.fill('input[name="email"]', TEST_USER.email);
  await page.fill('input[name="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');

  // Wait for redirect
  await page.waitForURL(/\/(account|$)/, { timeout: 10000 });
}

test.describe('Authentication System', () => {

  // Run ONCE before all tests - ensure test user exists
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();

    try {
      await page.goto('/register');
      await handleAgeGate(page);
      await handleCookieConsent(page);

      // Try to register the test user
      await page.fill('input[name="firstName"]', TEST_USER.firstName);
      await page.fill('input[name="lastName"]', TEST_USER.lastName);
      await page.fill('input[name="email"]', TEST_USER.email);
      await page.fill('input[name="phone"]', TEST_USER.phone);
      await page.fill('input[name="password"]', TEST_USER.password);
      await page.fill('input[name="confirmPassword"]', TEST_USER.password);
      await page.check('input[name="terms"]');

      await page.click('button[type="submit"]');

      // Wait for redirect or error - user may already exist, that's fine
      await page.waitForTimeout(5000);
    } catch (error) {
      console.log('Test user setup complete (may already exist)');
    } finally {
      await page.close();
    }
  });

  test('1. Registration Flow - registers new user with unique email', async ({ page }) => {
    const uniqueEmail = `newuser${Date.now()}@test.com`;

    await page.goto('/register');
    await handleAgeGate(page);
    await handleCookieConsent(page);

    await page.fill('input[name="firstName"]', 'New');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="phone"]', '5559999999');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');
    await page.check('input[name="terms"]');

    await page.click('button[type="submit"]');

    // Should redirect to home or account page
    await expect(page).toHaveURL(/\/(account|$)/, { timeout: 15000 });
  });

  test('2. Registration Validation - shows errors for invalid input', async ({ page }) => {
    await page.goto('/register');
    await handleAgeGate(page);
    await handleCookieConsent(page);

    // Fill with invalid data - mismatched passwords
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'DifferentPass123!');

    // Should show password mismatch error without even submitting
    const bodyText = await page.textContent('body');
    expect(bodyText?.toLowerCase()).toMatch(/match|must|don't match|do not match/);
  });

  test('3. Login Flow - logs in with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await handleAgeGate(page);
    await handleCookieConsent(page);

    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Should redirect
    await expect(page).toHaveURL(/\/(account|$)/, { timeout: 15000 });

    // Header should show user name
    await expect(page.locator('header')).toContainText(TEST_USER.firstName, { timeout: 5000 });
  });

  test('4. Login Validation - shows error for wrong password', async ({ page }) => {
    await page.goto('/login');
    await handleAgeGate(page);
    await handleCookieConsent(page);

    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('body')).toContainText(/invalid|incorrect|wrong|error/i, { timeout: 5000 });
  });

  test('5. Session Persistence - stays logged in after refresh', async ({ page }) => {
    await loginTestUser(page);

    // Refresh the page
    await page.reload();
    await handleAgeGate(page);

    // Should still show user name in header
    await expect(page.locator('header')).toContainText(TEST_USER.firstName, { timeout: 5000 });
  });

  test('6. Logout Flow - logs out successfully', async ({ page }) => {
    await loginTestUser(page);

    // Click on user dropdown/menu in header
    const headerButton = page.locator(`header >> text=${TEST_USER.firstName}`).first();
    await headerButton.click();

    // Click logout
    const logoutButton = page.locator('text=Logout').first();
    await logoutButton.click();

    // Wait for logout to complete
    await page.waitForTimeout(1000);

    // Should show Sign In button again
    await expect(page.locator('header')).toContainText(/sign in|login|log in/i, { timeout: 5000 });
  });

  test('7. Protected Routes - redirects to login when not authenticated', async ({ page }) => {
    // Clear all cookies and storage to ensure logged out
    await page.context().clearCookies();

    await page.goto('/account');
    await handleAgeGate(page);

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('8. Protected Routes - allows access when authenticated', async ({ page }) => {
    await loginTestUser(page);

    // Navigate to account page
    await page.goto('/account');
    await handleAgeGate(page);

    // Should stay on account page
    await expect(page).toHaveURL(/\/account/);

    // Should show user info
    await expect(page.locator('body')).toContainText(TEST_USER.email, { timeout: 5000 });
  });

  test('9. Mobile Responsive - auth works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/login');
    await handleAgeGate(page);
    await handleCookieConsent(page);

    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Should redirect successfully on mobile
    await expect(page).toHaveURL(/\/(account|$)/, { timeout: 15000 });
  });

});
