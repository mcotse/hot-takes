/**
 * Rate Limiting Tests
 *
 * Tests for client-side rate limiting functions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock Firebase modules
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  Timestamp: {
    now: () => ({ toMillis: () => Date.now() }),
    fromMillis: (ms: number) => ({ toMillis: () => ms }),
  },
}))

vi.mock('./firebase', () => ({
  getFirebaseDb: vi.fn(),
  USE_MOCK_AUTH: true,
}))

describe('rateLimiting', () => {
  const mockUserId = 'user-abc'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('RATE_LIMITS', () => {
    it('should export rate limit constants', async () => {
      const { RATE_LIMITS } = await import('./rateLimiting')

      expect(RATE_LIMITS.friendRequests).toBeDefined()
      expect(RATE_LIMITS.friendRequests.count).toBe(20)
      expect(RATE_LIMITS.friendRequests.windowMs).toBe(24 * 60 * 60 * 1000)

      expect(RATE_LIMITS.reports).toBeDefined()
      expect(RATE_LIMITS.reports.count).toBe(10)
      expect(RATE_LIMITS.reports.windowMs).toBe(24 * 60 * 60 * 1000)

      expect(RATE_LIMITS.boards).toBeDefined()
      expect(RATE_LIMITS.boards.count).toBe(50)
      expect(RATE_LIMITS.boards.windowMs).toBe(24 * 60 * 60 * 1000)
    })
  })

  describe('checkFriendRequestLimit', () => {
    it('should return allowed=true when under limit', async () => {
      const { checkFriendRequestLimit } = await import('./rateLimiting')

      const result = await checkFriendRequestLimit(mockUserId)

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBeGreaterThan(0)
      expect(result.error).toBeUndefined()
    })

    it('should return allowed=false when user is null', async () => {
      const { checkFriendRequestLimit } = await import('./rateLimiting')

      const result = await checkFriendRequestLimit(null)

      expect(result.allowed).toBe(false)
      expect(result.error).toBe('Not signed in')
    })
  })

  describe('checkReportLimit', () => {
    it('should return allowed=true when under limit', async () => {
      const { checkReportLimit } = await import('./rateLimiting')

      const result = await checkReportLimit(mockUserId)

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBeGreaterThan(0)
      expect(result.error).toBeUndefined()
    })

    it('should return allowed=false when user is null', async () => {
      const { checkReportLimit } = await import('./rateLimiting')

      const result = await checkReportLimit(null)

      expect(result.allowed).toBe(false)
      expect(result.error).toBe('Not signed in')
    })
  })

  describe('checkBoardCreationLimit', () => {
    it('should return allowed=true when under limit', async () => {
      const { checkBoardCreationLimit } = await import('./rateLimiting')

      const result = await checkBoardCreationLimit(mockUserId)

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBeGreaterThan(0)
      expect(result.error).toBeUndefined()
    })

    it('should return allowed=false when user is null', async () => {
      const { checkBoardCreationLimit } = await import('./rateLimiting')

      const result = await checkBoardCreationLimit(null)

      expect(result.allowed).toBe(false)
      expect(result.error).toBe('Not signed in')
    })
  })
})
