import { type ReactNode, type ElementType, type HTMLAttributes } from 'react'
import { wobbly } from '../../styles/wobbly'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  variant?: 'default' | 'postit'
  decoration?: 'none' | 'tape' | 'tack'
  as?: ElementType
}

/**
 * Tape decoration - translucent gray bar at top
 */
const TapeDecoration = () => (
  <div
    data-testid="decoration-tape"
    data-decoration="tape"
    className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-6 bg-gray-300/50 rotate-[-2deg]"
    style={{
      borderRadius: '2px',
    }}
  />
)

/**
 * Thumbtack decoration - red pin at top center
 */
const TackDecoration = () => (
  <div
    data-testid="decoration-tack"
    data-decoration="tack"
    className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#ff4d4d] border-2 border-[#2d2d2d] shadow-[1px_1px_0px_0px_#2d2d2d]"
    style={{
      borderRadius: wobbly.circle,
    }}
  />
)

/**
 * Hand-drawn style Card component
 *
 * Features:
 * - Wobbly irregular borders
 * - Subtle hard offset shadow
 * - Optional decorations (tape strip, thumbtack)
 * - Post-it yellow variant for feature cards
 */
export const Card = ({
  children,
  variant = 'default',
  decoration = 'none',
  as: Component = 'div',
  className = '',
  ...props
}: CardProps) => {
  return (
    <Component
      className={`
        relative
        ${variant === 'postit' ? 'bg-[#fff9c4]' : 'bg-white'}
        border-2 border-[#2d2d2d]
        shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)]
        p-4
        ${className}
      `}
      style={{
        borderRadius: wobbly.md,
      }}
      {...props}
    >
      {decoration === 'tape' && <TapeDecoration />}
      {decoration === 'tack' && <TackDecoration />}
      {children}
    </Component>
  )
}
