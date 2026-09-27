import { Component, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoadingProvider } from './context/LoadingProvider'
import { ContentProvider, useContent } from './context/ContentProvider'
import Loader      from './components/Loader/Loader'
import Navbar      from './components/Navbar/Navbar'
import Cursor      from './components/Cursor/Cursor'
import Footer      from './components/Footer/Footer'
import Home        from './pages/Home'
import Story       from './pages/Story'
import Results     from './pages/Results'
import GalleryPage from './pages/GalleryPage'
import ContactPage from './pages/ContactPage'
import OwnerPanel  from './pages/OwnerPanel'

// Catches any JS crash and shows the error instead of a black screen
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', background: '#030303', color: '#c8102e',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', fontFamily: 'monospace', padding: '24px',
          gap: '16px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '22px' }}>💥 CRASH DETECTED</div>
          <div style={{ fontSize: '13px', color: '#fff', maxWidth: '600px', wordBreak: 'break-word' }}>
            {this.state.error?.message}
          </div>
          <div style={{ fontSize: '11px', color: '#555', maxWidth: '600px', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
            {this.state.error?.stack}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// Reads branding from content and applies CSS custom properties
// so the owner's chosen primary color cascades everywhere
function BrandingApplier() {
  const { content } = useContent()
  useEffect(() => {
    const color = content?.branding?.primaryColor
    if (!color) return
    const root = document.documentElement
    root.style.setProperty('--red', color)
    // Derive glow colors from the brand color
    root.style.setProperty('--red-glow',   color + '38')
    root.style.setProperty('--red-glow-b', color + '70')
    root.style.setProperty('--red-dim',    color + '16')
  }, [content?.branding?.primaryColor])
  return null
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <LoadingProvider>
        <Loader />
        <BrowserRouter>
          <ContentProvider>
            <BrandingApplier />
            <Cursor />
            <Routes>
              <Route path="/"            element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/story"       element={<PublicLayout><Story /></PublicLayout>} />
              <Route path="/results"     element={<PublicLayout><Results /></PublicLayout>} />
              <Route path="/gallery"     element={<PublicLayout><GalleryPage /></PublicLayout>} />
              <Route path="/contact"     element={<PublicLayout><ContactPage /></PublicLayout>} />
              <Route path="/kgadmin-9x2" element={<OwnerPanel />} />
              <Route path="*"            element={<PublicLayout><Home /></PublicLayout>} />
            </Routes>
          </ContentProvider>
        </BrowserRouter>
      </LoadingProvider>
    </ErrorBoundary>
  )
}
 
