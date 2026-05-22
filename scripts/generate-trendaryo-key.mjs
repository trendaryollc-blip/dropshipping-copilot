#!/usr/bin/env node
/**
 * Generates TRENDARYO_API_KEY and writes .env.local + secrets/dropease-trendaryo-api-key.txt
 * Usage: node scripts/generate-trendaryo-key.mjs [optional-base-url]
 */
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const key = 'de_' + crypto.randomBytes(32).toString('base64url')
const baseUrl = process.argv[2] || 'https://trendaryo.com'

const envBlock = `# Trendaryo live store ↔ DropEase (generated ${new Date().toISOString().slice(0, 10)})
TRENDARYO_API_URL=${baseUrl}
TRENDARYO_API_KEY=${key}
`

const envPath = path.join(root, '.env.local')
let existing = ''
if (fs.existsSync(envPath)) {
  existing = fs.readFileSync(envPath, 'utf8')
  existing = existing
    .split('\n')
    .filter((line) => !line.startsWith('TRENDARYO_API_URL=') && !line.startsWith('TRENDARYO_API_KEY='))
    .join('\n')
    .trim()
}
const merged = (existing ? existing + '\n\n' : '') + envBlock
fs.writeFileSync(envPath, merged.endsWith('\n') ? merged : merged + '\n')

const secretPath = path.join(root, 'secrets', 'dropease-trendaryo-api-key.txt')
fs.mkdirSync(path.dirname(secretPath), { recursive: true })
fs.writeFileSync(
  secretPath,
  `# Paste into Trendaryo Vercel as DROPEASE_API_KEY\n\n${key}\n`,
)

console.log('\nTrendaryo connection key generated.\n')
console.log('DropEase (.env.local):  TRENDARYO_API_KEY=' + key)
console.log('Trendaryo (Vercel):     DROPEASE_API_KEY=' + key)
console.log('Base URL:               TRENDARYO_API_URL=' + baseUrl)
console.log('\nNext: copy trendaryo-bridge/ routes into trendaryo.com repo and redeploy.\n')
