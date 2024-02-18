import React , { useEffect, useState } from 'react'
import '../styles/SocketLobby.css'
import socketIOClient from 'socket.io-client';


const socket = socketIOClient('http://localhost:5005')

const SocketLobby = (props) => {

    const [userLobby, setUserLobby] = useState('');
    
    const [positions, setPositions] = useState([]);

    const [spinner, setSpinner] = useState(false);

    const [position, setPosition] = useState([]);

    const [place, setPlace] = useState()

    const [tabuleiro, setTabuleiro] = useState([]);
    
    
    useEffect(() => {
        socket.on('positions', (data) => {
          // data.filter((position) => position.username === userLobby).lenght === 0 && setUserLobby('')
          setPositions(data);
          console.log(data)

        });

        socket.on('tabuleiro', (data) => {
          // data.filter((position) => position.username === userLobby).lenght === 0 && setUserLobby('')
          setTabuleiro(data);
          console.log(data)

        });

        


    
        return () => {
          userLobby !== '' && socket.emit('removeUser', {username: userLobby})
          
        };
      }, []);

      useEffect(() => {
        const posicaoAtual = positions.filter((position) => position.username === userLobby);
        posicaoAtual.length === 0 && setUserLobby('')
        posicaoAtual[0] && setPosition([posicaoAtual[0].x, posicaoAtual[0].y]);
      
      }, [ positions, userLobby ]);

      useEffect(() => {
        if (position.length > 0) {
          const x = position[0];
          const y = position[1];
          const col = Math.floor(x / 50) + 1; // Calcula a coluna baseada na coordenada x
          const row = Math.floor(y / 50) + 1; // Calcula a linha baseada na coordenada y
          const place = (row - 1) * 8 + col; // Calcula o número da casa baseado na linha e coluna
      
          setPlace(place);
      }
        
      }, [position]);

      useEffect(() => {
        console.log(place)
        if (place === 1 ) {
          setSpinner(false)
        }
        if (place === 64) {
          setSpinner(true)
        }
        
      }, [place]);

    useEffect(() => {
        
        userLobby !== '' && socket.emit('enterLobby', {username: userLobby});
          // return () => userLobby && socket.emit('removeUser', {username: userLobby});

          // Keyboard event handler
        const handleKeyDown = (event) => {
          const { key } = event;
          let x = 0;
          let y = 0;
    
          switch (key) {
            case 'r':
              userLobby !== '' && socket.emit('resetUser', { username: userLobby });
              return;
            case 'ArrowUp':
              y = y - 50;
              break;
            case 'ArrowDown':
              y = y + 50;
              break;
            case 'ArrowLeft':
              x = x - 50;
              break;
            case 'ArrowRight':
              x = x + 50;
              break;
            default:
              return;
          }
    
          // Emit user's movement
          socket.emit('moveUser', { username: userLobby, x,y});
        //   setUserPosition({ x, y });
        };
    
        window.addEventListener('keydown', handleKeyDown);

      
    
          return () => {
            window.removeEventListener('keydown', handleKeyDown);
          }
      }, [ userLobby ]);

     

  return (

    props.showSocketLobby ? <div className='socket-lobby'>
        {userLobby === '' && <input className='input-lobby' type="text" placeholder="Insira seu nome"  onKeyDownCapture={(e) => e.key === 'Enter' && setUserLobby(e.target.value)} />}

        {userLobby !== ''  && <div className="chessboard">
        
        {tabuleiro.map((item, index) => <div
            key={item.id}
            className="square"
            style={{
              fontSize: '10px',
              color: 'gray',
            }}
            onClick={() => {
              socket.emit('moveClickUser', { username: userLobby, x: item.x, y: item.y });
            }}
          >
            <span>{item.x},{item.y}</span>
            <span>{item.metodo}</span>
            <span>{item.nome}</span>
            <img src={item.img} alt={item.metodo} />
            
          </div>)}

        
        {positions.map((position, index) => (
          position.username === userLobby ? <div
            key={position.username}
            className="player"
            style={{
              position: 'absolute',
              left:`${position.x}px`,
              top: `${position.y}px`,
              // scale: position.username === userLobby ? '0.7' : '0.5',
              
            }}
            
            onClick={() => {
              if (position.username === userLobby) {
                socket.emit('removeUser', { username: userLobby })
                setUserLobby('')
              } 
            }}
          >{position.username}{spinner && <div className="spinner"/>}</div> :
          <div
            key={position.username}
            className="othersPlayers"
            style={{
              position: 'absolute',
              left:`${position.x}px`,
              top: `${position.y}px`,
              
              
            }}
          ></div>
        ))}
        </div>}
    </div> : null
  )
}

export default SocketLobby