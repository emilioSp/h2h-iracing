// Verifies real car-control telemetry renders in the car overlay before comparing its layout.
import { expect, test } from '@playwright/test';

test('given the multiclass dump when car telemetry arrives then it shows ABS 4, TC 3, brake bias 51.1%, and the pit limiter off', async ({
  page,
}) => {
  await page.goto('/car');

  await expect(page.getByText('4', { exact: true })).toBeVisible();
  await expect(page.getByText('3', { exact: true })).toBeVisible();
  await expect(page.getByText('51.1%', { exact: true })).toBeVisible();
  await expect(page.getByText('OFF', { exact: true })).toBeVisible();

  await expect(page).toHaveScreenshot('car-multiclass.png', { animations: 'disabled' });
});
