// Verifies real weather SSE data and a fixed local clock render in the weather overlay.
import { expect, test } from '@playwright/test';

test.use({ locale: 'en-GB', timezoneId: 'UTC' });

test('given the multiclass dump and a fixed clock when weather receives telemetry then it shows temperatures, north wind, and both clocks', async ({
  page,
}) => {
  await page.clock.setFixedTime('2026-01-01T12:00:00Z');
  await page.goto('/weather-dashboard/');

  await expect(page.getByText('23.9°C', { exact: true })).toBeVisible();
  await expect(page.getByText('21.1°C', { exact: true })).toBeVisible();
  await expect(page.getByText('11.3 km/h', { exact: true })).toBeVisible();
  await expect(page.locator('span').filter({ hasText: /^N$/ })).toBeVisible();
  await expect(page.getByText('14:00', { exact: true })).toBeVisible();
  await expect(page.getByText('12:00', { exact: true })).toBeVisible();

  await expect(page).toHaveScreenshot('weather-multiclass.png', { animations: 'disabled' });
});
