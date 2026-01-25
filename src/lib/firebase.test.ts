import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  isFirebaseConfigured,
  isFirebaseInitialized,
  resetFirebase,
} from './firebase'

// Mock import.meta.env
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_FIREBASE_API_KEY: '',
      VITE_FIREBASE_AUTH_DOMAIN: '',
      VITE_FIREBASE_PROJECT_ID: '',
      VITE_FIREBASE_STORAGE_BUCKET: '',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '',
      VITE_FIREBASE_APP_ID: '',
    },
  },
})

describe('firebase', () => {
  beforeEach(() => {
    resetFirebase()
  })

  describe('isFirebaseConfigured', () => {
    it('returns false when env vars are not set', () => {
      // With empty env vars (mocked above)
      expect(isFirebaseConfigured()).toBe(false)
    })
  })

  describe('isFirebaseInitialized', () => {
    it('returns false initially', () => {
      expect(isFirebaseInitialized()).toBe(false)
    })
  })

  describe('resetFirebase', () => {
    it('resets initialization state', () => {
      resetFirebase()
      expect(isFirebaseInitialized()).toBe(false)
    })
  })
})
