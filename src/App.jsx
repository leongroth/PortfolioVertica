import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TestGrid from './TestGrid.jsx'
import ContentPage from './ContentPage.jsx'
// Aliased on import since the default export's own file is named React.jsx -
// only the local binding name matters here, not the file name.
import ReactPage from './React.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestGrid />} />
        {/* Example Content page - drop your own component in as children,
            e.g. <ContentPage><Frontend /></ContentPage>, and add more
            routes the same way for other pages. */}
        <Route path="/content" element={<ContentPage />} />
        <Route path="/react" element={<ContentPage><ReactPage /></ContentPage>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
