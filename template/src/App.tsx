import { Routes, Route } from 'react-router-dom'
import '@/css/globalStyles.css'
import Home from '@/views/home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
