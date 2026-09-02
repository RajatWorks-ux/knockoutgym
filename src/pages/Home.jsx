import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../context/ContentProvider'
import { splitText } from '../utils/splitText'
import './Home.css'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const { content } = useContent()
  if (!content) return <div style={{ minHeight: '100vh', background: '#060606' }} />
  return (
    <div className="home">
      <HeroSection      hero={content.hero}       gym={content.gym} />
      <StatsSection     stats={content.stats} />
      <AboutSection     about={content.about}     owner={content.owner} />
      <ResultsTeaser    results={content.results} />
      <MembershipTeaser membership={content.membership} />
      <CTASection       gym={content.gym} />
    </div>
  )
}

function HeroSection({ hero, gym }) {
  const h1Ref   = useRef(null)
  const h2Ref   = useRef(null)
  const subRef  = useRef(null)
  const ctaRef  = useRef(null)
  const tagsRef = useRef(null)

  useEffect(() => {
    if (!h1Ref.current || !h2Ref.current) return
    const chars1 = splitText(h1Ref.current)
    const chars2 = splitText(h2Ref.current)
    if (!chars1.length || !chars2.length) return
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    tl.from(chars1, { y: 140, opacity: 0, duration: 1.0, stagger: 0.025 })
      .from(chars2,  { y: 140, opacity: 0, duration: 1.0, stagger: 0.025 }, '-=0.7')
    if (subRef.current)  tl.from(subRef.current,  { opacity: 0, y: 24, duration: 0.7 }, '-=0.5')
    if (ctaRef.current)  tl.from(ctaRef.current,  { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    if (tagsRef.current?.children?.length) tl.from(tagsRef.current.children, { opacity: 0, y: 16, stagger: 0.08, duration: 0.5 }, '-=0.3')
  }, [])

  return (
    <section className="hero">
      {hero?.videoUrl
        ? <video className="hero-video" src={hero.videoUrl} autoPlay muted loop playsInline />
        : hero?.bgImage
          ? <div className="hero-img" style={{ backgroundImage: `url(${hero.bgImage})` }} />
          : <div className="hero-animated-bg" />
      }
      <div className="hero-overlay" />
      <div className="scan-line" />
      <div className="hero-content container">
        <div className="hero-text">
          <h1 ref={h1Ref} className="hero-h1">{hero?.line1 || 'WHERE CHAMPIONS'}</h1>
          <h1 ref={h2Ref} className="hero-h2">{hero?.line2 || 'ARE FORGED.'}</h1>
          {hero?.subtext && <p ref={subRef} className="hero-sub">{hero.subtext}</p>}
          <div ref={ctaRef} className="hero-cta-row">
            <Link to="/contact" className="btn-red">{hero?.ctaText || 'Join Now'} →</Link>
            <Link to="/story"   className="btn-outline">Our Story</Link>
          </div>
        </div>
        <div ref={tagsRef} className="hero-tags">
          {gym?.rating  && <span className="tag">⭐ {gym.rating} ({gym.reviews || '0'} Reviews)</span>}
          <span className="tag">📍 Zirakpur, Punjab</span>
          {gym?.hours?.weekdays && <span className="tag">🕐 {gym.hours.weekdays}</span>}
        </div>
      </div>
      <div className="hero-scroll"><span className="section-label">scroll</span><div className="hero-scroll-line" /></div>
    </section>
  )
}

function StatsSection({ stats }) {
  const sectionRef = useRef(null)
  const numRefs    = useRef([])
  const validStats = (stats || []).filter(s => s.value && s.label)
  if (!validStats.length) return null

  useEffect(() => {
    validStats.forEach((stat, i) => {
      const el = numRefs.current[i]
      if (!el) return
      const target = parseFloat(stat.value)
      if (isNaN(target)) { el.textContent = stat.value + stat.suffix; return }
      gsap.fromTo(
        { val: 0 },
        {
          val: target, duration: 2, ease: 'power2.out',
          onUpdate() { el.textContent = (Number.isInteger(target) ? Math.round(this.targets()[0].val) : this.targets()[0].val.toFixed(1)) + (stat.suffix || '') },
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      )
    })
  }, [validStats])

  return (
    <section ref={sectionRef} className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {validStats.map((stat, i) => (
            <div key={i} className="stat-item">
              <div className="stat-num">
                <span ref={el => numRefs.current[i] = el}>0{stat.suffix}</span>
              </div>
              <div className="stat-label section-label">{stat.label}</div>
              {i < validStats.length - 1 && <div className="stat-divider" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutSection({ about, owner }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    gsap.from(el.querySelector('.about-text'),     { opacity:0, x:60, duration:1, ease:'power3.out', scrollTrigger:{trigger:el,start:'top 75%'} })
    gsap.from(el.querySelector('.about-img-wrap'), { opacity:0, x:-60, duration:1, ease:'power3.out', scrollTrigger:{trigger:el,start:'top 75%'} })
  }, [])

  const imgSrc = about?.image || owner?.image || ''
  if (!about?.heading && !about?.body && !imgSrc) return null

  return (
    <section ref={ref} className="about-section">
      <div className={`container ${imgSrc ? 'about-grid' : 'about-no-img'}`}>
        {imgSrc && (
          <div className="about-img-wrap">
            <img src={imgSrc} alt="Knockout Gym" className="about-img" onError={e => { e.target.style.display = 'none' }} />
            <div className="about-img-glow" />
          </div>
        )}
        <div className="about-text">
          <p className="section-label red">About Us</p>
          {about?.heading    && <h2 className="about-h2">{about.heading}</h2>}
          {about?.subheading && <h3 className="about-h3">{about.subheading}</h3>}
          {about?.body       && <p className="about-body">{about.body}</p>}
          <Link to="/story" className="btn-red">Read Our Story →</Link>
        </div>
      </div>
    </section>
  )
}

function ResultsTeaser({ results }) {
  const valid = (results || []).filter(r => r.before && r.after).slice(0, 3)
  if (!valid.length) return null
  return (
    <section className="results-teaser">
      <div className="container">
        <div className="rt-header">
          <div>
            <p className="section-label red">Transformations</p>
            <h2 className="rt-heading">Real Results.</h2>
          </div>
          <Link to="/results" className="btn-outline">See All →</Link>
        </div>
        <div className="rt-grid">
          {valid.map(r => (
            <div key={r.id} className="rt-card">
              <div className="rt-images">
                <img src={r.before} alt="Before" className="rt-before" onError={e => e.target.style.display='none'} />
                <img src={r.after}  alt="After"  className="rt-after"  onError={e => e.target.style.display='none'} />
                <span className="rt-label-before">BEFORE</span>
                <span className="rt-label-after">AFTER</span>
              </div>
              <div className="rt-info">
                {r.name     && <span className="rt-name">{r.name}</span>}
                {r.result   && <span className="rt-result">{r.result}</span>}
                {r.duration && <span className="rt-duration">{r.duration}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MembershipTeaser({ membership }) {
  const plans = (membership || []).filter(p => p.name && p.price)
  if (!plans.length) return null
  return (
    <section className="mem-teaser">
      <div className="container">
        <p className="section-label red">Membership</p>
        <h2 className="mem-heading">Choose Your Plan.</h2>
        <div className="mem-grid">
          {plans.map(plan => (
            <div key={plan.id} className={`mem-card ${plan.badge ? 'mem-card-featured' : ''}`}>
              {plan.badge && <div className="mem-badge">{plan.badge}</div>}
              <p className="mem-plan-name">{plan.name}</p>
              <div className="mem-price">
                <span className="mem-currency">₹</span>
                <span className="mem-amount">{plan.price}</span>
                <span className="mem-period">/ {plan.period || 'month'}</span>
              </div>
              {(plan.features || []).length > 0 && (
                <ul className="mem-features">
                  {plan.features.map((f, i) => f && (
                    <li key={i}><span className="mem-check">✓</span> {f}</li>
                  ))}
                </ul>
              )}
              <Link to="/contact" className={plan.badge ? 'btn-red' : 'btn-outline'}>Get Started →</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ gym }) {
  return (
    <section className="cta-section">
      <div className="cta-glow" />
      <div className="container cta-inner">
        <h2 className="cta-heading">Ready to Start?</h2>
        {gym?.hours?.weekdays && (
          <p className="cta-sub">{gym.hours.weekdays} · Mon – Sat · {gym?.hours?.sunday || 'Closed Sunday'}</p>
        )}
        <div className="cta-btns">
          {gym?.phone    && <a href={`tel:${gym.phone}`} className="btn-red">Call — {gym.phone}</a>}
          {gym?.whatsapp && <a href={`https://wa.me/${gym.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-outline">WhatsApp</a>}
        </div>
      </div>
    </section>
  )
}

