import React, { useEffect, useState, useRef } from 'react'

import { Link } from 'react-router-dom';
import '../styles/Lobby.css'
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import Badge from 'react-bootstrap/Badge';

const user = JSON.parse(localStorage.getItem('user'));
const userSocket = user ? user.username : 'Visitante';
 
const socket = socketIOClient('http://localhost:5005', {
  query: {
    username: userSocket
  }
}) 

const Lobby = () => {
  const location = window.location;
  const [showSocketChat, setShowSocketChat] = useState(false);
  const messagesEndRef = useRef(null);
  const [user , setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [messagem, setMessagem] = useState('');
  const [imageLobby, setImageLobby] = React.useState('');
  const [error, setError] = React.useState('');
  const [messageHistory, setMessageHistory] = useState([]);

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
  
  useEffect(() => {
    socket.on('messagens', (message) => {
      // console.log(message);
      setMessageHistory([...messageHistory, message]);
    });

    return () => {
      socket.off('messagens');
    };
  }, [messageHistory]);

  useEffect(() => {
    socket.on('historicChat', (messages) => {
      // console.log(messages);
      setMessageHistory(messages);
    })
  }, []);

  const handleLogout = () => {
    
    localStorage.removeItem('user');
    
  }
  
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      }
    };
    scrollToBottom();
  }, [messageHistory]);

  useEffect(() => {
    socket.emit('getChatHistory');
  },[location]); 

  return (
    <div className='lobby'>
      <div className='lobby-header'>
      
        <Link className='lobby-title'  to={'/'}>BikeTrack</Link>
        <div className='lobby-menu'>
        
        {!showSocketChat ? <button className="start-button" style={{backgroundColor: '#555'}} onClick={() => setShowSocketChat(true)}>{messageHistory.length > 0 && <div className='badge'>{messageHistory.length} </div> } <span>Socket Chat</span> </button> : <button className="socket-button"  onClick={() => setShowSocketChat(false)}><span>Socket Chat </span>{messageHistory.length > 0 && <div className='badge'>{messageHistory.length} </div> }</button>}

        {user ? <Link className="start-button" to={`/events`}><span>Eventos</span></Link> : <Link className="start-button" to={"/login"}><span>Entrar</span></Link>}
        {user && <Link className="start-button" to={`/users/`}><span>Usuarios</span></Link>}
        
        {user && <Link className="start-button" to={'/login'} onClick={() => handleLogout()}><span>Sair</span></Link>}
        </div>
      </div>
      <div className='lobby-body'>
      <div className='lobby-socket'>
       
     
      {/* {lastMessage ? <span>Last message: {lastMessage.data}</span> : null} */}
      {showSocketChat && <div className='chat'>
        <span className='chat-title'>Socket Chat</span>
        <div className='messages-container' ref={messagesEndRef}>
        <span className='welcome'>Bem vindo {user ? user.username : 'Visitante'}</span>
        {messageHistory.length ? messageHistory.map((messagem) => (
          <div className='message-container'><span className='message' key={messagem._id}>{messagem.username}:{messagem.messagem}</span>{localStorage.getItem('user') ? messagem.username === JSON.parse(localStorage.getItem('user')).username  ? <button className='delete-message' onClick={() => socket.emit('deleteMessage', messagem._id)}>X</button> : messagem.username === 'Visitante' && localStorage.getItem('user') && <button className='delete-message' onClick={() => socket.emit('deleteMessage', messagem._id)}>X</button> :  null}</div>
        )): <div className='message'>Sem mensagens</div>}
      
      </div>
      <div className='send-message-container'>
      <input type="text" className='input-message' placeholder="Mensagem" onChange={(e) => setMessagem(e.target.value)} value={messagem} onKeyDown={(e) => e.key === 'Enter' && messagem && socket.emit('messagem', messagem) && setMessagem('')}/>
      <button className='send-message' onClick={() => messagem && socket.emit('messagem', messagem) && setMessagem('') } >Enviar </button>
      </div>
      </div>}
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