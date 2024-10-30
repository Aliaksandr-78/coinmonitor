import { test, expect } from '@playwright/test'

test.describe('Cryptocurrency App', () => {

  // Тест на проверку поиска монет
  test('should filter the coin list based on search input', async ({ page }) => {
    await page.goto('http://localhost:8080')

    // Ввод в поле поиска
    await page.fill('[data-testid="search-input"]', 'bitcoin')
    
    // Проверка на отображение биткойна в таблице результатов
    const visibleCoins = await page.locator('[data-testid="coin-name"]').allTextContents()
    expect(visibleCoins).toContain('Bitcoin')
  })

  // Тест на добавление монеты в портфель
  test('should add a coin to the portfolio', async ({ page }) => {
    await page.goto('http://localhost:8080')

    // Открываем модальное окно для покупки
    await page.click('[data-testid="buy-bitcoin-button"]')
    await page.fill('[data-testid="quantity-input"]', '2')
    await page.click('[data-testid="confirm-buy-button"]')

    // Проверяем, что монета добавлена в портфель
    const portfolioItems = await page.locator('[data-testid="portfolio-item"]').allTextContents()
    expect(portfolioItems).toContain('Bitcoin')
  })

  // Тест на удаление монеты из портфеля
  test('should remove a coin from the portfolio', async ({ page }) => {
    await page.goto('http://localhost:8080')

    // Добавляем монету, чтобы можно было ее удалить
    await page.click('[data-testid="buy-bitcoin-button"]')
    await page.fill('[data-testid="quantity-input"]', '1')
    await page.click('[data-testid="confirm-buy-button"]')

    // Удаляем монету
    await page.click('[data-testid="remove-bitcoin-button"]')
    
    // Проверяем, что монета удалена
    const portfolioItems = await page.locator('[data-testid="portfolio-item"]').allTextContents()
    expect(portfolioItems).not.toContain('Bitcoin')
  })

  // Тест на открытие и закрытие модального окна
  test('should open and close buy coin modal', async ({ page }) => {
    await page.goto('http://localhost:8080')

    // Открыть модальное окно
    await page.click('[data-testid="buy-bitcoin-button"]')
    await expect(page.locator('[data-testid="buy-coin-modal"]')).toBeVisible()

    // Закрыть модальное окно
    await page.click('[data-testid="close-modal-button"]')
    await expect(page.locator('[data-testid="buy-coin-modal"]')).not.toBeVisible()
  })

  // Тест на валидацию ввода
  test('should validate the quantity input', async ({ page }) => {
    await page.goto('http://localhost:8080')

    // Открыть модальное окно покупки
    await page.click('[data-testid="buy-bitcoin-button"]')
    
    // Ввести некорректное значение и попытаться купить
    await page.fill('[data-testid="quantity-input"]', '-1')
    await page.click('[data-testid="confirm-buy-button"]')

    // Проверить отображение сообщения об ошибке
    const errorMessage = await page.locator('[data-testid="quantity-error-message"]').textContent()
    expect(errorMessage).toBe('Минимальное количество монет для покупки: 1')
  })

  // Тест на проверку корректности расчета стоимости
  test('should calculate the total cost based on the latest price', async ({ page }) => {
    await page.goto('http://localhost:8080')

    // Открыть модальное окно покупки
    await page.click('[data-testid="buy-bitcoin-button"]')
    await page.fill('[data-testid="quantity-input"]', '2')
    
    // Получить текущую цену
    const currentPriceText = await page.locator('[data-testid="coin-price"]').textContent()
    if (!currentPriceText) {
      throw new Error('Current price is not available')
    }
    
    const currentPrice = parseFloat(currentPriceText.replace('$', ''))
    const totalPrice = currentPrice * 2

    // Получить отображаемую общую стоимость
    const displayedTotalPriceText = await page.locator('[data-testid="total-price"]').textContent()
    if (!displayedTotalPriceText) {
      throw new Error('Displayed total price is not available')
    }
    
    const displayedTotalPrice = parseFloat(displayedTotalPriceText.replace('$', ''))
    expect(displayedTotalPrice).toBeCloseTo(totalPrice, 2)
  })

  // Тест на обновление цены в реальном времени
  test('should update the displayed coin price in real-time', async ({ page }) => {
    await page.goto('http://localhost:8080')

    // Сохранить начальную цену
    const initialPriceText = await page.locator('[data-testid="coin-price"]').textContent()
    expect(initialPriceText).not.toBeNull()
    
    // Симулировать изменение цены
    await page.evaluate(() => {
      window.simulatePriceChange('bitcoin', 65000)
    })

    // Проверяем, что цена изменилась
    const updatedPriceText = await page.locator('[data-testid="coin-price"]').textContent()
    expect(updatedPriceText).not.toBe(initialPriceText)
    expect(updatedPriceText).toContain('65000')
  })

  // Тест на добавление нескольких монет и проверку общей стоимости портфеля
  test('should correctly calculate the total portfolio value after adding multiple coins', async ({ page }) => {
    await page.goto('http://localhost:8080')

    // Добавляем первую монету
    await page.click('[data-testid="buy-bitcoin-button"]')
    await page.fill('[data-testid="quantity-input"]', '2')
    await page.click('[data-testid="confirm-buy-button"]')

    // Добавляем вторую монету
    await page.click('[data-testid="buy-ethereum-button"]')
    await page.fill('[data-testid="quantity-input"]', '3')
    await page.click('[data-testid="confirm-buy-button"]')

    // Получаем общую стоимость портфеля
    const portfolioValueText = await page.locator('[data-testid="portfolio-value"]').textContent()
    expect(portfolioValueText).not.toBeNull()

    const portfolioValue = parseFloat(portfolioValueText!.replace('$', ''))
    expect(portfolioValue).toBeGreaterThan(0)
  })

  // Тест на проверку отображения уведомления при успешной покупке
  test('should display a success notification when a coin is purchased', async ({ page }) => {
    await page.goto('http://localhost:8080')

    // Открываем модальное окно и покупаем монету
    await page.click('[data-testid="buy-bitcoin-button"]')
    await page.fill('[data-testid="quantity-input"]', '1')
    await page.click('[data-testid="confirm-buy-button"]')

    // Проверяем, что появилось уведомление об успешной покупке
    const notificationText = await page.locator('[data-testid="success-notification"]').textContent()
    expect(notificationText).toBe('Покупка успешно выполнена')
  })

  // Тест на проверку обработки ошибок при неудачном запросе к API
  test('should display an error message if API request fails', async ({ page }) => {
    await page.goto('http://localhost:8080')

    // Симулируем ошибку в ответе API
    await page.evaluate(() => {
      window.simulateApiError('bitcoin')
    })

    // Проверяем, что отображается сообщение об ошибке
    const errorMessage = await page.locator('[data-testid="api-error-message"]').textContent()
    expect(errorMessage).toBe('Не удалось загрузить данные, попробуйте позже')
  })

  // Тест на проверку сохранения и загрузки портфеля после перезагрузки страницы
  test('should persist portfolio data after page reload', async ({ page }) => {
    await page.goto('http://localhost:8080')

    // Добавляем монету в портфель
    await page.click('[data-testid="buy-bitcoin-button"]')
    await page.fill('[data-testid="quantity-input"]', '2')
    await page.click('[data-testid="confirm-buy-button"]')

    // Перезагружаем страницу
    await page.reload()

    // Проверяем, что монета все еще находится в портфеле
    const portfolioItems = await page.locator('[data-testid="portfolio-item"]').allTextContents()
    expect(portfolioItems).toContain('Bitcoin')
  })
})
