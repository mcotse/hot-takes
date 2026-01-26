import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173/singles_infernal_rank/'

test.describe('Modal Responsive Width', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test data
    await page.goto(BASE_URL)
    await page.evaluate(() => {
      localStorage.clear()
      indexedDB.deleteDatabase('singles-infernal-rank-images')
    })
    await page.reload()

    // Wait for app to be ready
    await page.waitForSelector('nav[aria-label="Main navigation"]')

    // Load seed data - navigate to settings
    const settingsTab = page.locator('button:has-text("Settings"), [data-testid="settings-tab"]')
    await settingsTab.click()
    await page.waitForSelector('button:has-text("Load Cast & Photos")')

    const loadButton = page.locator('button:has-text("Load Cast & Photos")')
    await loadButton.click()

    // Wait for seed data to load by checking for success indicator
    await page.waitForSelector('button:has-text("Boards")', { timeout: 10000 })

    // Navigate to boards
    const boardsTab = page.locator('button:has-text("Boards"), [data-testid="boards-tab"]')
    await boardsTab.click()

    // Wait for boards list to appear
    await page.waitForSelector('button[aria-label*="Singles Inferno S5"]', { timeout: 5000 })

    // Open women's board
    const womenBoard = page.locator('button[aria-label*="Singles Inferno S5"]').filter({ hasText: '👩' })
    await womenBoard.click()

    // Wait for board detail page to load
    await page.waitForSelector('button[aria-label="Add new card"]', { timeout: 5000 })
  })

  test('modal should be constrained to 500px on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 })

    // Click add button to open the Add Card modal
    const addButton = page.locator('button[aria-label="Add new card"]')
    await addButton.click()

    // Wait for modal to be visible
    const modal = page.locator('[data-testid="bottom-sheet"]')
    await expect(modal).toBeVisible()

    // Get the modal's bounding box
    const modalBox = await modal.boundingBox()
    expect(modalBox).not.toBeNull()

    // Verify width is <= 500px on desktop (should be exactly 500px or close to it)
    expect(modalBox!.width).toBeLessThanOrEqual(500)
    expect(modalBox!.width).toBeGreaterThanOrEqual(490) // Allow small tolerance for rendering

    // Verify modal is horizontally centered (3px tolerance for sub-pixel rendering)
    const viewportWidth = 1280
    const expectedCenterX = viewportWidth / 2
    const modalCenterX = modalBox!.x + modalBox!.width / 2
    expect(Math.abs(modalCenterX - expectedCenterX)).toBeLessThan(3)

    // Take screenshot for visual verification
    await page.screenshot({ path: 'e2e/screenshots/modal-desktop-width.png', fullPage: true })
  })

  test('modal should span full width on mobile viewport', async ({ page }) => {
    // Set mobile viewport (iPhone 14 Pro Max width)
    await page.setViewportSize({ width: 430, height: 932 })

    // Click add button to open the Add Card modal
    const addButton = page.locator('button[aria-label="Add new card"]')
    await addButton.click()

    // Wait for modal to be visible
    const modal = page.locator('[data-testid="bottom-sheet"]')
    await expect(modal).toBeVisible()

    // Get the modal's bounding box
    const modalBox = await modal.boundingBox()
    expect(modalBox).not.toBeNull()

    // On mobile (430px), the modal should span the full viewport width
    // Allow small tolerance for sub-pixel rendering differences
    expect(modalBox!.width).toBeGreaterThanOrEqual(428)
    expect(modalBox!.width).toBeLessThanOrEqual(430)

    // Modal should start near x=0 (left edge), allow 2px tolerance
    expect(modalBox!.x).toBeGreaterThanOrEqual(0)
    expect(modalBox!.x).toBeLessThanOrEqual(2)

    // Take screenshot for visual verification
    await page.screenshot({ path: 'e2e/screenshots/modal-mobile-width.png', fullPage: true })
  })
})
