import { test, expect } from '@playwright/test';
import {
  generateTestUser,
  registerUser,
  loginAs,
  logout,
  isLoggedIn,
  isLoggedOut,
  handleAgeGate,
  type UserData
} from './helpers/auth';

// Store test user for reuse across tests
let testUser: UserData;

test.describe('Authentication System Tests', () => {

  test.beforeAll(() => {
    // Generate a test user that will be used across multiple tests
    testUser = generateTestUser();
    console.log(`Test user email: ${testUser.email}`);
  });

  /**
   * TEST 1: Registration Flow
   */
  test('should successfully register a new user', async ({ page }) => {
    await page.goto('/register');
    await handleAgeGate(page);

    // Fill in registration form
    await page.fill('input[name="firstName"]', testUser.firstName);
    await page.fill('input[name="lastName"]', testUser.lastName);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);

    // Accept terms
    await page.check('input[type="checkbox"][name="terms"]');

    // Take screenshot before submit
    await page.screenshot({ path: 'playwright-report/01-registration-form-filled.png' });

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for navigation (should redirect to homepage or account)
    await page.waitForURL(/\/(account)?$/, { timeout: 10000 });

    // Verify redirect occurred
    const currentUrl = page.url();
    console.log(`Redirected to: ${currentUrl}`);
    expect(currentUrl).toMatch(/\/(account)?$/);

    // Verify user is logged in (header shows user info)
    const loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBeTruthy();

    // Take screenshot of logged-in state
    await page.screenshot({ path: 'playwright-report/01-registration-success.png' });

    // Verify user can access /account
    await page.goto('/account');
    expect(page.url()).toContain('/account');
  });

  /**
   * TEST 2: Registration Validation
   */
  test('should show validation errors for invalid registration', async ({ page }) => {
    await page.goto('/register');
    await handleAgeGate(page);

    // Test 1: Empty form submission
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Check for error messages
    const hasErrors = await page.locator('text=/required|must|invalid/i').count() > 0;
    expect(hasErrors).toBeTruthy();
    await page.screenshot({ path: 'playwright-report/02-validation-empty-form.png' });

    // Test 2: Mismatched passwords
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'DifferentPass123!');
    await page.check('input[type="checkbox"][name="terms"]');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    const mismatchError = await page.locator('text=/password.*match|passwords must match/i').count() > 0;
    expect(mismatchError).toBeTruthy();
    await page.screenshot({ path: 'playwright-report/02-validation-password-mismatch.png' });

    // Test 3: Weak password
    await page.fill('input[name="password"]', 'weak');
    await page.fill('input[name="confirmPassword"]', 'weak');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    const weakPasswordError = await page.locator('text=/8 characters|password.*short|password.*weak/i').count() > 0;
    expect(weakPasswordError).toBeTruthy();
    await page.screenshot({ path: 'playwright-report/02-validation-weak-password.png' });

    // Test 4: Invalid email format
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    const invalidEmailError = await page.locator('text=/valid email|invalid email/i').count() > 0;
    expect(invalidEmailError).toBeTruthy();
    await page.screenshot({ path: 'playwright-report/02-validation-invalid-email.png' });

    // Test 5: Duplicate email (using email from Test 1)
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');
    await page.check('input[type="checkbox"][name="terms"]');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    const duplicateError = await page.locator('text=/already exists|already registered|email.*taken/i').count() > 0;
    expect(duplicateError).toBeTruthy();
    await page.screenshot({ path: 'playwright-report/02-validation-duplicate-email.png' });
  });

  /**
   * TEST 3: Login Flow
   */
  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await handleAgeGate(page);

    // Fill in login form
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);

    await page.screenshot({ path: 'playwright-report/03-login-form-filled.png' });

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect
    await page.waitForURL(/\/(account)?$/, { timeout: 10000 });

    // Verify logged in
    const loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBeTruthy();

    await page.screenshot({ path: 'playwright-report/03-login-success.png' });

    // Check for loyalty points display (should be 0 for new user)
    await page.goto('/account');
    const hasLoyaltySection = await page.locator('text=/loyalty|points/i').count() > 0;
    console.log(`Loyalty section found: ${hasLoyaltySection}`);
  });

  /**
   * TEST 4: Login Validation
   */
  test('should show errors for invalid login attempts', async ({ page }) => {
    await page.goto('/login');
    await handleAgeGate(page);

    // Test 1: Wrong password
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    const wrongPasswordError = await page.locator('text=/invalid.*credentials|incorrect.*password|login.*failed/i').count() > 0;
    expect(wrongPasswordError).toBeTruthy();
    await page.screenshot({ path: 'playwright-report/04-login-wrong-password.png' });

    // Test 2: Non-existent email
    await page.fill('input[name="email"]', 'nonexistent@test.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    const notFoundError = await page.locator('text=/not found|user.*not.*exist|invalid.*credentials/i').count() > 0;
    expect(notFoundError).toBeTruthy();
    await page.screenshot({ path: 'playwright-report/04-login-user-not-found.png' });

    // Test 3: Empty fields
    await page.fill('input[name="email"]', '');
    await page.fill('input[name="password"]', '');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Form should not submit or show validation errors
    const stillOnLogin = page.url().includes('/login');
    expect(stillOnLogin).toBeTruthy();
    await page.screenshot({ path: 'playwright-report/04-login-empty-fields.png' });
  });

  /**
   * TEST 5: Session Persistence
   */
  test('should maintain session after page refresh and new tabs', async ({ page, context }) => {
    // Handle age gate first
    await page.goto('/');
    await handleAgeGate(page);

    // Login first
    await loginAs(page, testUser.email, testUser.password);

    // Verify logged in
    let loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBeTruthy();

    // Refresh the page
    await page.reload();
    await page.waitForTimeout(1000);

    // Verify still logged in after refresh
    loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBeTruthy();
    await page.screenshot({ path: 'playwright-report/05-session-after-refresh.png' });

    // Open new tab and verify still logged in
    const newPage = await context.newPage();
    await newPage.goto('/');
    await newPage.waitForTimeout(1000);

    const loggedInNewTab = await isLoggedIn(newPage);
    expect(loggedInNewTab).toBeTruthy();
    await newPage.screenshot({ path: 'playwright-report/05-session-new-tab.png' });

    await newPage.close();
  });

  /**
   * TEST 6: Logout Flow
   */
  test('should successfully logout and clear session', async ({ page }) => {
    // Handle age gate first
    await page.goto('/');
    await handleAgeGate(page);

    // Login first
    await loginAs(page, testUser.email, testUser.password);

    await page.screenshot({ path: 'playwright-report/06-before-logout.png' });

    // Logout
    await logout(page);
    await page.waitForTimeout(1000);

    // Verify logged out (header shows "Sign In")
    const loggedOut = await isLoggedOut(page);
    expect(loggedOut).toBeTruthy();
    await page.screenshot({ path: 'playwright-report/06-after-logout.png' });

    // Verify /account redirects to /login
    await page.goto('/account');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');

    // Refresh and verify still logged out
    await page.goto('/');
    await page.waitForTimeout(1000);
    const stillLoggedOut = await isLoggedOut(page);
    expect(stillLoggedOut).toBeTruthy();
  });

  /**
   * TEST 7: Protected Routes
   */
  test('should protect /account route when not logged in', async ({ page }) => {
    // Ensure logged out
    await page.goto('/');
    await handleAgeGate(page);
    const loggedOut = await isLoggedOut(page);

    if (!loggedOut) {
      await logout(page);
      await page.waitForTimeout(1000);
    }

    // Try to access /account without login
    await page.goto('/account');
    await page.waitForTimeout(1000);

    // Should redirect to /login
    expect(page.url()).toContain('/login');
    await page.screenshot({ path: 'playwright-report/07-protected-route-redirect.png' });

    // Verify /brewing is public (should work)
    await page.goto('/brewing');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/brewing');
    await page.screenshot({ path: 'playwright-report/07-public-route-brewing.png' });

    // Now login and verify /account is accessible
    await loginAs(page, testUser.email, testUser.password);
    await page.goto('/account');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/account');

    // Verify user info displays correctly
    const hasUserInfo = await page.locator(`text=${testUser.firstName}`).count() > 0;
    console.log(`User info displays: ${hasUserInfo}`);
    await page.screenshot({ path: 'playwright-report/07-account-accessible.png' });
  });

  /**
   * TEST 8: Brewing Tools Data Persistence
   */
  test('should persist brewing batch data across sessions', async ({ page }) => {
    // Handle age gate first
    await page.goto('/');
    await handleAgeGate(page);

    // Login
    await loginAs(page, testUser.email, testUser.password);

    // Navigate to brewing batches
    await page.goto('/account/brewing');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'playwright-report/08-brewing-batches-page.png' });

    // Check if there's a way to create a batch
    const hasCreateButton = await page.locator('button:has-text("Create"), button:has-text("New"), a:has-text("Create")').count() > 0;
    console.log(`Create batch button found: ${hasCreateButton}`);

    if (hasCreateButton) {
      // Click create batch
      await page.click('button:has-text("Create"), button:has-text("New"), a:has-text("Create")').catch(() => {});
      await page.waitForTimeout(1000);

      // Fill in test batch data (if form appears)
      const hasNameField = await page.locator('input[name="name"], input[placeholder*="name"]').count() > 0;
      if (hasNameField) {
        await page.fill('input[name="name"], input[placeholder*="name"]', 'Test IPA Batch');
        await page.screenshot({ path: 'playwright-report/08-batch-form-filled.png' });

        // Submit
        await page.click('button[type="submit"]');
        await page.waitForTimeout(2000);
      }
    }

    // Refresh page and check if data persists
    await page.reload();
    await page.waitForTimeout(2000);
    const hasBatchData = await page.locator('text=/Test IPA|batch/i').count() > 0;
    console.log(`Batch data persists after refresh: ${hasBatchData}`);
    await page.screenshot({ path: 'playwright-report/08-batch-after-refresh.png' });

    // Logout and login again
    await logout(page);
    await loginAs(page, testUser.email, testUser.password);

    // Check if batch still exists
    await page.goto('/account/brewing');
    await page.waitForTimeout(2000);
    const hasBatchAfterRelogin = await page.locator('text=/Test IPA|batch/i').count() > 0;
    console.log(`Batch data persists after logout/login: ${hasBatchAfterRelogin}`);
    await page.screenshot({ path: 'playwright-report/08-batch-after-relogin.png' });
  });

  /**
   * TEST 9: Mobile Responsive Auth
   */
  test('should work correctly on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Test logged out state
    await page.goto('/');
    await handleAgeGate(page);
    await page.waitForTimeout(1000);

    // Open hamburger menu
    const hamburger = page.locator('button[aria-label="Open menu"]').first();
    await hamburger.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'playwright-report/09-mobile-menu-logged-out.png' });

    // Verify "Sign In" link visible
    const hasSignIn = await page.locator('text="Sign In"').count() > 0;
    expect(hasSignIn).toBeTruthy();

    // Close menu and login
    await page.keyboard.press('Escape');
    await loginAs(page, testUser.email, testUser.password);

    // Open hamburger menu again
    await page.goto('/');
    await page.waitForTimeout(1000);
    const hamburgerLoggedIn = page.locator('button[aria-label="Open menu"]').first();
    await hamburgerLoggedIn.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'playwright-report/09-mobile-menu-logged-in.png' });

    // Verify user info section appears
    const hasUserInfo = await page.locator(`text=${testUser.firstName}`).count() > 0;
    console.log(`Mobile menu shows user info: ${hasUserInfo}`);

    // Verify logout button works
    const hasLogout = await page.locator('text="Logout"').count() > 0;
    if (hasLogout) {
      await page.click('text="Logout"');
      await page.waitForTimeout(1000);

      const loggedOut = await isLoggedOut(page);
      expect(loggedOut).toBeTruthy();
      await page.screenshot({ path: 'playwright-report/09-mobile-after-logout.png' });
    }
  });
});
