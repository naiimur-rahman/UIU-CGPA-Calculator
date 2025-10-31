
import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Navigate to the local HTML file
        file_path = os.path.abspath('index.html')
        await page.goto(f'file://{file_path}')

        # Click the 'Credit' tab button
        await page.click('#credit-tab-btn')

        # Manually make the credit tab visible
        await page.evaluate("document.querySelector('#credit-tab').style.display = 'block'")

        # Fill in the input fields
        await page.fill('#completed-credit-input', '100')
        await page.fill('#trimester-completed-input', '13')

        # Click the calculate button
        await page.click('#calculate-credit-btn')

        # Wait for the result to be visible
        await page.wait_for_selector('#credit-result-section', state='visible')

        # Take a screenshot
        await page.screenshot(path='jules-scratch/verification/verification.png')

        await browser.close()

asyncio.run(main())
