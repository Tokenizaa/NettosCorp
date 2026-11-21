import { chromium } from 'playwright';

async function testFCCOnboarding() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('Navigating to NET onboarding...');
    await page.goto('http://127.0.0.1:3100/NET/onboarding', { waitUntil: 'networkidle', timeout: 60000 });

    // Wait for onboarding wizard to load
    await page.waitForSelector('[data-testid="onboarding-wizard"]', { timeout: 30000 });
    console.log('Onboarding wizard loaded');

    // Should be at step 3 (Create your first agent) since company exists
    await page.waitForSelector('text=Create your first agent', { timeout: 10000 });
    console.log('At step 3: Create your first agent');

    // Step 3: Name the agent
    await page.fill('input[id="onboarding-agent-name"]', 'FCC Agent');
    await page.keyboard.press('Enter');
    console.log('Agent name entered, pressed Enter');

    // Wait for step 4: Connect a model
    await page.waitForSelector('text=Connect a model', { timeout: 10000 });
    console.log('At step 4: Connect a model');

    // Wait for model source tiles to appear
    await page.waitForSelector('role=radiogroup', { timeout: 10000 });
    console.log('Model source tiles visible');

    // Click on "Claude Code" tile
    await page.click('role=radio[name="Claude Code"]');
    console.log('Clicked Claude Code tile');

    // Wait for FCC detection to complete
    try {
      await page.waitForSelector('text=FCC server detected', { timeout: 15000 });
      console.log('FCC server detected!');
    } catch {
      // Check if it's not detected
      const notDetected = await page.locator('text=FCC server not detected').isVisible();
      if (notDetected) {
        console.log('FCC server NOT detected');
      } else {
        console.log('FCC detection timeout - checking status...');
        const probing = await page.locator('text=Detecting FCC server').isVisible();
        if (probing) {
          console.log('Still probing...');
        }
      }
    }

    // Check model dropdown
    await page.waitForTimeout(1000);
    await page.click('[role="combobox"]');
    await page.waitForTimeout(500);

    const fccModels = await page.locator('text=(FCC)').count();
    console.log(`Found ${fccModels} FCC models in dropdown`);

    // Close dropdown
    await page.keyboard.press('Escape');

    // Click Connect button
    const connectBtn = page.locator('button:has-text("Connect")');
    if (await connectBtn.isVisible({ timeout: 5000 })) {
      await connectBtn.click();
      console.log('Clicked Connect button');

      // Wait for connection test
      try {
        await page.waitForSelector('text=Passed', { timeout: 60000 });
        console.log('Connection test passed!');
      } catch {
        console.log('Connection test did not pass within timeout');
      }
    }

    // Keep browser open for manual inspection
    console.log('\nTest complete. Browser will stay open for 30 seconds...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

testFCCOnboarding().catch(console.error);