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

    await page.routeFromHAR(harPath, { url: '**/api/**', notFound: 'abort' });
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
      const modal = page.getByTestId('modal');

      await expect(firstIngredient).toBeVisible();
      await firstIngredient.locator('a').click();

      await expect(modal).toBeVisible();
      await expect(page.getByTestId('modal-title')).toContainText('Детали ингредиента');

      await modal.getByRole('button').click();
      await expect(modal).toBeHidden();
    });

    test('должно закрываться кликом по оверлею', async ({ page }) => {
      const ingredientElements = page.locator('[data-testid^="ingredient-"]');
      const firstIngredient = ingredientElements.first();
      const modal = page.getByTestId('modal');
      const overlay = page.getByTestId('modal-overlay');

      await firstIngredient.locator('a').click();
      await expect(modal).toBeVisible();
      await expect(overlay).toBeVisible();

      await overlay.click({ position: { x: 10, y: 10 }, force: true });
      await expect(modal).toBeHidden();
    });

    test('должно показывать данные выбранного ингредиента в модальном окне', async ({ page }) => {
      const ingredientElements = page.locator('[data-testid^="ingredient-"]');
      const firstIngredient = ingredientElements.first();
      const ingredientTitle = (await firstIngredient.locator('p').nth(1).textContent())?.trim();
      const modal = page.getByTestId('modal');

      expect(ingredientTitle).toBeTruthy();

      await firstIngredient.locator('a').click();
      await expect(modal).toBeVisible();
      await expect(modal.getByText(ingredientTitle!)).toBeVisible();

      await modal.getByRole('button').click();
      await expect(modal).toBeHidden();
    });
  });

  test('должен добавлять булку и начинку в конструктор', async ({ page }) => {
    const ingredientElements = page.locator('[data-testid^="ingredient-"]');
    const bunItem = ingredientElements.nth(0);
    const mainItem = ingredientElements.nth(1);
    const constructor = page.getByTestId('burger-constructor');

    await bunItem.getByRole('button', { name: 'Добавить' }).click();
    await mainItem.getByRole('button', { name: 'Добавить' }).click();

    await expect(constructor.getByText('Тест булка (верх)')).toBeVisible();
    await expect(constructor.getByText('Тест булка (низ)')).toBeVisible();
    await expect(constructor.getByText('Тест начинка')).toBeVisible();
  });

  test.describe('оформление заказа', () => {
    test('должно собирать бургер, оформлять заказ и закрывать окно', async ({ page }) => {
      const ingredientElements = page.locator('[data-testid^="ingredient-"]');
      const bunItem = ingredientElements.nth(0);
      const mainItem = ingredientElements.nth(1);
      const constructor = page.getByTestId('burger-constructor');
      const orderModal = page.getByTestId('modal');

      await bunItem.getByRole('button', { name: 'Добавить' }).click();
      await mainItem.getByRole('button', { name: 'Добавить' }).click();

      await expect(constructor.getByText('Тест булка (верх)')).toBeVisible();
      await expect(constructor.getByText('Тест булка (низ)')).toBeVisible();
      await expect(constructor.getByText('Тест начинка')).toBeVisible();

      const orderButton = page.getByTestId('order-button');
      await expect(orderButton).toBeEnabled();

      await Promise.all([
        page.waitForResponse((response) =>
          response.url().includes('/orders') && response.request().method() === 'POST'
        ),
        orderButton.click()
      ]);

      await expect(orderModal.getByText('12345')).toBeVisible();
      await expect(orderModal.getByText('идентификатор заказа')).toBeVisible();

      await orderModal.getByRole('button').click();
      await expect(orderModal).toBeHidden();
      await expect(constructor.getByText('Выберите булки').first()).toBeVisible();
      await expect(constructor.getByText('Выберите начинку').first()).toBeVisible();
    });
  });
});
