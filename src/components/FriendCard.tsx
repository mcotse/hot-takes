/**
 * FriendCard Component
 *
 * Displays a friend with their avatar, name, username, and shared board count.
 * Hand-drawn aesthetic with wobbly borders.
 */

import { type KeyboardEvent } from 'react'
import { wobbly } from '../styles/wobbly'

export interface FriendCardProps {
  /** Friend's user ID */
  uid: string
  /** Friend's display name */
  displayName: string
  /** Friend's username */
  username: string
  /** Avatar URL (empty string for fallback) */
  avatarUrl: string
  /** Number of shared boards (optional) */
  sharedBoardCount?: number
  /** Click handler - receives uid */
  onClick: (uid: string) => void
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
        className="w-12 h-12 object-cover border-2 border-[#2d2d2d]"
        style={{ borderRadius: wobbly.circle }}
      />
    )
  }

  // Initials fallback
  return (
    <div
      className="
        w-12 h-12
        bg-[#e5e0d8]
        border-2 border-[#2d2d2d]
        flex items-center justify-center
        text-[#2d2d2d]
        font-semibold
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

export const FriendCard = ({
  uid,
  displayName,
  username,
  avatarUrl,
  sharedBoardCount,
  onClick,
}: FriendCardProps) => {
  const handleClick = () => onClick(uid)

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(uid)
    }
  }

  const initials = getInitials(displayName)

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="
        w-full
        flex items-center gap-3
        p-3
        bg-white
        border-[3px] border-[#2d2d2d]
        shadow-[4px_4px_0px_0px_#2d2d2d]
        hover:shadow-[2px_2px_0px_0px_#2d2d2d]
        hover:translate-x-[2px] hover:translate-y-[2px]
        active:shadow-none
        active:translate-x-[4px] active:translate-y-[4px]
        transition-all duration-100
        text-left
      "
      style={{ borderRadius: wobbly.md }}
    >
      {/* Avatar */}
      <Avatar src={avatarUrl} alt={`${displayName}'s avatar`} initials={initials} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[#2d2d2d] font-semibold truncate"
          style={{ fontFamily: "'Kalam', cursive" }}
        >
          {displayName}
        </p>
        <p
          className="text-[#2d2d2d]/60 text-sm truncate"
          style={{ fontFamily: "'Patrick Hand', cursive" }}
        >
          @{username}
        </p>
      </div>

      {/* Shared board count */}
      {sharedBoardCount !== undefined && sharedBoardCount > 0 && (
        <div
          className="
            px-2 py-1
            bg-[#e5e0d8]
            border-2 border-[#2d2d2d]
            text-[#2d2d2d]
            text-xs
          "
          style={{
            borderRadius: wobbly.sm,
            fontFamily: "'Patrick Hand', cursive",
          }}
        >
          {sharedBoardCount} shared
        </div>
      )}

      {/* Chevron */}
      <span className="text-[#2d2d2d]/40 text-lg" aria-hidden>
        ›
      </span>
    </button>
  )
}
