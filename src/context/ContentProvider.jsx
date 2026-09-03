import { createContext, useContext, useState, useEffect, useRef } from 'react'
import defaultContent from '../data/defaultContent'
import { getContent, setContent } from '../lib/db'

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setLocalContent] = useState(null)
  // Keep a ref that always holds the latest content so updateSection
  // never closes over a stale (or null) snapshot.
  const contentRef = useRef(null)

  useEffect(() => {
    async function load() {
      try {
        const saved = await getContent()
        if (saved) {
          const merged = deepMerge(defaultContent, saved)
          contentRef.current = merged
          setLocalContent(merged)
        } else {
          await setContent(defaultContent)
          contentRef.current = defaultContent
          setLocalContent(defaultContent)
        }
      } catch (err) {
        console.error('Content load error:', err)
        contentRef.current = defaultContent
        setLocalContent(defaultContent)
      }
    }
    load()
  }, [])

  const updateSection = async (sectionKey, newData) => {
    // SAFETY: always read the latest snapshot from Supabase before writing.
    // This prevents a race where the panel saves before content has loaded,
    // which would overwrite everything with just one section.
    let base = contentRef.current

    if (!base) {
      // Content hasn't loaded yet — pull fresh from DB
      try {
        const saved = await getContent()
        base = saved ? deepMerge(defaultContent, saved) : defaultContent
      } catch {
        base = defaultContent
      }
    }

    const updated = { ...base, [sectionKey]: newData }
    contentRef.current = updated
    setLocalContent(updated)

    const ok = await setContent(updated)
    if (!ok) console.warn('Failed to save to database')
    return ok
  }

  const resetToDefaults = async () => {
    contentRef.current = defaultContent
    setLocalContent(defaultContent)
    await setContent(defaultContent)
  }

  // Lets the owner panel force a fresh reload from Supabase
  const reloadFromDB = async () => {
    try {
      const saved = await getContent()
      if (saved) {
        const merged = deepMerge(defaultContent, saved)
        contentRef.current = merged
        setLocalContent(merged)
        return true
      }
    } catch (err) {
      console.error('reloadFromDB error:', err)
    }
    return false
  }

  return (
    <ContentContext.Provider value={{ content, updateSection, resetToDefaults, reloadFromDB }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be inside ContentProvider')
  return ctx
}

function deepMerge(defaults, saved) {
  const result = { ...defaults }
  for (const key of Object.keys(saved)) {
    if (saved[key] !== null && typeof saved[key] === 'object' && !Array.isArray(saved[key])) {
      result[key] = deepMerge(defaults[key] || {}, saved[key])
    } else {
      result[key] = saved[key]
    }
  }
  return result
}

