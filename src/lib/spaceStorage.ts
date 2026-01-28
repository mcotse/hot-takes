/**
 * Space Membership Local Storage
 *
 * Persists space memberships in localStorage so the device
 * knows which spaces it belongs to across sessions.
 */

import type { LocalSpaceMembership } from './spaceTypes'

const STORAGE_KEY = 'singles-infernal-rank:space-memberships'

/**
 * Get all local space memberships
 */
export const getSpaceMemberships = (): LocalSpaceMembership[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

/**
 * Save all space memberships
 */
export const saveSpaceMemberships = (memberships: LocalSpaceMembership[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memberships))
}

/**
 * Add a space membership
 */
export const addSpaceMembership = (membership: LocalSpaceMembership): void => {
  const memberships = getSpaceMemberships()
  // Avoid duplicates
  const existing = memberships.findIndex((m) => m.spaceId === membership.spaceId)
  if (existing >= 0) {
    memberships[existing] = membership
  } else {
    memberships.push(membership)
  }
  saveSpaceMemberships(memberships)
}

/**
 * Remove a space membership
 */
export const removeSpaceMembership = (spaceId: string): void => {
  const memberships = getSpaceMemberships().filter((m) => m.spaceId !== spaceId)
  saveSpaceMemberships(memberships)
}

/**
 * Get a specific membership by space ID
 */
export const getSpaceMembership = (spaceId: string): LocalSpaceMembership | null => {
  return getSpaceMemberships().find((m) => m.spaceId === spaceId) ?? null
}

/**
 * Get the count of spaces this device has joined
 */
export const getSpaceCount = (): number => {
  return getSpaceMemberships().length
}
