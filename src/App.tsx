import { Affix, Button } from 'antd'
import React, { useState } from 'react'
import { InfoModal } from './components/InfoModal'
import { Navbar } from './components/Navbar'
import Home from './containers/Home'
import { InfoOutlined } from '@ant-design/icons'

const App: React.FC = () => {
  const [app, setApp] = useState<HTMLDivElement | null>(null)
  return (
    <div className="App" ref={setApp}>
      <Navbar />
      <div className="container">
        <Home />
      </div>
      <Affix
        target={() => app}
        style={{ position: 'fixed', bottom: 80, right: 30 }}
      >
        <Button onClick={InfoModal} shape="circle" size="large" type="primary">
          <InfoOutlined />
        </Button>
      </Affix>
      <footer>© 2020 Shintaro Hirose</footer>
    </div>
  )
}

export default App
