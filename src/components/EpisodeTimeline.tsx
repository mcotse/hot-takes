import { motion, AnimatePresence } from 'framer-motion'
import type { Snapshot } from '../lib/types'
import { wobbly } from '../styles/wobbly'
import { springConfig } from '../styles/tokens'
import { getDisplayNameFromEntry } from '../hooks/useDisplayName'

export interface EpisodeTimelineProps {
  /** Snapshots to display, sorted by episode number */
  snapshots: Snapshot[]
  /** Called when a snapshot is selected */
  onSnapshotSelect: (snapshotId: string) => void
  /** Called when a snapshot should be deleted */
  onSnapshotDelete?: (snapshotId: string) => void
  /** Currently selected snapshot ID */
  selectedSnapshotId?: string
  /** Whether to display nicknames instead of real names */
  useNickname?: boolean
}

/**
 * Format date for display
 */
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Get top 3 rankings formatted as inline preview
 */
const getTop3Preview = (snapshot: Snapshot, useNickname: boolean): string => {
  const top3 = snapshot.rankings
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3)

  return top3
    .map((entry, idx) => `${idx + 1}. ${getDisplayNameFromEntry(entry, useNickname)}`)
    .join(', ')
}

/**
 * EpisodeCard Component
 * Individual episode item in the timeline
 */
const EpisodeCard = ({
  snapshot,
  isSelected,
  onSelect,
  onDelete,
  useNickname = false,
}: {
  snapshot: Snapshot
  isSelected: boolean
  onSelect: () => void
  onDelete?: () => void
  useNickname?: boolean
}) => {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      aria-label={`Select episode ${snapshot.episodeNumber}: ${snapshot.label}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={springConfig.default}
      className={`
        w-full text-left cursor-pointer
        bg-white
        border-[3px] border-[#2d2d2d]
        p-4
        transition-shadow
        ${isSelected
          ? 'shadow-[2px_2px_0px_0px_#2d5da1] border-[#2d5da1]'
          : 'shadow-[4px_4px_0px_0px_#2d2d2d] hover:shadow-[2px_2px_0px_0px_#2d2d2d]'
        }
      `}
      style={{ borderRadius: wobbly.md }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Episode Badge */}
        <div
          className={`
            flex-shrink-0
            w-12 h-12
            flex items-center justify-center
            border-[3px] border-[#2d2d2d]
            text-lg font-bold
            ${isSelected ? 'bg-[#2d5da1] text-white' : 'bg-[#e5e0d8] text-[#2d2d2d]'}
          `}
          style={{
            fontFamily: "'Kalam', cursive",
            borderRadius: wobbly.circle,
          }}
        >
          {snapshot.episodeNumber}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-[#2d2d2d] font-bold truncate"
            style={{ fontFamily: "'Kalam', cursive" }}
          >
            {snapshot.label}
          </h3>
          <p
            className="text-sm text-[#9a958d]"
            style={{ fontFamily: "'Patrick Hand', cursive" }}
          >
            {formatDate(snapshot.createdAt)} • {snapshot.rankings.length} items
          </p>
          {snapshot.notes && (
            <p
              className="text-sm text-[#9a958d] mt-1 truncate"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              "{snapshot.notes}"
            </p>
          )}
          {/* Top 3 inline preview */}
          {snapshot.rankings.length > 0 && (
            <p
              className="text-xs text-[#2d5da1] mt-1 truncate"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              {getTop3Preview(snapshot, useNickname)}
            </p>
          )}
        </div>

        {/* Delete button (optional) */}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            aria-label={`Delete ${snapshot.label}`}
            className="
              flex-shrink-0
              w-8 h-8
              flex items-center justify-center
              text-[#9a958d]
              hover:text-[#ff4d4d]
              transition-colors
            "
          >
            🗑️
          </button>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Empty state when no snapshots exist
 */
const EmptyState = () => (
  <div
    className="
      text-center py-12
      text-[#9a958d]
    "
  >
    <div className="text-4xl mb-4">📊</div>
    <h3
      className="text-lg text-[#2d2d2d] mb-2"
      style={{ fontFamily: "'Kalam', cursive", fontWeight: 700 }}
    >
      No Episodes Saved
    </h3>
    <p style={{ fontFamily: "'Patrick Hand', cursive" }}>
      Save your first episode snapshot from the board view!
    </p>
  </div>
)

/**
 * EpisodeTimeline Component
 *
 * A vertical scrollable list showing saved episode snapshots.
 * Each item shows: episode number badge, label, date, item count, and notes.
 */
export const EpisodeTimeline = ({
  snapshots,
  onSnapshotSelect,
  onSnapshotDelete,
  selectedSnapshotId,
  useNickname = false,
}: EpisodeTimelineProps) => {
  if (snapshots.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {snapshots.map((snapshot) => (
          <EpisodeCard
            key={snapshot.id}
            snapshot={snapshot}
            isSelected={selectedSnapshotId === snapshot.id}
            onSelect={() => onSnapshotSelect(snapshot.id)}
            onDelete={onSnapshotDelete ? () => onSnapshotDelete(snapshot.id) : undefined}
            useNickname={useNickname}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
