import { test, expect } from '@playwright/test';
import {
  addBackpackAndBikeLight,
  login,
  openCart,
  sauceDemoUrl,
} from './fixtures';

test('standard user can log in and review both selected products in the cart', async ({ page }) => {
  await login(page);
  await addBackpackAndBikeLight(page);
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  await openCart(page);
  await expect(page.locator('.cart_item')).toHaveCount(2);

  const backpack = page.locator('.cart_item').filter({ hasText: 'Sauce Labs Backpack' });
  await expect(backpack).toContainText('carry.allTheThings()');
  await expect(backpack.locator('.cart_quantity')).toHaveText('1');
  await expect(backpack.locator('.inventory_item_price')).toHaveText('$29.99');

  const bikeLight = page.locator('.cart_item').filter({ hasText: 'Sauce Labs Bike Light' });
  await expect(bikeLight).toContainText('Water-resistant with 3 lighting modes');
  await expect(bikeLight.locator('.cart_quantity')).toHaveText('1');
  await expect(bikeLight.locator('.inventory_item_price')).toHaveText('$9.99');

  await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();

  // Requirement gap: the observed cart has no item-total/tax/total summary.
  await expect(page.getByText('Item total', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Cart total', { exact: true })).toHaveCount(0);
});

test('logged-out direct navigation to checkout does not expose checkout information', async ({ browser }) => {
  // A new context ensures this check cannot inherit another test's authentication or cart.
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(`${sauceDemoUrl}/checkout-step-one.html`);
    await expect(page).toHaveURL(/saucedemo\.com\/(?:index\.html)?$/);
    await expect(page.getByPlaceholder('First Name')).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test('Continue Shopping returns to inventory without removing cart items', async ({ page }) => {
  await login(page);
  await addBackpackAndBikeLight(page);
  await openCart(page);
  await page.getByRole('button', { name: 'Continue Shopping' }).click();

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  await openCart(page);
  await expect(page.locator('.cart_item')).toHaveCount(2);
});