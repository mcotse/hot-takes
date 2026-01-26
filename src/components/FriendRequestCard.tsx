/**
 * FriendRequestCard Component
 *
 * Displays a pending friend request with accept/decline buttons.
 * Can show incoming (accept/decline) or outgoing (pending/cancel) requests.
 * Hand-drawn aesthetic with wobbly borders.
 */

import { wobbly } from '../styles/wobbly'

export interface FriendRequestCardProps {
  /** Friendship ID */
  friendshipId: string
  /** Requester's/recipient's display name */
  displayName: string
  /** Requester's/recipient's username */
  username: string
  /** Avatar URL (empty string for fallback) */
  avatarUrl: string
  /** Whether this is an incoming or outgoing request */
  direction?: 'incoming' | 'outgoing'
  /** Accept handler (for incoming) */
  onAccept?: (friendshipId: string) => void
  /** Decline handler (for incoming) */
  onDecline?: (friendshipId: string) => void
  /** Cancel handler (for outgoing) */
  onCancel?: (friendshipId: string) => void
  /** Whether buttons are disabled (during async operation) */
  isLoading?: boolean
}

/**
 * Get initials from display name for avatar fallback
 */
const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/)
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase()
  }
  return name.slice(0, 1).toUpperCase()
}

/**
 * Avatar component with image or initials fallback
 */
const Avatar = ({
  src,
  alt,
  initials,
}: {
  src: string
  alt: string
  initials: string
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="w-10 h-10 object-cover border-2 border-[#2d2d2d]"
        style={{ borderRadius: wobbly.circle }}
      />
    )
  }

  // Initials fallback
  return (
    <div
      className="
        w-10 h-10
        bg-[#e5e0d8]
        border-2 border-[#2d2d2d]
        flex items-center justify-center
        text-[#2d2d2d]
        font-semibold
        text-sm
      "
      style={{
        borderRadius: wobbly.circle,
        fontFamily: "'Kalam', cursive",
      }}
    >
      {initials}
    </div>
  )
}

/**
 * Small action button for accept/decline/cancel
 */
const ActionButton = ({
  onClick,
  disabled,
  variant,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  variant: 'accept' | 'decline' | 'cancel'
  children: React.ReactNode
}) => {
  const colors = {
    accept: 'bg-[#4ade80] hover:bg-[#22c55e] text-white',
    decline: 'bg-[#f87171] hover:bg-[#ef4444] text-white',
    cancel: 'bg-[#e5e0d8] hover:bg-[#d4cfc7] text-[#2d2d2d]',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        px-3 py-1
        border-2 border-[#2d2d2d]
        text-sm
        transition-colors
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${colors[variant]}
      `}
      style={{
        borderRadius: wobbly.sm,
        fontFamily: "'Patrick Hand', cursive",
      }}
    >
      {children}
    </button>
  )
}

export const FriendRequestCard = ({
  friendshipId,
  displayName,
  username,
  avatarUrl,
  direction = 'incoming',
  onAccept,
  onDecline,
  onCancel,
  isLoading = false,
}: FriendRequestCardProps) => {
  const initials = getInitials(displayName)
  const isIncoming = direction === 'incoming'

  return (
    <div
      className="
        flex items-center gap-3
        p-3
        bg-white
        border-[3px] border-[#2d2d2d]
        shadow-[4px_4px_0px_0px_#2d2d2d]
      "
      style={{ borderRadius: wobbly.md }}
    >
      {/* Avatar */}
      <Avatar src={avatarUrl} alt={`${displayName}'s avatar`} initials={initials} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[#2d2d2d] font-semibold truncate text-sm"
          style={{ fontFamily: "'Kalam', cursive" }}
        >
          {displayName}
        </p>
        <p
          className="text-[#2d2d2d]/60 text-xs truncate"
          style={{ fontFamily: "'Patrick Hand', cursive" }}
        >
          @{username}
        </p>
      </div>

      {/* Actions */}
      {isIncoming ? (
        // Incoming: Accept and Decline buttons
        <div className="flex gap-2">
          <ActionButton
            onClick={() => onAccept?.(friendshipId)}
            disabled={isLoading}
            variant="accept"
          >
            Accept
          </ActionButton>
          <ActionButton
            onClick={() => onDecline?.(friendshipId)}
            disabled={isLoading}
            variant="decline"
          >
            Decline
          </ActionButton>
        </div>
      ) : (
        // Outgoing: Pending label and optional Cancel button
        <div className="flex items-center gap-2">
          <span
            className="text-[#2d2d2d]/60 text-sm"
            style={{ fontFamily: "'Patrick Hand', cursive" }}
          >
            Pending
          </span>
          {onCancel && (
            <ActionButton
              onClick={() => onCancel(friendshipId)}
              disabled={isLoading}
              variant="cancel"
            >
              Cancel
            </ActionButton>
          )}
        </div>
      )}
    </div>
  )
}
