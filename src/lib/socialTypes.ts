/**
 * Social Features Data Types
 *
 * Types for Firebase-backed social features:
 * - Board sharing and visibility
 * - Templates for comparison
 * - Notifications
 * - Reports
 */

import { Timestamp } from 'firebase/firestore'

// ============ Board Sharing ============

export type BoardVisibility = 'private' | 'friends' | 'specific' | 'public'

/**
 * BoardSharing - Visibility settings for a board
 */
export interface BoardSharing {
  visibility: BoardVisibility
  allowedFriends?: string[]   // UIDs for 'specific' visibility
  publicLinkEnabled: boolean
  publicLinkId?: string       // Random ID for public link
}

/**
 * Create default sharing settings (private)
 */
export const createBoardSharing = (): BoardSharing => ({
  visibility: 'private',
  publicLinkEnabled: false,
})

/**
 * Type guard for BoardSharing
 */
export const isBoardSharing = (obj: unknown): obj is BoardSharing => {
  if (typeof obj !== 'object' || obj === null) return false
  const s = obj as Record<string, unknown>
  return (
    (s.visibility === 'private' ||
      s.visibility === 'friends' ||
      s.visibility === 'specific' ||
      s.visibility === 'public') &&
    typeof s.publicLinkEnabled === 'boolean'
  )
}

// ============ Cloud Board Extensions ============

/**
 * CloudBoardData - Additional fields for synced boards
 * These are optional extensions to the local Board type
 */
export interface CloudBoardData {
  ownerId: string             // Firebase UID of owner
  sharing: BoardSharing
  syncedAt: number            // Last sync timestamp (ms)
  templateId?: string         // If created from a template
}

// ============ Templates ============

/**
 * TemplateItem - A single item in a template
 */
export interface TemplateItem {
  id: string
  name: string                // Locked, cannot be changed
  defaultImageUrl?: string    // Optional default image
}

/**
 * BoardTemplate - Predefined board structure for comparison
 */
export interface BoardTemplate {
  id: string
  name: string                // Locked, e.g., "Singles Inferno S5"
  description: string
  category: string            // e.g., "Reality TV", "Sports", "Music"
  items: TemplateItem[]
  isActive: boolean           // Whether template is available
  createdAt: Timestamp
}

/**
 * Type guard for TemplateItem
 */
export const isTemplateItem = (obj: unknown): obj is TemplateItem => {
  if (typeof obj !== 'object' || obj === null) return false
  const t = obj as Record<string, unknown>
  return typeof t.id === 'string' && typeof t.name === 'string'
}

/**
 * Type guard for BoardTemplate
 */
export const isBoardTemplate = (obj: unknown): obj is BoardTemplate => {
  if (typeof obj !== 'object' || obj === null) return false
  const t = obj as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.name === 'string' &&
    typeof t.description === 'string' &&
    typeof t.category === 'string' &&
    Array.isArray(t.items) &&
    typeof t.isActive === 'boolean'
  )
}

// ============ Notifications ============

export type NotificationType =
  | 'friend_request'
  | 'friend_accepted'
  | 'board_shared'

/**
 * Notification - In-app notification for social events
 */
export interface Notification {
  id: string
  userId: string              // Recipient UID
  type: NotificationType
  fromUserId: string          // Sender UID
  fromUsername: string        // Denormalized for display
  fromAvatarUrl: string       // Denormalized for display
  data?: Record<string, unknown> // Type-specific data
  read: boolean
  createdAt: Timestamp
}

/**
 * Type guard for Notification
 */
export const isNotification = (obj: unknown): obj is Notification => {
  if (typeof obj !== 'object' || obj === null) return false
  const n = obj as Record<string, unknown>
  return (
    typeof n.id === 'string' &&
    typeof n.userId === 'string' &&
    (n.type === 'friend_request' ||
      n.type === 'friend_accepted' ||
      n.type === 'board_shared') &&
    typeof n.fromUserId === 'string' &&
    typeof n.fromUsername === 'string' &&
    typeof n.read === 'boolean'
  )
}

// ============ Report System ============

export type ReportReason =
  | 'inappropriate_content'
  | 'harassment'
  | 'spam'
  | 'impersonation'
  | 'other'

/**
 * Report - User report for moderation
 */
export interface Report {
  id: string
  reporterId: string          // UID of reporter
  reportedUserId: string      // UID of reported user
  reportedBoardId?: string    // Optional: specific board
  reason: ReportReason
  details: string
  status: 'pending' | 'reviewed' | 'dismissed'
  createdAt: Timestamp
}
