import React, { useEffect, useState, useRef } from 'react'
import '../styles/SocketChat.css'
import socketIOClient from 'socket.io-client';

const socket = socketIOClient('http://localhost:5005') 
const SocketChat = ( props ) => {

    const location = window.location;
    const [showSocketChat, setShowSocketChat] = useState(false);
    const messagesEndRef = useRef(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [messagem, setMessagem] = useState('');
    const [userChat, setUserChat] = useState(JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).username : 'Visitante');



    useEffect(() => {
      socket.on('messagens', (message) => {
        // console.log(message);
        props.setBadgeNumber([...messageHistory, message].length)
        setMessageHistory([...messageHistory, message]);
      });
  
      return () => {
        socket.off('messagens');
      };
    }, [messageHistory]);

    useEffect(() => {
      socket.on('historicChat', (messages) => {
        // console.log(messages);
        props.setBadgeNumber(messages.length)
        setMessageHistory(messages);
      })
    }, []);

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

    useEffect(() => {
      setShowSocketChat(props.showSocketChat)
    },[props.showSocketChat])

  return (
    showSocketChat ? 
    <div className='socket-chat'>
    <div className='close-socket-chat' onClick={() => props.setShowSocketChat(false)}>X</div>
        <span className='chat-title'>Socket Chat</span>
        <div className='messages-container' ref={messagesEndRef}>
        {userChat === 'Visitante' && <span className='welcome'>Olá visitante </span>}
        {userChat !== 'Visitante' && <span className='welcome'>Bem vindo {userChat}</span>}
        
        {messageHistory.length ? messageHistory.map((messagem) => (
          <div className='message-container'>
            <span className='message' key={messagem._id}>
              {messagem.username}:{messagem.messagem}
            </span>
            {localStorage.getItem('user') ? 
            messagem.username === JSON.parse(localStorage.getItem('user')).username  ? <button className='delete-message' onClick={() => socket.emit('deleteMessage', messagem._id)}>X</button> 
            : 
            messagem.username === userChat && localStorage.getItem('user') && <button className='delete-message' onClick={() => socket.emit('deleteMessage', messagem._id)}>X</button> 
            : null}
          </div>
        )): <div className='message' style={{textAlign: 'center', margin:'0 auto'}}>Sem mensagens</div>}
      
      </div>

      {userChat === 'Visitante' && <div>
            <input type='text' placeholder={userChat} className='input-username'  onBlur={(e) => e.target.value && setUserChat(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setUserChat(e.target.value)} />
      </div>}
      
      {userChat !== 'Visitante' && userChat && <div className='send-message-container'>
      <input type="text" className='input-message' placeholder="Mensagem" onChange={(e) => setMessagem(e.target.value)} value={messagem} onKeyDown={(e) => e.key === 'Enter' && messagem && socket.emit('messagem', {username: userChat, messagem}) && setMessagem('')}/>
      <button className='send-message' onClick={() => messagem && socket.emit('messagem', {username: userChat , messagem}) && setMessagem('') } >Enviar </button>
      </div>}
      </div>
      
    : null
  )
}

export default SocketChat