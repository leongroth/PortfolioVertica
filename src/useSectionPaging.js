import { useCallback, useEffect, useMemo, useRef } from 'react'

// How the page moves from one section to the next on desktop.
//
// This animates the scroll position itself rather than using CSS
// scroll-snap, because CSS gives no control over how long the snap takes -
// the browser's own is around 300ms, with no property to change it. So the
// scroll container's scroll-snap-type is off wherever this is enabled; the
// two can't both drive the scroller, since the browser re-snaps after every
// programmatic scroll.
//
// The numbers worth touching are right here:
export const SNAP_DURATION_MS = 900 // roughly a third of the browser's own speed
const COOLDOWN_MS = 120 // ignore wheel input for this long after landing, so one flick isn't read twice
const RETARGET_MIN_MS = 250 // shortest gap between two steps when scrolling continuously

const WHEEL_THRESHOLD = 4 // ignore the tiny deltas a trackpad emits at the very start of a gesture
const SETTLE_MS = 150 // how long the scroller must be still to count as "stopped", without scrollend
const EDGE_TOLERANCE = 2 // px; closer than this to a section edge counts as already being there

// Eases in and out - slow at both ends, quickest in the middle. Over a
// distance this long (a whole screen) a curve that only eases out spends its
// last third barely moving, which reads as sluggish rather than smooth.
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Drives section-to-section scrolling on `pageRef`:
//   - a wheel gesture pages to the next/previous section instead of scrolling
//     freely, and scrolling again while it's still moving carries on to the
//     section after that rather than being dropped
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
  const destination = useRef(null)
  const lockedUntil = useRef(0)
  const lastStepAt = useRef(0)
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
      // Where this animation is headed, so a gesture that arrives mid-flight
      // can step on from there rather than from wherever the page happens to
      // have reached.
      destination.current = to

      const land = () => {
        frame.current = null
        destination.current = null
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
        el.scrollTop = from + (to - from) * easeInOutCubic(t)
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

    const handleWheel = (event) => {
      if (event.ctrlKey) return // pinch-zoom, not a scroll
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return

      const now = performance.now()
      if (now < lockedUntil.current) {
        event.preventDefault()
        return
      }

      const animating = frame.current !== null
      // Keep scrolling and the page keeps going, one section at a time,
      // instead of the animation locking input out for most of a second -
      // that lockout is what made the old snapping feel like it ignored
      // every other gesture. The interval is what stops a trackpad's
      // momentum tail from running away with it.
      if (animating && now - lastStepAt.current < RETARGET_MIN_MS) {
        event.preventDefault()
        return
      }

      const from = animating ? destination.current : el.scrollTop
      const target = nextTop(from, event.deltaY > 0 ? 1 : -1)

      // Past the last section (or above the first): let the browser have the
      // gesture, unless an animation is running and it would fight it.
      if (target === undefined) {
        if (animating) event.preventDefault()
        return
      }

      event.preventDefault()
      lastStepAt.current = now
      animateTo(target)
    }

    // Everything that isn't the wheel - dragging the scrollbar, arrow keys,
    // a touchscreen - scrolls normally and gets eased onto the nearest
    // section once it comes to rest.
    const handleSettled = () => {
      if (frame.current !== null || performance.now() < lockedUntil.current) return
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
      destination.current = null
    }
  }, [pageRef, tops, enabled, animateTo])

  return scrollToSection
}
