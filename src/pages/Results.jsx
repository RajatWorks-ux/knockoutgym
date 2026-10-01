import { useState } from 'react'
import { useContent } from '../context/ContentProvider'
import './Results.css'

const FILTERS = [
  { key: 'all',            label: 'All'            },
  { key: 'weight-loss',    label: 'Weight Loss'    },
  { key: 'muscle-gain',    label: 'Muscle Gain'    },
  { key: 'transformation', label: 'Transformation' },
]

export default function Results() {
  const { content } = useContent()
  const [filter, setFilter] = useState('all')

  const results  = (content?.results || []).filter(r => r.before && r.after)
  const filtered = filter === 'all' ? results : results.filter(r => r.type === filter)

  const activeTypes    = new Set(results.map(r => r.type).filter(Boolean))
  const visibleFilters = FILTERS.filter(f => f.key === 'all' || activeTypes.has(f.key))

  return (
    <div className="page results-page">
      <div className="container">
        <p className="section-label red">Transformations</p>
        <h1 className="res-heading">Real Results.<br />Real People.</h1>
        <p className="res-sub">{results.length} transformation{results.length !== 1 ? 's' : ''} and counting.</p>

        {visibleFilters.length > 1 && (
          <div className="filter-bar">
            {visibleFilters.map(f => (
              <button key={f.key}
                className={`filter-btn ${filter === f.key ? 'active' : ''}`}
                onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="no-results">No transformations in this category yet.</p>
        ) : (
          <div className="rd-grid">
            {filtered.map(r => <ResultCard key={r.id} data={r} />)}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── DESIGN D CARD ────────────────────────────────────────────────────────────
   After photo = full hero (aspect-ratio box, cover+top so face always shows)
   Before photo = fixed-size inset thumbnail (always portrait ratio, cover+top)
   Stat = top-left overlay on the hero
   Works with ANY image ratio — portrait, landscape, square, tall, wide
   ─────────────────────────────────────────────────────────────────────────── */
function ResultCard({ data }) {
  const [afterErr,  setAfterErr]  = useState(false)
  const [beforeErr, setBeforeErr] = useState(false)

  if (afterErr && beforeErr) return null

  return (
    <div className="rd-card">
      <div className="rd-hero">

        {/* AFTER — main hero image */}
        {!afterErr ? (
          <img src={data.after} alt="After" className="rd-after"
            onError={() => setAfterErr(true)} />
        ) : (
          <div className="rd-after rd-placeholder" />
        )}

        {/* Gradient overlays for readability */}
        <div className="rd-gradient-top" />
        <div className="rd-gradient-bottom" />

        {/* BEFORE — inset thumbnail, bottom-left */}
        {!beforeErr && data.before && (
          <div className="rd-inset">
            <img src={data.before} alt="Before"
              onError={() => setBeforeErr(true)} />
            <span className="rd-inset-lbl">BEFORE</span>
          </div>
        )}

        {/* Labels */}
        <span className="rd-after-lbl">AFTER</span>

        {/* Stat — top left, bold */}
        {data.result && <div className="rd-stat">{data.result}</div>}
      </div>

      <div className="rd-meta">
        <div>
          {data.name     && <div className="rd-name">{data.name}</div>}
          {data.duration && <div className="rd-duration">{data.duration}</div>}
        </div>
        {data.category && (
          <span className="rd-cat">{data.category}</span>
        )}
      </div>
    </div>
  )
}
