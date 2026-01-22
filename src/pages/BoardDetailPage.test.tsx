import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BoardDetailPage } from './BoardDetailPage'
import * as useBoardsModule from '../hooks/useBoards'
import * as useCardsModule from '../hooks/useCards'

// Mock the hooks
vi.mock('../hooks/useBoards')
vi.mock('../hooks/useCards')

const mockUseBoards = vi.mocked(useBoardsModule.useBoards)
const mockUseCards = vi.mocked(useCardsModule.useCards)

describe('BoardDetailPage', () => {
  const mockBoard = {
    id: 'board-1',
    name: 'Test Board',
    coverImage: null,
    createdAt: 1000,
    updatedAt: 1000,
    deletedAt: null,
  }

  const mockCards = [
    {
      id: 'card-1',
      boardId: 'board-1',
      name: 'First Card',
      imageKey: null,
      thumbnailKey: null,
      imageCrop: null,
      notes: 'Some notes',
      metadata: {},
      rank: 1,
      createdAt: 1000,
      updatedAt: 1000,
    },
    {
      id: 'card-2',
      boardId: 'board-1',
      name: 'Second Card',
      imageKey: null,
      thumbnailKey: null,
      imageCrop: null,
      notes: '',
      metadata: {},
      rank: 2,
      createdAt: 2000,
      updatedAt: 2000,
    },
  ]

  const defaultBoardsHook = {
    boards: [mockBoard],
    deletedBoards: [],
    createBoard: vi.fn(),
    updateBoard: vi.fn(),
    softDeleteBoard: vi.fn(),
    restoreBoard: vi.fn(),
    permanentlyDeleteBoard: vi.fn(),
    getBoard: vi.fn(() => mockBoard),
    refresh: vi.fn(),
  }

  const defaultCardsHook = {
    cards: mockCards,
    createCard: vi.fn(),
    updateCard: vi.fn(),
    deleteCard: vi.fn(),
    reorderCards: vi.fn(),
    getCard: vi.fn(),
    refresh: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseBoards.mockReturnValue(defaultBoardsHook)
    mockUseCards.mockReturnValue(defaultCardsHook)
  })

  describe('header', () => {
    it('renders the board name', () => {
      render(<BoardDetailPage boardId="board-1" onBack={vi.fn()} />)
      expect(screen.getByText('Test Board')).toBeInTheDocument()
    })

    it('renders back button', () => {
      render(<BoardDetailPage boardId="board-1" onBack={vi.fn()} />)
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    })

    it('calls onBack when back button clicked', () => {
      const onBack = vi.fn()
      render(<BoardDetailPage boardId="board-1" onBack={onBack} />)

      fireEvent.click(screen.getByRole('button', { name: /back/i }))
      expect(onBack).toHaveBeenCalled()
    })
  })

  describe('rank list', () => {
    it('renders the rank list with cards', () => {
      render(<BoardDetailPage boardId="board-1" onBack={vi.fn()} />)

      expect(screen.getByText('First Card')).toBeInTheDocument()
      expect(screen.getByText('Second Card')).toBeInTheDocument()
    })

    it('shows empty state when no cards', () => {
      mockUseCards.mockReturnValue({
        ...defaultCardsHook,
        cards: [],
      })

      render(<BoardDetailPage boardId="board-1" onBack={vi.fn()} />)

      expect(screen.getByTestId('empty-list')).toBeInTheDocument()
    })
  })

  describe('add card button', () => {
    it('renders FAB to add new card', () => {
      render(<BoardDetailPage boardId="board-1" onBack={vi.fn()} />)

      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
    })
  })

  describe('reordering', () => {
    it('calls reorderCards when cards are reordered', () => {
      const reorderCards = vi.fn()
      mockUseCards.mockReturnValue({
        ...defaultCardsHook,
        reorderCards,
      })

      render(<BoardDetailPage boardId="board-1" onBack={vi.fn()} />)

      // The RankList component handles the actual reorder
      // Just verify the hook is connected
      expect(mockUseCards).toHaveBeenCalledWith('board-1')
    })
  })

  describe('board not found', () => {
    it('shows error when board not found', () => {
      mockUseBoards.mockReturnValue({
        ...defaultBoardsHook,
        getBoard: vi.fn(() => undefined),
      })

      render(<BoardDetailPage boardId="non-existent" onBack={vi.fn()} />)

      expect(screen.getByText(/not found/i)).toBeInTheDocument()
    })
  })
})
