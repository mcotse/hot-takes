import { type HTMLAttributes } from 'react'

export interface DragHandleProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the handle is currently being dragged */
  isDragging?: boolean
}

/**
 * Individual wobbly line - each slightly different for hand-drawn feel
 */
const WobblyLine = ({
  variant,
}: {
  variant: 'top' | 'middle' | 'bottom'
}) => {
  // Each line has slightly different dimensions and rotation for organic feel
  const lineStyles = {
    top: {
      width: '18px',
      transform: 'rotate(-1deg)',
      borderRadius: '1px 2px 1px 2px',
    },
    middle: {
      width: '20px',
      transform: 'rotate(0.5deg)',
      borderRadius: '2px 1px 2px 1px',
    },
    bottom: {
      width: '17px',
      transform: 'rotate(1deg)',
      borderRadius: '1px 1px 2px 2px',
    },
  }

  return (
    <div
      data-testid="drag-line"
      className="h-[2px] bg-[#2d2d2d] transition-all duration-100"
      style={lineStyles[variant]}
    />
  )
}

/**
 * DragHandle Component
 *
 * A grip indicator with three horizontal wobbly lines that
 * looks hand-drawn. Used as the drag initiation point for
 * reorderable cards.
 *
 * Design notes:
 * - Three lines with slight variations in width and rotation
 * - Minimum 48x48px touch target for accessibility
 * - Pencil-gray color (#2d2d2d) matching the hand-drawn aesthetic
 * - Subtle hover state with accent color hint
 * - Reduced opacity when actively dragging
 */
export const DragHandle = ({
  isDragging = false,
  className = '',
  ...props
}: DragHandleProps) => {
  return (
    <div
      data-testid="drag-handle"
      role="img"
      aria-label="Drag to reorder"
      className={`
        flex flex-col items-center justify-center gap-[5px]
        w-12 h-12 min-w-12 min-h-12
        cursor-grab
        select-none
        touch-none
        transition-all duration-100
        hover:scale-110
        hover:opacity-80
        active:cursor-grabbing
        ${isDragging ? 'opacity-60 scale-95' : 'opacity-100'}
        ${className}
      `}
      {...props}
    >
      <WobblyLine variant="top" />
      <WobblyLine variant="middle" />
      <WobblyLine variant="bottom" />
    </div>
  )
}
