import { useBoards } from '../hooks/useBoards'
import { useCards } from '../hooks/useCards'
import { RankList } from '../components/RankList'
import { Button } from '../components/ui/Button'
import { wobbly } from '../styles/wobbly'

interface BoardDetailPageProps {
  /** ID of the board to display */
  boardId: string
  /** Called when user wants to go back */
  onBack: () => void
  /** Called when a card is tapped for editing */
  onCardTap?: (cardId: string) => void
  /** Called when add card button is pressed */
  onAddCard?: () => void
}

/**
 * Back button with arrow
 */
const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Go back"
    className="
      flex items-center justify-center
      w-10 h-10
      text-[#2d2d2d] text-2xl
      hover:text-[#ff4d4d]
      transition-colors
    "
  >
    ←
  </button>
)

/**
 * Floating Action Button for adding cards
 */
const AddCardFAB = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Add new card"
    className="
      fixed bottom-24 right-4
      w-14 h-14
      bg-[#ff4d4d] text-white
      border-[3px] border-[#2d2d2d]
      shadow-[4px_4px_0px_0px_#2d2d2d]
      hover:shadow-[2px_2px_0px_0px_#2d2d2d]
      hover:translate-x-[2px] hover:translate-y-[2px]
      active:shadow-none
      active:translate-x-[4px] active:translate-y-[4px]
      transition-all duration-100
      text-3xl font-bold
      flex items-center justify-center
      z-20
    "
    style={{
      borderRadius: wobbly.circle,
      fontFamily: "'Kalam', cursive",
    }}
  >
    +
  </button>
)

/**
 * Error state when board not found
 */
const BoardNotFound = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-full flex flex-col items-center justify-center p-8 text-center">
    <div className="text-6xl mb-4">😕</div>
    <h2
      className="text-2xl text-[#2d2d2d] mb-2"
      style={{ fontFamily: "'Kalam', cursive", fontWeight: 700 }}
    >
      Board not found
    </h2>
    <p
      className="text-[#9a958d] mb-6"
      style={{ fontFamily: "'Patrick Hand', cursive" }}
    >
      This board may have been deleted.
    </p>
    <Button variant="secondary" onClick={onBack}>
      Go Back
    </Button>
  </div>
)

/**
 * BoardDetailPage Component
 *
 * Full-screen view of a board with its ranked cards.
 * Features:
 * - Header with board name and back button
 * - Scrollable list of draggable ranked cards
 * - FAB to add new cards
 * - Tap card to open detail modal
 * - Drag handle to reorder
 */
export const BoardDetailPage = ({
  boardId,
  onBack,
  onCardTap,
  onAddCard,
}: BoardDetailPageProps) => {
  const { getBoard } = useBoards()
  const { cards, reorderCards } = useCards(boardId)

  const board = getBoard(boardId)

  if (!board) {
    return <BoardNotFound onBack={onBack} />
  }

  const handleReorder = (fromIndex: number, toIndex: number) => {
    reorderCards(fromIndex, toIndex)
  }

  const handleCardTap = (cardId: string) => {
    onCardTap?.(cardId)
  }

  const handleAddCard = () => {
    onAddCard?.()
  }

  // TODO: Get thumbnail URLs from useImageStorage
  const thumbnailUrls: Record<string, string> = {}

  return (
    <div className="min-h-full pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#fdfbf7]/95 backdrop-blur-sm border-b border-[#e5e0d8]">
        <div className="flex items-center gap-2 px-2 py-3">
          <BackButton onClick={onBack} />

          <h1
            className="flex-1 text-2xl text-[#2d2d2d] truncate"
            style={{ fontFamily: "'Kalam', cursive", fontWeight: 700 }}
          >
            {board.name}
          </h1>
        </div>
      </header>

      {/* Rank List */}
      <RankList
        cards={cards}
        thumbnailUrls={thumbnailUrls}
        onReorder={handleReorder}
        onCardTap={handleCardTap}
      />

      {/* Add Card FAB */}
      <AddCardFAB onClick={handleAddCard} />
    </div>
  )
}
