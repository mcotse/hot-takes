/**
 * useReports Hook
 *
 * Manages report submission state and operations.
 *
 * Features:
 * - Submit reports for users or boards
 * - Rate limiting checks
 * - Duplicate report prevention
 * - Loading and error states
 */

import { useState, useCallback } from 'react'
import type { ReportReason } from '../lib/socialTypes'
import type { ReportTargetType, ReportResult } from '../lib/firestoreReports'
import { createReport, hasUserReported } from '../lib/firestoreReports'
import { checkReportLimit } from '../lib/rateLimiting'

/**
 * useReports options
 */
export interface UseReportsOptions {
  /** Current user's UID (null if not signed in) */
  userId: string | null
}

/**
 * useReports return type
 */
export interface UseReportsReturn {
  /** Submit a report */
  submitReport: (
    targetType: ReportTargetType,
    targetId: string,
    reason: ReportReason,
    details: string
  ) => Promise<ReportResult>
  /** Whether a report is being submitted */
  isSubmitting: boolean
  /** Error message if submission failed */
  error: string | null
}

/**
 * Hook for managing reports
 */
export const useReports = (options: UseReportsOptions): UseReportsReturn => {
  const { userId } = options

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Submit a report
   */
  const submitReport = useCallback(
    async (
      targetType: ReportTargetType,
      targetId: string,
      reason: ReportReason,
      details: string
    ): Promise<ReportResult> => {
      // Clear previous error
      setError(null)

      // Check if signed in
      if (!userId) {
        const err = 'Not signed in'
        setError(err)
        return { success: false, error: err }
      }

      setIsSubmitting(true)

      try {
        // Check rate limit
        const limitCheck = await checkReportLimit(userId)
        if (!limitCheck.allowed) {
          setError(limitCheck.error || 'Rate limit exceeded')
          return { success: false, error: limitCheck.error || 'Rate limit exceeded' }
        }

        // Check for duplicate report
        const alreadyReported = await hasUserReported(userId, targetType, targetId)
        if (alreadyReported) {
          const err = "You've already reported this"
          setError(err)
          return { success: false, error: err }
        }

        // Submit the report
        const result = await createReport(
          userId,
          targetType,
          targetId,
          reason,
          details
        )

        if (!result.success) {
          setError(result.error || 'Failed to submit report')
        }

        return result
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to submit report'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setIsSubmitting(false)
      }
    },
    [userId]
  )

  return {
    submitReport,
    isSubmitting,
    error,
  }
}
