import { test, expect } from '@playwright/test';
import {
  addBackpackAndBikeLight,
  fillCheckoutInformation,
  goToCheckoutInformation,
  login,
  openCart,
} from './fixtures';

test('checkout controls and summary remain usable at a 390px mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  await addBackpackAndBikeLight(page);
  await openCart(page);
  await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);

  await goToCheckoutInformation(page);
  await expect(page.getByPlaceholder('First Name')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  await fillCheckoutInformation(page);
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByText('Total: $43.18')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.getByText('Thank you for your order!')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Back Home' })).toBeVisible();
});