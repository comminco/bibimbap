import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import '@/css/globalStyles.css'
import Home from '@/views/home'
import { init } from '@/utils/init'

function App() {
  useEffect(() => {
      init()
  }, [])
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
