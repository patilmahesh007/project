import React from 'react'
import {Link} from 'react-router-dom'
function App() {
  return (
    <div className="w-screen h-screen bg-slate-700 text-red-700 text-4xl flex justify-center items-center">App
    <Link to={'/login'}>login</Link>
    </div>
  )
}

export default App