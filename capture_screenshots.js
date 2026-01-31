const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: { width: 1280, height: 800 }
    });
    const page = await browser.newPage();
    const baseUrl = 'http://localhost:3001'; // Ensure this matches your running port
    const screenshotsDir = './screenshots';

    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }

    console.log('🚀 Starting Screenshot Capture...');

    try {
        // 1. Capture Login
        await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle0' });

        // Test Failed Login
        console.log('🧪 Testing Failed Login...');
        await page.type('input[name="email"]', 'wrong@example.com');
        await page.type('input[name="password"]', 'badpass');
        await page.click('button[type="submit"]');
        await new Promise(r => setTimeout(r, 1000)); // Wait for error state
        await page.screenshot({ path: `${screenshotsDir}/login_error.png` });
        console.log('📸 Captured Login Error state.');

        // Refresh for clean state
        await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle0' });
        console.log('📸 Capturing Login Page...');
        await page.screenshot({ path: `${screenshotsDir}/login.png` });

        // 2. Perform Login (or Signup)
        // We will try to Signup a new random user to ensure we can get in
        const randId = Math.floor(Math.random() * 10000);
        const email = `demo${randId}@example.com`;
        const password = 'password123';

        console.log(`👤 Creating new user: ${email}`);

        await page.goto(`${baseUrl}/signup`, { waitUntil: 'networkidle0' });
        await page.screenshot({ path: `${screenshotsDir}/signup.png` }); // Capture Signup too

        // Fill Signup Form
        // MUI TextFields usually have name attributes if passed via register(), inspecting code: {...register('email')} likely adds name="email"
        await page.type('input[name="name"]', 'Automated Tester');
        await page.type('input[name="email"]', email);
        await page.type('input[name="password"]', password);

        // Submit
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }), // Wait for redirect
            page.click('button[type="submit"]'),
        ]);

        console.log('✅ Signup/Login Successful! Redirected to Dashboard.');

        // 3. Capture Dashboard
        await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle0' });
        // Wait a bit for charts to animate
        await new Promise(r => setTimeout(r, 2000));
        console.log('📸 Capturing Dashboard Desktop...');
        await page.setViewport({ width: 1280, height: 800 });
        await page.screenshot({ path: `${screenshotsDir}/dashboard_desktop.png` });

        // Mobile View
        console.log('📸 Capturing Dashboard Mobile...');
        await page.setViewport({ width: 375, height: 667 });
        await new Promise(r => setTimeout(r, 1000)); // responsiveness delay
        await page.screenshot({ path: `${screenshotsDir}/dashboard_mobile.png` });

        // Reset Viewport
        await page.setViewport({ width: 1280, height: 800 });
        await new Promise(r => setTimeout(r, 500));

        // 4. Capture Daily Usage
        await page.goto(`${baseUrl}/daily-usage`, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 1000));
        console.log('📸 Capturing Daily Usage...');
        await page.screenshot({ path: `${screenshotsDir}/daily-usage.png` });

        // 5. Capture Analytics
        await page.goto(`${baseUrl}/analytics`, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000)); // Charts take time
        console.log('📸 Capturing Analytics...');
        await page.screenshot({ path: `${screenshotsDir}/analytics.png` });

        // 6. Capture Budget Planning Wizard
        console.log('🔮 Testing Budget Wizard...');
        await page.goto(`${baseUrl}/budget-planning`, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 1000));
        await page.screenshot({ path: `${screenshotsDir}/budget_step_1_income.png` });

        // Step 1: Income
        // Set Income to 50000
        const incomeInputs = await page.$$('input[type="text"]');
        if (incomeInputs.length > 0) {
            // Ensure we clear it first (ctrl+a, backspace might be needed if not empty, but default is 0)
            await incomeInputs[0].click({ clickCount: 3 });
            await incomeInputs[0].type('50000');
        }
        await new Promise(r => setTimeout(r, 500));
        // Click Next
        let nextBtn = await page.$x("//button[contains(., 'Next')]");
        if (nextBtn.length > 0) {
            await nextBtn[0].click();
            await new Promise(r => setTimeout(r, 1000)); // Wait for transition
        }

        // Step 2: Needs
        await page.screenshot({ path: `${screenshotsDir}/budget_step_2_needs.png` });
        // Set Needs to 20000
        const needsInputs = await page.$$('input[type="text"]');
        if (needsInputs.length > 0) {
            // Need to find the one for Needs amount (it might be the first one visible now)
            await needsInputs[0].click({ clickCount: 3 });
            await needsInputs[0].type('20000');
        }
        // Click Next
        nextBtn = await page.$x("//button[contains(., 'Next')]");
        if (nextBtn.length > 0) {
            await nextBtn[0].click();
            await new Promise(r => setTimeout(r, 1000));
        }

        // Step 3: Wants
        await page.screenshot({ path: `${screenshotsDir}/budget_step_3_wants.png` });
        const wantsInputs = await page.$$('input[type="text"]');
        if (wantsInputs.length > 0) {
            await wantsInputs[0].click({ clickCount: 3 });
            await wantsInputs[0].type('15000');
        }
        // Click Next
        nextBtn = await page.$x("//button[contains(., 'Next')]");
        if (nextBtn.length > 0) {
            await nextBtn[0].click();
            await new Promise(r => setTimeout(r, 1000));
        }

        // Step 4: Goals
        await page.screenshot({ path: `${screenshotsDir}/budget_step_4_goals.png` });
        // Click Finish
        const finishBtn = await page.$x("//button[contains(., 'Finish')]");
        if (finishBtn.length > 0) {
            await finishBtn[0].click();
            // Wait for loading or result
            console.log('⏳ Waiting for Budget Result...');
            await new Promise(r => setTimeout(r, 3000)); // Mock wait or real API wait
            await page.screenshot({ path: `${screenshotsDir}/budget_planning_result.png` });
        }
        // 7. Test Profile Update
        console.log('👤 Navigating to Profile...');
        await page.goto(`${baseUrl}/profile`, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000)); // Wait for animation
        await page.screenshot({ path: `${screenshotsDir}/profile.png` });

        // Update Name
        console.log('✏️ Updating Name...');
        // Wait for input
        await page.waitForSelector('input[type="text"]');
        const inputs = await page.$$('input[type="text"]');
        if (inputs.length > 0) {
            await inputs[0].type(' Updated'); // First text input is Name
        } else {
            throw new Error("Could not find Name input");
        }
        // Find Save Button (contains text 'Save Changes')
        const saveBtn = await page.$x("//button[contains(., 'Save Changes')]");
        if (saveBtn.length > 0) {
            await saveBtn[0].click();
            await new Promise(r => setTimeout(r, 2000)); // Wait for Swal and update
            await page.screenshot({ path: `${screenshotsDir}/profile_updated.png` });
            console.log('📸 Captured Profile Update success.');
        } else {
            console.log('⚠️ Could not find Save button');
        }

        // Verify Navbar Sync
        console.log('🔄 Verifying Navbar Sync...');
        await page.screenshot({ path: `${screenshotsDir}/navbar_sync.png` });

        // Verify Dashboard Header Removal
        await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 1000));
        await page.screenshot({ path: `${screenshotsDir}/dashboard_final.png` });

        console.log('🎉 All Screenshots Captured!');

    } catch (error) {
        console.error('❌ Error capturing screenshots:', error);
    } finally {
        await browser.close();
    }
})();
