/**
 * Allowlist Management
 *
 * Checks device tokens against the VITE_ALLOWLIST_DEVICE_TOKENS env var.
 * Allowlisted devices bypass all space/board limits.
 */

/**
 * Get the set of allowlisted device tokens from env
 */
const getAllowlistedTokens = (): Set<string> => {
  const raw = import.meta.env.VITE_ALLOWLIST_DEVICE_TOKENS
  if (!raw || typeof raw !== 'string') return new Set()
  return new Set(raw.split(',').map((t: string) => t.trim()).filter(Boolean))
}

/**
 * Check if a device token is on the allowlist
 */
export const isAllowlisted = (deviceToken: string): boolean => {
  return getAllowlistedTokens().has(deviceToken)
}
