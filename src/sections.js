// Single source of truth for section content. Add/remove an entry here to
// add/remove a scroll section - TestGrid derives SECTION_COUNT from this
// array's length, so the grid layout stays in sync automatically.
//
// By default each section renders one auto-centered content box built from
// its title/text/image. To take control of position and size, add a `boxes`
// array instead - each entry is { colSpan, rowSpan, title?, text?, image?,
// ...position } in grid units (100px each), relative to the top of that
// section's body (row 0 = the first row below the nav bar, for section 0;
// row 0 = the section's own top row otherwise). Omitted title/text/image on
// a box fall back to the section's own. You can list more than one box.
//
// Position, pick one style per box:
//   - Exact: { col: 2, row: 1 } - absolute grid coordinates.
//   - Aligned: { align: 'center', valign: 'center' } - 'start' (default) |
//     'center' | 'end' on each axis, relative to the whole section.
//   - Relative: { relativeTo: 0, placement: 'right', gap: 1, valign: 'center' }
//     - positions this box against an earlier box in the same `boxes` array
//     (by its index), placement is 'right' | 'left' | 'below' | 'above',
//     gap is the space between them (grid units, default 0 = touching), and
//     align/valign controls the cross-axis position against the anchor
//     box's own span instead of the whole section.
// Example - a wide box with a small "aside" box centered to its right:
//   {
//     title: 'About me',
//     boxes: [
//       { col: 2, row: 1, colSpan: 4, rowSpan: 3, text: '...' },
//       { relativeTo: 0, placement: 'right', gap: 1, valign: 'center',
//         colSpan: 2, rowSpan: 2, title: 'Fun fact', text: '...' },
//     ],
//   }
// The decorative squares around custom boxes mirror left-to-right whenever
// the resolved layout actually turns out symmetric (e.g. a single centered
// box), and fall back to a plain (still gapless) fill otherwise - detected
// automatically, no need to reason about it yourself.
//
// By default a box renders as the built-in ContentCard (title/text/image).
// To render your own component instead, import it and set `component` on
// the box - it's placed and sized exactly like any other box (same
// col/row/colSpan/rowSpan reservation and skip-if-it-doesn't-fit behavior).
// TestGrid wraps every box - default or custom - in a shared shell that
// already provides the background, border, rounded corners, drop shadow and
// grid positioning, so your component only needs to render its own content
// filling 100% width/height; it doesn't need to (and shouldn't) position or
// style its own outer box. It receives every field you put on the box
// object as props (col/row/colSpan/rowSpan included, in case it wants to
// know its own size), so pass whatever your component needs:
//   import Timeline from './Timeline'
//   ...
//   boxes: [
//     { component: Timeline, align: 'center', valign: 'center',
//       colSpan: 6, rowSpan: 4, events: [...] },
//   ]
import About from './About'
import DesignCard from './DesignCard'
import ReactCard from './ReactCard'
import FreelanceCard from './FreelanceCard'
import AngularCard from './AngularCard'
import AXONCard from './AXONCard'
import ACESCard from './ACESCard'
import MessageCard from './MessageCard'
import SocialButtons from './SocialButtons'

export const SECTIONS = [
  {
    // 1 box: the custom About component, 10 columns x 4 rows, centered.
    title: 'About me',
    boxes: [
      { component: About, align: 'center', valign: 'center', colSpan: 10, rowSpan: 4 },
    ],
  },
  {
    // 3 boxes: a centered box with one flowed to each side of it.
    title: 'Section 2',
    boxes: [
      { component: FreelanceCard, align: 'center', valign: 'center', colSpan: 4, rowSpan: 4, text: 'Center box' },
      { component: ReactCard, relativeTo: 0, placement: 'left', gap: 1, colSpan: 4, rowSpan: 4, text: 'Left box' },
      { component: AngularCard, relativeTo: 0, placement: 'right', gap: 1, colSpan: 4, rowSpan: 4, text: 'Right box' },
    ],
  },
  {
    title: 'Section 3',
    boxes: [
      {component: DesignCard, align: 'center', valign: 'center', rowOffset: 1, colSpan: 14, rowSpan: 7}
    ],
    text: "Placeholder text for this section - swap in real copy whenever you're ready.",
    image: null,
  },
  {
    // 2 boxes: side by side, centered as a pair (alignSpan on the first box
    // reserves room for both boxes plus the gap between them, so the whole
    // pair centers as a group instead of just the first box). alignSpan/gap
    // must keep colSpan*2 + gap EVEN - the grid's own column count (`cols`
    // in gridLayout.js) is always forced even, so an odd-total pair can
    // never land on integer column boundaries symmetrically; it'll always
    // round 1 unit toward one side. (gap: 1 here previously gave a total of
    // 11, an odd number - hence the pair reliably sitting 1 unit off
    // center. gap: 2 gives 12, which splits evenly no matter the viewport.)
    title: 'Section 4',
    boxes: [
      { component: AXONCard, align: 'center', valign: 'center', alignSpan: 12, colSpan: 5, rowSpan: 5, text: 'Left box' },
      { component: ACESCard, relativeTo: 0, placement: 'right', gap: 2, colSpan: 5, rowSpan: 5, text: 'Right box' },
    ],
  },
  {
    // 2 boxes: a message box with a row of 4 icon buttons below it, the
    // pair centered together as a group. valignSpan on the message box (its
    // own rowSpan + the 1-row gap + the button row's rowSpan) centers that
    // whole vertical stack, the same way alignSpan centers Section 4's pair
    // horizontally. The button row's align: 'center' then centers *it*
    // relative to the message box's own horizontal center - which works out
    // to the section's center too, since the message box itself is centered
    // with no anchor of its own - even though the two boxes are different
    // widths (4 vs 8), because centering-on-a-center is width-independent.
    title: 'Section 5',
    boxes: [
      { component: MessageCard, align: 'center', valign: 'center', valignSpan: 5, colSpan: 4, rowSpan: 2 },
      { component: SocialButtons, relativeTo: 0, placement: 'below', gap: 1, align: 'center', colSpan: 8, rowSpan: 2 },
    ],
  },
]
