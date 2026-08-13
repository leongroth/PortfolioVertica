// Shared layout for the five project pages (ACES, AXON, React, Freelance
// work, Angular platform). They're all the same shape - a heading block, an
// image beside a column of text, and a row of tech icons - so the styling
// lives here once and each page only supplies its own words, its own image
// and how wide that image should be.
//
// The one thing that changes with screen size is the middle block: on
// desktop the image and the text sit side by side at 40% width each, and
// anywhere narrower they stack, because splitting a tablet's content box in
// two leaves a column of text too narrow to read. Type sizes, icon sizes and
// the gap between blocks come from the CSS variables in index.css, so they
// step down a breakpoint at a time without this file knowing the numbers.
export const getProjectPageStyles = (breakpoint, { imageWidth = '40%' } = {}) => {
  const stacked = breakpoint !== 'desktop'

  return {
    main: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--block-gap)',
      boxSizing: 'border-box',
      // Room for the fixed back button (see BackButton), which floats over
      // the top-left corner of the content box once it spans the full width.
      padding: stacked ? '80px 24px 48px' : 0,
      textAlign: stacked ? 'center' : 'start',
    },
    headings: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bread: {
      display: 'flex',
      flexDirection: stacked ? 'column' : 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 'var(--block-gap)',
      width: '100%',
    },
    image: {
      // Stacked, the image gets the width of the box rather than its own
      // share of a row - capped by height as well so a tall mockup can't
      // push the text off the bottom of a short screen.
      width: stacked ? (breakpoint === 'phone' ? '80%' : '45%') : imageWidth,
      maxHeight: stacked ? '35vh' : undefined,
      objectFit: 'contain',
    },
    text: {
      width: stacked ? '100%' : '40%',
      margin: 0,
      textAlign: 'start',
    },
    tech: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    skills: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '16px',
    },
    skillIcon: {
      width: 'var(--icon-size)',
      height: 'var(--icon-size)',
    },
  }
}
