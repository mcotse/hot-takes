/**
 * Firestore Friendship Service
 *
 * Provides CRUD operations for friendships in Firestore.
 * Handles friend requests, acceptance, unfriending, and blocking.
 *
 * Data model:
 * - Friendships are stored at /friendships/{friendshipId}
 * - friendshipId is generated from sorted user IDs: "uid1_uid2"
 * - This ensures there's only one document per user pair
 */

import type { Friendship } from './socialTypes'
import { sortUserIds } from './socialTypes'
import { getFirebaseDb, USE_MOCK_AUTH } from './firebase'

// ============ Types ============

export interface FriendshipResult {
  success: boolean
  friendshipId?: string
  error?: string
}

export type RequestDirection = 'incoming' | 'outgoing'

// ============ Helper Functions ============

/**
 * Generate a unique friendship ID from two user IDs
 * Sorts IDs alphabetically to ensure consistency
 */
export const generateFriendshipId = (uid1: string, uid2: string): string => {
  const [a, b] = sortUserIds(uid1, uid2)
  return `${a}_${b}`
}

/**
 * Create a friendship request object (for local use)
 */
export const createFriendRequestObject = (
  fromUid: string,
  toUid: string
): Omit<Friendship, 'createdAt'> & { createdAt: number } => {
  const [sortedA, sortedB] = sortUserIds(fromUid, toUid)
  return {
    id: generateFriendshipId(fromUid, toUid),
    users: [sortedA, sortedB],
    status: 'pending',
    requestedBy: fromUid,
    createdAt: Date.now(),
  }
}

// ============ Firestore Operations ============

/**
 * Send a friend request
 */
export const createFriendRequest = async (
  fromUid: string,
  toUid: string
): Promise<FriendshipResult> => {
  // Validate
  if (fromUid === toUid) {
    return { success: false, error: "You can't send a friend request to yourself" }
  }

  if (USE_MOCK_AUTH) {
    // In mock mode, just return success
    return {
      success: true,
      friendshipId: generateFriendshipId(fromUid, toUid),
    }
  }

  try {
    const db = await getFirebaseDb()
    const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore')

    const friendshipId = generateFriendshipId(fromUid, toUid)
    const friendshipRef = doc(db, 'friendships', friendshipId)

    // Check if friendship already exists
    const existingDoc = await getDoc(friendshipRef)
    if (existingDoc.exists()) {
      const existing = existingDoc.data() as Friendship
      if (existing.status === 'active') {
        return { success: false, error: 'You are already friends with this user' }
      }
      if (existing.status === 'pending') {
        return { success: false, error: 'A friend request is already pending' }
      }
    }

    // Create the friendship document
    const [sortedA, sortedB] = sortUserIds(fromUid, toUid)
    await setDoc(friendshipRef, {
      id: friendshipId,
      users: [sortedA, sortedB],
      status: 'pending',
      requestedBy: fromUid,
      createdAt: serverTimestamp(),
    })

    return { success: true, friendshipId }
  } catch (error) {
    console.error('Error creating friend request:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send friend request',
    }
  }
}

/**
 * Accept a friend request
 */
export const acceptFriendRequest = async (
  friendshipId: string,
  acceptingUid: string
): Promise<FriendshipResult> => {
  if (USE_MOCK_AUTH) {
    return { success: true, friendshipId }
  }

  try {
    const db = await getFirebaseDb()
    const { doc, getDoc, updateDoc, serverTimestamp } = await import('firebase/firestore')

    const friendshipRef = doc(db, 'friendships', friendshipId)
    const friendshipDoc = await getDoc(friendshipRef)

    if (!friendshipDoc.exists()) {
      return { success: false, error: 'Friend request not found' }
    }

    const friendship = friendshipDoc.data() as Friendship

    // Verify the accepting user is not the one who sent the request
    if (friendship.requestedBy === acceptingUid) {
      return { success: false, error: "You can't accept your own friend request" }
    }

    // Verify the accepting user is part of the friendship
    if (!friendship.users.includes(acceptingUid)) {
      return { success: false, error: 'You are not part of this friend request' }
    }

    // Update to active
    await updateDoc(friendshipRef, {
      status: 'active',
      acceptedAt: serverTimestamp(),
    })

    return { success: true, friendshipId }
  } catch (error) {
    console.error('Error accepting friend request:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to accept friend request',
    }
  }
}

/**
 * Decline a friend request
 */
export const declineFriendRequest = async (
  friendshipId: string,
  decliningUid: string
): Promise<FriendshipResult> => {
  if (USE_MOCK_AUTH) {
    return { success: true, friendshipId }
  }

  try {
    const db = await getFirebaseDb()
    const { doc, getDoc, deleteDoc } = await import('firebase/firestore')

    const friendshipRef = doc(db, 'friendships', friendshipId)
    const friendshipDoc = await getDoc(friendshipRef)

    if (!friendshipDoc.exists()) {
      return { success: false, error: 'Friend request not found' }
    }

    const friendship = friendshipDoc.data() as Friendship

    // Verify the declining user is part of the friendship
    if (!friendship.users.includes(decliningUid)) {
      return { success: false, error: 'You are not part of this friend request' }
    }

    // Delete the document
    await deleteDoc(friendshipRef)

    return { success: true, friendshipId }
  } catch (error) {
    console.error('Error declining friend request:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to decline friend request',
    }
  }
}

/**
 * Unfriend a user
 */
export const unfriend = async (
  uid: string,
  friendUid: string
): Promise<FriendshipResult> => {
  if (USE_MOCK_AUTH) {
    return { success: true, friendshipId: generateFriendshipId(uid, friendUid) }
  }

  try {
    const db = await getFirebaseDb()
    const { doc, deleteDoc } = await import('firebase/firestore')

    const friendshipId = generateFriendshipId(uid, friendUid)
    const friendshipRef = doc(db, 'friendships', friendshipId)

    await deleteDoc(friendshipRef)

    return { success: true, friendshipId }
  } catch (error) {
    console.error('Error unfriending:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unfriend',
    }
  }
}

/**
 * Get all active friendships for a user
 */
export const getFriendships = async (uid: string): Promise<Friendship[]> => {
  if (USE_MOCK_AUTH) {
    return []
  }

  try {
    const db = await getFirebaseDb()
    const { collection, query, where, getDocs } = await import('firebase/firestore')

    const q = query(
      collection(db, 'friendships'),
      where('users', 'array-contains', uid),
      where('status', '==', 'active')
    )

    const snapshot = await getDocs(q)
    const friendships: Friendship[] = []

    snapshot.forEach((doc) => {
      friendships.push(doc.data() as Friendship)
    })

    return friendships
  } catch (error) {
    console.error('Error getting friendships:', error)
    return []
  }
}

/**
 * Get pending friend requests
 */
export const getPendingRequests = async (
  uid: string,
  direction: RequestDirection
): Promise<Friendship[]> => {
  if (USE_MOCK_AUTH) {
    return []
  }

  try {
    const db = await getFirebaseDb()
    const { collection, query, where, getDocs } = await import('firebase/firestore')

    // Incoming: requests where uid is in users but not the requester
    // Outgoing: requests where uid is the requester
    let q
    if (direction === 'outgoing') {
      q = query(
        collection(db, 'friendships'),
        where('requestedBy', '==', uid),
        where('status', '==', 'pending')
      )
    } else {
      // For incoming, we need to query by users array and filter client-side
      q = query(
        collection(db, 'friendships'),
        where('users', 'array-contains', uid),
        where('status', '==', 'pending')
      )
    }

    const snapshot = await getDocs(q)
    const requests: Friendship[] = []

    snapshot.forEach((doc) => {
      const friendship = doc.data() as Friendship
      // For incoming, filter out requests we sent
      if (direction === 'incoming' && friendship.requestedBy === uid) {
        return
      }
      requests.push(friendship)
    })

    return requests
  } catch (error) {
    console.error('Error getting pending requests:', error)
    return []
  }
}

/**
 * Block a user
 * This adds the user to the blocker's blockedUsers array in their profile
 * and removes any existing friendship
 */
export const blockUser = async (
  uid: string,
  userToBlock: string
): Promise<FriendshipResult> => {
  if (uid === userToBlock) {
    return { success: false, error: "You can't block yourself" }
  }

  if (USE_MOCK_AUTH) {
    return { success: true }
  }

  try {
    const db = await getFirebaseDb()
    const { doc, updateDoc, deleteDoc, arrayUnion } = await import('firebase/firestore')

    // Add to blocked users in user profile
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      blockedUsers: arrayUnion(userToBlock),
    })

    // Remove any existing friendship
    const friendshipId = generateFriendshipId(uid, userToBlock)
    const friendshipRef = doc(db, 'friendships', friendshipId)
    await deleteDoc(friendshipRef)

    return { success: true }
  } catch (error) {
    console.error('Error blocking user:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to block user',
    }
  }
}

/**
 * Unblock a user
 */
export const unblockUser = async (
  uid: string,
  userToUnblock: string
): Promise<FriendshipResult> => {
  if (USE_MOCK_AUTH) {
    return { success: true }
  }

  try {
    const db = await getFirebaseDb()
    const { doc, updateDoc, arrayRemove } = await import('firebase/firestore')

    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      blockedUsers: arrayRemove(userToUnblock),
    })

    return { success: true }
  } catch (error) {
    console.error('Error unblocking user:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unblock user',
    }
  }
}

/**
 * Check if a friendship exists between two users
 */
export const checkFriendship = async (
  uid1: string,
  uid2: string
): Promise<Friendship | null> => {
  if (USE_MOCK_AUTH) {
    return null
  }

  try {
    const db = await getFirebaseDb()
    const { doc, getDoc } = await import('firebase/firestore')

    const friendshipId = generateFriendshipId(uid1, uid2)
    const friendshipRef = doc(db, 'friendships', friendshipId)
    const friendshipDoc = await getDoc(friendshipRef)

    if (!friendshipDoc.exists()) {
      return null
    }

    return friendshipDoc.data() as Friendship
  } catch (error) {
    console.error('Error checking friendship:', error)
    return null
  }
}
