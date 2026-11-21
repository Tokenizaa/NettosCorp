import { test, expect } from '@playwright/test';

// This test uses the existing dev server on port 3100
// Run with: PAPERCLIP_E2E_PORT=3100 PAPERCLIP_E2E_SERVER_URL=http://127.0.0.1:3100 npx playwright test fcc-onboarding-dev.spec.ts --headed

test.use({ baseURL: 'http://127.0.0.1:3100' });

test('complete onboarding with FCC auto-detection', async ({ page }) => {
  test.setTimeout(120000);
  // Navigate to NET onboarding
  await page.goto('/NET/onboarding', { waitUntil: 'networkidle' });

  // Wait for onboarding wizard to load
  await page.waitForSelector('[data-testid="onboarding-wizard"]', { timeout: 30000 });

  // Should be at step 3 (Create your first agent) since company exists
  await page.waitForSelector('text=Create your first agent', { timeout: 10000 });

  // Step 3: Name the agent
  await page.fill('input[id="onboarding-agent-name"]', 'FCC Agent');
  await page.keyboard.press('Enter');

  // Wait for step 4: Connect a model
  await page.waitForSelector('text=Connect a model', { timeout: 10000 });

  // Wait for model source tiles to appear
  await page.waitForSelector('role=radiogroup', { timeout: 10000 });

  // Click on "Claude" tile (accessible name from CONNECT_SOURCE_NAMES)
  await page.click('role=radio[name="Claude"]');

  // Wait for FCC detection to complete
  await page.waitForSelector('text=FCC server detected', { timeout: 15000 });

  // Verify models are populated (FCC models should have (FCC) suffix)
  await page.click('[role="combobox"]');
  await page.waitForTimeout(500);

  const fccModels = await page.locator('text=(FCC)').count();
  console.log(`Found ${fccModels} FCC models`);
  expect(fccModels).toBeGreaterThan(0);

  // Close dropdown
  await page.keyboard.press('Escape');

  // Click Connect button
  await page.click('button:has-text("Connect")');

  // Wait for connection test to complete
  await page.waitForSelector('text=Passed', { timeout: 60000 });

  // Click "Get started" to complete onboarding
  await page.click('button:has-text("Get started")');

  // Verify we're redirected to the issue page
  await page.waitForURL('**/issues/**', { timeout: 10000 });

  console.log('Onboarding completed successfully with FCC!');
});

test('verify FCC models available in model dropdown', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('/NET/onboarding', { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="onboarding-wizard"]', { timeout: 30000 });
  await page.waitForSelector('text=Create your first agent', { timeout: 10000 });

  await page.fill('input[id="onboarding-agent-name"]', 'FCC Agent Test');
  await page.keyboard.press('Enter');

  await page.waitForSelector('text=Connect a model', { timeout: 10000 });
  await page.waitForSelector('role=radiogroup', { timeout: 10000 });

  await page.click('role=radio[name="Claude"]');

  // Wait for FCC detection
  await page.waitForSelector('text=FCC server detected', { timeout: 15000 });

  // Open model dropdown
  await page.click('[role="combobox"]');
  await page.waitForTimeout(500);

  // Check for FCC models (should have (FCC) suffix)
  const fccModels = await page.locator('text=(FCC)').count();
  console.log(`Found ${fccModels} FCC models`);

  // Should have at least some models from FCC
  expect(fccModels).toBeGreaterThan(0);
});