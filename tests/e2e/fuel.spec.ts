// Verifies real fuel telemetry renders without estimates when the static dump has no consumption history.
import { expect, test } from '@playwright/test';

test('given the multiclass dump without fuel history when fuel telemetry arrives then it shows fuel and race time with unavailable consumption and refill estimates', async ({
  page,
}) => {
  await page.goto('/fuel');

  await expect(page.getByText('50.8', { exact: true })).toBeVisible();
  await expect(page.getByText('00:07:33', { exact: true })).toBeVisible();
  // Two consumption fields and three refill fields cannot be estimated from a single frozen frame.
  await expect(page.getByText('--.--', { exact: true })).toHaveCount(5);

  await expect(page).toHaveScreenshot('fuel-multiclass.png', { animations: 'disabled' });
});
