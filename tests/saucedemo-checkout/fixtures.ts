import { expect, type Page } from '@playwright/test';

export const sauceDemoUrl = 'https://www.saucedemo.com';

export async function login(page: Page): Promise<void> {
  await page.goto(sauceDemoUrl);
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/inventory\.html$/);
}

export async function addBackpackAndBikeLight(page: Page): Promise<void> {
  const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
  const bikeLight = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Bike Light' });

  await backpack.getByRole('button', { name: 'Add to cart' }).click();
  await bikeLight.getByRole('button', { name: 'Add to cart' }).click();
}

export async function openCart(page: Page): Promise<void> {
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/\/cart\.html$/);
}

export async function goToCheckoutInformation(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
}

export async function fillCheckoutInformation(
  page: Page,
  firstName = 'Taylor',
  lastName = 'Morgan',
  postalCode = '94105',
): Promise<void> {
  await page.getByPlaceholder('First Name').fill(firstName);
  await page.getByPlaceholder('Last Name').fill(lastName);
  await page.getByPlaceholder('Zip/Postal Code').fill(postalCode);
}