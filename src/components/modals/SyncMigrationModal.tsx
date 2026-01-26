/**
 * SyncMigrationModal Component
 *
 * Modal shown after first sign-in when user has existing local boards.
 * Offers to sync local boards to the cloud.
 *
 * Features:
 * - Shows count of local boards to sync
 * - Sync and skip options
 * - Loading and error states
 * - Hand-drawn aesthetic
 */

import { motion, AnimatePresence } from 'framer-motion'
import { wobbly } from '../../styles/wobbly'
import { springConfig } from '../../styles/tokens'
import { Button } from '../ui/Button'
import type { Board } from '../../lib/types'

export interface SyncMigrationModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Local boards to sync */
  boards: Board[]
  /** Called when user wants to sync */
  onSync: () => Promise<void>
  /** Called when user skips sync */
  onSkip: () => void
  /** Whether sync is in progress */
  isSyncing: boolean
  /** Error message if sync failed */
  error: string | null
}

export const SyncMigrationModal = ({
  isOpen,
  boards,
  onSync,
  onSkip,
  isSyncing,
  error,
}: SyncMigrationModalProps) => {
  // Don't show if no boards to sync
  if (boards.length === 0) {
    return null
  }

  const boardCount = boards.length
  const boardWord = boardCount === 1 ? 'board' : 'boards'

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
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sync-modal-title"
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
            {/* Icon */}
            <div
              className="
                w-16 h-16 mx-auto mb-4
                bg-[#e5e0d8]
                border-[3px] border-[#2d2d2d]
                flex items-center justify-center
                text-3xl
              "
              style={{ borderRadius: wobbly.circle }}
            >
              <span role="img" aria-label="cloud sync">
                ☁️
              </span>
            </div>

            {/* Title */}
            <h2
              id="sync-modal-title"
              className="text-2xl text-center text-[#2d2d2d] mb-2"
              style={{
                fontFamily: "'Kalam', cursive",
                fontWeight: 700,
              }}
            >
              Sync Your Boards?
            </h2>

            {/* Description */}
            <p
              className="text-center text-[#2d2d2d]/70 mb-4"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              You have{' '}
              <strong className="text-[#2d2d2d]">
                {boardCount} {boardWord}
              </strong>{' '}
              on this device. Sync them to access from anywhere and share with friends.
            </p>

            {/* Error message */}
            {error && (
              <div
                className="mb-4 p-3 bg-[#ff4d4d]/10 border-2 border-[#ff4d4d] text-[#ff4d4d] text-center"
                style={{
                  borderRadius: wobbly.sm,
                  fontFamily: "'Patrick Hand', cursive",
                }}
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Syncing indicator */}
            {isSyncing && (
              <div
                className="mb-4 p-3 bg-[#2d5da1]/10 border-2 border-[#2d5da1] text-[#2d5da1] text-center"
                style={{
                  borderRadius: wobbly.sm,
                  fontFamily: "'Patrick Hand', cursive",
                }}
              >
                <span className="inline-block animate-spin mr-2">⏳</span>
                Syncing your boards...
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3">
              <Button
                onClick={onSync}
                disabled={isSyncing}
                className="w-full"
              >
                {isSyncing ? 'Syncing...' : error ? 'Retry Sync' : 'Sync Now'}
              </Button>

              <button
                onClick={onSkip}
                disabled={isSyncing}
                className="
                  w-full
                  py-2
                  text-[#2d2d2d]/60
                  hover:text-[#2d2d2d]
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  transition-colors
                "
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                Not Now
              </button>
            </div>

            {/* Note */}
            <p
              className="mt-4 text-xs text-center text-[#2d2d2d]/50"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              You can always sync later from Settings
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
