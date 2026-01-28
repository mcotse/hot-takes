/**
 * Device Token Management
 *
 * Generates and persists a random UUID as a device identifier.
 * Used for space membership tracking and allowlist checks.
 * Generated once and stored in localStorage.
 */

const DEVICE_TOKEN_KEY = 'singles-infernal-rank:device-token'

/**
 * Get the device token, creating one if it doesn't exist
 */
export const getDeviceToken = (): string => {
  const existing = localStorage.getItem(DEVICE_TOKEN_KEY)
  if (existing) return existing

  const token = crypto.randomUUID()
  localStorage.setItem(DEVICE_TOKEN_KEY, token)
  return token
}

/**
 * Check if a device token exists (without creating one)
 */
export const hasDeviceToken = (): boolean => {
  return localStorage.getItem(DEVICE_TOKEN_KEY) !== null
}
