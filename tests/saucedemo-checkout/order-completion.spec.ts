import { test, expect } from '@playwright/test';
import {
  addBackpackAndBikeLight,
  fillCheckoutInformation,
  goToCheckoutInformation,
  login,
  openCart,
} from './fixtures';

test('finishing a two-item order confirms completion and clears the cart', async ({ page }) => {
  await login(page);
  await addBackpackAndBikeLight(page);
  await openCart(page);
  await goToCheckoutInformation(page);
  await fillCheckoutInformation(page);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByText('Total: $43.18')).toBeVisible();
  await page.getByRole('button', { name: 'Finish' }).click();

  await expect(page).toHaveURL(/\/checkout-complete\.html$/);
  await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
  await expect(page.getByText('Thank you for your order!')).toBeVisible();
  await expect(page.getByText(/Your order has been dispatched/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Back Home' })).toBeEnabled();
  await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

  await page.getByRole('button', { name: 'Back Home' }).click();
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await openCart(page);
  await expect(page.locator('.cart_item')).toHaveCount(0);
});