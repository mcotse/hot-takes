/**
 * useReports Hook Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useReports } from './useReports'

// Mock the Firestore reports module
vi.mock('../lib/firestoreReports', () => ({
  createReport: vi.fn().mockResolvedValue({ success: true, reportId: 'report-123' }),
  hasUserReported: vi.fn().mockResolvedValue(false),
}))

// Mock rate limiting
vi.mock('../lib/rateLimiting', () => ({
  checkReportLimit: vi.fn().mockResolvedValue({ allowed: true, remaining: 10 }),
}))

describe('useReports', () => {
  const mockUserId = 'user-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useReports({ userId: mockUserId }))

    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.error).toBeNull()
    expect(typeof result.current.submitReport).toBe('function')
  })

  it('should submit report successfully', async () => {
    const { result } = renderHook(() => useReports({ userId: mockUserId }))

    let reportResult: { success: boolean; reportId?: string; error?: string }

    await act(async () => {
      reportResult = await result.current.submitReport(
        'user',
        'target-456',
        'harassment',
        'Abusive messages'
      )
    })

    expect(reportResult!.success).toBe(true)
    expect(reportResult!.reportId).toBe('report-123')
    expect(result.current.error).toBeNull()
  })

  it('should handle submission error', async () => {
    const { createReport } = await import('../lib/firestoreReports')
    vi.mocked(createReport).mockResolvedValueOnce({
      success: false,
      error: 'Failed to submit',
    })

    const { result } = renderHook(() => useReports({ userId: mockUserId }))

    await act(async () => {
      await result.current.submitReport('user', 'target-456', 'spam', 'Spam content')
    })

    expect(result.current.error).toBe('Failed to submit')
  })

  it('should check for duplicate reports', async () => {
    const { hasUserReported } = await import('../lib/firestoreReports')
    vi.mocked(hasUserReported).mockResolvedValueOnce(true)

    const { result } = renderHook(() => useReports({ userId: mockUserId }))

    let reportResult: { success: boolean; error?: string }

    await act(async () => {
      reportResult = await result.current.submitReport(
        'user',
        'already-reported-user',
        'harassment',
        'Test'
      )
    })

    expect(reportResult!.success).toBe(false)
    expect(reportResult!.error).toContain('already')
  })

  it('should check rate limits', async () => {
    const { checkReportLimit } = await import('../lib/rateLimiting')
    vi.mocked(checkReportLimit).mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      error: 'Rate limit exceeded',
    })

    const { result } = renderHook(() => useReports({ userId: mockUserId }))

    let reportResult: { success: boolean; error?: string }

    await act(async () => {
      reportResult = await result.current.submitReport(
        'user',
        'target-456',
        'spam',
        'Test'
      )
    })

    expect(reportResult!.success).toBe(false)
    expect(reportResult!.error).toBe('Rate limit exceeded')
  })

  it('should fail if not signed in', async () => {
    const { result } = renderHook(() => useReports({ userId: null }))

    let reportResult: { success: boolean; error?: string }

    await act(async () => {
      reportResult = await result.current.submitReport(
        'user',
        'target-456',
        'spam',
        'Test'
      )
    })

    expect(reportResult!.success).toBe(false)
    expect(reportResult!.error).toBe('Not signed in')
  })

  it('should track submitting state', async () => {
    const { result } = renderHook(() => useReports({ userId: mockUserId }))

    // Create a promise that we can resolve manually
    let resolvePromise: (value: { success: boolean; reportId: string }) => void
    const slowPromise = new Promise<{ success: boolean; reportId: string }>((resolve) => {
      resolvePromise = resolve
    })

    const { createReport } = await import('../lib/firestoreReports')
    vi.mocked(createReport).mockReturnValueOnce(slowPromise)

    let submitPromise: Promise<unknown>
    act(() => {
      submitPromise = result.current.submitReport('user', 'target-456', 'spam', 'Test')
    })

    // Should be submitting
    expect(result.current.isSubmitting).toBe(true)

    // Resolve and wait
    await act(async () => {
      resolvePromise!({ success: true, reportId: 'report-456' })
      await submitPromise
    })

    // Should no longer be submitting
    expect(result.current.isSubmitting).toBe(false)
  })

  it('should clear error on new submission', async () => {
    const { createReport } = await import('../lib/firestoreReports')
    vi.mocked(createReport)
      .mockResolvedValueOnce({ success: false, error: 'First error' })
      .mockResolvedValueOnce({ success: true, reportId: 'report-789' })

    const { result } = renderHook(() => useReports({ userId: mockUserId }))

    // First submission fails
    await act(async () => {
      await result.current.submitReport('user', 'target-1', 'spam', 'Test')
    })
    expect(result.current.error).toBe('First error')

    // Second submission succeeds
    await act(async () => {
      await result.current.submitReport('user', 'target-2', 'spam', 'Test 2')
    })
    expect(result.current.error).toBeNull()
  })
})
