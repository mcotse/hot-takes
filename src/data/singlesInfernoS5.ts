/**
 * Singles Inferno Season 5 Cast Seed Data
 *
 * This file contains the cast members from Netflix's Singles Inferno Season 5.
 * Use this as seed data to quickly populate a ranking board.
 */

import type { ImportData } from '../lib/storage'

const BOARD_ID = 'singles-inferno-s5-seed'
const now = Date.now()

/**
 * Singles Inferno Season 5 seed data ready for import
 */
export const singlesInfernoS5SeedData: ImportData = {
  version: '1.0',
  boards: [
    {
      id: BOARD_ID,
      name: 'Singles Inferno S5',
      coverImage: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    },
  ],
  cards: [
    // Female Cast Members
    {
      id: 'si5-park-hee-sun',
      boardId: BOARD_ID,
      name: 'Park Hee Sun',
      imageKey: null,
      thumbnailKey: null,
      imageCrop: null,
      notes: 'Female contestant',
      metadata: { gender: 'female', season: 5 },
      rank: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'si5-kim-go-eun',
      boardId: BOARD_ID,
      name: 'Kim Go Eun',
      imageKey: null,
      thumbnailKey: null,
      imageCrop: null,
      notes: 'Female contestant',
      metadata: { gender: 'female', season: 5 },
      rank: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'si5-ham-ye-jin',
      boardId: BOARD_ID,
      name: 'Ham Ye Jin',
      imageKey: null,
      thumbnailKey: null,
      imageCrop: null,
      notes: 'Female contestant',
      metadata: { gender: 'female', season: 5 },
      rank: 3,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'si5-kim-min-ji',
      boardId: BOARD_ID,
      name: 'Kim Min Ji',
      imageKey: null,
      thumbnailKey: null,
      imageCrop: null,
      notes: 'Female contestant',
      metadata: { gender: 'female', season: 5 },
      rank: 4,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'si5-lee-joo-young',
      boardId: BOARD_ID,
      name: 'Lee Joo Young',
      imageKey: null,
      thumbnailKey: null,
      imageCrop: null,
      notes: 'Female contestant',
      metadata: { gender: 'female', season: 5 },
      rank: 5,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'si5-choi-mina-sue',
      boardId: BOARD_ID,
      name: 'Choi Mina Sue',
      imageKey: null,
      thumbnailKey: null,
      imageCrop: null,
      notes: 'Female contestant',
      metadata: { gender: 'female', season: 5 },
      rank: 6,
      createdAt: now,
      updatedAt: now,
    },
    // Male Cast Members
    {
      id: 'si5-youn-hyun-jae',
      boardId: BOARD_ID,
      name: 'Youn Hyun Jae',
      imageKey: null,
      thumbnailKey: null,
      imageCrop: null,
      notes: 'Male contestant',
      metadata: { gender: 'male', season: 5 },
      rank: 7,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'si5-song-seung-il',
      boardId: BOARD_ID,
      name: 'Song Seung Il',
      imageKey: null,
      thumbnailKey: null,
      imageCrop: null,
      notes: 'Male contestant',
      metadata: { gender: 'male', season: 5 },
      rank: 8,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'si5-shin-hyeon-woo',
      boardId: BOARD_ID,
      name: 'Shin Hyeon Woo',
      imageKey: null,
      thumbnailKey: null,
      imageCrop: null,
      notes: 'Male contestant',
      metadata: { gender: 'male', season: 5 },
      rank: 9,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'si5-kim-jae-jin',
      boardId: BOARD_ID,
      name: 'Kim Jae Jin',
      imageKey: null,
      thumbnailKey: null,
      imageCrop: null,
      notes: 'Male contestant',
      metadata: { gender: 'male', season: 5 },
      rank: 10,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'si5-woo-sung-min',
      boardId: BOARD_ID,
      name: 'Woo Sung Min',
      imageKey: null,
      thumbnailKey: null,
      imageCrop: null,
      notes: 'Male contestant',
      metadata: { gender: 'male', season: 5 },
      rank: 11,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'si5-lim-su-been',
      boardId: BOARD_ID,
      name: 'Lim Su Been',
      imageKey: null,
      thumbnailKey: null,
      imageCrop: null,
      notes: 'Male contestant',
      metadata: { gender: 'male', season: 5 },
      rank: 12,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'si5-lee-sung-hun',
      boardId: BOARD_ID,
      name: 'Lee Sung Hun (Samuel Lee)',
      imageKey: null,
      thumbnailKey: null,
      imageCrop: null,
      notes: 'Male contestant',
      metadata: { gender: 'male', season: 5 },
      rank: 13,
      createdAt: now,
      updatedAt: now,
    },
  ],
  exportedAt: now,
}

/**
 * Get the seed data as a JSON string for import
 */
export const getSinglesInfernoS5Json = (): string => {
  return JSON.stringify(singlesInfernoS5SeedData, null, 2)
}
