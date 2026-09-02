import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const setVH = () => {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
}
setVH()
window.addEventListener('resize', setVH, { passive: true })

createRoot(document.getElementById('root')).render(<App />)
