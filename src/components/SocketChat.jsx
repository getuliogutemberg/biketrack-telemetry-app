import React, { useEffect, useState, useRef } from 'react'
import '../styles/SocketChat.css'



const SocketChat = (props) => {

    const location = window.location;
    const [showSocketChat, setShowSocketChat] = useState(false);
    const messagesEndRef = useRef(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [messagem, setMessagem] = useState('');
    const [userChat, setUserChat] = useState({ username: 'Visitante' });



    useEffect(() => {
      props.socket.on('messagens', (message) => {
        // console.log(message);
        props.setBadgeNumber([...messageHistory, message].length)
        setMessageHistory([...messageHistory, message]);
      });

      props.socket.on('setSocketUser', (user) => {
        setUserChat(user);
      });
  
      return () => {
        props.socket.off('messagens');
      };
    }, [messageHistory]);

    useEffect(() => {
      props.socket.on('historicChat', (messages) => {
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
      props.socket.emit('getChatHistory');
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
        {userChat && userChat.username === 'Visitante' && <span className='welcome'>Olá visitante </span>}
        {userChat && userChat.username !== 'Visitante' && <span className='welcome'>Bem vindo {userChat.username}</span>}
        
        {messageHistory.length ? messageHistory.map((messagem) => (
          <div className='message-container' key={messagem._id}>
            <span className='message' key={messagem._id}>
              {messagem.username}:{messagem.messagem}
            </span>
            {messagem.username === userChat.username && <button className='delete-message' onClick={() => props.socket.emit('deleteMessage', messagem._id)}>X</button> }
            
           
          </div>
        )): <div className='message' style={{textAlign: 'center', margin:'0 auto'}}>Sem mensagens</div>}
      
      </div>

      {userChat && userChat.username === 'Visitante' && <div>
            <input type='text' placeholder={'Insira seu nome'} className='input-username'  onBlur={(e) => e.target.value && setUserChat(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setUserChat(e.target.value)} />
      </div>}
      
      {userChat && userChat.username !== 'Visitante' && <div className='send-message-container'>
      <input type="text" className='input-message' placeholder="Mensagem" onChange={(e) => setMessagem(e.target.value)} value={messagem} onKeyDown={(e) => e.key === 'Enter' && messagem && props.socket.emit('messagem', {username: userChat.username, messagem}) && setMessagem('')}/>
      <button className='send-message' onClick={() => messagem && props.socket.emit('messagem', {username: userChat.username , messagem}) && setMessagem('') } >Enviar </button>
      </div>}
      </div>
      
    : null
  )
}

export default SocketChat