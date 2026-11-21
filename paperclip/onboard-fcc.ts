import { test, expect } from '@playwright/test';

test('complete onboarding with FCC auto-detection', async ({ page }) => {
  // Navigate to NET onboarding
  await page.goto('http://127.0.0.1:3100/NET/onboarding');

  // Wait for onboarding wizard to load
  await page.waitForSelector('[data-testid="onboarding-wizard"]', { timeout: 30000 });

  // Step 1: Name your organization - should be pre-filled with "NettoCorp"
  // The wizard should skip to step 3 (Create your first agent) since company exists
  await page.waitForSelector('text=Create your first agent', { timeout: 10000 });

  // Step 3: Name the agent
  await page.fill('input[id="onboarding-agent-name"]', 'FCC Agent');
  await page.keyboard.press('Enter');

  // Wait for step 4: Connect a model
  await page.waitForSelector('text=Connect a model', { timeout: 10000 });

  // Wait for model source tiles to appear
  await page.waitForSelector('role=radiogroup', { timeout: 10000 });

  // Click on "Claude Code" tile
  await page.click('role=radio[name="Claude Code"]');

  // Wait for FCC detection to complete
  await page.waitForSelector('text=FCC server detected', { timeout: 10000 });

  // Verify models are populated
  await page.waitForSelector('text=model', { timeout: 5000 });

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
  await page.goto('http://127.0.0.1:3100/NET/onboarding');
  await page.waitForSelector('[data-testid="onboarding-wizard"]', { timeout: 30000 });
  await page.waitForSelector('text=Create your first agent', { timeout: 10000 });

  await page.fill('input[id="onboarding-agent-name"]', 'FCC Agent Test');
  await page.keyboard.press('Enter');

  await page.waitForSelector('text=Connect a model', { timeout: 10000 });
  await page.waitForSelector('role=radiogroup', { timeout: 10000 });

  await page.click('role=radio[name="Claude Code"]');

  // Wait for FCC detection
  await page.waitForSelector('text=FCC server detected', { timeout: 10000 });

  // Open model dropdown
  await page.click('[role="combobox"]');

  // Check for FCC models (should have (FCC) suffix)
  const fccModels = await page.locator('text=(FCC)').count();
  console.log(`Found ${fccModels} FCC models`);

  // Should have at least some models from FCC
  expect(fccModels).toBeGreaterThan(0);
});