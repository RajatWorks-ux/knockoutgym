import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useLoading } from '../../context/LoadingProvider'
import './Loader.css'

export default function Loader() {
  const { isLoaded, finishLoading, contentReady } = useLoading()
  const loaderRef = useRef(null)
  const barRef    = useRef(null)
  const pctRef    = useRef(null)
  const doneRef   = useRef(false)

  useEffect(() => {
    if (doneRef.current) return
    const bar    = barRef.current
    const pct    = pctRef.current
    const loader = loaderRef.current
    if (!bar || !pct || !loader) return

    // Animate to 85% in 1.2s, then wait for contentReady
    gsap.to(bar, { scaleX: 0.85, duration: 1.2, ease: 'power2.out' })
    gsap.to(pct, { textContent: '85', duration: 1.2, snap: { textContent: 1 }, ease: 'power2.out' })
  }, [])

  useEffect(() => {
    if (!contentReady || doneRef.current) return
    doneRef.current = true

    const bar    = barRef.current
    const pct    = pctRef.current
    const loader = loaderRef.current

    // Fill to 100%
    gsap.to(bar, { scaleX: 1, duration: 0.3, ease: 'power2.out' })
    gsap.to(pct, { textContent: '100', duration: 0.3, snap: { textContent: 1 }, ease: 'power2.out' })

    // Slide up after short delay then call finishLoading
    setTimeout(() => {
      gsap.to(loader, {
        yPercent: -100,
        duration: 0.75,
        ease: 'power4.inOut',
        onComplete: finishLoading,
      })
    }, 400)
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

