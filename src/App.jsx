import React from 'react'
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

// Every route renders at every screen size - the layout adapts through the
// three breakpoints in gridConstants.js (see getBreakpoint) rather than
// being gated behind a minimum width.
const App = () => (
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

export default App
