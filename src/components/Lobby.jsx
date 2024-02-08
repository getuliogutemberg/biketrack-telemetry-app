import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import '../styles/Lobby.css'
import axios from 'axios';
import SocketChat from './SocketChat';

const Lobby = () => {
  
  const [showSocketChat, setShowSocketChat] = useState(false);
  
  const [user , setUser] = useState(JSON.parse(localStorage.getItem('user')));
  
  const [imageLobby, setImageLobby] = React.useState('');
  const [error, setError] = React.useState('');
  const [ badgeNumer, setBadgeNumber] = useState(0);
 
useEffect(() => {
  localStorage.getItem('user') &&
  setUser(JSON.parse(localStorage.getItem('user')))
}, [localStorage.getItem('user')]);
 
  useEffect(()=>
  {
  const fetchImage = async () => {
    axios.get('https://picsum.photos/1920/1080').then(
      (response) => {
        setImageLobby(response.request.responseURL);
      },
      (error) => {
        setError(error);
        setInterval(() => {
          setError('');
        }, 3000);
      }
    )
  };
  fetchImage();
  const interval = setInterval(() => {
    fetchImage();
  }, 5000);

  return () => clearInterval(interval);
  
  },[])
  
  return (
    <div className='lobby'>
      <div className='lobby-header'>
      
        <Link className='lobby-title'  to={'/'}>BikeTrack</Link>
        <div className='lobby-menu'>
        <button className="start-button"  style={{ 
          border: showSocketChat && '2px solid white',
          boxSizing: 'border-box',
          }} onClick={() => setShowSocketChat(!showSocketChat)}> <span>Socket Chat</span> </button>
        {badgeNumer > 0 && <div className='badge'>{badgeNumer} </div> }

        {user ? <Link className="start-button" to={`/events`}><span>Eventos</span></Link> : <Link className="start-button" to={"/login"}><span>Entrar</span></Link>}
        {user && <Link className="start-button" to={`/users/`}><span>Usuarios</span></Link>}
        
        {user && <Link className="start-button" to={'/'} onClick={() => localStorage.removeItem('user')}><span>Sair</span></Link>}
        </div>
      </div>
      <div className='lobby-body'>
      <div className='lobby-socket'>
       
      <SocketChat showSocketChat={showSocketChat} setBadgeNumber={setBadgeNumber} setShowSocketChat={() => setShowSocketChat(false)}/>
    </div>
        {error && <div className="error-message">{error}</div>}
       <img
        className='image-carousel fade-image'
          src={imageLobby ? imageLobby : '/mulher-ciclista-profissional.jpg'} // Propriedade imageSrc passada para o componente
          alt={'Imagem aleatória'} // Propriedade altText passada para o componente
        /> 
        <div className='degraded-overlay' /> 
        
        
      </div>
    </div>
  )
}

export default Lobby