import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  describe('rendering', () => {
    it('renders children content', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('renders as a div by default', () => {
      render(<Card data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')
      expect(card.tagName).toBe('DIV')
    })
  })

  describe('variants', () => {
    it('renders default variant with white background', () => {
      render(<Card data-testid="card">Default</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('bg-white')
    })

    it('renders postit variant with yellow background', () => {
      render(<Card data-testid="card" variant="postit">Post-it</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('bg-[#fff9c4]')
    })
  })

  describe('decorations', () => {
    it('renders without decoration by default', () => {
      render(<Card data-testid="card">No decoration</Card>)
      const card = screen.getByTestId('card')
      expect(card.querySelector('[data-decoration]')).toBeNull()
    })

    it('renders tape decoration when specified', () => {
      render(<Card decoration="tape">With tape</Card>)
      expect(screen.getByTestId('decoration-tape')).toBeInTheDocument()
    })

    it('renders tack decoration when specified', () => {
      render(<Card decoration="tack">With tack</Card>)
      expect(screen.getByTestId('decoration-tack')).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('has wobbly border-radius', () => {
      render(<Card data-testid="card">Wobbly</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveStyle({ borderRadius: expect.stringContaining('/') })
    })

    it('has border', () => {
      render(<Card data-testid="card">Bordered</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('border-2')
    })

    it('has subtle shadow', () => {
      render(<Card data-testid="card">Shadow</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)]')
    })
  })

  describe('padding', () => {
    it('has default padding', () => {
      render(<Card data-testid="card">Padded</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('p-4')
    })

    it('allows custom padding via className', () => {
      render(<Card data-testid="card" className="p-8">Custom padding</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('p-8')
    })
  })

  describe('as prop', () => {
    it('can render as different elements', () => {
      render(<Card as="section" data-testid="card">Section</Card>)
      const card = screen.getByTestId('card')
      expect(card.tagName).toBe('SECTION')
    })

    it('can render as article', () => {
      render(<Card as="article" data-testid="card">Article</Card>)
      const card = screen.getByTestId('card')
      expect(card.tagName).toBe('ARTICLE')
    })
  })
})
