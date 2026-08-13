import { useCallback, useEffect, useMemo, useRef } from 'react'

// How the page moves from one section to the next on desktop.
//
// This animates the scroll position itself rather than using CSS
// scroll-snap, because CSS gives no control over either of the two things
// this needs: how long the snap takes (the browser's own is around 300ms and
// fixed) and how it eases (a plain decelerate - it can't overshoot). So the
// scroll container's scroll-snap-type is off wherever this is enabled; the
// two can't both drive the scroller, since the browser re-snaps after every
// programmatic scroll and would flatten the overshoot on every frame.
//
// The three numbers worth touching are right here:
export const SNAP_DURATION_MS = 600 // roughly half the speed of the browser's own snap
// How far past the section it swings before settling back. This is the
// easeOutBack constant, and it's worth knowing what it buys: 1.2 overshoots
// by about 5% of the distance travelled (~48px on a 909px section), 0.9 by
// 3%, and the textbook 1.70158 by a full 10%, which on a section this size
// is nearly a tenth of the screen and reads as a lurch.
export const SNAP_OVERSHOOT = 1.2 // 0 = no bounce at all
const COOLDOWN_MS = 120 // ignore wheel input for this long after landing, so one flick isn't read twice

const WHEEL_THRESHOLD = 4 // ignore the tiny deltas a trackpad emits at the very start of a gesture
const SETTLE_MS = 150 // how long the scroller must be still to count as "stopped", without scrollend
const EDGE_TOLERANCE = 2 // px; closer than this to a section edge counts as already being there

// Standard "back" ease: accelerates out, overshoots the target, settles back
// onto it. `overshoot` is the classic easeOutBack constant (1.70158 gives a
// ~10% overrun); the default above is softer than that.
const easeOutBack = (t, overshoot) => {
  const c3 = overshoot + 1
  return 1 + c3 * (t - 1) ** 3 + overshoot * (t - 1) ** 2
}

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Drives section-to-section scrolling on `pageRef`:
//   - a wheel gesture pages to the next/previous section instead of scrolling
//     freely, and further wheel input during the animation is swallowed
//     rather than queued up behind it
//   - anything else that moves the scroller (the scrollbar, arrow keys, a
//     touchscreen) is left alone while it's moving and eased onto the
//     nearest section once it stops, which is the job CSS mandatory snapping
//     used to do
// and returns scrollToSection for the nav bar to call.
//
// `sectionTops` is in grid rows (see TestGrid) and `enabled` turns the whole
// thing off - on tablet and phone, where sections are taller than the screen
// and paging would fight the reader rather than help them.
export const useSectionPaging = ({ pageRef, sectionTops, pitch, enabled }) => {
  const frame = useRef(null)
  const lockedUntil = useRef(0)
  const settleTimer = useRef(null)

  const tops = useMemo(() => sectionTops.map((row) => row * pitch), [sectionTops, pitch])

  const animateTo = useCallback(
    (top, { instant = false } = {}) => {
      const el = pageRef.current
      if (!el) return

      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = null

      const to = Math.max(0, Math.min(el.scrollHeight - el.clientHeight, top))
      const from = el.scrollTop
      const land = () => {
        frame.current = null
        el.scrollTop = to
        lockedUntil.current = performance.now() + COOLDOWN_MS
      }

      if (instant || prefersReducedMotion() || Math.abs(to - from) < 1) {
        land()
        return
      }

      const start = performance.now()
      const step = (now) => {
        const t = Math.min(1, (now - start) / SNAP_DURATION_MS)
        // The overshoot deliberately runs past `to`; at the very top or
        // bottom of the page the scroller clamps it, so the bounce just
        // doesn't show there.
        el.scrollTop = from + (to - from) * easeOutBack(t, SNAP_OVERSHOOT)
        if (t < 1) frame.current = requestAnimationFrame(step)
        else land()
      }
      frame.current = requestAnimationFrame(step)
    },
    [pageRef],
  )

  const scrollToSection = useCallback(
    (sectionIndex, behavior = 'smooth') => {
      animateTo(tops[sectionIndex] ?? 0, { instant: behavior === 'auto' })
    },
    [animateTo, tops],
  )

  useEffect(() => {
    const el = pageRef.current
    if (!el || !enabled || tops.length === 0) return

    // The next section boundary in the direction of travel - measured from
    // where the page actually is, so this still does the right thing when
    // the reader has stopped somewhere in the middle of a section.
    const nextTop = (scrollTop, direction) =>
      direction > 0
        ? tops.find((top) => top > scrollTop + EDGE_TOLERANCE)
        : [...tops].reverse().find((top) => top < scrollTop - EDGE_TOLERANCE)

    const nearestTop = (scrollTop) =>
      tops.reduce((best, top) => (Math.abs(top - scrollTop) < Math.abs(best - scrollTop) ? top : best), tops[0])

    const busy = () => frame.current !== null || performance.now() < lockedUntil.current

    const handleWheel = (event) => {
      if (event.ctrlKey) return // pinch-zoom, not a scroll
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return

      // Mid-animation input is dropped, not queued: letting it through is
      // what made the old snapping feel like it was ignoring every other
      // gesture, since the queued scroll landed somewhere arbitrary.
      if (busy()) {
        event.preventDefault()
        return
      }

      const target = nextTop(el.scrollTop, event.deltaY > 0 ? 1 : -1)
      // Past the last section (or above the first), leave the browser to it
      // rather than trapping the gesture.
      if (target === undefined) return

      event.preventDefault()
      animateTo(target)
    }

    // Everything that isn't the wheel - dragging the scrollbar, arrow keys,
    // a touchscreen - scrolls normally and gets eased onto the nearest
    // section once it comes to rest.
    const handleSettled = () => {
      if (busy()) return
      const maxScroll = el.scrollHeight - el.clientHeight
      // Not at the very top or bottom, where the nearest section may be
      // unreachable and pulling at it would just fight the reader.
      if (el.scrollTop <= EDGE_TOLERANCE || el.scrollTop >= maxScroll - EDGE_TOLERANCE) return
      const nearest = nearestTop(el.scrollTop)
      if (Math.abs(nearest - el.scrollTop) > EDGE_TOLERANCE) animateTo(nearest)
    }

    const hasScrollEnd = 'onscrollend' in window
    // Without scrollend (Safari), settling is detected by the scroll events
    // simply stopping.
    const handleScroll = () => {
      if (frame.current) return
      clearTimeout(settleTimer.current)
      settleTimer.current = setTimeout(handleSettled, SETTLE_MS)
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    if (hasScrollEnd) el.addEventListener('scrollend', handleSettled)
    else el.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      el.removeEventListener('wheel', handleWheel)
      if (hasScrollEnd) el.removeEventListener('scrollend', handleSettled)
      else el.removeEventListener('scroll', handleScroll)
      clearTimeout(settleTimer.current)
      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = null
    }
  }, [pageRef, tops, enabled, animateTo])

  return scrollToSection
}
