import React from 'react'
import { Link } from 'react-router-dom';


const Header = () => {
  return (
    <div className='header'>
      <Link to="/">BikeTrack</Link>
    </div>
  )
}

export default Header