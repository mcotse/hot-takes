/**
 * Word Bank for Join Code Generation
 *
 * Generates human-readable join codes in "adjective-noun" format.
 * ~50 adjectives x ~50 nouns = ~2500 unique combinations.
 */

const adjectives = [
  'happy', 'brave', 'calm', 'clever', 'cool',
  'cozy', 'crisp', 'cute', 'daring', 'eager',
  'fancy', 'fast', 'fierce', 'fluffy', 'funky',
  'gentle', 'golden', 'grand', 'groovy', 'honest',
  'jolly', 'kind', 'lazy', 'lively', 'lucky',
  'mellow', 'mighty', 'neat', 'noble', 'plucky',
  'proud', 'quick', 'quiet', 'rapid', 'royal',
  'savvy', 'shiny', 'silly', 'sleek', 'snappy',
  'speedy', 'spicy', 'steady', 'sunny', 'super',
  'sweet', 'swift', 'tender', 'vivid', 'witty',
] as const

const nouns = [
  'tiger', 'panda', 'eagle', 'fox', 'wolf',
  'bear', 'hawk', 'lion', 'otter', 'raven',
  'shark', 'cobra', 'crane', 'dolphin', 'falcon',
  'gecko', 'heron', 'iguana', 'jaguar', 'koala',
  'lemur', 'moose', 'newt', 'owl', 'parrot',
  'quail', 'robin', 'salmon', 'toucan', 'viper',
  'whale', 'zebra', 'badger', 'bison', 'camel',
  'dingo', 'elk', 'ferret', 'goose', 'husky',
  'ibis', 'jackal', 'kiwi', 'lark', 'marten',
  'narwhal', 'osprey', 'puma', 'quokka', 'stork',
] as const

/**
 * Generate a random join code in "adjective-noun" format
 */
export const generateJoinCode = (): string => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adj}-${noun}`
}

/**
 * Generate a unique join code by checking against existing codes.
 * Falls back to appending a random digit after exhausting retries.
 */
export const generateUniqueJoinCode = async (
  existingCodes: Set<string>,
  maxRetries = 20
): Promise<string> => {
  for (let i = 0; i < maxRetries; i++) {
    const code = generateJoinCode()
    if (!existingCodes.has(code)) {
      return code
    }
  }

  // Fallback: append random digit
  const code = generateJoinCode()
  const suffix = Math.floor(Math.random() * 100)
  return `${code}-${suffix}`
}

/**
 * Validate that a string looks like a valid join code
 */
export const isValidJoinCode = (code: string): boolean => {
  return /^[a-z]+-[a-z]+(-\d+)?$/.test(code)
}
