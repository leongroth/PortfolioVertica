// Every icon directly under assets/Icons (not the Buttons subfolder, which
// is for UI buttons, not page flair) - `*.svg` is a single-level glob, so it
// naturally doesn't reach into Buttons/.
const iconModules = import.meta.glob('/src/assets/Icons/*.svg', { eager: true, import: 'default' })
export const FLAIR_ICONS = Object.values(iconModules)

export const ICON_POSITIONS = ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right']

const ICON_CHANCE = 0.15 // fraction of eligible squares that get an icon

// Randomly gives some of the plain 1x1 decorative squares in `cells` an
// icon + one of the 5 ICON_POSITIONS (center or a corner). Only 1x1 squares
// are eligible so icons stay small "flair" rather than dominating a merged
// or LARGE_SPAN square. Uses Math.random() (not the grid layout's seeded
// PRNG) since this is purely decorative and, unlike the tiling itself,
// doesn't need to be reproducible - it's fine for it to look different
// every time the grid regenerates.
export const assignIcons = (cells) =>
  cells.map((cell) => {
    if (cell.type !== 'square' || cell.colSpan !== 1 || cell.rowSpan !== 1) return cell
    if (Math.random() >= ICON_CHANCE) return cell

    const icon = FLAIR_ICONS[Math.floor(Math.random() * FLAIR_ICONS.length)]
    const iconPosition = ICON_POSITIONS[Math.floor(Math.random() * ICON_POSITIONS.length)]
    return { ...cell, icon, iconPosition }
  })
