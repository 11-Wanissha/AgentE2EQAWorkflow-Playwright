import { test, expect } from '@playwright/test';
import {
  addBackpackAndBikeLight,
  fillCheckoutInformation,
  goToCheckoutInformation,
  login,
  openCart,
} from './fixtures';

async function proceedToOverview(page: import('@playwright/test').Page): Promise<void> {
  await login(page);
  await addBackpackAndBikeLight(page);
  await openCart(page);
  await goToCheckoutInformation(page);
  await fillCheckoutInformation(page);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
}

test('two-item checkout overview shows accurate products, payment, shipping, and totals', async ({ page }) => {
  await proceedToOverview(page);

  await expect(page.locator('.title')).toHaveText('Checkout: Overview');
  await expect(page.locator('.cart_item')).toHaveCount(2);
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
  await expect(page.getByText('Payment Information')).toBeVisible();
  await expect(page.getByText('SauceCard #31337')).toBeVisible();
  await expect(page.getByText('Shipping Information')).toBeVisible();
  await expect(page.getByText('Free Pony Express Delivery!')).toBeVisible();
  await expect(page.getByText('Item total: $39.98')).toBeVisible();
  await expect(page.getByText('Tax: $3.20')).toBeVisible();
  await expect(page.getByText('Total: $43.18')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
});

test('known defect: an empty cart can proceed to an overview with zero totals', async ({ page }) => {
  await login(page);
  await addBackpackAndBikeLight(page);
  await openCart(page);
  await page.locator('.cart_item').filter({ hasText: 'Sauce Labs Backpack' }).getByRole('button', { name: 'Remove' }).click();
  await page.locator('.cart_item').filter({ hasText: 'Sauce Labs Bike Light' }).getByRole('button', { name: 'Remove' }).click();
  await expect(page.locator('.cart_item')).toHaveCount(0);
  await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

  await goToCheckoutInformation(page);
  await fillCheckoutInformation(page);
  await page.getByRole('button', { name: 'Continue' }).click();

  // Characterization of the empty-cart business-rule defect; this is not a passing requirement check.
  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(page.getByText('Item total: $0', { exact: true })).toBeVisible();
  await expect(page.getByText('Tax: $0.00')).toBeVisible();
  await expect(page.getByText('Total: $0.00')).toBeVisible();
});

test('known defect: Cancel from overview returns to inventory while preserving the cart', async ({ page }) => {
  await proceedToOverview(page);
  await page.getByRole('button', { name: 'Cancel' }).click();

  // Requirement says Cart; current observed behavior is inventory, so assert the defect explicitly.
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  await openCart(page);
  await expect(page.locator('.cart_item')).toHaveCount(2);
});