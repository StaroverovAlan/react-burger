import { expect, test } from '@playwright/test';

const harPath = './e2e/hars/constructor.har';

const bunId = '60666c42cc7b410027a1a9b1';
const sauceId = '60666c42cc7b410027a1a9b7';

test.describe('Страница конструктора', () => {
  test.beforeEach(async ({ context, page }): Promise<void> => {
    await page.routeFromHAR(harPath, {
      url: '**/api/**',
      update: false,
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://127.0.0.1:5173',
      },
    ]);

    await page.addInitScript((): void => {
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
    });
  });

  test('позволяет открыть данные ингредиента, собрать бургер и создать заказ', async ({
    page,
  }): Promise<void> => {
    await page.goto('/');

    const bunCard = page.getByTestId(`ingredient-card-${bunId}`);
    const sauceCard = page.getByTestId(`ingredient-card-${sauceId}`);
    const constructor = page.getByTestId('burger-constructor');
    const closeModalButton = page.getByRole('button', {
      name: 'Закрыть модальное окно',
    });
    const orderButton = page.getByRole('button', { name: 'Оформить заказ' });

    await expect(page.getByText('Соберите бургер')).toBeVisible();
    await expect(bunCard).toBeVisible();

    await bunCard.click();

    const modal = page.getByTestId('modal');

    await expect(modal).toContainText('Краторная булка N-200i');
    await expect(modal).toContainText('Калории, ккал');

    await closeModalButton.click();
    await expect(modal).toHaveCount(0);

    await bunCard.dragTo(constructor);
    await sauceCard.dragTo(constructor);

    await expect(constructor).toContainText('Краторная булка N-200i (верх)');
    await expect(constructor).toContainText('Краторная булка N-200i (низ)');
    await expect(constructor).toContainText('Соус Spicy-X');

    const orderResponsePromise = page.waitForResponse((response) => {
      return (
        response.url().endsWith('/api/orders') && response.request().method() === 'POST'
      );
    });

    await orderButton.click();

    const orderResponse = await orderResponsePromise;

    expect(orderResponse.ok()).toBeTruthy();

    const orderModal = page.getByTestId('modal');

    await expect(orderModal).toContainText('77777');
    await expect(orderModal).toContainText('идентификатор заказа');
    await expect(page.getByTestId('order-details')).toBeVisible();

    await closeModalButton.click();
    await expect(orderModal).toHaveCount(0);
  });
});
