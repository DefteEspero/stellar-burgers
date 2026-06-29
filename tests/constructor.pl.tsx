import { test, expect, Page } from '@playwright/test';
import path from 'path';

const INGREDIENTS_HAR = path.resolve(__dirname, 'hars/ingredients.har');
const ORDER_HAR = path.resolve(__dirname, 'hars/order.har');

const BUN = {
  id: '643d69a5c3f7b9001cfa093d',
  name: 'Флюоресцентная булка R2-D3'
};

const MAIN = {
  id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии'
};

const ORDER_NUMBER = '71234';
const USER_NAME = 'Тестовый Пользователь';

const mockIngredients = (page: Page) =>
  page.routeFromHAR(INGREDIENTS_HAR, {
    url: '**/api/ingredients',
    update: false,
    notFound: 'abort'
  });

const addIngredient = (page: Page, id: string) =>
  page
    .getByTestId(`ingredient-${id}`)
    .getByRole('button', { name: 'Добавить' })
    .click();

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await mockIngredients(page);
    await page.goto('/');
    await expect(page.getByTestId(`ingredient-${BUN.id}`)).toBeVisible();
  });

  test('Добавление булки и начинки из списка в конструктор', async ({
    page
  }) => {
    const constructor = page.getByTestId('burger-constructor');

    await expect(constructor).toContainText('Выберите булки');
    await expect(constructor).toContainText('Выберите начинку');

    await addIngredient(page, BUN.id);
    await addIngredient(page, MAIN.id);

    await expect(constructor).toContainText(`${BUN.name} (верх)`);
    await expect(constructor).toContainText(`${BUN.name} (низ)`);
    await expect(constructor).toContainText(MAIN.name);
    await expect(constructor).not.toContainText('Выберите начинку');
  });

  test.describe('Модальное окно ингредиента', () => {
    test('Открытие модального окна с данными выбранного ингредиента', async ({
      page
    }) => {
      const modal = page.getByTestId('modal');

      await page.getByTestId(`ingredient-${BUN.id}`).getByRole('link').click();
      await expect(modal).toBeVisible();
      await expect(modal).toContainText(BUN.name);
      await expect(modal).not.toContainText(MAIN.name);
    });

    test('Закрытие модального окна по клику на крестик', async ({ page }) => {
      const modal = page.getByTestId('modal');

      await page.getByTestId(`ingredient-${MAIN.id}`).getByRole('link').click();
      await expect(modal).toBeVisible();
      await page.getByTestId('modal-close').click();
      await expect(modal).not.toBeVisible();
    });

    test('Закрытие модального окна по клику на оверлей', async ({ page }) => {
      const modal = page.getByTestId('modal');

      await page.getByTestId(`ingredient-${MAIN.id}`).getByRole('link').click();
      await expect(modal).toBeVisible();
      await page
        .getByTestId('modal-overlay')
        .click({ position: { x: 5, y: 5 } });
      await expect(modal).not.toBeVisible();
    });
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await mockIngredients(page);

    await page.routeFromHAR(ORDER_HAR, {
      url: '**/api/auth/**',
      update: false,
      notFound: 'abort'
    });

    await page.routeFromHAR(ORDER_HAR, {
      url: '**/api/orders**',
      update: false,
      notFound: 'abort'
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://127.0.0.1:4000'
      }
    ]);

    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/');
    await expect(page.getByTestId(`ingredient-${BUN.id}`)).toBeVisible();
    await expect(page.getByText(USER_NAME)).toBeVisible();
  });

  test.afterEach(async ({ page, context }) => {
    await context.clearCookies();
  });

  test('Сборка бургера, оформление заказа и очистка конструктора', async ({
    page
  }) => {
    const constructor = page.getByTestId('burger-constructor');

    await addIngredient(page, BUN.id);
    await addIngredient(page, MAIN.id);
    await expect(constructor).toContainText(MAIN.name);
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText(ORDER_NUMBER);
    await expect(constructor).toContainText('Выберите булки');
    await expect(constructor).toContainText('Выберите начинку');
    await expect(constructor).not.toContainText(MAIN.name);
    await page.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();
  });
});
