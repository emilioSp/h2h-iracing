// Verifies dump-backed telemetry reaches the H2H browser overlay and preserves its visual layout.
import { expect, test } from '@playwright/test';

test('given the multiclass dump when H2H receives telemetry then it shows the player and both neighbouring cars', async ({
  page,
}) => {
  await page.goto('/h2h');

  await expect(page.getByText('Spatola', { exact: true })).toBeVisible();
  await expect(page.getByText('P5', { exact: true })).toBeVisible();
  await expect(page.getByText('Szebeni', { exact: true })).toBeVisible();
  await expect(page.getByText('Hill', { exact: true })).toBeVisible();
  await expect(page.getByText('0.1s', { exact: true })).toHaveCount(2);

  // Initial lap highlights last eight seconds; capture the settled dashboard instead.
  await expect(page.locator('.animate-pulse')).toHaveCount(0, { timeout: 15_000 });
  await expect(page).toHaveScreenshot('h2h-multiclass.png', { animations: 'disabled' });
});
