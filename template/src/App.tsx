import { useEffect } from 'react'

import { Routes, Route } from 'react-router-dom'
import '@/css/globalStyles.css'
import Home from '@/views/home'

function App() {
  /**
   * after rendering, remove intro and appear components
   */
  useEffect(() => {
    setTimeout(() => {
      const introEl = document.getElementById('intro')!
      const bibimbapEl = document.getElementById('_bibimbap')!

      bibimbapEl.style.animation = 'appear linear 1.5s 1 Forwards'
      introEl.style.animation = 'disappear linear 1s 1 Forwards'

      setTimeout(() => {
        introEl.remove()
      }, 1200)
    }, 2200)
  }, [])
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
