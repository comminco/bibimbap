import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import '@/css/globalStyles.css'
import Home from '@/views/home'
import { init } from '@/utils/init'
import { timeZone as timeZoneRecoil } from '@/atoms/user'
import { useSetRecoilState } from 'recoil'

function App() {
  const setTimeZone = useSetRecoilState(timeZoneRecoil)

  useEffect(() => {
      init()


    const { timeZone } = Intl.DateTimeFormat().resolvedOptions()
    setTimeZone(timeZone)
  }, [])
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
