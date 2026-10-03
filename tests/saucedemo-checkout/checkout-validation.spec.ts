import { test, expect } from '@playwright/test';
import {
  addBackpackAndBikeLight,
  fillCheckoutInformation,
  goToCheckoutInformation,
  login,
  openCart,
} from './fixtures';

const requiredFieldCases = [
  { name: 'First Name', values: ['', '', ''], error: 'Error: First Name is required' },
  { name: 'Last Name', values: ['Taylor', '', ''], error: 'Error: Last Name is required' },
  { name: 'Postal Code', values: ['Taylor', 'Morgan', ''], error: 'Error: Postal Code is required' },
] as const;

for (const scenario of requiredFieldCases) {
  test(`checkout blocks submission when ${scenario.name} is missing`, async ({ page }) => {
    await login(page);
    await addBackpackAndBikeLight(page);
    await openCart(page);
    await goToCheckoutInformation(page);
    await fillCheckoutInformation(page, ...scenario.values);

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText(scenario.error, { exact: true })).toBeVisible();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });
}

test('correcting missing checkout fields allows progression to the order overview', async ({ page }) => {
  await login(page);
  await addBackpackAndBikeLight(page);
  await openCart(page);
  await goToCheckoutInformation(page);

  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByText('Error: First Name is required', { exact: true })).toBeVisible();
  await page.getByPlaceholder('First Name').fill('Taylor');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByText('Error: Last Name is required', { exact: true })).toBeVisible();
  await page.getByPlaceholder('Last Name').fill('Morgan');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByText('Error: Postal Code is required', { exact: true })).toBeVisible();
  await page.getByPlaceholder('Zip/Postal Code').fill('94105');
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(page.getByText('Item total: $39.98')).toBeVisible();
});

test('known defect: malformed checkout values are currently accepted', async ({ page }) => {
  await login(page);
  await addBackpackAndBikeLight(page);
  await openCart(page);
  await goToCheckoutInformation(page);
  await fillCheckoutInformation(page, '@#$', '!!!', 'abc');
  await page.getByRole('button', { name: 'Continue' }).click();

  // Characterization only: the intended format-validation requirement is not met today.
  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(page.getByText(/Error:/)).toHaveCount(0);
});