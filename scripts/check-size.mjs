/**
 * Bundle size budget (fails CI when exceeded). Run after `npm run build`.
 *  - initial JS: what the browser downloads before the first screen (entry + modulepreloads)
 *  - total JS: every chunk, including lazy ones (lessons, notation)
 */
import { readFileSync, readdirSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

// total raised from 450 to 600 KB for the band characters (inline SVG art that loads after the first screen)
const BUDGET_KB = { initial: 160, total: 600 }
const dir = process.argv[2] ?? 'dist'
const html = readFileSync(`${dir}/index.html`, 'utf8')
const gz = (f) => gzipSync(readFileSync(`${dir}/${f}`)).length / 1024
const initialFiles = [...html.matchAll(/(?:src|href)="\.?\/?(assets\/[^"]+\.js)"/g)].map((m) => m[1])
const allJs = readdirSync(`${dir}/assets`).filter((f) => f.endsWith('.js')).map((f) => `assets/${f}`)

const initial = initialFiles.reduce((s, f) => s + gz(f), 0)
const total = allJs.reduce((s, f) => s + gz(f), 0)
const row = (name, kb, max) => `${kb <= max ? '✓' : '✗'} ${name.padEnd(10)} ${kb.toFixed(1).padStart(6)} KB gzip (budget ${max} KB)`
console.log(row('initial', initial, BUDGET_KB.initial))
console.log(row('total', total, BUDGET_KB.total))
if (initial > BUDGET_KB.initial || total > BUDGET_KB.total) process.exit(1)
