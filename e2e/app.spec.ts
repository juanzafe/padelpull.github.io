import { test, expect, Page } from '@playwright/test'

test.describe('PadelPull App', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  const abrirModalAnadir = async (page: Page) => {
    await page.getByTestId('btn-add-player').click()
    await expect(page.getByLabel('Nombre')).toBeVisible()
  }

  const confirmarJugador = async (page: Page, nombre: string) => {
  await page.getByTestId('btn-confirm-player').click()

  // jugador añadido a la lista
  await expect(
    page.getByText(nombre, { exact: true })
  ).toBeVisible()

  // input limpio → listo para siguiente jugador
  await expect(
    page.getByLabel('Nombre')
  ).toHaveValue('')
}

  test('muestra el título correctamente', async ({ page }) => {
    await expect(page.getByText('Padel Pull').first()).toBeVisible()
  })

  test('muestra mensaje vacío cuando no hay jugadores', async ({ page }) => {
    await expect(page.getByText(/Añade jugadores/)).toBeVisible()
  })

  test('añade un jugador correctamente', async ({ page }) => {
    await abrirModalAnadir(page)
    await page.getByLabel('Nombre').fill('TestJugador')
    await confirmarJugador(page, 'TestJugador')
  })

  test('elimina un jugador', async ({ page }) => {
    await abrirModalAnadir(page)
    await page.getByLabel('Nombre').fill('TestJugador')
    await confirmarJugador(page, 'TestJugador')

    await page.getByTestId('btn-delete-player').first().click()
    await expect(page.getByText('TestJugador', { exact: true })).not.toBeVisible()
  })

  test('genera partidos con 4 jugadores', async ({ page }) => {
    const jugadores = ['Jugador1', 'Jugador2', 'Jugador3', 'Jugador4']

    for (const nombre of jugadores) {
      await abrirModalAnadir(page)
      await page.getByLabel('Nombre').fill(nombre)
      await confirmarJugador(page, nombre)
    }

    await page.getByTestId('btn-generate-pull').click()
    await expect(page.getByText('Partidos')).toBeVisible()
  })

})