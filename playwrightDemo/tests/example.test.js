import { test, expect } from '@playwright/test';
import { validData,invalidData } from '../dataset.test/users.mock';

test.describe('Basic Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173'); 
  });

  test('should validate required fields and show errors', async ({ page }) => {
    await page.getByTestId('submit-button').click();
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Valid email is required')).toBeVisible();
    await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
    await expect(page.locator('text=Address is required')).toBeVisible();
    
  });

  test('should successfully submit the form and validate table data', async ({ page }) => {
    for (const data of validData) {
      await page.getByLabel('Name').fill(data.name);
      await page.getByLabel('Email').fill(data.email);
      await page.getByLabel('Password').fill(data.password);
      await page.getByLabel('Address').fill(data.address);
      await page.getByLabel(data.gender,{exact:true}).click();
      await page.getByTestId('country-select').getByLabel('').click();
      await page.getByRole('option', { name: data.country }).click();
      await page.getByTestId('submit-button').click();
      
      await expect(page.getByTestId('success-message')).toBeVisible();
      
      const rows = await page.locator('table tbody tr').all();

      for (let i = 0; i < data.length; i++) {
        const row = rows[i];
        const formData = data[i];
  
        await expect(row.locator('td:nth-child(1)')).toHaveText(formData.name);
        await expect(row.locator('td:nth-child(2)')).toHaveText(formData.email);
        await expect(row.locator('td:nth-child(3)')).toHaveText(formData.address);
        await expect(row.locator('td:nth-child(4)')).toHaveText(formData.gender);
        await expect(row.locator('td:nth-child(5)')).toHaveText(formData.country);
  
        await page.screenshot({ path: `success-${formData.name}.png`, fullPage: true });
      }
    }
  });

  test('should show error message when invalid data is entered', async ({ page }) => {
    await page.getByLabel('Name').fill(invalidData.name);
    await page.getByLabel('Email').fill(invalidData.email);
    await page.getByLabel('Password').fill(invalidData.password);
    await page.getByLabel('Address').fill(invalidData.address);
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('failed-message')).toBeVisible();
  } );

  test('should show error message when invalid email is entered', async ({ page }) => {
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByTestId('submit-button').click();
    await expect(page.locator('text=Valid email is required')).toBeVisible();
  });

  test('should show error message when password is less than 6 characters', async ({ page }) => {
    await page.getByLabel('Password').fill('pass');
    await page.getByTestId('submit-button').click();
    await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
  });
});
