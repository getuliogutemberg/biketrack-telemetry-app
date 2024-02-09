import React , { useEffect, useState } from 'react'
import '../styles/SocketLobby.css'
import socketIOClient from 'socket.io-client';
import { keyboard } from '@testing-library/user-event/dist/keyboard';

const socket = socketIOClient('http://localhost:5005')

const SocketLobby = () => {

    const [userLobby, setUserLobby] = useState('');
    const [userPosition, setUserPosition] = useState({ x: 0, y: 0 });
    const [positions, setPositions] = useState([]);
    
    
    useEffect(() => {
        socket.on('positions', (data) => {
          setPositions(data);
        });
    
        return () => {
          socket.off('positions');
        };
      }, []);

    useEffect(() => {
        
        userLobby !== '' && socket.emit('enterLobby', {
            username: userLobby,
            x: userPosition.x,
            y: userPosition.y,
          });
          return () => userLobby !== '' && socket.emit('removeUser', {username: userLobby});
      }, [ userLobby ]);

      useEffect(() => {
        // Keyboard event handler
        const handleKeyDown = (event) => {
          const { key } = event;
          let x = userPosition.x;
          let y = userPosition.y;
    
          switch (key) {
            case 'ArrowUp':
              y = y - 10;
              break;
            case 'ArrowDown':
              y = y + 10;
              break;
            case 'ArrowLeft':
              x = x - 10;
              break;
            case 'ArrowRight':
              x = x + 10;
              break;
            default:
              return;
          }
    
          // Emit user's movement
          socket.emit('moveUser', { username: userLobby, x, y });
        //   setUserPosition({ x, y });
        };
    
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, [socket, userLobby, userPosition.x, userPosition.y]);

  return (

    <div className='socket-lobby'>
        <div class="chessboard">
            {userLobby === '' && <input type="text" placeholder="Username"  onBlur={(e) => setUserLobby(e.target.value)} />}
        {positions.map((position, index) => (
          <div
            key={index}
            className="square"
            style={{
                position: 'absolute',
              background: position.user === 'Visitante1' ? 'red' : 'blue',
              left: `${position.x * 10}px`,
              top: `${position.y * 10}px`,
            }}
          >{position.username}</div>
        ))}
        </div>
    </div>
  )
}

export default SocketLobby