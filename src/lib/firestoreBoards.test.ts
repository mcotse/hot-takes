/**
 * Firestore Board Service Tests
 *
 * Tests for cloud board CRUD operations.
 * Uses mock Firestore to test without Firebase.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Board } from './types'
import type { CloudBoardData } from './socialTypes'

// Mock Firebase modules
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  Timestamp: {
    now: () => ({ toMillis: () => Date.now() }),
    fromMillis: (ms: number) => ({ toMillis: () => ms }),
  },
}))

vi.mock('./firebase', () => ({
  getFirebaseDb: vi.fn(),
  USE_MOCK_AUTH: true,
}))

describe('firestoreBoards', () => {
  const mockBoard: Board = {
    id: 'board-123',
    name: 'Test Board',
    coverImage: null,
    createdAt: Date.now() - 10000,
    updatedAt: Date.now(),
    deletedAt: null,
  }

  const mockUserId = 'user-abc'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('toCloudBoard', () => {
    it('should convert local board to cloud format with owner info', async () => {
      const { toCloudBoard } = await import('./firestoreBoards')

      const cloudBoard = toCloudBoard(mockBoard, mockUserId)

      expect(cloudBoard.id).toBe(mockBoard.id)
      expect(cloudBoard.name).toBe(mockBoard.name)
      expect(cloudBoard.ownerId).toBe(mockUserId)
      expect(cloudBoard.sharing.visibility).toBe('private')
      expect(cloudBoard.sharing.publicLinkEnabled).toBe(false)
    })

    it('should preserve all local board fields', async () => {
      const { toCloudBoard } = await import('./firestoreBoards')

      const boardWithCover: Board = {
        ...mockBoard,
        coverImage: 'cover-key-123',
      }

      const cloudBoard = toCloudBoard(boardWithCover, mockUserId)

      expect(cloudBoard.coverImage).toBe('cover-key-123')
      expect(cloudBoard.createdAt).toBe(boardWithCover.createdAt)
      expect(cloudBoard.updatedAt).toBe(boardWithCover.updatedAt)
    })

    it('should set default sharing settings', async () => {
      const { toCloudBoard } = await import('./firestoreBoards')

      const cloudBoard = toCloudBoard(mockBoard, mockUserId)

      expect(cloudBoard.sharing).toEqual({
        visibility: 'private',
        publicLinkEnabled: false,
      })
    })
  })

  describe('fromCloudBoard', () => {
    it('should convert cloud board to local format', async () => {
      const { toCloudBoard, fromCloudBoard } = await import('./firestoreBoards')

      const cloudBoard = toCloudBoard(mockBoard, mockUserId)
      const localBoard = fromCloudBoard(cloudBoard)

      expect(localBoard.id).toBe(mockBoard.id)
      expect(localBoard.name).toBe(mockBoard.name)
      expect(localBoard.coverImage).toBe(mockBoard.coverImage)
      expect(localBoard.createdAt).toBe(mockBoard.createdAt)
      expect(localBoard.updatedAt).toBe(mockBoard.updatedAt)
      expect(localBoard.deletedAt).toBe(mockBoard.deletedAt)
    })

    it('should strip cloud-only fields', async () => {
      const { toCloudBoard, fromCloudBoard } = await import('./firestoreBoards')

      const cloudBoard = toCloudBoard(mockBoard, mockUserId)
      const localBoard = fromCloudBoard(cloudBoard) as Record<string, unknown>

      expect(localBoard.ownerId).toBeUndefined()
      expect(localBoard.sharing).toBeUndefined()
      expect(localBoard.syncedAt).toBeUndefined()
    })
  })

  describe('CloudBoard type', () => {
    it('should extend Board with cloud fields', async () => {
      const { toCloudBoard } = await import('./firestoreBoards')

      const cloudBoard = toCloudBoard(mockBoard, mockUserId)

      // Required cloud fields
      expect(cloudBoard).toHaveProperty('ownerId')
      expect(cloudBoard).toHaveProperty('sharing')
      expect(cloudBoard).toHaveProperty('syncedAt')

      // Original board fields
      expect(cloudBoard).toHaveProperty('id')
      expect(cloudBoard).toHaveProperty('name')
      expect(cloudBoard).toHaveProperty('coverImage')
      expect(cloudBoard).toHaveProperty('createdAt')
      expect(cloudBoard).toHaveProperty('updatedAt')
      expect(cloudBoard).toHaveProperty('deletedAt')
    })
  })

  describe('mergeBoards', () => {
    it('should prefer local board when timestamps differ (local wins)', async () => {
      const { mergeBoards } = await import('./firestoreBoards')

      const localBoard: Board = {
        ...mockBoard,
        name: 'Local Name',
        updatedAt: Date.now(),
      }

      const cloudBoard: Board = {
        ...mockBoard,
        name: 'Cloud Name',
        updatedAt: Date.now() - 5000, // older
      }

      const merged = mergeBoards(localBoard, cloudBoard)

      expect(merged.name).toBe('Local Name')
    })

    it('should prefer local board even when cloud is newer (local always wins)', async () => {
      const { mergeBoards } = await import('./firestoreBoards')

      const localBoard: Board = {
        ...mockBoard,
        name: 'Local Name',
        updatedAt: Date.now() - 5000, // older
      }

      const cloudBoard: Board = {
        ...mockBoard,
        name: 'Cloud Name',
        updatedAt: Date.now(), // newer
      }

      // Per spec: local always wins
      const merged = mergeBoards(localBoard, cloudBoard)
      expect(merged.name).toBe('Local Name')
    })

    it('should return local board if cloud is null', async () => {
      const { mergeBoards } = await import('./firestoreBoards')

      const localBoard: Board = { ...mockBoard, name: 'Local Only' }

      const merged = mergeBoards(localBoard, null)

      expect(merged.name).toBe('Local Only')
    })

    it('should return cloud board if local is null', async () => {
      const { mergeBoards } = await import('./firestoreBoards')

      const cloudBoard: Board = { ...mockBoard, name: 'Cloud Only' }

      const merged = mergeBoards(null, cloudBoard)

      expect(merged.name).toBe('Cloud Only')
    })
  })

  describe('mergeBoardLists', () => {
    it('should combine local and cloud boards by ID', async () => {
      const { mergeBoardLists } = await import('./firestoreBoards')

      const localBoards: Board[] = [
        { ...mockBoard, id: 'board-1', name: 'Local Board 1' },
        { ...mockBoard, id: 'board-2', name: 'Local Board 2' },
      ]

      const cloudBoards: Board[] = [
        { ...mockBoard, id: 'board-2', name: 'Cloud Board 2' },
        { ...mockBoard, id: 'board-3', name: 'Cloud Board 3' },
      ]

      const merged = mergeBoardLists(localBoards, cloudBoards)

      expect(merged).toHaveLength(3)
      expect(merged.find((b) => b.id === 'board-1')?.name).toBe('Local Board 1')
      expect(merged.find((b) => b.id === 'board-2')?.name).toBe('Local Board 2') // local wins
      expect(merged.find((b) => b.id === 'board-3')?.name).toBe('Cloud Board 3')
    })

    it('should handle empty local list', async () => {
      const { mergeBoardLists } = await import('./firestoreBoards')

      const cloudBoards: Board[] = [
        { ...mockBoard, id: 'board-1', name: 'Cloud Board 1' },
      ]

      const merged = mergeBoardLists([], cloudBoards)

      expect(merged).toHaveLength(1)
      expect(merged[0].name).toBe('Cloud Board 1')
    })

    it('should handle empty cloud list', async () => {
      const { mergeBoardLists } = await import('./firestoreBoards')

      const localBoards: Board[] = [
        { ...mockBoard, id: 'board-1', name: 'Local Board 1' },
      ]

      const merged = mergeBoardLists(localBoards, [])

      expect(merged).toHaveLength(1)
      expect(merged[0].name).toBe('Local Board 1')
    })
  })
})
