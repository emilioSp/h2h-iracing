// Verifies the real spotter stream draws only the left overlap segment at the overlay's native size.
import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 800, height: 200 } });

test('given the multiclass dump reports a car on the left when spotter telemetry arrives then only the left bar shows an overlap', async ({
  page,
}) => {
  await page.goto('/spotter');

  const leftBar = page.locator('#root > div > div').first();
  const rightBar = page.locator('#root > div > div').last();

  await expect(leftBar.locator('.bg-yellow')).toBeVisible();
  await expect(rightBar.locator(':scope > div')).toHaveCount(0);

  await expect(page).toHaveScreenshot('spotter-multiclass.png', {
    animations: 'disabled',
    omitBackground: true,
  });
});
