/**
 * FriendRequestCard Tests
 *
 * Tests for the friend request card component.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FriendRequestCard } from './FriendRequestCard'

describe('FriendRequestCard', () => {
  const defaultProps = {
    friendshipId: 'friendship-123',
    displayName: 'Request Sender',
    username: 'requestsender',
    avatarUrl: 'https://example.com/avatar.jpg',
    onAccept: vi.fn(),
    onDecline: vi.fn(),
    isLoading: false,
  }

  describe('rendering', () => {
    it('should render display name', () => {
      render(<FriendRequestCard {...defaultProps} />)

      expect(screen.getByText('Request Sender')).toBeInTheDocument()
    })

    it('should render username with @ prefix', () => {
      render(<FriendRequestCard {...defaultProps} />)

      expect(screen.getByText('@requestsender')).toBeInTheDocument()
    })

    it('should render avatar', () => {
      render(<FriendRequestCard {...defaultProps} />)

      const avatar = screen.getByRole('img', { name: /request sender/i })
      expect(avatar).toHaveAttribute('src', defaultProps.avatarUrl)
    })

    it('should render accept button', () => {
      render(<FriendRequestCard {...defaultProps} />)

      expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument()
    })

    it('should render decline button', () => {
      render(<FriendRequestCard {...defaultProps} />)

      expect(screen.getByRole('button', { name: /decline/i })).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should call onAccept when accept button clicked', async () => {
      const user = userEvent.setup()
      render(<FriendRequestCard {...defaultProps} />)

      await user.click(screen.getByRole('button', { name: /accept/i }))

      expect(defaultProps.onAccept).toHaveBeenCalledWith('friendship-123')
    })

    it('should call onDecline when decline button clicked', async () => {
      const user = userEvent.setup()
      render(<FriendRequestCard {...defaultProps} />)

      await user.click(screen.getByRole('button', { name: /decline/i }))

      expect(defaultProps.onDecline).toHaveBeenCalledWith('friendship-123')
    })
  })

  describe('loading state', () => {
    it('should disable buttons when loading', () => {
      render(<FriendRequestCard {...defaultProps} isLoading={true} />)

      expect(screen.getByRole('button', { name: /accept/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /decline/i })).toBeDisabled()
    })
  })

  describe('outgoing request', () => {
    it('should show pending label for outgoing requests', () => {
      render(<FriendRequestCard {...defaultProps} direction="outgoing" />)

      expect(screen.getByText(/pending/i)).toBeInTheDocument()
    })

    it('should show cancel button for outgoing requests', () => {
      render(<FriendRequestCard {...defaultProps} direction="outgoing" onCancel={vi.fn()} />)

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('should not show accept/decline for outgoing requests', () => {
      render(<FriendRequestCard {...defaultProps} direction="outgoing" />)

      expect(screen.queryByRole('button', { name: /accept/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /decline/i })).not.toBeInTheDocument()
    })
  })
})
