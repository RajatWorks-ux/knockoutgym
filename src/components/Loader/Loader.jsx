import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useLoading } from '../../context/LoadingProvider'
import './Loader.css'

export default function Loader() {
  const { isLoaded, finishLoading, contentReady } = useLoading()

  const loaderRef       = useRef(null)
  const barRef          = useRef(null)
  const pctRef          = useRef(null)
  const finishCalledRef = useRef(false)
  const animDoneRef     = useRef(false)
  const contentReadyRef = useRef(false)
  const finishLoadingRef = useRef(finishLoading)

  useEffect(() => {
    finishLoadingRef.current = finishLoading
  }, [finishLoading])

  function runFinish() {
    if (finishCalledRef.current) return
    finishCalledRef.current = true

    const bar    = barRef.current
    const pct    = pctRef.current
    const loader = loaderRef.current

    if (!loader) {
      finishLoadingRef.current()
      return
    }

    // Fill to 100%
    if (bar) gsap.to(bar, { scaleX: 1, duration: 0.35, ease: 'power2.out' })
    if (pct) gsap.to(pct, {
      textContent: '100',
      duration: 0.35,
      snap: { textContent: 1 },
      ease: 'power2.out',
    })

    // Slide up after bar fills
    gsap.to(loader, {
      delay: 0.45,
      yPercent: -100,
      duration: 0.75,
      ease: 'power4.inOut',
      onComplete: () => finishLoadingRef.current(),
    })
  }

  // Phase 1: animate to 85%, then check if content is already ready
  useEffect(() => {
    const bar = barRef.current
    const pct = pctRef.current
    if (!bar || !pct) return

    const barTween = gsap.to(bar, {
      scaleX: 0.85,
      duration: 1.2,
      ease: 'power2.out',
      onComplete: () => {
        animDoneRef.current = true
        if (contentReadyRef.current) runFinish()
      },
    })
    const pctTween = gsap.to(pct, {
      textContent: '85',
      duration: 1.2,
      snap: { textContent: 1 },
      ease: 'power2.out',
    })

    // Cleanup for StrictMode double-invoke — kill tweens if effect re-runs
    return () => {
      barTween.kill()
      pctTween.kill()
      animDoneRef.current = false
    }
  }, [])

  // Phase 2: content ready from Supabase
  useEffect(() => {
    if (!contentReady) return
    contentReadyRef.current = true
    if (animDoneRef.current) runFinish()
  }, [contentReady])

  if (isLoaded) return null

  return (
    <div ref={loaderRef} className="loader">
      <div className="loader-logo">
        <span className="loader-ko">KO</span>
        <span className="loader-name">KNOCKOUT GYM</span>
      </div>
      <div className="loader-bottom">
        <div className="loader-bar-track">
          <div ref={barRef} className="loader-bar" />
        </div>
        <span ref={pctRef} className="loader-pct">0</span>
      </div>
    </div>
  )
}

