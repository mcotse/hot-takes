/**
 * Singles Inferno Season 5 Cast Seed Data
 *
 * This file contains the cast members from Netflix's Singles Inferno Season 5.
 * Use this as seed data to quickly populate a ranking board.
 */

import type { Board, Card, Snapshot, RankingEntry } from '../lib/types'
import { saveBoard, saveCard, getBoard, getCardsByBoard, saveSnapshot, getSnapshotsByBoard } from '../lib/storage'
import { saveImage } from '../lib/db'

const WOMEN_BOARD_ID = 'singles-inferno-s5-women'
const MEN_BOARD_ID = 'singles-inferno-s5-men'

/**
 * Cast member data (image URLs kept for reference but placeholders are generated locally)
 */
interface CastMember {
  id: string
  name: string
  notes: string
  gender: 'female' | 'male'
  imageUrl: string
}

const castMembers: CastMember[] = [
  // Female Cast Members
  {
    id: 'si5-park-hee-sun',
    name: 'Park Hee Sun',
    notes: '',
    gender: 'female',
    imageUrl: 'https://www.dexerto.com/cdn-image/wp-content/uploads/2026/01/19/Park-Hee-sun-1024x599.jpg',
  },
  {
    id: 'si5-kim-go-eun',
    name: 'Kim Go Eun',
    notes: '',
    gender: 'female',
    imageUrl: 'https://www.dexerto.com/cdn-image/wp-content/uploads/2026/01/19/Kim-Go-eun-1024x603.jpg',
  },
  {
    id: 'si5-ham-ye-jin',
    name: 'Ham Ye Jin',
    notes: '',
    gender: 'female',
    imageUrl: 'https://www.dexerto.com/cdn-image/wp-content/uploads/2026/01/19/Ham-Ye-jin-1024x598.jpg',
  },
  {
    id: 'si5-kim-min-ji',
    name: 'Kim Min Ji',
    notes: '',
    gender: 'female',
    imageUrl: 'https://www.dexerto.com/cdn-image/wp-content/uploads/2026/01/19/Kim-Min-ji-1024x598.jpg',
  },
  {
    id: 'si5-lee-joo-young',
    name: 'Lee Joo Young',
    notes: '',
    gender: 'female',
    imageUrl: 'https://www.dexerto.com/cdn-image/wp-content/uploads/2026/01/19/Lee-Joo-young-1024x592.jpg',
  },
  {
    id: 'si5-choi-mina-sue',
    name: 'Choi Mina Sue',
    notes: '',
    gender: 'female',
    imageUrl: 'https://www.dexerto.com/cdn-image/wp-content/uploads/2026/01/19/Choi-Mina-Sue-1024x605.jpg',
  },
  // Male Cast Members
  {
    id: 'si5-youn-hyun-jae',
    name: 'Youn Hyun Jae',
    notes: '',
    gender: 'male',
    imageUrl: 'https://www.dexerto.com/cdn-image/wp-content/uploads/2026/01/19/Youn-Hyun-jae-1024x598.jpg',
  },
  {
    id: 'si5-song-seung-il',
    name: 'Song Seung Il',
    notes: '',
    gender: 'male',
    imageUrl: 'https://www.dexerto.com/cdn-image/wp-content/uploads/2026/01/19/Song-Seung-il-1024x598.jpg',
  },
  {
    id: 'si5-shin-hyeon-woo',
    name: 'Shin Hyeon Woo',
    notes: '',
    gender: 'male',
    imageUrl: 'https://www.dexerto.com/cdn-image/wp-content/uploads/2026/01/19/Shin-Hyeon–woo-1024x598.jpg',
  },
  {
    id: 'si5-kim-jae-jin',
    name: 'Kim Jae Jin',
    notes: '',
    gender: 'male',
    imageUrl: 'https://www.dexerto.com/cdn-image/wp-content/uploads/2026/01/19/Kim-Jae-jin--1024x607.jpg',
  },
  {
    id: 'si5-woo-sung-min',
    name: 'Woo Sung Min',
    notes: '',
    gender: 'male',
    imageUrl: 'https://www.dexerto.com/cdn-image/wp-content/uploads/2026/01/19/Woo-Sung-min-1024x598.jpg',
  },
  {
    id: 'si5-lim-su-been',
    name: 'Lim Su Been',
    notes: '',
    gender: 'male',
    imageUrl: 'https://www.dexerto.com/cdn-image/wp-content/uploads/2026/01/19/Lim-Su-been-1024x600.jpg',
  },
  {
    id: 'si5-lee-sung-hun',
    name: 'Lee Sung Hun (Samuel Lee)',
    notes: '',
    gender: 'male',
    imageUrl: 'https://www.dexerto.com/cdn-image/wp-content/uploads/2026/01/19/Lee-Sung-hun-1024x598.jpg',
  },
]

/**
 * Color palette for placeholder avatars (soft, pastel colors)
 */
const AVATAR_COLORS = [
  '#FF6B6B', // coral
  '#4ECDC4', // teal
  '#45B7D1', // sky blue
  '#96CEB4', // sage
  '#FFEAA7', // butter
  '#DDA0DD', // plum
  '#98D8C8', // mint
  '#F7DC6F', // gold
  '#BB8FCE', // lavender
  '#85C1E9', // light blue
  '#F8B500', // amber
  '#7DCEA0', // green
  '#F1948A', // rose
]

/**
 * Get initials from a name (e.g., "Park Hee Sun" -> "PH")
 */
const getInitials = (name: string): string => {
  const parts = name.split(' ').filter(p => p.length > 0)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

/**
 * Generate a deterministic color based on name
 */
const getColorForName = (name: string): string => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

/**
 * Generate a placeholder avatar image as a Blob
 * Creates a colored circle with initials - instant, no network required
 */
const generatePlaceholderAvatar = (name: string, size: number = 200): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Failed to get canvas context'))
      return
    }

    const color = getColorForName(name)
    const initials = getInitials(name)

    // Draw background circle
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw initials
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `bold ${size * 0.4}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(initials, size / 2, size / 2)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create blob'))
        }
      },
      'image/jpeg',
      0.8
    )
  })
}

/**
 * Generate placeholder images for a cast member and save to IndexedDB
 * This is instant - no network required
 */
const generateCastMemberPlaceholder = async (
  member: CastMember,
  now: number
): Promise<{ member: CastMember; imageKey: string }> => {
  const imageKey = `image-${member.id}`

  // Generate full-size and thumbnail placeholders
  const fullBlob = await generatePlaceholderAvatar(member.name, 400)
  const thumbnailBlob = await generatePlaceholderAvatar(member.name, 200)

  await saveImage({
    key: imageKey,
    blob: fullBlob,
    thumbnail: thumbnailBlob,
    mimeType: 'image/jpeg',
    createdAt: now,
  })

  return { member, imageKey }
}

/**
 * Load progress callback type
 */
export type LoadProgressCallback = (current: number, total: number, name: string) => void

/**
 * Load result
 */
export interface LoadSeedDataResult {
  success: boolean
  boardCreated: boolean
  cardsCreated: number
  imagesLoaded: number
  errors: string[]
}

/**
 * Load Singles Inferno Season 5 seed data with images
 *
 * This function:
 * 1. Creates the board with poster as cover image
 * 2. Creates all cast member cards
 * 3. Fetches and processes images for each cast member
 * 4. Reports progress via callback
 */
export const loadSinglesInfernoS5 = async (
  onProgress?: LoadProgressCallback
): Promise<LoadSeedDataResult> => {
  const now = Date.now()
  const errors: string[] = []
  let imagesLoaded = 0
  let cardsCreated = 0
  let boardsCreated = 0

  // Split cast by gender
  const women = castMembers.filter(m => m.gender === 'female')
  const men = castMembers.filter(m => m.gender === 'male')

  const totalSteps = castMembers.length + 2 // +2 for two board posters

  // Check if boards already exist - only skip if BOTH already exist
  const existingWomenBoard = getBoard(WOMEN_BOARD_ID)
  const existingMenBoard = getBoard(MEN_BOARD_ID)
  if (existingWomenBoard && existingMenBoard) {
    return {
      success: true,
      boardCreated: false,
      cardsCreated: 0,
      imagesLoaded: 0,
      errors: ['Singles Inferno S5 boards already exist'],
    }
  }

  // Step 1: Generate poster placeholder (instant, no network)
  onProgress?.(0, totalSteps, 'Creating boards...')

  let coverImageKey: string | null = null
  try {
    coverImageKey = `poster-${WOMEN_BOARD_ID}`
    const posterFull = await generatePlaceholderAvatar('Singles Inferno S5', 400)
    const posterThumb = await generatePlaceholderAvatar('Singles Inferno S5', 200)

    await saveImage({
      key: coverImageKey,
      blob: posterFull,
      thumbnail: posterThumb,
      mimeType: 'image/jpeg',
      createdAt: now,
    })
    imagesLoaded++
  } catch (error) {
    errors.push(`Failed to create poster: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  // Create Women's board
  const womenBoard: Board = {
    id: WOMEN_BOARD_ID,
    name: 'Singles Inferno S5 Girls',
    coverImage: coverImageKey,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  }
  saveBoard(womenBoard)
  boardsCreated++

  // Step 2: Create Men's board (reuse same poster)
  onProgress?.(1, totalSteps, 'Creating boards...')

  const menBoard: Board = {
    id: MEN_BOARD_ID,
    name: 'Singles Inferno S5 Boys',
    coverImage: coverImageKey, // Reuse same poster
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  }
  saveBoard(menBoard)
  boardsCreated++

  // Step 3: Generate placeholder images for all cast members (instant, no network!)
  const imageKeyMap = new Map<string, string>()

  for (let i = 0; i < castMembers.length; i++) {
    const member = castMembers[i]
    onProgress?.(i + 2, totalSteps, `Creating ${member.name}...`)

    try {
      const result = await generateCastMemberPlaceholder(member, now)
      imageKeyMap.set(member.id, result.imageKey)
      imagesLoaded++
    } catch (error) {
      errors.push(`Failed to create placeholder for ${member.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Step 4: Create cards for women (fast, no I/O)
  for (let i = 0; i < women.length; i++) {
    const member = women[i]
    const imageKey = imageKeyMap.get(member.id) ?? null

    const card: Card = {
      id: member.id,
      boardId: WOMEN_BOARD_ID,
      name: member.name,
      nickname: '',
      imageKey,
      thumbnailKey: imageKey,
      imageCrop: null,
      notes: member.notes,
      metadata: { gender: member.gender, season: 5 },
      rank: i + 1,
      createdAt: now,
      updatedAt: now,
    }
    saveCard(card)
    cardsCreated++
  }

  // Step 5: Create cards for men (fast, no I/O)
  for (let i = 0; i < men.length; i++) {
    const member = men[i]
    const imageKey = imageKeyMap.get(member.id) ?? null

    const card: Card = {
      id: member.id,
      boardId: MEN_BOARD_ID,
      name: member.name,
      nickname: '',
      imageKey,
      thumbnailKey: imageKey,
      imageCrop: null,
      notes: member.notes,
      metadata: { gender: member.gender, season: 5 },
      rank: i + 1,
      createdAt: now,
      updatedAt: now,
    }
    saveCard(card)
    cardsCreated++
  }

  onProgress?.(totalSteps, totalSteps, 'Complete!')

  return {
    success: true,
    boardCreated: boardsCreated > 0,
    cardsCreated,
    imagesLoaded,
    errors,
  }
}

/**
 * Get the seed data as a JSON string for import (without images)
 * @deprecated Use loadSinglesInfernoS5() instead for full functionality with images
 */
export const getSinglesInfernoS5Json = (): string => {
  const now = Date.now()
  const women = castMembers.filter(m => m.gender === 'female')
  const men = castMembers.filter(m => m.gender === 'male')

  return JSON.stringify({
    version: '1.0',
    boards: [
      {
        id: WOMEN_BOARD_ID,
        name: 'Singles Inferno S5 Girls',
        coverImage: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      {
        id: MEN_BOARD_ID,
        name: 'Singles Inferno S5 Boys',
        coverImage: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
    ],
    cards: [
      ...women.map((member, index) => ({
        id: member.id,
        boardId: WOMEN_BOARD_ID,
        name: member.name,
        imageKey: null,
        thumbnailKey: null,
        imageCrop: null,
        notes: member.notes,
        metadata: { gender: member.gender, season: 5 },
        rank: index + 1,
        createdAt: now,
        updatedAt: now,
      })),
      ...men.map((member, index) => ({
        id: member.id,
        boardId: MEN_BOARD_ID,
        name: member.name,
        imageKey: null,
        thumbnailKey: null,
        imageCrop: null,
        notes: member.notes,
        metadata: { gender: member.gender, season: 5 },
        rank: index + 1,
        createdAt: now,
        updatedAt: now,
      })),
    ],
    exportedAt: now,
  }, null, 2)
}

/**
 * Snapshot load result
 */
export interface LoadSnapshotsResult {
  success: boolean
  snapshotsCreated: number
  errors: string[]
}

/**
 * Episode-by-episode ranking configurations
 * Each array represents the card IDs in rank order for that episode
 */
const WOMEN_RANKINGS_BY_EPISODE: string[][] = [
  // Episode 1: Initial impressions
  ['si5-park-hee-sun', 'si5-kim-go-eun', 'si5-ham-ye-jin', 'si5-kim-min-ji', 'si5-lee-joo-young', 'si5-choi-mina-sue'],
  // Episode 2: After first Paradise dates
  ['si5-kim-go-eun', 'si5-park-hee-sun', 'si5-choi-mina-sue', 'si5-ham-ye-jin', 'si5-kim-min-ji', 'si5-lee-joo-young'],
  // Episode 3: Drama and unexpected connections
  ['si5-ham-ye-jin', 'si5-kim-go-eun', 'si5-park-hee-sun', 'si5-lee-joo-young', 'si5-choi-mina-sue', 'si5-kim-min-ji'],
  // Episode 4: Mid-season shake-up
  ['si5-kim-go-eun', 'si5-ham-ye-jin', 'si5-lee-joo-young', 'si5-park-hee-sun', 'si5-kim-min-ji', 'si5-choi-mina-sue'],
  // Episode 5: Final rankings
  ['si5-ham-ye-jin', 'si5-kim-go-eun', 'si5-park-hee-sun', 'si5-lee-joo-young', 'si5-kim-min-ji', 'si5-choi-mina-sue'],
]

const MEN_RANKINGS_BY_EPISODE: string[][] = [
  // Episode 1: Initial impressions
  ['si5-youn-hyun-jae', 'si5-song-seung-il', 'si5-shin-hyeon-woo', 'si5-kim-jae-jin', 'si5-woo-sung-min', 'si5-lim-su-been', 'si5-lee-sung-hun'],
  // Episode 2: After first Paradise dates
  ['si5-song-seung-il', 'si5-youn-hyun-jae', 'si5-kim-jae-jin', 'si5-shin-hyeon-woo', 'si5-lee-sung-hun', 'si5-woo-sung-min', 'si5-lim-su-been'],
  // Episode 3: Drama and unexpected connections
  ['si5-kim-jae-jin', 'si5-song-seung-il', 'si5-youn-hyun-jae', 'si5-lee-sung-hun', 'si5-shin-hyeon-woo', 'si5-lim-su-been', 'si5-woo-sung-min'],
  // Episode 4: Mid-season shake-up
  ['si5-song-seung-il', 'si5-kim-jae-jin', 'si5-lee-sung-hun', 'si5-youn-hyun-jae', 'si5-shin-hyeon-woo', 'si5-woo-sung-min', 'si5-lim-su-been'],
  // Episode 5: Final rankings
  ['si5-kim-jae-jin', 'si5-song-seung-il', 'si5-youn-hyun-jae', 'si5-lee-sung-hun', 'si5-shin-hyeon-woo', 'si5-lim-su-been', 'si5-woo-sung-min'],
]

const EPISODE_NOTES: string[] = [
  'First impressions from the arrival episode',
  'Rankings after the first Paradise dates and pool party',
  'Big shake-up after the love triangle drama!',
  'Mid-season adjustments as relationships develop',
  'Final episode rankings before the finale',
]

/**
 * Load snapshot history for Singles Inferno S5 boards
 *
 * Creates 5 episodes of ranking history showing week-over-week changes
 * Requires the boards and cards to already exist (run loadSinglesInfernoS5 first)
 */
export const loadSinglesInfernoS5Snapshots = (
  onProgress?: LoadProgressCallback
): LoadSnapshotsResult => {
  const errors: string[] = []
  let snapshotsCreated = 0

  // Check if boards exist
  const womenBoard = getBoard(WOMEN_BOARD_ID)
  const menBoard = getBoard(MEN_BOARD_ID)

  if (!womenBoard || !menBoard) {
    return {
      success: false,
      snapshotsCreated: 0,
      errors: ['Singles Inferno S5 boards not found. Load the cast data first.'],
    }
  }

  // Check if snapshots already exist
  const existingWomenSnapshots = getSnapshotsByBoard(WOMEN_BOARD_ID)
  const existingMenSnapshots = getSnapshotsByBoard(MEN_BOARD_ID)

  if (existingWomenSnapshots.length > 0 || existingMenSnapshots.length > 0) {
    return {
      success: true,
      snapshotsCreated: 0,
      errors: ['Snapshots already exist for Singles Inferno S5 boards'],
    }
  }

  // Get current cards to build ranking entries
  const womenCards = getCardsByBoard(WOMEN_BOARD_ID)
  const menCards = getCardsByBoard(MEN_BOARD_ID)

  if (womenCards.length === 0 || menCards.length === 0) {
    return {
      success: false,
      snapshotsCreated: 0,
      errors: ['No cards found for Singles Inferno S5 boards. Load the cast data first.'],
    }
  }

  // Create card lookup maps
  const womenCardMap = new Map(womenCards.map(c => [c.id, c]))
  const menCardMap = new Map(menCards.map(c => [c.id, c]))

  const totalEpisodes = WOMEN_RANKINGS_BY_EPISODE.length + MEN_RANKINGS_BY_EPISODE.length
  let currentStep = 0

  // Create snapshots for women's board
  for (let ep = 0; ep < WOMEN_RANKINGS_BY_EPISODE.length; ep++) {
    onProgress?.(++currentStep, totalEpisodes, `Creating Women Ep ${ep + 1}...`)

    const rankings: RankingEntry[] = WOMEN_RANKINGS_BY_EPISODE[ep]
      .map((cardId, index) => {
        const card = womenCardMap.get(cardId)
        if (!card) return null
        return {
          cardId: card.id,
          cardName: card.name,
          rank: index + 1,
          thumbnailKey: card.thumbnailKey,
        }
      })
      .filter((entry): entry is RankingEntry => entry !== null)

    // Create snapshot with timestamps spread over "weeks"
    const baseTime = Date.now() - (WOMEN_RANKINGS_BY_EPISODE.length - ep) * 7 * 24 * 60 * 60 * 1000

    const snapshot: Snapshot = {
      id: `snapshot-women-ep${ep + 1}`,
      boardId: WOMEN_BOARD_ID,
      episodeNumber: ep + 1,
      label: `Episode ${ep + 1}`,
      notes: EPISODE_NOTES[ep] || '',
      rankings,
      createdAt: baseTime,
    }

    saveSnapshot(snapshot)
    snapshotsCreated++
  }

  // Create snapshots for men's board
  for (let ep = 0; ep < MEN_RANKINGS_BY_EPISODE.length; ep++) {
    onProgress?.(++currentStep, totalEpisodes, `Creating Men Ep ${ep + 1}...`)

    const rankings: RankingEntry[] = MEN_RANKINGS_BY_EPISODE[ep]
      .map((cardId, index) => {
        const card = menCardMap.get(cardId)
        if (!card) return null
        return {
          cardId: card.id,
          cardName: card.name,
          rank: index + 1,
          thumbnailKey: card.thumbnailKey,
        }
      })
      .filter((entry): entry is RankingEntry => entry !== null)

    // Create snapshot with timestamps spread over "weeks"
    const baseTime = Date.now() - (MEN_RANKINGS_BY_EPISODE.length - ep) * 7 * 24 * 60 * 60 * 1000

    const snapshot: Snapshot = {
      id: `snapshot-men-ep${ep + 1}`,
      boardId: MEN_BOARD_ID,
      episodeNumber: ep + 1,
      label: `Episode ${ep + 1}`,
      notes: EPISODE_NOTES[ep] || '',
      rankings,
      createdAt: baseTime,
    }

    saveSnapshot(snapshot)
    snapshotsCreated++
  }

  onProgress?.(totalEpisodes, totalEpisodes, 'Complete!')

  return {
    success: true,
    snapshotsCreated,
    errors,
  }
}
