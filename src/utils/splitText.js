export function splitText(el) {
  if (!el) return []
  try {
    const text = el.textContent || ''
    el.textContent = ''
    el.style.overflow = 'hidden'
    el.style.display  = 'inline-block'
    return text.split('').map(char => {
      const wrap = document.createElement('span')
      wrap.style.display  = 'inline-block'
      wrap.style.overflow = 'hidden'
      const inner = document.createElement('span')
      inner.style.display = 'inline-block'
      inner.textContent = char === ' ' ? '\u00A0' : char
      wrap.appendChild(inner)
      el.appendChild(wrap)
      return inner
    })
  } catch (e) {
    return []
  }
}
