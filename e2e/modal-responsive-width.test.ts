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
    await page.waitForTimeout(500)

    // Load seed data
    const settingsTab = page.locator('button:has-text("Settings"), [data-testid="settings-tab"]')
    await settingsTab.click()
    await page.waitForTimeout(300)

    const loadButton = page.locator('button:has-text("Load Cast & Photos")')
    await loadButton.click()
    await page.waitForTimeout(2000)

    // Navigate to boards
    const boardsTab = page.locator('button:has-text("Boards"), [data-testid="boards-tab"]')
    await boardsTab.click()
    await page.waitForTimeout(500)

    // Open women's board
    const womenBoard = page.locator('button[aria-label*="Singles Inferno S5"]').filter({ hasText: '👩' })
    await womenBoard.click()
    await page.waitForTimeout(500)
  })

  test('modal should be constrained to 500px on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.waitForTimeout(300)

    // Click add button to open the Add Card modal
    const addButton = page.locator('button[aria-label="Add new card"]')
    await addButton.click()
    await page.waitForTimeout(300)

    // Get the bottom sheet modal
    const modal = page.locator('[data-testid="bottom-sheet"]')
    await expect(modal).toBeVisible()

    // Get the modal's bounding box
    const modalBox = await modal.boundingBox()
    expect(modalBox).not.toBeNull()

    // Verify width is <= 500px on desktop
    expect(modalBox!.width).toBeLessThanOrEqual(500)
    expect(modalBox!.width).toBeGreaterThan(400) // Should be close to 500px

    // Verify modal is horizontally centered
    const viewportWidth = 1280
    const expectedCenterX = viewportWidth / 2
    const modalCenterX = modalBox!.x + modalBox!.width / 2

    // Allow 10px tolerance for centering
    expect(Math.abs(modalCenterX - expectedCenterX)).toBeLessThan(10)

    // Take screenshot for visual verification
    await page.screenshot({ path: 'e2e/screenshots/modal-desktop-width.png', fullPage: true })
  })

  test('modal should span full width on mobile viewport', async ({ page }) => {
    // Set mobile viewport (iPhone 14 Pro Max width)
    await page.setViewportSize({ width: 430, height: 932 })
    await page.waitForTimeout(300)

    // Click add button to open the Add Card modal
    const addButton = page.locator('button[aria-label="Add new card"]')
    await addButton.click()
    await page.waitForTimeout(300)

    // Get the bottom sheet modal
    const modal = page.locator('[data-testid="bottom-sheet"]')
    await expect(modal).toBeVisible()

    // Get the modal's bounding box
    const modalBox = await modal.boundingBox()
    expect(modalBox).not.toBeNull()

    // On mobile (430px), the modal should span the full viewport width
    // Since max-w-[500px] is larger than 430px, it should be 430px wide
    expect(modalBox!.width).toBe(430)

    // Modal should start at x=0 (left edge)
    expect(modalBox!.x).toBe(0)

    // Take screenshot for visual verification
    await page.screenshot({ path: 'e2e/screenshots/modal-mobile-width.png', fullPage: true })
  })
})
