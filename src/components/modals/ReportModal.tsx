/**
 * ReportModal Component
 *
 * Modal for submitting reports on users or boards.
 * Features:
 * - Radio button selection for report reasons
 * - Textarea for additional details
 * - Validation before submission
 * - Hand-drawn aesthetic
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { wobbly } from '../../styles/wobbly'
import { springConfig } from '../../styles/tokens'
import type { ReportReason } from '../../lib/socialTypes'
import type { ReportTargetType } from '../../lib/firestoreReports'
import { useReports } from '../../hooks/useReports'
import { Button } from '../ui/Button'

// Report reason labels
const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'inappropriate_content', label: 'Inappropriate content' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'spam', label: 'Spam' },
  { value: 'impersonation', label: 'Impersonation' },
  { value: 'other', label: 'Other' },
]

export interface ReportModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Called when modal should close */
  onClose: () => void
  /** Type of target being reported */
  targetType: ReportTargetType
  /** ID of the target being reported */
  targetId: string
  /** Display name of the target */
  targetName: string
  /** Current user's ID */
  userId: string | null
  /** Called after successful report submission */
  onSubmitted: () => void
}

export const ReportModal = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetName,
  userId,
  onSubmitted,
}: ReportModalProps) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null)
  const [details, setDetails] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const { submitReport, isSubmitting, error: submitError } = useReports({ userId })

  // Combined error
  const error = validationError || submitError

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedReason(null)
      setDetails('')
      setValidationError(null)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, isSubmitting])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setValidationError(null)

      // Validate reason selection
      if (!selectedReason) {
        setValidationError('Please select a reason for your report')
        return
      }

      // Validate details for "other" reason
      if (selectedReason === 'other' && !details.trim()) {
        setValidationError('Please provide details for your report')
        return
      }

      const result = await submitReport(targetType, targetId, selectedReason, details)

      if (result.success) {
        onSubmitted()
        onClose()
      }
    },
    [selectedReason, details, submitReport, targetType, targetId, onSubmitted, onClose]
  )

  // Handle backdrop click
  const handleBackdropClick = useCallback(() => {
    if (!isSubmitting) {
      onClose()
    }
  }, [onClose, isSubmitting])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            data-testid="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={springConfig.default}
            className="
              relative
              w-full max-w-sm
              bg-[#fdfbf7]
              border-[3px] border-[#2d2d2d]
              shadow-[8px_8px_0px_0px_#2d2d2d]
              p-6
            "
            style={{ borderRadius: wobbly.lg }}
          >
            {/* Title */}
            <h2
              id="report-modal-title"
              className="text-2xl text-center text-[#2d2d2d] mb-4"
              style={{
                fontFamily: "'Kalam', cursive",
                fontWeight: 700,
              }}
            >
              Report {targetName}
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Reason selection */}
              <fieldset className="mb-4">
                <legend
                  className="sr-only"
                >
                  Select a reason for reporting
                </legend>
                <div className="space-y-2">
                  {REPORT_REASONS.map(({ value, label }) => (
                    <label
                      key={value}
                      className={`
                        flex items-center gap-3 p-3 cursor-pointer
                        border-2 border-[#2d2d2d]
                        transition-colors
                        ${selectedReason === value ? 'bg-[#e5e0d8]' : 'bg-white hover:bg-[#faf8f5]'}
                      `}
                      style={{ borderRadius: wobbly.sm }}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        value={value}
                        checked={selectedReason === value}
                        onChange={() => {
                          setSelectedReason(value)
                          setValidationError(null)
                        }}
                        disabled={isSubmitting}
                        className="
                          w-5 h-5
                          accent-[#2d2d2d]
                        "
                      />
                      <span
                        className="text-[#2d2d2d]"
                        style={{ fontFamily: "'Patrick Hand', cursive" }}
                      >
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Details textarea */}
              <div className="mb-4">
                <label
                  htmlFor="report-details"
                  className="sr-only"
                >
                  Additional details
                </label>
                <textarea
                  id="report-details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide additional details (optional)"
                  disabled={isSubmitting}
                  rows={3}
                  className="
                    w-full p-3
                    bg-white
                    border-2 border-[#2d2d2d]
                    text-[#2d2d2d]
                    placeholder-[#2d2d2d]/40
                    resize-none
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#2d5da1]
                    disabled:opacity-50
                  "
                  style={{
                    borderRadius: wobbly.sm,
                    fontFamily: "'Patrick Hand', cursive",
                  }}
                />
              </div>

              {/* Error message */}
              {error && (
                <p
                  className="mb-4 text-sm text-[#ff4d4d] text-center"
                  style={{ fontFamily: "'Patrick Hand', cursive" }}
                  role="alert"
                >
                  {error}
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
