/**
 * ReportModal Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ReportModal } from './ReportModal'

// Mock useReports hook
vi.mock('../../hooks/useReports', () => ({
  useReports: () => ({
    submitReport: vi.fn().mockResolvedValue({ success: true, reportId: 'report-123' }),
    isSubmitting: false,
    error: null,
  }),
}))

describe('ReportModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    targetType: 'user' as const,
    targetId: 'target-456',
    targetName: 'John Doe',
    userId: 'user-123',
    onSubmitted: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render when open', () => {
    render(<ReportModal {...defaultProps} />)

    expect(screen.getByText(/Report John Doe/i)).toBeInTheDocument()
  })

  it('should not render when closed', () => {
    render(<ReportModal {...defaultProps} isOpen={false} />)

    expect(screen.queryByText(/Report/i)).not.toBeInTheDocument()
  })

  it('should display all report reason options', () => {
    render(<ReportModal {...defaultProps} />)

    expect(screen.getByLabelText(/Inappropriate content/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Harassment/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Spam/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Impersonation/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Other/i)).toBeInTheDocument()
  })

  it('should have a details textarea', () => {
    render(<ReportModal {...defaultProps} />)

    expect(screen.getByPlaceholderText(/additional details/i)).toBeInTheDocument()
  })

  it('should call onClose when cancel is clicked', () => {
    render(<ReportModal {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }))

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('should select a reason on click', () => {
    render(<ReportModal {...defaultProps} />)

    const harassmentRadio = screen.getByLabelText(/Harassment/i)
    fireEvent.click(harassmentRadio)

    expect(harassmentRadio).toBeChecked()
  })

  it('should allow typing in details', () => {
    render(<ReportModal {...defaultProps} />)

    const textarea = screen.getByPlaceholderText(/additional details/i)
    fireEvent.change(textarea, { target: { value: 'This user was rude' } })

    expect(textarea).toHaveValue('This user was rude')
  })

  it('should show submit button', () => {
    render(<ReportModal {...defaultProps} />)

    expect(screen.getByRole('button', { name: /Submit Report/i })).toBeInTheDocument()
  })

  it('should close backdrop on click', () => {
    render(<ReportModal {...defaultProps} />)

    const backdrop = screen.getByTestId('backdrop')
    fireEvent.click(backdrop)

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('should have accessible role dialog', () => {
    render(<ReportModal {...defaultProps} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should require reason selection before submit', async () => {
    render(<ReportModal {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /Submit Report/i })
    fireEvent.click(submitButton)

    // Should show validation error (use role="alert" to find the error)
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Please select a reason/i)
    })
  })
})
