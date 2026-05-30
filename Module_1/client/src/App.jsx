import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Routes,Route } from 'react-router-dom'

import Login from './components/Login'
import Staff from './components/Staff'
import Admin from './components/Admin'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/staff' element={<Staff/>}/>
        <Route path='/admin' element={<Admin/>}/>
      </Routes>
     </>
  )
}

export default App
