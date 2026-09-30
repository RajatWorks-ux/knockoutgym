import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentProvider'
import './Home.css'

export default function Home() {
  const { content } = useContent()
  if (!content) return <div style={{ minHeight: '100vh', background: '#030303' }} />
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

/* ── HERO ── */
function HeroSection({ hero, gym }) {
  const hasMedia = hero?.videoUrl || hero?.bgImage
  return (
    <section className="hero">
      {hero?.videoUrl
        ? <video className="hero-video" src={hero.videoUrl} autoPlay muted loop playsInline />
        : hero?.bgImage
          ? <div className="hero-img" style={{ backgroundImage: `url(${hero.bgImage})` }} />
          : <div className="hero-animated-bg" />
      }
      <div className="hero-overlay" />
      {hasMedia && <div className="scan-line" />}

      <div className="hero-content">
        <div className="hero-text">
          {gym?.name && (
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              <span className="hero-eyebrow-text">{gym.name}</span>
            </div>
          )}
          <h1 className="hero-h1">{hero?.line1 || 'WHERE CHAMPIONS'}</h1>
          <h1 className="hero-h2">{hero?.line2 || 'ARE FORGED.'}</h1>
          {hero?.subtext && <p className="hero-sub">{hero.subtext}</p>}
          <div className="hero-cta-row">
            <Link to="/contact" className="btn-red">{hero?.ctaText || 'Join Now'} →</Link>
            <Link to="/story"   className="btn-outline">Our Story</Link>
          </div>
        </div>

        <div className="hero-tags">
          {gym?.rating  && <span className="tag">⭐ {gym.rating} ({gym.reviews || '0'} Reviews)</span>}
          {gym?.address && <span className="tag">📍 Zirakpur, Punjab</span>}
          {gym?.hours?.weekdays && <span className="tag">🕐 {gym.hours.weekdays}</span>}
        </div>
      </div>

      <div className="hero-scroll">
        <span className="section-label">scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  )
}

/* ── STATS ── */
function StatsSection({ stats }) {
  const valid = (stats || []).filter(s => s.value && s.label)
  if (!valid.length) return null
  return (
    <section className="stats-section">
      <div className="stats-grid">
        {valid.map((stat, i) => (
          <div key={i} className="stat-item">
            <div className="stat-num">
              {stat.value}{stat.suffix && <sup>{stat.suffix}</sup>}
            </div>
            <div className="stat-label section-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── ABOUT ── */
function AboutSection({ about, owner }) {
  const imgSrc = about?.image || owner?.image || ''
  if (!about?.heading && !about?.body && !imgSrc) return null
  return (
    <section className="about-section">
      <div className={`container ${imgSrc ? 'about-grid' : 'about-no-img'}`}>
        {imgSrc && (
          <div className="about-img-wrap">
            <img src={imgSrc} alt="About" className="about-img"
              onError={e => { e.target.style.display = 'none' }} />
            <div className="about-img-glow" />
          </div>
        )}
        <div className="about-text">
          <p className="section-label red">About Us</p>
          {about?.heading    && <h2 className="about-h2">{about.heading}</h2>}
          {about?.subheading && <h3 className="about-h3">{about.subheading}</h3>}
          {about?.body       && <p  className="about-body">{about.body}</p>}
          <div><Link to="/story" className="btn-red">Read Our Story →</Link></div>
        </div>
      </div>
    </section>
  )
}

/* ── RESULTS TEASER — side-by-side, no cropping ── */
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
              {/* Side-by-side full images — no cropping */}
              <div className="rt-images">
                <div className="rt-side">
                  <img src={r.before} alt="Before" className="rt-img"
                    onError={e => e.target.style.display = 'none'} />
                  <span className="rt-label">BEFORE</span>
                </div>
                <div className="rt-side">
                  <img src={r.after} alt="After" className="rt-img"
                    onError={e => e.target.style.display = 'none'} />
                  <span className="rt-label">AFTER</span>
                </div>
              </div>
              <div className="rt-info">
                <div>
                  {r.name     && <span className="rt-name">{r.name}</span>}
                  {r.duration && <div><span className="rt-duration">{r.duration}</span></div>}
                </div>
                {r.result && <span className="rt-result">{r.result}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── MEMBERSHIP ── */
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
              <Link to="/contact" className={plan.badge ? 'btn-red' : 'btn-outline'}>
                Get Started →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CTA ── */
function CTASection({ gym }) {
  return (
    <section className="cta-section">
      <div className="cta-glow" />
      <div className="container cta-inner">
        <h2 className="cta-heading">Ready to Start?</h2>
        {gym?.hours?.weekdays && (
          <p className="cta-sub">{gym.hours.weekdays} · Mon–Sat · {gym?.hours?.sunday || 'Closed Sunday'}</p>
        )}
        <div className="cta-btns">
          {gym?.phone    && <a href={`tel:${gym.phone}`} className="btn-red">Call — {gym.phone}</a>}
          {gym?.whatsapp && (
            <a href={`https://wa.me/${gym.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-outline">
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
