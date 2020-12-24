import React from 'react'
import logo from '../images/wca-radarchart_header_white.svg'

export const Navbar: React.FC = () => {
  return (
    <div className="navbar">
      <img src={logo} alt="logo" width="300px" />
    </div>
  )
}
