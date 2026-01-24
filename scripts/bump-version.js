#!/usr/bin/env node
/**
 * Bump version script
 * Usage: node scripts/bump-version.js [patch|minor|major]
 */

import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const packagePath = join(__dirname, '..', 'package.json')

function bumpVersion(version, type) {
  const [major, minor, patch] = version.split('.').map(Number)

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
    default:
      throw new Error(`Unknown bump type: ${type}`)
  }
}

const bumpType = process.argv[2]

if (!['patch', 'minor', 'major'].includes(bumpType)) {
  console.error('Usage: node scripts/bump-version.js [patch|minor|major]')
  process.exit(1)
}

const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'))
const oldVersion = pkg.version
const newVersion = bumpVersion(oldVersion, bumpType)

pkg.version = newVersion
writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n')

console.log(`v${newVersion}`)
