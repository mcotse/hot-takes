import { colors, shadows, fonts, tokens } from './tokens'

describe('Design Tokens', () => {
  describe('colors', () => {
    it('should have warm paper background color', () => {
      expect(colors.background).toBe('#fdfbf7')
    })

    it('should use soft pencil black (not pure black)', () => {
      expect(colors.foreground).toBe('#2d2d2d')
      expect(colors.foreground).not.toBe('#000000')
    })

    it('should have all required colors', () => {
      expect(colors.background).toBeDefined()
      expect(colors.foreground).toBeDefined()
      expect(colors.muted).toBeDefined()
      expect(colors.accent).toBeDefined()
      expect(colors.secondary).toBeDefined()
      expect(colors.border).toBeDefined()
    })
  })

  describe('shadows', () => {
    it('should have no blur in shadows (hard offset only)', () => {
      // All shadows should have 0px blur
      expect(shadows.sm).toMatch(/0px 0px/)
      expect(shadows.md).toMatch(/0px 0px/)
      expect(shadows.lg).toMatch(/0px 0px/)
    })

    it('should have correct offsets', () => {
      expect(shadows.sm).toContain('2px 2px')
      expect(shadows.md).toContain('4px 4px')
      expect(shadows.lg).toContain('8px 8px')
    })
  })

  describe('fonts', () => {
    it('should use Kalam for headings', () => {
      expect(fonts.heading).toContain('Kalam')
    })

    it('should use Patrick Hand for body', () => {
      expect(fonts.body).toContain('Patrick Hand')
    })
  })

  describe('tokens export', () => {
    it('should export all token categories', () => {
      expect(tokens.colors).toBeDefined()
      expect(tokens.fonts).toBeDefined()
      expect(tokens.shadows).toBeDefined()
      expect(tokens.spacing).toBeDefined()
      expect(tokens.borderWidths).toBeDefined()
      expect(tokens.zIndex).toBeDefined()
    })
  })
})
