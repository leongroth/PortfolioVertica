import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TestGrid from './TestGrid.jsx'
import ContentPage from './ContentPage.jsx'
// Aliased on import since the default export's own file is named React.jsx -
// only the local binding name matters here, not the file name.
import ReactPage from './React.jsx'
import FreelanceWork from './FreelanceWork.jsx'
import AngularPlatform from './AngularPlatform.jsx'
import AXON from './AXON.jsx'
import ACES from './ACES.jsx'
import NotResponsiveNotice from './NotResponsiveNotice.jsx'
import { MOBILE_BLOCK_MAX_WIDTH } from './gridConstants'

const App = () => {
  // Gates every route behind one width check (rather than each page doing
  // its own), so the whole site - not just some pages - shows the notice
  // below MOBILE_BLOCK_MAX_WIDTH. Tracks live viewport width the same way
  // useGridDimensions does, so resizing the window (not just loading it
  // narrow) still triggers it.
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (viewportWidth < MOBILE_BLOCK_MAX_WIDTH) {
    return <NotResponsiveNotice />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestGrid />} />
        {/* Example Content page - drop your own component in as children,
            e.g. <ContentPage><Frontend /></ContentPage>, and add more
            routes the same way for other pages. */}
        <Route path="/content" element={<ContentPage />} />
        <Route path="/react" element={<ContentPage><ReactPage /></ContentPage>} />
        <Route path="/freelance" element={<ContentPage><FreelanceWork /></ContentPage>} />
        <Route path="/angular" element={<ContentPage><AngularPlatform /></ContentPage>} />
        <Route path="/axon" element={<ContentPage><AXON /></ContentPage>} />
        <Route path="/aces" element={<ContentPage><ACES /></ContentPage>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
