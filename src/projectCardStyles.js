import { TYPE } from './typography'

// Shared layout for the five project cards on the main page (Freelance,
// React/ACES, Angular, AXON, ACES). Each card is a mockup image with a
// title, a subtitle and a "Read more" button, and each one keeps its own
// desktop pose - how wide its image is, and whether that image is lifted so
// it pokes out past the top edge of the card (see CARD_SHELL_STYLE's
// overflow: visible).
//
// Below desktop the cards change shape rather than just shrink, because the
// box they sit in does: sections.js stacks them into one column there, so a
// card that was 4 columns wide and 4 rows tall becomes a wide, short strip
// on a tablet and a narrow block on a phone.
//   - tablet: image and text side by side, which suits a box that's much
//     wider than it is tall.
//   - phone: back to a column, but with the image capped by height so it
//     can't crowd out the title and button beneath it.
// The lifted-image pose is desktop-only: it needs room above the card, and
// stacked cards have another card directly above them.
// Built once per (breakpoint, imageWidth, lift) combination and reused from
// then on. These used to be plain module-level constants, and components
// relied on that without saying so: passing React the *same* style object
// again lets it skip diffing that element's style entirely. Rebuilding them
// on every render meant every card re-diffed every style property whenever
// the page re-rendered - including on each scroll, when the active nav
// section changes mid snap-animation. There are six combinations in all, so
// the cache never grows.
const cache = new Map()

export const getProjectCardStyles = (breakpoint, { imageWidth = '95%', lift = false } = {}) => {
  const key = `${breakpoint}|${imageWidth}|${lift}`
  if (!cache.has(key)) cache.set(key, buildProjectCardStyles(breakpoint, imageWidth, lift))
  return cache.get(key)
}

const buildProjectCardStyles = (breakpoint, imageWidth, lift) => {
  const phone = breakpoint === 'phone'

  const button = {
    backgroundColor: '#FFAA00',
    // Bigger on a phone than it used to be - it's a finger target there, not
    // a cursor one, and at this padding the button clears 44px tall.
    padding: phone ? '14px 28px' : '16px 32px',
    width: 'fit-content',
    border: 'none',
    borderRadius: '16px',
    // A <button> inherits neither font nor colour from the page: left to
    // itself it picks up the UA's own, which on iOS means a system font and
    // a tinted (blue/purple-looking) label rather than dark text in Satoshi.
    // Spelling both out - and turning the native appearance off, which is
    // what stops iOS restyling the control regardless - keeps it identical
    // on every device.
    ...TYPE.body,
    fontSize: phone ? '16px' : 'var(--type-body)',
    color: '#333333',
    WebkitAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer',
  }

  const shared = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      alignItems: 'center',
    },
    containterTwo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    },
    btn: button,
    hoverBtn: { ...button, backgroundColor: '#DE9400' },
  }

  if (breakpoint === 'desktop') {
    return {
      ...shared,
      mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: lift ? 'flex-end' : 'space-between',
        width: '100%',
        height: '100%',
        overflow: 'visible',
        alignItems: 'center',
        paddingTop: lift ? 0 : '24px',
        paddingBottom: '24px',
      },
      image: {
        width: imageWidth,
        ...(lift ? { position: 'relative', top: '-10%' } : null),
      },
    }
  }

  if (breakpoint === 'tablet') {
    return {
      ...shared,
      mainContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '32px',
        width: '100%',
        height: '100%',
        padding: '24px',
        boxSizing: 'border-box',
      },
      image: {
        width: '35%',
        maxHeight: '100%',
        objectFit: 'contain',
      },
    }
  }

  return {
    ...shared,
    mainContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
      width: '100%',
      height: '100%',
      padding: '16px',
      boxSizing: 'border-box',
    },
    image: {
      width: '70%',
      maxHeight: '45%',
      objectFit: 'contain',
    },
  }
}
