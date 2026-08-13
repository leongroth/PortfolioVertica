// Every icon directly under assets/Icons (not the Buttons subfolder, which
// is for UI buttons, not page flair) - `*.svg` is a single-level glob, so it
// naturally doesn't reach into Buttons/.
const iconModules = import.meta.glob('/src/assets/Icons/*.svg', { eager: true, import: 'default' })
export const FLAIR_ICONS = Object.values(iconModules)

export const ICON_POSITIONS = ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right']

const ICON_COUNT_RANGE = [6, 7] // icons per call (call this once per section, not on the whole page)

// Short UX/dev-flavored snippets scattered as text flair, pinned to the top
// or bottom edge of a square (see STRING_POSITIONS).
export const FLAIR_STRINGS = [
  'UX Design',
  'Accessibility',
  "{ display: 'flex' }",
  "[ 'design', 'dev' ]",
  '.py',
  '.jsx',
  'JSON',
]

export const STRING_POSITIONS = ['top', 'bottom']

const STRING_COUNT_RANGE = [6, 7] // strings per call, same cadence as icons

// Picks `count` (within [min, max]) cells out of `eligible`, spread across
// reading order (row, then col) by splitting eligible into `count` equal-ish
// chunks and choosing one at random from each chunk, so picks land in
// different regions of the section instead of clustering together. Shared
// by assignIcons and assignStrings below. Uses Math.random() (not the grid
// layout's seeded PRNG) since this is purely decorative and, unlike the
// tiling itself, doesn't need to be reproducible - it's fine for it to look
// different every time the grid regenerates.
const pickSpread = (eligible, [min, max]) => {
  if (eligible.length === 0) return new Set()

  const count = Math.min(eligible.length, min + Math.floor(Math.random() * (max - min + 1)))
  const sorted = [...eligible].sort((a, b) => a.row - b.row || a.col - b.col)
  const chosen = new Set()
  for (let i = 0; i < count; i++) {
    const start = Math.floor((i * sorted.length) / count)
    const end = Math.floor(((i + 1) * sorted.length) / count)
    if (end <= start) continue
    chosen.add(sorted[start + Math.floor(Math.random() * (end - start))])
  }
  return chosen
}

// Gives a small, fixed number (6-7) of the plain 1x1 decorative squares in
// `cells` an icon + one of the 5 ICON_POSITIONS (center or a corner). Only
// 1x1 squares are eligible so icons stay small "flair" rather than
// dominating a merged or LARGE_SPAN square. Call this once per section (not
// once on the whole page's cells) so each section gets its own share of
// icons instead of them clustering wherever chance happens to land them.
export const assignIcons = (cells) => {
  const eligible = cells.filter((cell) => cell.type === 'square' && cell.colSpan === 1 && cell.rowSpan === 1)
  const chosen = pickSpread(eligible, ICON_COUNT_RANGE)
  if (chosen.size === 0) return cells

  return cells.map((cell) => {
    if (!chosen.has(cell)) return cell

    const icon = FLAIR_ICONS[Math.floor(Math.random() * FLAIR_ICONS.length)]
    const iconPosition = ICON_POSITIONS[Math.floor(Math.random() * ICON_POSITIONS.length)]
    return { ...cell, icon, iconPosition }
  })
}

// Same idea as assignIcons, but hands out a FLAIR_STRINGS snippet pinned to
// the top or bottom edge instead of an icon. Only squares that didn't
// already get an icon are eligible, so a single square never has to carry
// both at once - call this after assignIcons on the same cells.
export const assignStrings = (cells) => {
  const eligible = cells.filter(
    (cell) => cell.type === 'square' && cell.colSpan === 1 && cell.rowSpan === 1 && !cell.icon,
  )
  const chosen = pickSpread(eligible, STRING_COUNT_RANGE)
  if (chosen.size === 0) return cells

  return cells.map((cell) => {
    if (!chosen.has(cell)) return cell

    const flairText = FLAIR_STRINGS[Math.floor(Math.random() * FLAIR_STRINGS.length)]
    const flairTextPosition = STRING_POSITIONS[Math.floor(Math.random() * STRING_POSITIONS.length)]
    return { ...cell, flairText, flairTextPosition }
  })
}
