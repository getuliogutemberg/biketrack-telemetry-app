import React from 'react'
import { CiLogin } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { IoCalendarOutline } from "react-icons/io5";
import { LuUsers2 } from "react-icons/lu";

import {  Link } from 'react-router-dom';
const Sidebar = () => {
  
  const handleLogout = () => {
    
    localStorage.removeItem('user');
    
  }

  return (
    <div className='sidebar'>
    <ul>
      {localStorage.getItem('user') && <li><Link to="/users"><LuUsers2 /><span>Usuarios</span></Link></li>}
      {localStorage.getItem('user') && <li><Link to="/events"><IoCalendarOutline /><span>Eventos</span></Link></li>}
      {!localStorage.getItem('user') && <li><Link to="/login"><CiLogin /><span>Login</span></Link></li>}
    </ul>
    {localStorage.getItem('user') && <Link to="/" onClick={() => handleLogout()}><CiLogout /><span>Logout</span></Link>}
  </div>
  )
}

export default Sidebar