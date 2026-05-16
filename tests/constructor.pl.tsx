import path from 'path';
import { test, expect } from '@playwright/test';

const harPath = path.resolve(__dirname, 'hars', 'burger-api.har');

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-token',
        domain: 'localhost',
        path: '/',
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'refresh-token');
    });

    await page.routeFromHAR(harPath, { notFound: 'fallback' });
    await page.goto('/');
  });

  test.afterEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.removeItem('refreshToken');
    });
  });

  test.describe('модальное окно ингредиента', () => {
    test('должно открываться и закрываться по кнопке', async ({ page }) => {
      const ingredientElements = page.locator('[data-testid^="ingredient-"]');
      const firstIngredient = ingredientElements.first();

      await expect(firstIngredient).toBeVisible();
      await firstIngredient.locator('a').click();

      await expect(page.getByTestId('modal')).toBeVisible();
      await expect(page.getByTestId('modal-title')).toContainText('Детали ингредиента');

      await page.locator('[data-testid="modal"] button').click();
      await expect(page.getByTestId('modal')).toBeHidden();
    });

    test('должно показывать данные выбранного ингредиента в модальном окне', async ({ page }) => {
      const ingredientElements = page.locator('[data-testid^="ingredient-"]');
      const firstIngredient = ingredientElements.first();
      const selectedIngredientName = (
        await firstIngredient.locator('p').nth(1).textContent()
      )?.trim();

      await firstIngredient.locator('a').click();
      await expect(page.getByTestId('modal')).toBeVisible();
      await expect(page.getByTestId('modal')).toContainText(selectedIngredientName || '');

      await page.locator('[data-testid="modal"] button').click();
      await expect(page.getByTestId('modal')).toBeHidden();
    });
  });

  test('должен добавлять булку и начинку в конструктор', async ({ page }) => {
    const ingredientElements = page.locator('[data-testid^="ingredient-"]');
    const bunItem = ingredientElements.nth(0);
    const mainItem = ingredientElements.nth(1);

    await bunItem.getByRole('button', { name: 'Добавить' }).click();
    await mainItem.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByText('Тест булка (верх)')).toBeVisible();
    await expect(page.getByText('Тест булка (низ)')).toBeVisible();
    await expect(page.getByTestId('burger-constructor').getByText('Тест начинка')).toBeVisible();
  });

  test.describe('оформление заказа', () => {
    test('должно собирать бургер, оформлять заказ и закрывать окно', async ({ page }) => {
      const ingredientElements = page.locator('[data-testid^="ingredient-"]');
      const bunItem = ingredientElements.nth(0);
      const mainItem = ingredientElements.nth(1);

      await bunItem.getByRole('button', { name: 'Добавить' }).click();
      await mainItem.getByRole('button', { name: 'Добавить' }).click();

      await expect(page.getByText('Тест булка (верх)')).toBeVisible();
      await expect(page.getByText('Тест булка (низ)')).toBeVisible();
      await expect(page.getByTestId('burger-constructor').getByText('Тест начинка')).toBeVisible();

      const orderButton = page.getByTestId('order-button');
      await expect(orderButton).toBeEnabled();

      await Promise.all([
        page.waitForResponse((response) =>
          response.url().includes('/orders') && response.request().method() === 'POST'
        ),
        orderButton.click()
      ]);

      await expect(page.getByText('12345')).toBeVisible();
      await expect(page.getByText('идентификатор заказа')).toBeVisible();

      await page.locator('[data-testid="modal"] button').click();
      await expect(page.getByTestId('modal')).toBeHidden();
      await expect(page.getByText('Выберите булки').first()).toBeVisible();
      await expect(page.getByText('Выберите начинку').first()).toBeVisible();
    });
  });
});
