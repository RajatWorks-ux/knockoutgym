import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useLoading } from '../../context/LoadingProvider'
import './Loader.css'

// Read cached brand values written by ContentProvider
// Falls back to defaults if no cache yet (very first ever load)
function getBrand() {
  try {
    const cached = JSON.parse(localStorage.getItem('kg_brand') || '{}')
    return {
      logo: cached.logo || 'KO',
      name: (cached.name || 'KNOCKOUT GYM').toUpperCase(),
    }
  } catch {
    return { logo: 'KO', name: 'KNOCKOUT GYM' }
  }
}

export default function Loader() {
  const { isLoaded, finishLoading, contentReady } = useLoading()
  const loaderRef = useRef(null)
  const barRef    = useRef(null)
  const pctRef    = useRef(null)
  const doneRef   = useRef(false)
  const brand     = getBrand()

  useEffect(() => {
    if (doneRef.current) return
    const bar    = barRef.current
    const pct    = pctRef.current
    if (!bar || !pct) return

    gsap.to(bar, { scaleX: 0.85, duration: 1.2, ease: 'power2.out' })
    gsap.to(pct, { textContent: '85', duration: 1.2, snap: { textContent: 1 }, ease: 'power2.out' })
  }, [])

  useEffect(() => {
    if (!contentReady || doneRef.current) return
    doneRef.current = true

    const bar    = barRef.current
    const pct    = pctRef.current
    const loader = loaderRef.current

    gsap.to(bar, { scaleX: 1, duration: 0.3, ease: 'power2.out' })
    gsap.to(pct, { textContent: '100', duration: 0.3, snap: { textContent: 1 }, ease: 'power2.out' })

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
        <span className="loader-ko">{brand.logo}</span>
        <span className="loader-name">{brand.name}</span>
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

