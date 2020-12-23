import React from 'react'
import { Navbar } from './components/Navbar'
import Home from './containers/Home'

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Home />
      </div>
    </div>
  )
}

export default App
