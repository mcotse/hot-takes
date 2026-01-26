/**
 * FriendCard Tests
 *
 * Tests for the friend display card component.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FriendCard } from './FriendCard'

describe('FriendCard', () => {
  const defaultProps = {
    uid: 'friend-123',
    displayName: 'Test Friend',
    username: 'testfriend',
    avatarUrl: 'https://example.com/avatar.jpg',
    onClick: vi.fn(),
  }

  describe('rendering', () => {
    it('should render display name', () => {
      render(<FriendCard {...defaultProps} />)

      expect(screen.getByText('Test Friend')).toBeInTheDocument()
    })

    it('should render username with @ prefix', () => {
      render(<FriendCard {...defaultProps} />)

      expect(screen.getByText('@testfriend')).toBeInTheDocument()
    })

    it('should render avatar image', () => {
      render(<FriendCard {...defaultProps} />)

      const avatar = screen.getByRole('img', { name: /test friend/i })
      expect(avatar).toHaveAttribute('src', defaultProps.avatarUrl)
    })

    it('should show shared board count when provided', () => {
      render(<FriendCard {...defaultProps} sharedBoardCount={3} />)

      expect(screen.getByText(/3 shared/i)).toBeInTheDocument()
    })

    it('should not show board count when not provided', () => {
      render(<FriendCard {...defaultProps} />)

      expect(screen.queryByText(/shared/i)).not.toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup()
      render(<FriendCard {...defaultProps} />)

      await user.click(screen.getByRole('button'))

      expect(defaultProps.onClick).toHaveBeenCalledWith('friend-123')
    })

    it('should call onClick on Enter key press', async () => {
      const user = userEvent.setup()
      render(<FriendCard {...defaultProps} />)

      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard('{Enter}')

      expect(defaultProps.onClick).toHaveBeenCalledWith('friend-123')
    })
  })

  describe('avatar fallback', () => {
    it('should show initials when no avatar URL', () => {
      render(<FriendCard {...defaultProps} avatarUrl="" />)

      // Should show initials fallback
      expect(screen.getByText('TF')).toBeInTheDocument()
    })

    it('should use first letter of single-word name', () => {
      render(<FriendCard {...defaultProps} displayName="Friend" avatarUrl="" />)

      expect(screen.getByText('F')).toBeInTheDocument()
    })
  })
})
