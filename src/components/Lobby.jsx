import React, { useEffect } from 'react'

import { Link } from 'react-router-dom';
import '../styles/Lobby.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const Lobby = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [imageLobby, setImageLobby] = React.useState('');
  const [error, setError] = React.useState('');


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

  const handleLogout = () => {
    
    localStorage.removeItem('user');
    navigate("/login")
  }

  

  return (
    <div className='lobby'>
      <div className='lobby-header'>
      
        <Link className='lobby-title'  to={'/'}>BikeTrack</Link>
        <div className='lobby-menu'>
        {user ? <Link className="start-button" to={`/events`}><span>Eventos</span></Link> : <Link className="start-button" to={"/login"}><span>Entrar</span></Link>}
        {user && <Link className="start-button" to={`/users/`}><span>Usuarios</span></Link>}
        
        {user && <Link className="start-button" to="/" onClick={() => handleLogout()}><span>Sair</span></Link>}
        </div>
      </div>
      <div className='lobby-body'>
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