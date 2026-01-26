/**
 * Firestore Report Service Tests
 *
 * Tests for report CRUD operations.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock Firebase modules
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  addDoc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  serverTimestamp: vi.fn(() => ({ _serverTimestamp: true })),
  Timestamp: {
    now: () => ({ toMillis: () => Date.now() }),
    fromMillis: (ms: number) => ({ toMillis: () => ms }),
  },
}))

vi.mock('./firebase', () => ({
  getFirebaseDb: vi.fn(),
  USE_MOCK_AUTH: true,
}))

describe('firestoreReports', () => {
  const mockReporterId = 'reporter-123'
  const mockTargetUserId = 'target-456'
  const mockTargetBoardId = 'board-789'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createReport', () => {
    it('should create a user report successfully', async () => {
      const { createReport } = await import('./firestoreReports')

      const result = await createReport(
        mockReporterId,
        'user',
        mockTargetUserId,
        'harassment',
        'This user sent abusive messages'
      )

      expect(result.success).toBe(true)
      expect(result.reportId).toBeDefined()
    })

    it('should create a board report successfully', async () => {
      const { createReport } = await import('./firestoreReports')

      const result = await createReport(
        mockReporterId,
        'board',
        mockTargetBoardId,
        'inappropriate_content',
        'This board contains offensive images'
      )

      expect(result.success).toBe(true)
      expect(result.reportId).toBeDefined()
    })

    it('should fail if reporting self', async () => {
      const { createReport } = await import('./firestoreReports')

      const result = await createReport(
        mockReporterId,
        'user',
        mockReporterId,
        'spam',
        'Test'
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('yourself')
    })

    it('should fail with empty details for other reason', async () => {
      const { createReport } = await import('./firestoreReports')

      const result = await createReport(
        mockReporterId,
        'user',
        mockTargetUserId,
        'other',
        ''
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('details')
    })
  })

  describe('hasUserReported', () => {
    it('should return false when user has not reported target', async () => {
      const { hasUserReported } = await import('./firestoreReports')

      const result = await hasUserReported(mockReporterId, 'user', mockTargetUserId)

      // In mock mode, always returns false
      expect(result).toBe(false)
    })
  })

  describe('getReportCountSince', () => {
    it('should return count of reports since timestamp', async () => {
      const { getReportCountSince } = await import('./firestoreReports')

      const sinceMs = Date.now() - 24 * 60 * 60 * 1000
      const count = await getReportCountSince(mockReporterId, sinceMs)

      // In mock mode, always returns 0
      expect(count).toBe(0)
    })
  })

  describe('ReportResult type', () => {
    it('should have correct shape on success', async () => {
      const { createReport } = await import('./firestoreReports')

      const result = await createReport(
        mockReporterId,
        'user',
        mockTargetUserId,
        'spam',
        'Spam messages'
      )

      expect(result).toHaveProperty('success')
      expect(result).toHaveProperty('reportId')
    })

    it('should have error on failure', async () => {
      const { createReport } = await import('./firestoreReports')

      const result = await createReport(
        mockReporterId,
        'user',
        mockReporterId,
        'spam',
        'Test'
      )

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })
})
