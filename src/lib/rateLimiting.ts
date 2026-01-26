/**
 * Rate Limiting Service
 *
 * Client-side rate limiting for social actions.
 * Queries Firestore to count user's recent actions within time windows.
 *
 * Rate limits:
 * - Friend requests: 20 per 24 hours
 * - Reports: 10 per 24 hours
 * - Board creation: 50 per 24 hours
 */

import { getFirebaseDb, USE_MOCK_AUTH } from './firebase'

// ============ Constants ============

const ONE_DAY_MS = 24 * 60 * 60 * 1000

export const RATE_LIMITS = {
  friendRequests: { count: 20, windowMs: ONE_DAY_MS },
  reports: { count: 10, windowMs: ONE_DAY_MS },
  boards: { count: 50, windowMs: ONE_DAY_MS },
}

// ============ Types ============

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  error?: string
}

// ============ Helper Functions ============

/**
 * Count documents created by user since a given timestamp
 */
const countDocumentsSince = async (
  collectionName: string,
  userId: string,
  userIdField: string,
  sinceMs: number
): Promise<number> => {
  if (USE_MOCK_AUTH) {
    // In mock mode, always return 0 (no rate limiting)
    return 0
  }

  try {
    const db = await getFirebaseDb()
    const { collection, query, where, getDocs, Timestamp } = await import('firebase/firestore')

    const sinceTimestamp = Timestamp.fromMillis(sinceMs)

    const q = query(
      collection(db, collectionName),
      where(userIdField, '==', userId),
      where('createdAt', '>=', sinceTimestamp)
    )

    const snapshot = await getDocs(q)
    return snapshot.size
  } catch (error) {
    console.error(`Error counting ${collectionName}:`, error)
    return 0 // Default to allowing on error
  }
}

// ============ Rate Limit Checks ============

/**
 * Check if user can send more friend requests
 */
export const checkFriendRequestLimit = async (
  userId: string | null
): Promise<RateLimitResult> => {
  if (!userId) {
    return { allowed: false, remaining: 0, error: 'Not signed in' }
  }

  const { count, windowMs } = RATE_LIMITS.friendRequests
  const sinceMs = Date.now() - windowMs

  const currentCount = await countDocumentsSince(
    'friendships',
    userId,
    'requestedBy',
    sinceMs
  )

  const remaining = Math.max(0, count - currentCount)
  const allowed = remaining > 0

  return {
    allowed,
    remaining,
    error: allowed ? undefined : `You can only send ${count} friend requests per day. Please try again later.`,
  }
}

/**
 * Check if user can submit more reports
 */
export const checkReportLimit = async (
  userId: string | null
): Promise<RateLimitResult> => {
  if (!userId) {
    return { allowed: false, remaining: 0, error: 'Not signed in' }
  }

  const { count, windowMs } = RATE_LIMITS.reports
  const sinceMs = Date.now() - windowMs

  const currentCount = await countDocumentsSince(
    'reports',
    userId,
    'reporterId',
    sinceMs
  )

  const remaining = Math.max(0, count - currentCount)
  const allowed = remaining > 0

  return {
    allowed,
    remaining,
    error: allowed ? undefined : `You can only submit ${count} reports per day. Please try again later.`,
  }
}

/**
 * Check if user can create more boards
 */
export const checkBoardCreationLimit = async (
  userId: string | null
): Promise<RateLimitResult> => {
  if (!userId) {
    return { allowed: false, remaining: 0, error: 'Not signed in' }
  }

  const { count, windowMs } = RATE_LIMITS.boards
  const sinceMs = Date.now() - windowMs

  const currentCount = await countDocumentsSince(
    'boards',
    userId,
    'ownerId',
    sinceMs
  )

  const remaining = Math.max(0, count - currentCount)
  const allowed = remaining > 0

  return {
    allowed,
    remaining,
    error: allowed ? undefined : `You can only create ${count} boards per day. Please try again later.`,
  }
}
