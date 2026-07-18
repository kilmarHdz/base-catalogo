import { test, expect } from '@playwright/test';

test.describe('smoke', () => {
  test('home page loads and shows hero', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Catálogo Base/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('catalog page renders products', async ({ page }) => {
    await page.goto('/productos');
    await expect(page.getByRole('heading', { name: /Catálogo de Productos/i })).toBeVisible();
    const cards = page.locator('article');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/nosotros');
    await expect(page.getByRole('heading', { name: /Quiénes Somos/i })).toBeVisible();
  });

  test('contact page shows form', async ({ page }) => {
    await page.goto('/contacto');
    await expect(page.getByRole('heading', { name: /Contáctanos/i })).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
  });

  test('404 page is branded', async ({ page }) => {
    const response = await page.goto('/ruta-que-no-existe-1234');
    expect(response?.status()).toBe(404);
    await expect(page.getByText('Página no encontrada')).toBeVisible();
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const initialClass = await html.getAttribute('class');
    await page.getByRole('button', { name: /tema/i }).click();
    const newClass = await html.getAttribute('class');
    expect(newClass !== initialClass || initialClass === null).toBeTruthy();
  });

  test('add to cart from catalog', async ({ page }) => {
    await page.goto('/productos');
    const firstAddButton = page.getByRole('button', { name: /Añadir .* al carrito/i }).first();
    await firstAddButton.click();
    await expect(page.getByRole('button', { name: /Ver carrito/i })).toContainText(/[1-9]/);
  });
});
