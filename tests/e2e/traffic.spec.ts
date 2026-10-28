// Verifies the real traffic stream lists approaching faster cars at the overlay's native size.
import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 500, height: 200 } });

test('given three faster cars behind in the multiclass dump when traffic telemetry arrives then it lists them nearest first with their classes', async ({
  page,
}) => {
  await page.goto('/traffic');

  await expect(page.locator('#root .truncate')).toHaveText([
    'Aussie Greg Hill',
    'Jeff Rubin',
    'Derek Edgerton',
  ]);
  await expect(page.getByText('LMP2', { exact: true })).toBeVisible();
  await expect(page.getByText('GTP', { exact: true })).toHaveCount(2);

  await expect(page).toHaveScreenshot('traffic-multiclass.png', {
    animations: 'disabled',
    omitBackground: true,
  });
});
